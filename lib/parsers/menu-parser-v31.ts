/**
 * Parser pour menus structure v3.1 (Skill.md)
 *
 * Structure attendue :
 * - Frontmatter YAML (nom, type_proteine, numero, lipides_totaux, ig_moyen, etc.)
 * - REPAS 1 - 11h00 (1200 kcal)
 *   - ENTRÉE - Salade vinaigrée
 *   - PROTÉINE
 *   - LÉGUMES (avec variantes saison)
 *   - FÉCULENTS (avec options)
 *   - DESSERT
 * - REPAS 2 - 17h00 (900 kcal)
 *   - ENTRÉE - Soupe maison
 *   - PROTÉINE
 *   - LÉGUMES D'ACCOMPAGNEMENT
 *   - LÉGUMINEUSES
 * - RÉCAPITULATIF NUTRITIONNEL
 * - POINTS CRITIQUES
 */

import matter from "gray-matter";
import {
  MenuV31,
  RepasStructureV31,
  ComposantRepas,
  BudgetLipides,
  IngredientMenu,
  VarianteSaisonniere,
  TypeProteine,
  FrequenceMenu,
  CIBLES_MENU_V31,
} from "@/types/menu";
import { Saison } from "@/types/aliment";
import { TypeLipide, LipideRecette } from "@/types/soupe";
import { v4 as uuidv4 } from "uuid";
import { calculerBudgetLipides } from "../utils/menu-templates-v31";

export interface ParseMenuResult {
  success: boolean;
  menu?: MenuV31;
  warnings: string[];
  errors: string[];
}

/**
 * Parser un fichier menu v3.1
 */
export function parseMenuV31Markdown(
  content: string,
  filename?: string
): ParseMenuResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Parser frontmatter + body
    const { data: frontmatter, content: body } = matter(content);

    // Extraire métadonnées
    const nom = frontmatter.nom || extractNomFromFilename(filename) || "Menu sans nom";
    const type_proteine = parseTypeProteine(frontmatter.type_proteine, warnings);
    const numero = parseInt(frontmatter.numero) || 1;
    const frequence = parseFrequence(type_proteine);

    // Extraire cibles nutritionnelles
    const lipides_totaux = parseLipidesTotaux(frontmatter.lipides_totaux);
    const calories_cibles = CIBLES_MENU_V31.TOTAL_KCAL;
    const proteines_cibles_g = CIBLES_MENU_V31.TOTAL_PROTEINES_G;
    const glucides_cibles_g = CIBLES_MENU_V31.TOTAL_GLUCIDES_G;

    // Parser REPAS 1
    const repas_1 = parseRepas1(body, warnings);

    // Parser REPAS 2
    const repas_2 = parseRepas2(body, warnings);

    // Calculer budget lipides journée
    const budget_lipides_journee = calculerBudgetLipidesJournee(repas_1, repas_2);

    // Extraire IG moyen
    const ig_moyen = parseIGMoyen(frontmatter.ig_moyen);

    // Extraire saisons compatibles
    const saisons = extractSaisons(body);

    // Extraire points critiques
    const points_critiques = extractPointsCritiques(body);
    const eviter_absolument = extractEviterAbsolument(body);

    // Extraire préparation avance et variantes express
    const preparation_avance = extractPreparationAvance(body);
    const variantes_express = extractVariantesExpress(body);

    // Extraire tags
    const tags = extractTags(body, frontmatter);

    const menu: MenuV31 = {
      id: uuidv4(),
      nom,
      numero,
      type_proteine,
      categorie: getCategorieFromTypeProteine(type_proteine),
      frequence,
      saisons,

      calories_cibles,
      proteines_cibles_g,
      lipides_cibles_g: lipides_totaux,
      glucides_cibles_g,

      repas_1,
      repas_2,

      budget_lipides_journee,

      ig_moyen,

      adaptatif_bmr: frontmatter.adaptatif_bmr !== false, // true par défaut
      bmr_reference: CIBLES_MENU_V31.BMR_REFERENCE,

      variantes_saison_count: parseInt(frontmatter.variantes_saison) || 4,

      compatible_chylomicronemie: true,
      points_critiques,
      eviter_absolument,

      preparation_avance,
      variantes_express,

      date_creation: new Date(),
      date_modification: new Date(),
      version: frontmatter.version || "1.0",
      source: "import",
      tags,
    };

    return {
      success: true,
      menu,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Erreur parsing menu : ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      warnings,
      errors,
    };
  }
}

