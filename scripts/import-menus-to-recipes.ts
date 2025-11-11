/**
 * Script d'import des menus vers les templates de recettes
 * Parse les fichiers .md du dossier /menu et génère des RecipeTemplate
 */

import fs from 'fs';
import path from 'path';
import type { RecipeTemplate } from '../types/recipe';

interface MenuMetadata {
  nom: string;
  type_proteine: string;
  numero: number;
  lipides_totaux: string;
  ig_moyen: string;
  variantes_saison: number;
  adaptatif_bmr: boolean;
}

interface ParsedIngredient {
  nom: string;
  quantite_crue_g?: number;
  quantite_cuite_g?: number;
  code_ciqual?: string;
  role?: "proteine_principale" | "proteine_complementaire" | "feculent" | "legume" | "lipide" | "autre";
  notes?: string;
}

interface ParsedRepas {
  numero: 1 | 2;
  entree?: ParsedIngredient[];
  proteine: ParsedIngredient;
  legumes: ParsedIngredient[];
  feculent?: ParsedIngredient;
  dessert?: ParsedIngredient[];
}

/**
 * Parse le frontmatter YAML d'un fichier markdown
 */
function parseFrontmatter(content: string): MenuMetadata | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) return null;

  const yaml = frontmatterMatch[1];
  const metadata: any = {};

  // Parse basique YAML (lignes clé: valeur)
  yaml.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      // Nettoyer les quotes
      let cleanValue: any = value.replace(/^["']|["']$/g, '');
      // Convertir les nombres
      if (!isNaN(Number(cleanValue))) {
        cleanValue = Number(cleanValue);
      }
      // Convertir les booléens
      if (cleanValue === 'true') cleanValue = true;
      if (cleanValue === 'false') cleanValue = false;

      metadata[key] = cleanValue;
    }
  });

  return metadata as MenuMetadata;
}

/**
 * Extrait la protéine principale d'une section
 */
function extraireProteine(section: string): ParsedIngredient | null {
  // Chercher "Blanc de poulet SANS PEAU : 200g"
  const match = section.match(/\*\*(.+?):\s*(\d+)g\*\*/);
  if (!match) return null;

  const [, nom, quantite] = match;

  // Déterminer le code CIQUAL selon le type de protéine
  let code_ciqual: string | undefined;
  const nomLower = nom.toLowerCase();

  if (nomLower.includes('poulet')) {
    code_ciqual = "16018"; // Poulet sans peau
  } else if (nomLower.includes('dinde')) {
    code_ciqual = "16300"; // Dinde sans peau
  } else if (nomLower.includes('bœuf') || nomLower.includes('boeuf')) {
    code_ciqual = "6254"; // Bœuf haché 5%
  } else if (nomLower.includes('cabillaud')) {
    code_ciqual = "26009"; // Cabillaud
  } else if (nomLower.includes('colin')) {
    code_ciqual = "26015"; // Colin
  } else if (nomLower.includes('saumon')) {
    code_ciqual = "26036"; // Saumon
  }

  return {
    nom: nom.trim(),
    quantite_crue_g: Number(quantite),
    code_ciqual,
    role: "proteine_principale",
    notes: "À cuire sans matière grasse"
  };
}

/**
 * Extrait les féculents d'une section
 */
