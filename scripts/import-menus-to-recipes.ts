/**
 * Script d'import COMPLET des menus vers les templates de recettes
 * Génère 4 variantes par menu (une par saison) + 12 soupes
 */

import fs from 'fs';
import path from 'path';
import type { RecipeTemplate, IngredientTemplate } from '../types/recipe';
import type { Saison } from '../types/aliment';

const SAISONS: Saison[] = ["Printemps", "Été", "Automne", "Hiver"];

interface MenuMetadata {
  nom: string;
  type_proteine: string;
  numero: number;
}

/**
 * Parse le frontmatter YAML
 */
function parseFrontmatter(content: string): any {
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
  if (!frontmatterMatch) return null;

  const yaml = frontmatterMatch[1];
  const metadata: any = {};

  yaml.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      let cleanValue: any = value.replace(/^["']|["']$/g, '');
      if (!isNaN(Number(cleanValue))) cleanValue = Number(cleanValue);
      if (cleanValue === 'true') cleanValue = true;
      if (cleanValue === 'false') cleanValue = false;
      metadata[key] = cleanValue;
    }
  });

  // Normaliser les champs (gérer différents formats)
  if (!metadata.nom && metadata.title) {
    metadata.nom = metadata.title;
  }
  if (!metadata.type_proteine && metadata.proteines) {
    metadata.type_proteine = metadata.proteines;
  }
  if (!metadata.numero && metadata.numero_menu) {
    metadata.numero = metadata.numero_menu;
  }
  // Extraire le numéro depuis le champ numero si format "Poulet_02"
  if (typeof metadata.numero === 'string' && metadata.numero.includes('_')) {
    const numMatch = metadata.numero.match(/_(\d+)/);
    if (numMatch) {
      metadata.numero = parseInt(numMatch[1]);
    }
  }

  return metadata;
}

/**
 * Détermine le code CIQUAL selon le nom de la protéine
 */
function getCodeCiqualProteine(nom: string): string | undefined {
  const nomLower = nom.toLowerCase();
  if (nomLower.includes('poulet')) return "16018";
  if (nomLower.includes('dinde')) return "16300";
  if (nomLower.includes('bœuf') || nomLower.includes('boeuf') || nomLower.includes('haché') || nomLower.includes('steak')) return "6254";
  if (nomLower.includes('cabillaud')) return "26009";
  if (nomLower.includes('colin')) return "26015";
  if (nomLower.includes('lieu')) return "26020";
  if (nomLower.includes('sole')) return "26040";
  if (nomLower.includes('saumon')) return "26036";
  if (nomLower.includes('thon')) return "26058";
  return undefined;
}

/**
 * Parse les légumes d'une version saisonnière
 */
function parseLegumesSaison(section: string, saison: Saison): IngredientTemplate[] {
  const legumes: IngredientTemplate[] = [];

  // Patterns de légumes courants
  const legumePatterns = [
    { pattern: /butternut/i, code: "20148", nom: "Courge butternut" },
    { pattern: /brocoli/i, code: "20028", nom: "Brocoli" },
    { pattern: /carotte/i, code: "20010", nom: "Carottes" },
    { pattern: /chou-fleur/i, code: "20034", nom: "Chou-fleur" },
    { pattern: /poireau/i, code: "20059", nom: "Poireaux" },
    { pattern: /asperge/i, code: "20004", nom: "Asperges vertes" },
    { pattern: /haricot.*vert/i, code: "20009", nom: "Haricots verts" },
    { pattern: /courgette/i, code: "20041", nom: "Courgettes" },
    { pattern: /aubergine/i, code: "20005", nom: "Aubergine" },
    { pattern: /poivron/i, code: "20047", nom: "Poivrons rouges" },
    { pattern: /tomate/i, code: "20182", nom: "Tomates cerises" },
    { pattern: /champignon/i, code: "20030", nom: "Champignons de Paris" },
    { pattern: /épinard/i, code: "20044", nom: "Épinards" },
  ];

  for (const { pattern, code, nom } of legumePatterns) {
    if (pattern.test(section)) {
      legumes.push({
        code_ciqual: code,
        nom,
        categorie: "legume",
        role: "legume",
        notes: `Légumes de saison ${saison}`
      });
    }
  }

  return legumes;
}