/**
 * Parser REPAS 1 - 11h00 (1200 kcal)
 */
function parseRepas1(body: string, warnings: string[]): RepasStructureV31 {
  // Trouver section REPAS 1
  const repas1Match = body.match(/##\s*🍽️?\s*REPAS 1[^\n]*\n([\s\S]*?)(?=##\s*🥣?\s*REPAS 2|##\s*📊|$)/i);

  if (!repas1Match) {
    warnings.push("⚠️ REPAS 1 non trouvé");
    return createEmptyRepas("REPAS 1");
  }

  const repas1Content = repas1Match[1];

  // Parser composants
  const composants: ComposantRepas[] = [];

  // ENTRÉE
  const entree = parseComposant(repas1Content, "ENTRÉE", warnings);
  if (entree) composants.push(entree);

  // PROTÉINE
  const proteine = parseComposant(repas1Content, "PROTÉINE", warnings);
  if (proteine) composants.push(proteine);

  // LÉGUMES (avec variantes saison)
  const legumes = parseComposantAvecVariantes(repas1Content, "LÉGUMES", warnings);
  if (legumes) composants.push(legumes);

  // FÉCULENTS (avec options)
  const feculents = parseComposantAvecOptions(repas1Content, "FÉCULENTS", warnings);
  if (feculents) composants.push(feculents);

  // DESSERT
  const dessert = parseComposant(repas1Content, "DESSERT", warnings);
  if (dessert) composants.push(dessert);

  // Calculer budget lipides
  const budget_lipides = calculerBudgetLipidesComposants(composants);

  return {
    nom: "REPAS 1",
    heure: "11h00",
    calories_cibles: CIBLES_MENU_V31.REPAS_1_KCAL,
    proteines_cibles_g: CIBLES_MENU_V31.REPAS_1_PROTEINES_G,
    lipides_cibles_g: CIBLES_MENU_V31.REPAS_1_LIPIDES_G,
    glucides_cibles_g: CIBLES_MENU_V31.REPAS_1_GLUCIDES_G,
    composants,
    budget_lipides,
  };
}

/**
 * Parser REPAS 2 - 17h00 (900 kcal)
 */
function parseRepas2(body: string, warnings: string[]): RepasStructureV31 {
  // Trouver section REPAS 2
  const repas2Match = body.match(/##\s*🥣?\s*REPAS 2[^\n]*\n([\s\S]*?)(?=##\s*📊|##\s*⚠️|$)/i);

  if (!repas2Match) {
    warnings.push("⚠️ REPAS 2 non trouvé");
    return createEmptyRepas("REPAS 2");
  }

  const repas2Content = repas2Match[1];

  const composants: ComposantRepas[] = [];

  // ENTRÉE - Soupe
  const entree = parseComposant(repas2Content, "ENTRÉE|SOUPE", warnings);
  if (entree) composants.push(entree);

  // PROTÉINE
  const proteine = parseComposant(repas2Content, "PROTÉINE", warnings);
  if (proteine) composants.push(proteine);

  // LÉGUMES
  const legumes = parseComposantAvecVariantes(repas2Content, "LÉGUMES", warnings);
  if (legumes) composants.push(legumes);

  // LÉGUMINEUSES
  const legumineuses = parseComposant(repas2Content, "LÉGUMINEUSES|FÉCULENTS", warnings);
  if (legumineuses) composants.push(legumineuses);

  const budget_lipides = calculerBudgetLipidesComposants(composants);

  return {
    nom: "REPAS 2",
    heure: "17h00",
    calories_cibles: CIBLES_MENU_V31.REPAS_2_KCAL,
    proteines_cibles_g: CIBLES_MENU_V31.REPAS_2_PROTEINES_G,
    lipides_cibles_g: CIBLES_MENU_V31.REPAS_2_LIPIDES_G,
    glucides_cibles_g: CIBLES_MENU_V31.REPAS_2_GLUCIDES_G,
    composants,
    budget_lipides,
  };
}

/**
 * Parser un composant simple (sans variantes)
 */
function parseComposant(
  content: string,
  nomPattern: string,
  warnings: string[]
): ComposantRepas | null {
  // Chercher section : ### 🥗 ENTRÉE - Salade vinaigrée (150 kcal)
  const regex = new RegExp(
    `###\\s*[^\\n]*?(${nomPattern})\\s*-?\\s*([^\\n(]*?)(?:\\([^)]*\\))?\\n([\\s\\S]*?)(?=###|####|##|$)`,
    "i"
  );
  const match = content.match(regex);

  if (!match) return null;

  const nomComposant = match[1].trim();
  const descriptionFromTitle = match[2]?.trim();
  const composantContent = match[3];

  // Utiliser description du titre si disponible, sinon nom du composant
  const description = descriptionFromTitle || nomComposant;

  // Parser ingrédients
  const ingredients = parseIngredients(composantContent);

  // Parser lipides
  const lipides = parseLipidesComposant(composantContent);

  // Extraire cuisson
  const cuissonMatch = composantContent.match(/\*\*Cuisson[^:]*\*\*\s*:\s*([^\n]+)/i);
  const cuisson = cuissonMatch ? cuissonMatch[1].trim() : undefined;

  // Extraire assaisonnement
  const assaisonnementMatch = composantContent.match(/\*\*Assaisonnement[^:]*\*\*\s*:\s*([^\n]+)/i);
  const assaisonnement = assaisonnementMatch ? assaisonnementMatch[1].trim() : undefined;

  // Extraire calories (approximatif)
  const caloriesMatch = composantContent.match(/\((\d+)\s*kcal/i);
  const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : undefined;

  return {
    nom: nomComposant.toUpperCase(),
    description,
    ingredients,
    lipides,
    cuisson,
    assaisonnement,
    calories,
  };
}

/**
 * Parser composant avec variantes saisonnières
 */
function parseComposantAvecVariantes(
  content: string,
  nomPattern: string,
  warnings: string[]
): ComposantRepas | null {
  const composant = parseComposant(content, nomPattern, warnings);
  if (!composant) return null;

  // Chercher variantes : #### 🍂 VERSION AUTOMNE
  const variantesRegex = /####\s*[^\\n]*?VERSION\s+(AUTOMNE|HIVER|PRINTEMPS|ÉTÉ)[^\\n]*\n([\\s\\S]*?)(?=####|###|##|$)/gi;
  const variantes: VarianteSaisonniere[] = [];

  let match;
  while ((match = variantesRegex.exec(content)) !== null) {
    const saisonStr = match[1].trim();
    const varianteContent = match[2];

    const saison = normalizeSaison(saisonStr);
    if (!saison) continue;

    const ingredients = parseIngredients(varianteContent);
    const notesMatch = varianteContent.match(/\*\*([^*]+)\*\*/);
    const notes = notesMatch ? notesMatch[1].trim() : undefined;

    variantes.push({
      saison,
      ingredients,
      notes,
    });
  }

  if (variantes.length > 0) {
    composant.variantes_saison = variantes;
  }

  return composant;
}

/**
 * Parser composant avec options (féculents)
 */
function parseComposantAvecOptions(
  content: string,
  nomPattern: string,
  warnings: string[]
): ComposantRepas | null {
  const composant = parseComposant(content, nomPattern, warnings);
  if (!composant) return null;

  // Les options sont déjà dans les ingrédients parsés
  // On pourrait affiner pour distinguer les options, mais pour l'instant
  // on garde tout dans ingredients

  return composant;
}

/**
 * Parser ingrédients d'un composant
 */
function parseIngredients(content: string): IngredientMenu[] {
  const ingredients: IngredientMenu[] = [];

  // Format 1 : "- Tomates : 150g"
  // Format 2 : "- **Blanc de poulet** : 200g (cru)"
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("-") && !trimmed.startsWith("*")) continue;

    // Extraire nom, quantité, unité, notes
    const match = trimmed.match(/[-*]\s*(?:\*\*)?([^:*]+?)(?:\*\*)?\s*:\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç]+)(?:\s*\(([^)]+)\))?/i);

    if (match) {
      ingredients.push({
        nom: match[1].trim(),
        quantite: parseFloat(match[2]),
        unite: match[3].trim(),
        notes: match[4]?.trim(),
      });
    }
  }

  return ingredients;
}