function extraireFeculent(section: string): ParsedIngredient | null {
  // Chercher "Poids SEC : 70g" ou "Poids SEC : 70g (= ~180g cuit)"
  const match = section.match(/\*\*Poids SEC\s*:\s*(\d+)g\*\*\s*(?:\(=\s*~(\d+)g cuit\))?/i);
  if (!match) return null;

  const [, quantite_crue, quantite_cuite] = match;

  // Déterminer le type de féculent
  let nom = "";
  let code_ciqual: string | undefined;

  if (section.includes('Lentilles vertes')) {
    nom = "Lentilles vertes";
    code_ciqual = "20516";
  } else if (section.includes('Lentilles corail')) {
    nom = "Lentilles corail";
    code_ciqual = "20526";
  } else if (section.includes('Quinoa')) {
    nom = "Quinoa";
    code_ciqual = "9410";
  } else if (section.includes('Riz basmati')) {
    nom = "Riz basmati";
    code_ciqual = "9100";
  } else if (section.includes('Pâtes')) {
    nom = "Pâtes complètes";
    code_ciqual = "9680";
  }

  return {
    nom,
    quantite_crue_g: Number(quantite_crue),
    quantite_cuite_g: quantite_cuite ? Number(quantite_cuite) : undefined,
    code_ciqual,
    role: "feculent",
    notes: `Poids cru: ${quantite_crue}g${quantite_cuite ? ` (cuit: ~${quantite_cuite}g)` : ''}`
  };
}

/**
 * Génère un RecipeTemplate à partir d'un menu parsé
 */
function genererRecipeTemplate(
  metadata: MenuMetadata,
  repas: ParsedRepas,
  menuFilePath: string
): RecipeTemplate {
  const id = `${metadata.type_proteine.toLowerCase()}-${metadata.numero.toString().padStart(2, '0')}-repas${repas.numero}`;

  const titre = repas.numero === 1
    ? `${metadata.type_proteine} - ${metadata.nom} (Repas 1)`
    : `${metadata.type_proteine} - ${metadata.nom} (Repas 2)`;

  // Construire la liste des ingrédients template
  const ingredients_template: any[] = [];

  // Ajouter la protéine principale
  if (repas.proteine.code_ciqual) {
    ingredients_template.push({
      code_ciqual: repas.proteine.code_ciqual,
      nom: repas.proteine.nom,
      categorie: "proteine",
      role: "proteine_principale",
      notes: repas.proteine.notes
    });
  }

  // Ajouter le blanc d'œuf complémentaire
  ingredients_template.push({
    code_ciqual: "22000",
    nom: "Blanc d'œuf liquide",
    categorie: "proteine",
    role: "proteine_complementaire",
    notes: "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
  });

  // Ajouter les féculents
  if (repas.feculent && repas.feculent.code_ciqual) {
    ingredients_template.push({
      code_ciqual: repas.feculent.code_ciqual,
      nom: repas.feculent.nom,
      categorie: "feculent",
      role: "feculent",
      notes: repas.feculent.notes
    });
  }

  // Ajouter des légumes par défaut (à adapter selon parsing)
  ingredients_template.push({
    code_ciqual: "20028", // Brocoli
    nom: "Brocoli",
    categorie: "legume",
    role: "legume",
    notes: "Cuisson vapeur 10-12 min"
  });

  // Ajouter huile MCT si mentionné
  ingredients_template.push({
    code_ciqual: "17270", // Huile MCT coco
    nom: "Huile MCT coco",
    categorie: "lipide",
    role: "lipide",
    notes: "Pour cuisson, respecter budget lipides"
  });

  const template: RecipeTemplate = {
    id,
    titre,
    type: "plat_principal",
    repas_cible: repas.numero === 1 ? "REPAS_1" : "REPAS_2",
    saison: ["Printemps", "Été", "Automne", "Hiver"], // Par défaut toutes saisons

    temps_preparation_min: 15,
    temps_cuisson_min: 25,
    temps_total_min: 40,

    ingredients_template,

    besoins_reference: {
      proteines_g: repas.numero === 1 ? 100 : 70,
      lipides_max_g: 10,
      fibres_g: repas.numero === 1 ? 20 : 15,
      ig_moyen_max: 55
    },

    difficulte: "facile",
    etapes: [
      {
        numero: 1,
        titre: "Préparation des ingrédients",
        description: "Préparer et laver tous les ingrédients",
        duree_min: 10
      },
      {
        numero: 2,
        titre: "Cuisson de la protéine",
        description: `Cuire ${repas.proteine.nom} sans matière grasse (vapeur, poêle antiadhésive ou four)`,
        duree_min: 20
      },
      {
        numero: 3,
        titre: "Cuisson des accompagnements",
        description: "Cuire les légumes et féculents selon les instructions",
        duree_min: 15
      },
      {
        numero: 4,
        titre: "Assemblage et service",
        description: "Disposer harmonieusement dans l'assiette",
        duree_min: 5
      }
    ],

    tags: [
      "chylomicronémie_compatible",
      "ig_bas",
      metadata.type_proteine.toLowerCase(),
      "adaptatif"
    ],

    source: `Importé depuis ${path.basename(menuFilePath)}`,
    favoris: false
  };

  return template;
}

