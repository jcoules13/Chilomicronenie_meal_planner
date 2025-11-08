/**
 * Script de parsing et filtrage du fichier CIQUAL
 *
 * Objectifs :
 * 1. Parser le fichier Excel CIQUAL 2020 (3186 aliments)
 * 2. Filtrer les 300 aliments les plus pertinents pour la chylomicronémie
 * 3. Mapper vers l'interface IngredientCiqual
 * 4. Enrichir avec compatibilité, IG, saisons
 * 5. Générer un fichier JSON prêt à l'import
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const CIQUAL_FILE_PATH = path.join(process.cwd(), 'table_ciqual', 'Table_Ciqual_2020.xls');
const OUTPUT_FILE_PATH = path.join(process.cwd(), 'lib', 'db', 'ciqual-data-300.json');

// Mapping des colonnes CIQUAL
interface CiqualRow {
  alim_grp_code: string;
  alim_ssgrp_code: string;
  alim_ssssgrp_code: string;
  alim_grp_nom_fr: string;
  alim_ssgrp_nom_fr: string;
  alim_ssssgrp_nom_fr: string;
  alim_code: string;
  alim_nom_fr: string;
  alim_nom_sci: string;
  [key: string]: any;
}

// Groupes prioritaires pour la chylomicronémie
const GROUPES_PRIORITAIRES = [
  'légumes',
  'fruits',
  'viandes',
  'poissons',
  'céréales',
  'produits céréaliers',
  'légumineuses',
  'produits laitiers',
  'œufs',
  'tubercules',
  'aromates et épices',
];

// Mots-clés à exclure (plats composés, industriels, etc.)
const MOTS_EXCLUS = [
  'moyenne',
  'moyen',
  'appertisé',
  'surgelé',
  'conserve',
  'plat',
  'pizza',
  'burger',
  'sandwich',
  'hamburger',
  'dessert',
  'gâteau',
  'pâtisserie',
  'biscuit',
  'viennoiserie',
  'confiserie',
  'chocolat',
  'crème glacée',
  'glace',
  'sorbet',
  'sauce',
  'bouillon',
  'soupe',
  'potage',
  'boisson',
  'alcool',
  'vin',
  'bière',
  'fast-food',
  'restauration rapide',
];

/**
 * Nettoie une valeur numérique française (virgule → point)
 */