/**
 * Parser lipides d'un composant
 */
function parseLipidesComposant(content: string): LipideRecette[] {
  const lipides: LipideRecette[] = [];

  // Chercher huile MCT
  const mctMatch = content.match(/Huile MCT coco\s*:\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç.]+)/i);
  if (mctMatch) {
    const quantite = parseFloat(mctMatch[1]);
    const unite = mctMatch[2];
    const quantite_g = convertirEnGrammes(quantite, unite);

    lipides.push({
      type: "MCT_COCO",
      quantite_g,
      portions: 1,
      quantite_par_portion_g: quantite_g,
      note: "Cuisson"
    });
  }

  // Chercher huile d'olive
  const oliveMatch = content.match(/Huile d'olive\s*:\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç.]+)/i);
  if (oliveMatch) {
    const quantite = parseFloat(oliveMatch[1]);
    const unite = oliveMatch[2];
    const quantite_g = convertirEnGrammes(quantite, unite);

    lipides.push({
      type: "OLIVE",
      quantite_g,
      portions: 1,
      quantite_par_portion_g: quantite_g,
      note: "Assaisonnement"
    });
  }

  // Chercher huile de sésame
  const sesameMatch = content.match(/Huile (?:de )?sésame\s*:\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç.]+)/i);
  if (sesameMatch) {
    const quantite = parseFloat(sesameMatch[1]);
    const unite = sesameMatch[2];
    const quantite_g = convertirEnGrammes(quantite, unite);

    lipides.push({
      type: "SESAME",
      quantite_g,
      portions: 1,
      quantite_par_portion_g: quantite_g,
    });
  }

  return lipides;
}