/**
 * Parse un repas et génère 4 variantes (une par saison)
 */
function parseRepasVariantes(
  content: string,
  metadata: MenuMetadata,
  numeroRepas: 1 | 2
): RecipeTemplate[] {
  const templates: RecipeTemplate[] = [];

  // Chercher le repas
  const repasRegex = numeroRepas === 1
    ? /## 🍽️ REPAS 1[\s\S]+?(?=## 🥣 REPAS 2|$)/
    : /## 🥣 REPAS 2[\s\S]+?(?=## |$)/;

  const repasMatch = content.match(repasRegex);
  if (!repasMatch) return [];

  const repasContent = repasMatch[0];

  // Extraire la protéine principale
  const proteineMatch = repasContent.match(/\*\*(.+?):\s*(\d+)g\*\*/);
  if (!proteineMatch) return [];

  const [, nomProteine, quantiteProteine] = proteineMatch;
  const codeProteine = getCodeCiqualProteine(nomProteine);
  if (!codeProteine) return [];

  // Extraire le féculent
  const feculentMatch = repasContent.match(/\*\*Poids SEC\s*:\s*(\d+)g\*\*/i);
  let feculentTemplate: IngredientTemplate | null = null;

  if (feculentMatch) {
    const [, quantiteFeculent] = feculentMatch;
    let nomFeculent = "";
    let codeFeculent: string | undefined;

    if (repasContent.includes('Lentilles vertes')) {
      nomFeculent = "Lentilles vertes";
      codeFeculent = "20516";
    } else if (repasContent.includes('Lentilles corail')) {
      nomFeculent = "Lentilles corail";
      codeFeculent = "20526";
    } else if (repasContent.includes('Quinoa')) {
      nomFeculent = "Quinoa";
      codeFeculent = "9410";
    } else if (repasContent.includes('Riz basmati')) {
      nomFeculent = "Riz basmati";
      codeFeculent = "9100";
    }

    if (codeFeculent) {
      feculentTemplate = {
        code_ciqual: codeFeculent,
        nom: nomFeculent,
        categorie: "feculent",
        role: "feculent",
        notes: `Poids cru recommandé: ${quantiteFeculent}g`
      };
    }
  }

  // Créer 4 variantes (une par saison)
  for (const saison of SAISONS) {
    // Extraire les légumes pour cette saison
    let saisonPattern: string;
    switch (saison) {
      case "Automne": saisonPattern = "🍂.*AUTOMNE"; break;
      case "Hiver": saisonPattern = "❄️.*HIVER"; break;
      case "Printemps": saisonPattern = "🌸.*PRINTEMPS"; break;
      case "Été": saisonPattern = "☀️.*ÉTÉ"; break;
    }

    const saisonRegex = new RegExp(`#### ${saisonPattern}[\\s\\S]+?(?=####|###|$)`, 'i');
    const saisonMatch = repasContent.match(saisonRegex);

    let legumes: IngredientTemplate[] = [];
    if (saisonMatch) {
      legumes = parseLegumesSaison(saisonMatch[0], saison);
    }

    // Si pas de légumes trouvés, utiliser des légumes par défaut
    if (legumes.length === 0) {
      legumes = [{
        code_ciqual: "20028",
        nom: "Brocoli",
        categorie: "legume",
        role: "legume",
        notes: "Légumes de saison"
      }];
    }

    // Construire la liste des ingrédients
    const ingredients: IngredientTemplate[] = [
      {
        code_ciqual: codeProteine,
        nom: nomProteine.trim(),
        categorie: "proteine",
        role: "proteine_principale",
        notes: "À cuire sans matière grasse"
      },
      {
        code_ciqual: "22000",
        nom: "Blanc d'œuf liquide",
        categorie: "proteine",
        role: "proteine_complementaire",
        notes: "Ajouté automatiquement si nécessaire"
      }
    ];

    if (feculentTemplate) {
      ingredients.push(feculentTemplate);
    }

    ingredients.push(...legumes);

    // Ajouter huile MCT
    ingredients.push({
      code_ciqual: "17270",
      nom: "Huile MCT coco",
      categorie: "lipide",
      role: "lipide",
      notes: "Pour cuisson, selon budget lipides"
    });

    // Créer le template
    const id = `${metadata.type_proteine.toLowerCase().replace(/\s+/g, '-')}-${String(metadata.numero).padStart(2, '0')}-repas${numeroRepas}-${saison.toLowerCase()}`;

    const template: RecipeTemplate = {
      id,
      titre: `${metadata.type_proteine} - ${metadata.nom} ${saison} (Repas ${numeroRepas})`,
      type: "plat_principal",
      repas_cible: numeroRepas === 1 ? "REPAS_1" : "REPAS_2",
      saison: [saison],

      temps_preparation_min: 15,
      temps_cuisson_min: 25,
      temps_total_min: 40,

      ingredients_template: ingredients,

      besoins_reference: {
        proteines_g: numeroRepas === 1 ? 100 : 70,
        lipides_max_g: 10,
        fibres_g: numeroRepas === 1 ? 20 : 15,
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
          description: `Cuire ${nomProteine.trim()} sans matière grasse (vapeur, poêle antiadhésive ou four)`,
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
        saison.toLowerCase(),
        "adaptatif"
      ],

      cout_estime: "moyen",
      favoris: false
    };

    templates.push(template);
  }

  return templates;
}