function parseNumericValue(value: any): number | undefined {
  if (value === undefined || value === null || value === '' || value === '-') {
    return undefined;
  }

  let stringValue = String(value);

  // Gérer les valeurs "< X"
  if (stringValue.startsWith('<')) {
    stringValue = stringValue.substring(1).trim();
  }

  // Remplacer la virgule par un point
  stringValue = stringValue.replace(',', '.');

  const parsed = parseFloat(stringValue);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Vérifie si un aliment doit être exclu
 */
function shouldExclude(aliment: CiqualRow): boolean {
  const nomLower = aliment.alim_nom_fr.toLowerCase();
  const groupeLower = aliment.alim_grp_nom_fr?.toLowerCase() || '';

  // Exclure les aliments avec mots-clés exclus
  for (const motExclu of MOTS_EXCLUS) {
    if (nomLower.includes(motExclu) || groupeLower.includes(motExclu)) {
      return true;
    }
  }

  // Exclure les codes d'aliments "moyens" (terminant par 999)
  if (String(aliment.alim_code).endsWith('999')) {
    return true;
  }

  return false;
}

/**
 * Calcule le score de priorité d'un aliment
 */
function calculatePriorityScore(aliment: CiqualRow): number {
  let score = 0;
  const nomLower = aliment.alim_nom_fr.toLowerCase();
  const groupeLower = aliment.alim_grp_nom_fr?.toLowerCase() || '';

  // Points pour groupes prioritaires
  for (const groupe of GROUPES_PRIORITAIRES) {
    if (groupeLower.includes(groupe)) {
      score += 10;
      break;
    }
  }

  // Points pour aliments bruts (sans transformation)
  if (nomLower.includes('cru') || nomLower.includes('frais')) {
    score += 5;
  }

  // Points pour aliments cuits simples
  if (nomLower.includes('cuit') || nomLower.includes('bouilli') || nomLower.includes('vapeur')) {
    score += 3;
  }

  // Pénalités pour transformations
  if (nomLower.includes('pané') || nomLower.includes('frit') || nomLower.includes('rôti')) {
    score -= 2;
  }

  return score;
}

/**
 * Détermine le groupe simplifié à partir des sous-groupes CIQUAL
 */
function determineGroupe(aliment: CiqualRow): string {
  const sousGroupe = aliment.alim_ssgrp_nom_fr?.toLowerCase() || '';
  const groupeLower = aliment.alim_grp_nom_fr?.toLowerCase() || '';

  // Utiliser les sous-groupes en priorité (plus précis)
  if (sousGroupe === 'fruits') return 'Fruits';
  if (sousGroupe === 'légumes') return 'Légumes';
  if (sousGroupe === 'pommes de terre et autres tubercules') return 'Légumes';
  if (sousGroupe === 'légumineuses') return 'Légumineuses';

  if (sousGroupe === 'viandes crues' || sousGroupe === 'viandes cuites') return 'Viandes';
  if (sousGroupe === 'autres produits à base de viande') return 'Viandes';

  if (sousGroupe === 'poissons crus' || sousGroupe === 'poissons cuits') return 'Poissons';
  if (sousGroupe === 'mollusques et crustacés crus' || sousGroupe === 'mollusques et crustacés cuits') return 'Poissons';
  if (sousGroupe.includes('poissons')) return 'Poissons';

  if (sousGroupe === 'pâtes, riz et céréales') return 'Féculents';
  if (sousGroupe === 'céréales de petit-déjeuner') return 'Féculents';
  if (sousGroupe === 'pains et assimilés') return 'Féculents';

  if (sousGroupe === 'fromages et assimilés') return 'Produits laitiers';
  if (sousGroupe === 'laits') return 'Produits laitiers';
  if (sousGroupe === 'produits laitiers frais et assimilés') return 'Produits laitiers';
  if (sousGroupe.includes('crèmes')) return 'Produits laitiers';

  if (sousGroupe === 'œufs') return 'Œufs';

  if (sousGroupe === 'huiles et graisses végétales') return 'Huiles et matières grasses';
  if (sousGroupe === 'beurres' || sousGroupe === 'margarines') return 'Huiles et matières grasses';
  if (sousGroupe === 'autres matières grasses') return 'Huiles et matières grasses';

  if (sousGroupe === 'fruits à coque et graines oléagineuses') return 'Noix et graines';

  if (sousGroupe === 'herbes' || sousGroupe === 'épices') return 'Aromates';
  if (sousGroupe === 'condiments') return 'Aromates';

  // Fallback sur groupes si sous-groupe pas reconnu
  if (groupeLower.includes('matières grasses')) return 'Huiles et matières grasses';

  return 'Autres';
}

/**
 * Détermine la compatibilité chylomicronémie
 */
function determineCompatibilite(lipides_g: number): boolean {
  return lipides_g < 10;
}

// Quotas par groupe pour une sélection équilibrée
const QUOTAS_PAR_GROUPE: Record<string, number> = {
  'Légumes': 50,
  'Fruits': 50,
  'Viandes': 40,
  'Poissons': 40,
  'Féculents': 30,
  'Légumineuses': 20,
  'Produits laitiers': 20,
  'Œufs': 5,
  'Huiles et matières grasses': 10,
  'Noix et graines': 15,
  'Aromates': 20,
};

/**
 * Parse le fichier CIQUAL et génère les 300 meilleurs aliments
 */
async function parseCiqualFile() {
  console.log('📊 Parsing du fichier CIQUAL...\n');

  if (!fs.existsSync(CIQUAL_FILE_PATH)) {
    console.error('❌ Fichier introuvable:', CIQUAL_FILE_PATH);
    process.exit(1);
  }

  // Lire le fichier Excel
  const workbook = XLSX.readFile(CIQUAL_FILE_PATH);
  const worksheet = workbook.Sheets['compo'];
  const rawData = XLSX.utils.sheet_to_json(worksheet) as CiqualRow[];

  console.log(`✅ ${rawData.length} aliments chargés\n`);

  // Filtrage et groupement
  console.log('🔍 Filtrage des aliments pertinents...\n');

  const alimentsFiltered = rawData
    .filter(aliment => !shouldExclude(aliment))
    .map(aliment => ({
      ...aliment,
      groupe: determineGroupe(aliment),
      priorityScore: calculatePriorityScore(aliment),
    }));

  // Grouper par catégorie
  const parGroupe: Record<string, typeof alimentsFiltered> = {};
  alimentsFiltered.forEach(aliment => {
    if (!parGroupe[aliment.groupe]) {
      parGroupe[aliment.groupe] = [];
    }
    parGroupe[aliment.groupe].push(aliment);
  });

  // Sélectionner selon les quotas
  const alimentsSelectionnes: typeof alimentsFiltered = [];

  for (const [groupe, quota] of Object.entries(QUOTAS_PAR_GROUPE)) {
    const alimentsGroupe = parGroupe[groupe] || [];
    const selectionnes = alimentsGroupe
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, quota);

    console.log(`  ${groupe}: ${selectionnes.length}/${quota} (disponibles: ${alimentsGroupe.length})`);
    alimentsSelectionnes.push(...selectionnes);
  }

  console.log(`\n✅ ${alimentsSelectionnes.length} aliments sélectionnés\n`);

  // Mapping vers IngredientCiqual
  console.log('🗺️  Mapping vers IngredientCiqual...\n');

  const ingredients = alimentsSelectionnes.map(aliment => {
    const energie_kcal = parseNumericValue(aliment['Energie, Règlement UE N° 1169/2011 (kcal/100 g)']) || 0;
    const proteines_g = parseNumericValue(aliment['Protéines, N x facteur de Jones (g/100 g)']) || 0;
    const lipides_g = parseNumericValue(aliment['Lipides (g/100 g)']) || 0;
    const glucides_g = parseNumericValue(aliment['Glucides (g/100 g)']) || 0;
    const fibres_g = parseNumericValue(aliment['Fibres alimentaires (g/100 g)']) || 0;
    const sel_g = parseNumericValue(aliment['Sel chlorure de sodium (g/100 g)']) || 0;
    const eau_g = parseNumericValue(aliment['Eau (g/100 g)']);

    const groupe = aliment.groupe; // Déjà calculé dans alimentsSelectionnes
    const compatible_chylo = determineCompatibilite(lipides_g);

    return {
      code_ciqual: String(aliment.alim_code),
      nom_fr: aliment.alim_nom_fr,
      nom_en: undefined,
      groupe,
      sous_groupe: aliment.alim_ssgrp_nom_fr !== '-' ? aliment.alim_ssgrp_nom_fr : undefined,
      nutrition_100g: {
        energie_kcal,
        proteines_g,
        lipides_g,
        glucides_g,
        fibres_g,
        sel_g,
        eau_g,
        sucres_g: parseNumericValue(aliment['Sucres (g/100 g)']),
        amidon_g: parseNumericValue(aliment['Amidon (g/100 g)']),
        ag_satures_g: parseNumericValue(aliment['AG saturés (g/100 g)']),
        ag_monoinsatures_g: parseNumericValue(aliment['AG monoinsaturés (g/100 g)']),
        ag_polyinsatures_g: parseNumericValue(aliment['AG polyinsaturés (g/100 g)']),
        cholesterol_mg: parseNumericValue(aliment['Cholestérol (mg/100 g)']),
        calcium_mg: parseNumericValue(aliment['Calcium (mg/100 g)']),
        fer_mg: parseNumericValue(aliment['Fer (mg/100 g)']),
        magnesium_mg: parseNumericValue(aliment['Magnésium (mg/100 g)']),
        phosphore_mg: parseNumericValue(aliment['Phosphore (mg/100 g)']),
        potassium_mg: parseNumericValue(aliment['Potassium (mg/100 g)']),
        sodium_mg: parseNumericValue(aliment['Sodium (mg/100 g)']),
        zinc_mg: parseNumericValue(aliment['Zinc (mg/100 g)']),
        vitamine_a_µg: parseNumericValue(aliment['Rétinol (µg/100 g)']),
        vitamine_b1_mg: parseNumericValue(aliment['Vitamine B1 ou Thiamine (mg/100 g)']),
        vitamine_b2_mg: parseNumericValue(aliment['Vitamine B2 ou Riboflavine (mg/100 g)']),
        vitamine_b3_mg: parseNumericValue(aliment['Vitamine B3 ou PP ou Niacine (mg/100 g)']),
        vitamine_b5_mg: parseNumericValue(aliment['Vitamine B5 ou Acide pantothénique (mg/100 g)']),
        vitamine_b6_mg: parseNumericValue(aliment['Vitamine B6 (mg/100 g)']),
        vitamine_b9_µg: parseNumericValue(aliment['Vitamine B9 ou Folates totaux (µg/100 g)']),
        vitamine_b12_µg: parseNumericValue(aliment['Vitamine B12 (µg/100 g)']),
        vitamine_c_mg: parseNumericValue(aliment['Vitamine C (mg/100 g)']),
        vitamine_d_µg: parseNumericValue(aliment['Vitamine D (µg/100 g)']),
        vitamine_e_mg: parseNumericValue(aliment['Vitamine E (mg/100 g)']),
        vitamine_k_µg: parseNumericValue(aliment['Vitamine K1 (µg/100 g)']),
      },
      compatible_chylo,
      index_glycemique: undefined, // À enrichir manuellement
      allergenes: [],
      regime_exclusions: [],
      saisons: ['TOUTE_ANNEE'], // Par défaut
      source: 'CIQUAL' as const,
      notes: `Source: ANSES CIQUAL 2020 - Code aliment: ${aliment.alim_code}`,
    };
  });

  // Statistiques par groupe
  console.log('📊 Répartition par groupe:\n');
  const groupeCount: Record<string, number> = {};
  ingredients.forEach(ing => {
    groupeCount[ing.groupe] = (groupeCount[ing.groupe] || 0) + 1;
  });
  Object.entries(groupeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([groupe, count]) => {
      console.log(`  ${groupe}: ${count}`);
    });

  console.log(`\n✅ Compatibles chylomicronémie: ${ingredients.filter(i => i.compatible_chylo).length}/${ingredients.length}\n`);

  // Sauvegarder le fichier JSON
  fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(ingredients, null, 2), 'utf-8');
  console.log(`✅ Fichier généré: ${OUTPUT_FILE_PATH}\n`);

  console.log('✅ Parsing terminé avec succès!\n');
}

parseCiqualFile().catch(console.error);