/**
 * Convertir quantité en grammes
 */
function convertirEnGrammes(quantite: number, unite: string): number {
  if (unite.includes("c.à.soupe") || unite.includes("c.à.s")) {
    return quantite * 10; // 1 c.à.s huile ≈ 10g
  } else if (unite.includes("c.à.café") || unite.includes("c.à.c")) {
    return quantite * 5; // 1 c.à.c huile ≈ 5g
  } else if (unite.toLowerCase().includes("g")) {
    return quantite;
  } else if (unite.toLowerCase().includes("ml")) {
    return quantite * 0.92; // Densité huile ≈ 0.92 g/ml
  }
  return quantite;
}

/**
 * Calculer budget lipides des composants
 */
function calculerBudgetLipidesComposants(composants: ComposantRepas[]): BudgetLipides {
  let mct = 0, olive = 0, sesame = 0, naturels = 0, autres = 0;

  composants.forEach(comp => {
    if (comp.lipides) {
      comp.lipides.forEach(lip => {
        switch (lip.type) {
          case "MCT_COCO": mct += lip.quantite_g; break;
          case "OLIVE": olive += lip.quantite_g; break;
          case "SESAME": sesame += lip.quantite_g; break;
          case "AUCUN": break;
        }
      });
    }
  });

  return calculerBudgetLipides(mct, olive, sesame, naturels, autres);
}

/**
 * Calculer budget lipides journée
 */
function calculerBudgetLipidesJournee(
  repas1: RepasStructureV31,
  repas2: RepasStructureV31
): BudgetLipides {
  return calculerBudgetLipides(
    repas1.budget_lipides.mct_coco_g + repas2.budget_lipides.mct_coco_g,
    repas1.budget_lipides.huile_olive_g + repas2.budget_lipides.huile_olive_g,
    repas1.budget_lipides.huile_sesame_g + repas2.budget_lipides.huile_sesame_g,
    repas1.budget_lipides.naturels_proteines_g + repas2.budget_lipides.naturels_proteines_g,
    repas1.budget_lipides.autres_g + repas2.budget_lipides.autres_g
  );
}

// === Helpers ===

function createEmptyRepas(nom: "REPAS 1" | "REPAS 2"): RepasStructureV31 {
  const isRepas1 = nom === "REPAS 1";
  return {
    nom,
    heure: isRepas1 ? "11h00" : "17h00",
    calories_cibles: isRepas1 ? CIBLES_MENU_V31.REPAS_1_KCAL : CIBLES_MENU_V31.REPAS_2_KCAL,
    proteines_cibles_g: isRepas1 ? CIBLES_MENU_V31.REPAS_1_PROTEINES_G : CIBLES_MENU_V31.REPAS_2_PROTEINES_G,
    lipides_cibles_g: isRepas1 ? CIBLES_MENU_V31.REPAS_1_LIPIDES_G : CIBLES_MENU_V31.REPAS_2_LIPIDES_G,
    glucides_cibles_g: isRepas1 ? CIBLES_MENU_V31.REPAS_1_GLUCIDES_G : CIBLES_MENU_V31.REPAS_2_GLUCIDES_G,
    composants: [],
    budget_lipides: calculerBudgetLipides(0, 0, 0, 0, 0),
  };
}