/**
 * Parse un fichier menu et génère les templates
 */
function parseMenuFile(filePath: string): RecipeTemplate[] {
  console.log(`📖 Parsing ${path.basename(filePath)}...`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const metadata = parseFrontmatter(content);

  if (!metadata) {
    console.warn(`⚠️  Pas de métadonnées trouvées dans ${filePath}`);
    return [];
  }

  const templates: RecipeTemplate[] = [];

  // Extraire REPAS 1
  const repas1Match = content.match(/## 🍽️ REPAS 1[\s\S]+?(?=## 🥣 REPAS 2|$)/);
  if (repas1Match) {
    const repas1Content = repas1Match[0];

    const proteine = extraireProteine(repas1Content);
    const feculent = extraireFeculent(repas1Content);

    if (proteine) {
      const repas1: ParsedRepas = {
        numero: 1,
        proteine,
        legumes: [],
        feculent: feculent || undefined
      };

      templates.push(genererRecipeTemplate(metadata, repas1, filePath));
    }
  }

  // Extraire REPAS 2
  const repas2Match = content.match(/## 🥣 REPAS 2[\s\S]+?(?=## |$)/);
  if (repas2Match) {
    const repas2Content = repas2Match[0];

    const proteine = extraireProteine(repas2Content);
    const feculent = extraireFeculent(repas2Content);

    if (proteine) {
      const repas2: ParsedRepas = {
        numero: 2,
        proteine,
        legumes: [],
        feculent: feculent || undefined
      };

      templates.push(genererRecipeTemplate(metadata, repas2, filePath));
    }
  }

  return templates;
}

/**
 * Fonction principale d'import
 */
export async function importMenusToRecipes() {
  const menuDir = path.join(process.cwd(), 'menu');
  const outputFile = path.join(process.cwd(), 'data', 'recipe-templates-imported.ts');

  console.log('🚀 Démarrage import menus → recettes\n');

  // Lister tous les fichiers .md
  const files = fs.readdirSync(menuDir)
    .filter(f => f.endsWith('.md') && f.startsWith('Menu_'))
    .map(f => path.join(menuDir, f));

  console.log(`📁 ${files.length} fichiers menus trouvés\n`);

  // Parser tous les menus
  const allTemplates: RecipeTemplate[] = [];

  for (const file of files) {
    const templates = parseMenuFile(file);
    allTemplates.push(...templates);
  }

  console.log(`\n✅ ${allTemplates.length} templates de recettes générés\n`);

  // Générer le fichier TypeScript
  const tsContent = `/**
 * Templates de recettes importés automatiquement depuis /menu
 * Généré par scripts/import-menus-to-recipes.ts
 * Date: ${new Date().toISOString()}
 */

import type { RecipeTemplate } from "@/types/recipe";

export const IMPORTED_RECIPE_TEMPLATES: RecipeTemplate[] = ${JSON.stringify(allTemplates, null, 2)};

export default IMPORTED_RECIPE_TEMPLATES;
`;

  fs.writeFileSync(outputFile, tsContent, 'utf-8');
  console.log(`💾 Fichier généré: ${outputFile}`);
  console.log(`\n🎉 Import terminé avec succès!`);

  return allTemplates;
}

// Exécution si appelé directement
if (require.main === module) {
  importMenusToRecipes().catch(console.error);
}