/**
 * Parse un fichier menu complet
 */
function parseMenuFile(filePath: string): RecipeTemplate[] {
  console.log(`📖 Parsing ${path.basename(filePath)}...`);

  const content = fs.readFileSync(filePath, 'utf-8');
  let metadata = parseFrontmatter(content);

  // Si pas de métadonnées valides, extraire du nom de fichier
  if (!metadata || !metadata.type_proteine) {
    const filename = path.basename(filePath, '.md');
    const filenameParts = filename.split('_');

    metadata = {
      nom: filename.replace(/_/g, ' ').replace('Menu ', ''),
      type_proteine: filenameParts[1] || 'Inconnu',
      numero: parseInt(filenameParts[2]) || 1
    };

    // Extraire aussi du titre si présent
    const titreMatch = content.match(/^#+ (.+Menu .+)/m);
    if (titreMatch) {
      metadata.nom = titreMatch[1].replace(/^.*Menu\s+/, '').replace(/\n.*$/, '').trim();
    }

    console.log(`  ℹ️  Métadonnées extraites du nom de fichier: ${metadata.type_proteine}`);
  }

  const templates: RecipeTemplate[] = [];

  // Parser REPAS 1 (4 variantes)
  const repas1 = parseRepasVariantes(content, metadata, 1);
  templates.push(...repas1);

  // Parser REPAS 2 (4 variantes)
  const repas2 = parseRepasVariantes(content, metadata, 2);
  templates.push(...repas2);

  console.log(`  → ${templates.length} variantes générées`);

  return templates;
}

/**
 * Parse le fichier des soupes
 */
function parseSoupesFile(filePath: string): RecipeTemplate[] {
  console.log(`🍲 Parsing soupes...`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const templates: RecipeTemplate[] = [];

  // Pour chaque saison
  const saisons = [
    { key: "AUTOMNE", saison: "Automne" as Saison, emoji: "🍂" },
    { key: "HIVER", saison: "Hiver" as Saison, emoji: "❄️" },
    { key: "PRINTEMPS", saison: "Printemps" as Saison, emoji: "🌸" },
    { key: "ÉTÉ", saison: "Été" as Saison, emoji: "☀️" }
  ];

  let soupeNum = 1;

  for (const { key, saison, emoji } of saisons) {
    // Extraire la section de cette saison - chercher juste le mot clé
    const saisonRegex = new RegExp(`## .+ ${key}[\\s\\S]+?(?=## .+(?:HIVER|PRINTEMPS|ÉTÉ|AUTOMNE|📊|💡|⚠️)|$)`, 'i');
    const saisonMatch = content.match(saisonRegex);

    if (!saisonMatch) {
      console.warn(`⚠️  Section ${saison} non trouvée dans les soupes`);
      continue;
    }

    const saisonContent = saisonMatch[0];

    // Extraire les soupes (### 1., ### 2., ### 3.)
    const soupeMatches = saisonContent.match(/### \d+\. (.+?)\n[\s\S]+?(?=### \d+\.|## |$)/g);

    if (!soupeMatches) {
      console.warn(`⚠️  Aucune soupe trouvée dans section ${saison}`);
      continue;
    }

    for (const soupeMatch of soupeMatches) {
      // Extraire le nom
      const nomMatch = soupeMatch.match(/### \d+\. (.+)/);
      if (!nomMatch) continue;

      const nom = nomMatch[1].trim();

      const template: RecipeTemplate = {
        id: `soupe-${soupeNum.toString().padStart(2, '0')}-${saison.toLowerCase()}`,
        titre: `Soupe ${nom} (${saison})`,
        type: "soupe",
        repas_cible: "LES_DEUX",
        saison: [saison],

        temps_preparation_min: 10,
        temps_cuisson_min: 25,
        temps_total_min: 35,

        ingredients_template: [
          {
            code_ciqual: "20028",
            nom: "Légumes de saison variés",
            categorie: "legume",
            role: "legume",
            notes: "Voir recette originale pour détails"
          },
          {
            code_ciqual: "17440",
            nom: "Huile d'olive",
            categorie: "lipide",
            role: "lipide",
            notes: "Maximum 1-2g par portion"
          }
        ],

        besoins_reference: {
          proteines_g: 5,
          lipides_max_g: 2,
          fibres_g: 5,
          ig_moyen_max: 50
        },

        difficulte: "facile",
        etapes: [
          {
            numero: 1,
            titre: "Préparation des légumes",
            description: "Laver et couper tous les légumes",
            duree_min: 10
          },
          {
            numero: 2,
            titre: "Cuisson",
            description: "Faire revenir rapidement puis ajouter le bouillon et cuire 25 minutes",
            duree_min: 25
          },
          {
            numero: 3,
            titre: "Mixage",
            description: "Mixer jusqu'à obtenir une texture veloutée",
            duree_min: 5
          }
        ],

        tags: [
          "soupe",
          "chylomicronémie_compatible",
          "ig_bas",
          saison.toLowerCase(),
          "batch_cooking"
        ],

        cout_estime: "faible",
        favoris: false
      };

      templates.push(template);
      soupeNum++;
    }
  }

  console.log(`  → ${templates.length} soupes générées`);

  return templates;
}

/**
 * Fonction principale
 */
export async function importAllRecipes() {
  const menuDir = path.join(process.cwd(), 'menu');
  const outputFile = path.join(process.cwd(), 'data', 'recipe-templates-imported.ts');

  console.log('🚀 Import COMPLET menus → recettes\n');

  const allTemplates: RecipeTemplate[] = [];

  // Importer les fichiers de menus
  const menuFiles = fs.readdirSync(menuDir)
    .filter(f => f.endsWith('.md') && f.startsWith('Menu_'))
    .map(f => path.join(menuDir, f));

  console.log(`📁 ${menuFiles.length} fichiers menus trouvés\n`);

  for (const file of menuFiles) {
    const templates = parseMenuFile(file);
    allTemplates.push(...templates);
  }

  // Importer les soupes
  const soupesFile = path.join(menuDir, '12_Soupes_Saisonnieres.md');
  if (fs.existsSync(soupesFile)) {
    const soupes = parseSoupesFile(soupesFile);
    allTemplates.push(...soupes);
  }

  console.log(`\n✅ ${allTemplates.length} templates générés au total\n`);

  // Générer le fichier TypeScript
  const tsContent = `/**
 * Templates de recettes importés automatiquement depuis /menu
 * Généré par scripts/import-menus-to-recipes.ts
 * Date: ${new Date().toISOString()}
 * Total: ${allTemplates.length} recettes
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

if (require.main === module) {
  importAllRecipes().catch(console.error);
}