function extractNomFromFilename(filename?: string): string | null {
  if (!filename) return null;
  const match = filename.match(/Menu_([^_]+)_(\d+)/);
  return match ? `Menu ${match[1]} ${match[2]}` : null;
}

function parseTypeProteine(value: any, warnings: string[]): TypeProteine {
  if (!value) {
    warnings.push("⚠️ Type protéine manquant, utilisation de 'Poulet' par défaut");
    return "Poulet";
  }

  // Normaliser la valeur : trim + lowercase pour comparaison
  const normalized = String(value).trim().toLowerCase();

  // Mapping étendu avec toutes les variantes possibles (casse, accents, espaces)
  const mapping: Record<string, TypeProteine> = {
    // Poulet - variantes
    "poulet": "Poulet",
    "POULET": "Poulet",
    "Poulet": "Poulet",
    "chicken": "Poulet",

    // Dinde - variantes
    "dinde": "Dinde",
    "DINDE": "Dinde",
    "Dinde": "Dinde",
    "turkey": "Dinde",

    // Boeuf - variantes (avec et sans accent, avec "maigre")
    "boeuf": "Boeuf",
    "bœuf": "Boeuf",
    "BOEUF": "Boeuf",
    "BŒUF": "Boeuf",
    "Boeuf": "Boeuf",
    "Bœuf": "Boeuf",
    "boeuf maigre": "Boeuf",
    "bœuf maigre": "Boeuf",
    "Boeuf Maigre": "Boeuf",
    "Bœuf Maigre": "Boeuf",
    "BOEUF MAIGRE": "Boeuf",
    "BŒUF MAIGRE": "Boeuf",
    "beef": "Boeuf",

    // Poisson Maigre - variantes
    "poisson maigre": "Poisson Maigre",
    "POISSON MAIGRE": "Poisson Maigre",
    "Poisson Maigre": "Poisson Maigre",
    "poisson": "Poisson Maigre",
    "POISSON": "Poisson Maigre",
    "Poisson": "Poisson Maigre",
    "fish": "Poisson Maigre",
    "lean fish": "Poisson Maigre",

    // Poisson Gras - variantes
    "poisson gras": "Poisson Gras",
    "POISSON GRAS": "Poisson Gras",
    "Poisson Gras": "Poisson Gras",
    "fatty fish": "Poisson Gras",
    "saumon": "Poisson Gras",
    "salmon": "Poisson Gras",

    // Végétarien - variantes
    "végétarien": "Végétarien",
    "vegetarien": "Végétarien",
    "VÉGÉTARIEN": "Végétarien",
    "VEGETARIEN": "Végétarien",
    "Végétarien": "Végétarien",
    "Vegetarien": "Végétarien",
    "veggie": "Végétarien",
    "vegetarian": "Végétarien",
    "vege": "Végétarien",
    "veg": "Végétarien",
  };

  // Chercher dans le mapping
  const result = mapping[normalized];

  if (result) {
    return result;
  }

  // Si aucune correspondance exacte, essayer de détecter par mot-clé
  if (normalized.includes("poulet") || normalized.includes("chicken")) {
    warnings.push(`⚠️ Type protéine "${value}" non reconnu exactement, détecté comme 'Poulet'`);
    return "Poulet";
  }
  if (normalized.includes("dinde") || normalized.includes("turkey")) {
    warnings.push(`⚠️ Type protéine "${value}" non reconnu exactement, détecté comme 'Dinde'`);
    return "Dinde";
  }
  if (normalized.includes("boeuf") || normalized.includes("bœuf") || normalized.includes("beef")) {
    warnings.push(`⚠️ Type protéine "${value}" non reconnu exactement, détecté comme 'Boeuf'`);
    return "Boeuf";
  }
  if (normalized.includes("poisson") || normalized.includes("fish")) {
    if (normalized.includes("gras") || normalized.includes("fatty") || normalized.includes("saumon")) {
      warnings.push(`⚠️ Type protéine "${value}" non reconnu exactement, détecté comme 'Poisson Gras'`);
      return "Poisson Gras";
    }
    warnings.push(`⚠️ Type protéine "${value}" non reconnu exactement, détecté comme 'Poisson Maigre'`);
    return "Poisson Maigre";
  }
  if (normalized.includes("veg") || normalized.includes("végé")) {
    warnings.push(`⚠️ Type protéine "${value}" non reconnu exactement, détecté comme 'Végétarien'`);
    return "Végétarien";
  }

  // Aucune correspondance trouvée
  warnings.push(`❌ Type protéine "${value}" non reconnu, utilisation de 'Poulet' par défaut`);
  return "Poulet";
}

