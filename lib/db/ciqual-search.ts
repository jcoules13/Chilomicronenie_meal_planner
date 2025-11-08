/**
 * Recherche et ajout d'aliments individuels depuis CIQUAL complet
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import type { IngredientCiqual } from '@/types/ciqual';
import { initDB } from './indexedDB';
import { v4 as uuidv4 } from 'uuid';

// Essayer d'abord .xlsx (format moderne), sinon .xls (ancien format)
const CIQUAL_FILE_PATH_XLSX = path.join(process.cwd(), 'table_ciqual', 'Table_Ciqual_2020.xlsx');
const CIQUAL_FILE_PATH_XLS = path.join(process.cwd(), 'table_ciqual', 'Table_Ciqual_2020.xls');
const CIQUAL_FILE_PATH = fs.existsSync(CIQUAL_FILE_PATH_XLSX) ? CIQUAL_FILE_PATH_XLSX : CIQUAL_FILE_PATH_XLS;

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
 * Détermine le groupe simplifié
 */
function determineGroupe(aliment: CiqualRow): string {
  const sousGroupe = aliment.alim_ssgrp_nom_fr?.toLowerCase() || '';
  const groupeLower = aliment.alim_grp_nom_fr?.toLowerCase() || '';

  if (sousGroupe === 'fruits') return 'Fruits';
  if (sousGroupe === 'légumes') return 'Légumes';
  if (sousGroupe === 'pommes de terre et autres tubercules') return 'Légumes';
  if (sousGroupe === 'légumineuses') return 'Légumineuses';
  if (sousGroupe === 'viandes crues' || sousGroupe === 'viandes cuites') return 'Viandes';
  if (sousGroupe === 'poissons crus' || sousGroupe === 'poissons cuits') return 'Poissons';
  if (sousGroupe === 'mollusques et crustacés crus' || sousGroupe === 'mollusques et crustacés cuits') return 'Poissons';
  if (sousGroupe === 'pâtes, riz et céréales') return 'Féculents';
  if (sousGroupe === 'fromages et assimilés') return 'Produits laitiers';
  if (sousGroupe === 'laits') return 'Produits laitiers';
  if (sousGroupe === 'produits laitiers frais et assimilés') return 'Produits laitiers';
  if (sousGroupe === 'œufs') return 'Œufs';
  if (sousGroupe === 'huiles et graisses végétales') return 'Huiles et matières grasses';
  if (sousGroupe === 'fruits à coque et graines oléagineuses') return 'Noix et graines';
  if (sousGroupe === 'herbes' || sousGroupe === 'épices') return 'Aromates';

  return 'Autres';
}

/**
 * Mappe un aliment CIQUAL brut vers IngredientCiqual
 */
function mapToIngredientCiqual(aliment: CiqualRow): Omit<IngredientCiqual, 'id' | 'date_import'> {
  const energie_kcal = parseNumericValue(aliment['Energie, Règlement UE N° 1169/2011 (kcal/100 g)']) || 0;
  const proteines_g = parseNumericValue(aliment['Protéines, N x facteur de Jones (g/100 g)']) || 0;
  const lipides_g = parseNumericValue(aliment['Lipides (g/100 g)']) || 0;
  const glucides_g = parseNumericValue(aliment['Glucides (g/100 g)']) || 0;
  const fibres_g = parseNumericValue(aliment['Fibres alimentaires (g/100 g)']) || 0;
  const sel_g = parseNumericValue(aliment['Sel chlorure de sodium (g/100 g)']) || 0;
  const eau_g = parseNumericValue(aliment['Eau (g/100 g)']);

  const groupe = determineGroupe(aliment);
  const compatible_chylo = lipides_g < 10;

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
    index_glycemique: undefined,
    allergenes: [],
    regime_exclusions: [],
    saisons: ['TOUTE_ANNEE'],
    source: 'CIQUAL',
    notes: `Source: ANSES CIQUAL 2020 - Code aliment: ${aliment.alim_code}`,
  };
}

/**
 * Recherche des aliments dans le fichier CIQUAL complet par nom
 */
export async function searchCiqualByName(query: string, limit: number = 20): Promise<{
  success: boolean;
  results: Array<Omit<IngredientCiqual, 'id' | 'date_import'>>;
  error?: string;
}> {
  try {
    if (!query || query.trim().length < 2) {
      return { success: false, results: [], error: 'Recherche trop courte (min 2 caractères)' };
    }

    if (!fs.existsSync(CIQUAL_FILE_PATH)) {
      console.error('Fichier non trouvé:', CIQUAL_FILE_PATH);
      return { success: false, results: [], error: `Fichier CIQUAL introuvable: ${CIQUAL_FILE_PATH}` };
    }

    console.log('Tentative de lecture du fichier:', CIQUAL_FILE_PATH);

    // Lire le fichier Excel avec fs.readFileSync pour éviter les problèmes de permissions Windows
    const fileBuffer = fs.readFileSync(CIQUAL_FILE_PATH);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets['compo'];
    const rawData = XLSX.utils.sheet_to_json(worksheet) as CiqualRow[];

    // Recherche fuzzy
    const queryLower = query.toLowerCase().trim();
    const results: Array<Omit<IngredientCiqual, 'id' | 'date_import'>> = [];

    for (const aliment of rawData) {
      const nomLower = aliment.alim_nom_fr?.toLowerCase() || '';

      if (nomLower.includes(queryLower)) {
        results.push(mapToIngredientCiqual(aliment));

        if (results.length >= limit) {
          break;
        }
      }
    }

    return { success: true, results };
  } catch (error) {
    console.error('Erreur recherche CIQUAL:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, results: [], error: `Erreur: ${errorMessage}` };
  }
}

/**
 * Ajoute un aliment CIQUAL spécifique dans IndexedDB
 */
export async function addSingleCiqualIngredient(
  ingredient: Omit<IngredientCiqual, 'id' | 'date_import'>
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const db = await initDB();

    // Vérifier si l'aliment existe déjà (par code CIQUAL)
    const transaction = db.transaction('ingredients_ciqual', 'readonly');
    const store = transaction.objectStore('ingredients_ciqual');
    const index = store.index('code_ciqual');

    const existingRequest = index.get(ingredient.code_ciqual);

    const existing = await new Promise<IngredientCiqual | undefined>((resolve) => {
      existingRequest.onsuccess = () => resolve(existingRequest.result);
      existingRequest.onerror = () => resolve(undefined);
    });

    if (existing) {
      return { success: false, error: 'Cet aliment existe déjà dans votre base' };
    }

    // Ajouter l'aliment
    const newIngredient: IngredientCiqual = {
      ...ingredient,
      id: uuidv4(),
      date_import: new Date().toISOString(),
    };

    const writeTransaction = db.transaction('ingredients_ciqual', 'readwrite');
    const writeStore = writeTransaction.objectStore('ingredients_ciqual');

    await new Promise<void>((resolve, reject) => {
      const request = writeStore.add(newIngredient);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur ajout ingrédient:', error);
    return { success: false, error: String(error) };
  }
}