function parseFrequence(type_proteine: TypeProteine): FrequenceMenu {
  if (type_proteine === "Poisson Gras") return "SEMAINE_4";
  if (type_proteine === "Poisson Maigre") return "HEBDOMADAIRE";
  return "QUOTIDIEN";
}

function parseLipidesTotaux(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 20;
  }
  return 20;
}

function parseIGMoyen(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 45;
  }
  return 45;
}

function getCategorieFromTypeProteine(type: TypeProteine): any {
  if (type === "Poulet" || type === "Dinde") return "Viande Blanche";
  if (type === "Boeuf") return "Viande Rouge";
  if (type === "Poisson Maigre") return "Poisson Maigre";
  if (type === "Poisson Gras") return "Poisson Gras";
  return "Autre";
}

function normalizeSaison(saison: string): Saison | null {
  const mapping: Record<string, Saison> = {
    "AUTOMNE": "Automne",
    "HIVER": "Hiver",
    "PRINTEMPS": "Printemps",
    "ÉTÉ": "Été",
  };
  return mapping[saison.toUpperCase()] || null;
}

function extractSaisons(body: string): Saison[] {
  const saisons: Set<Saison> = new Set();
  if (body.includes("AUTOMNE")) saisons.add("Automne");
  if (body.includes("HIVER")) saisons.add("Hiver");
  if (body.includes("PRINTEMPS")) saisons.add("Printemps");
  if (body.includes("ÉTÉ") || body.includes("ETE")) saisons.add("Été");
  return Array.from(saisons);
}

function extractPointsCritiques(body: string): string[] | undefined {
  const match = body.match(/###\s*✅\s*CE MENU RESPECTE[^:]*:\n([\s\S]*?)(?=###|##|$)/i);
  if (!match) return undefined;

  const points: string[] = [];
  const lines = match[1].split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^\d+\./)) {
      points.push(trimmed);
    }
  }
  return points.length > 0 ? points : undefined;
}

function extractEviterAbsolument(body: string): string[] | undefined {
  const match = body.match(/###\s*❌\s*À ÉVITER ABSOLUMENT[^:]*:\n([\s\S]*?)(?=###|##|$)/i);
  if (!match) return undefined;

  const items: string[] = [];
  const lines = match[1].split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ❌") || trimmed.startsWith("-❌")) {
      items.push(trimmed.replace(/^-\s*❌\s*/, ""));
    }
  }
  return items.length > 0 ? items : undefined;
}

function extractPreparationAvance(body: string): string[] | undefined {
  const match = body.match(/###\s*Préparation à l'avance[^:]*:\n([\s\S]*?)(?=###|##|$)/i);
  if (!match) return undefined;

  const items: string[] = [];
  const lines = match[1].split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^\d+\.\s*\*\*/)) {
      items.push(trimmed);
    }
  }
  return items.length > 0 ? items : undefined;
}

function extractVariantesExpress(body: string): string[] | undefined {
  const match = body.match(/###\s*Variantes express[^:]*:\n([\s\S]*?)(?=###|##|$)/i);
  if (!match) return undefined;

  const items: string[] = [];
  const lines = match[1].split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- **")) {
      items.push(trimmed.replace(/^-\s*/, ""));
    }
  }
  return items.length > 0 ? items : undefined;
}

function extractTags(body: string, frontmatter: any): string[] {
  const tags: string[] = [];

  // Tags du frontmatter
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    tags.push(...frontmatter.tags);
  }

  // Tags en fin de fichier : #menu #poulet #adaptatif
  const tagsMatch = body.match(/##\s*🏷️\s*Tags[^\n]*\n([^\n]+)/i);
  if (tagsMatch) {
    const tagLine = tagsMatch[1];
    const foundTags = tagLine.match(/#[a-z0-9-]+/gi);
    if (foundTags) {
      tags.push(...foundTags);
    }
  }

  return [...new Set(tags)]; // Dédupliquer
}
