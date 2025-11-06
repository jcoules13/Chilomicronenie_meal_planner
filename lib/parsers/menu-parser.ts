import matter from "gray-matter";
import {
  Menu,
  RepasMenu,
  IngredientMenu,
  CategorieMenu,
  CATEGORIES_MENU,
} from "@/types/menu";
import { Saison } from "@/types/aliment";
import { v4 as uuidv4 } from "uuid";

/**
 * Résultat du parsing d'un menu
 */
export interface ParseMenuResult {
  success: boolean;
  menu?: Menu;
  errors: string[];
  warnings: string[];
}

/**
 * Parse un fichier Markdown de menu
 */
export function parseMenuMarkdown(
  content: string,
  filename?: string
): ParseMenuResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Parser le frontmatter et le contenu
    const { data: frontmatter, content: body } = matter(content);

    // Nom du menu (du frontmatter ou du filename)
    const nom = parseNom(frontmatter, filename, warnings);

    // Catégorie
    const categorie = parseCategorie(frontmatter, warnings);

    // Saisons
    const saisons = parseSaisons(frontmatter, warnings);

    // Portions
    const portions = parsePortions(frontmatter, warnings);

    // Temps de préparation et cuisson
    const temps_preparation_min = parseTemps(
      frontmatter.temps_preparation,
      "préparation",
      warnings
    );
    const temps_cuisson_min = parseTemps(
      frontmatter.temps_cuisson,
      "cuisson",
      warnings
    );

    // Parser les repas depuis le body
    const repas = parseRepas(body, warnings);

    // Parser les valeurs nutritionnelles
    const valeurs_nutritionnelles = parseValeursNutritionnelles(
      frontmatter,
      body,
      warnings
    );

    // Notes et variantes
    const notes = frontmatter.notes || extractNotesFromBody(body);
    const variantes_saisonnieres =
      frontmatter.variantes_saisonnieres ||
      extractVariantesFromBody(body);
    const conseils_preparation =
      frontmatter.conseils_preparation || extractConseilsFromBody(body);

    // Créer le menu
    const menu: Menu = {
      id: uuidv4(),
      nom,
      categorie,
      saisons,
      portions,
      temps_preparation_min,
      temps_cuisson_min,
      repas,
      valeurs_nutritionnelles,
      notes,
      variantes_saisonnieres,
      conseils_preparation,
      date_creation: new Date(),
      date_modification: new Date(),
      source: "import",
    };

    // Validation finale
    if (repas.length === 0) {
      warnings.push("Aucun repas trouvé dans le menu");
    }

    if (valeurs_nutritionnelles.lipides_g > 20) {
      warnings.push(
        `Attention : ${valeurs_nutritionnelles.lipides_g}g de lipides (limite recommandée : 10-20g)`
      );
    }

    return {
      success: true,
      menu,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Erreur parsing : ${error}`);
    return {
      success: false,
      errors,
      warnings,
    };
  }
}

/**
 * Parse le nom du menu
 */
function parseNom(
  frontmatter: any,
  filename: string | undefined,
  warnings: string[]
): string {
  if (frontmatter.nom && typeof frontmatter.nom === "string") {
    return frontmatter.nom.trim();
  }

  if (filename) {
    // Nettoyer le nom de fichier (enlever .md, remplacer _ par espace)
    const cleanName = filename
      .replace(/\.md$/i, "")
      .replace(/_/g, " ")
      .trim();
    warnings.push(`Nom extrait du fichier : ${cleanName}`);
    return cleanName;
  }

  warnings.push("Nom manquant, défini sur 'Menu sans nom'");
  return "Menu sans nom";
}

/**
 * Parse la catégorie du menu
 */
function parseCategorie(
  frontmatter: any,
  warnings: string[]
): CategorieMenu {
  const value = frontmatter.categorie || frontmatter.category;

  if (!value) {
    warnings.push("Catégorie manquante, définie sur 'Autre'");
    return "Autre";
  }

  const cleanValue = String(value).trim();

  // Mapping singulier/pluriel et variations
  const mapping: Record<string, CategorieMenu> = {
    "viande blanche": "Viande Blanche",
    poulet: "Viande Blanche",
    dinde: "Viande Blanche",
    "viande rouge": "Viande Rouge",
    boeuf: "Viande Rouge",
    veau: "Viande Rouge",
    "poisson maigre": "Poisson Maigre",
    "poisson blanc": "Poisson Maigre",
    cabillaud: "Poisson Maigre",
    merlan: "Poisson Maigre",
    "poisson gras": "Poisson Gras",
    saumon: "Poisson Gras",
    végétarien: "Végétarien",
    vegetarien: "Végétarien",
    végétalien: "Végétalien",
    vegetalien: "Végétalien",
    vegan: "Végétalien",
  };

  const normalized = cleanValue.toLowerCase();
  if (mapping[normalized]) {
    return mapping[normalized];
  }

  // Vérifier si c'est déjà une catégorie valide
  if (Object.keys(CATEGORIES_MENU).includes(cleanValue)) {
    return cleanValue as CategorieMenu;
  }

  warnings.push(
    `Catégorie '${cleanValue}' non reconnue, définie sur 'Autre'`
  );
  return "Autre";
}

/**
 * Parse les saisons
 */
function parseSaisons(frontmatter: any, warnings: string[]): Saison[] {
  const value = frontmatter.saison || frontmatter.saisons;

  if (!value) {
    warnings.push("Saisons manquantes, défini sur 'Toute l'année'");
    return ["Printemps", "Été", "Automne", "Hiver"];
  }

  const saisons: Saison[] = [];
  const saisonsList = ["Printemps", "Été", "Automne", "Hiver"];

  if (typeof value === "string") {
    // Gérer les saisons séparées par virgule ou tiret
    const parts = value.split(/[,\-\/]/).map((s) => s.trim());

    for (const part of parts) {
      const normalized = part.toLowerCase();
      const mapping: Record<string, Saison> = {
        printemps: "Printemps",
        spring: "Printemps",
        été: "Été",
        ete: "Été",
        summer: "Été",
        automne: "Automne",
        autumn: "Automne",
        fall: "Automne",
        hiver: "Hiver",
        winter: "Hiver",
      };

      if (mapping[normalized]) {
        saisons.push(mapping[normalized]);
      }
    }
  } else if (Array.isArray(value)) {
    for (const s of value) {
      if (saisonsList.includes(s)) {
        saisons.push(s as Saison);
      }
    }
  }

  if (saisons.length === 0) {
    warnings.push("Aucune saison valide trouvée, défini sur 'Toute l'année'");
    return ["Printemps", "Été", "Automne", "Hiver"];
  }

  return saisons;
}

/**
 * Parse le nombre de portions
 */
function parsePortions(frontmatter: any, warnings: string[]): number {
  const value = frontmatter.portions || frontmatter.portion;

  if (!value) {
    return 1; // Défaut 1 portion
  }

  const portions = parseInt(String(value), 10);

  if (isNaN(portions) || portions < 1) {
    warnings.push("Nombre de portions invalide, défini sur 1");
    return 1;
  }

  return portions;
}

/**
 * Parse un temps (préparation ou cuisson)
 */
function parseTemps(
  value: any,
  type: string,
  warnings: string[]
): number | undefined {
  if (!value) return undefined;

  const temps = parseInt(String(value), 10);

  if (isNaN(temps) || temps < 0) {
    warnings.push(`Temps de ${type} invalide, ignoré`);
    return undefined;
  }

  return temps;
}

/**
 * Parse les repas depuis le body
 */
function parseRepas(body: string, warnings: string[]): RepasMenu[] {
  const repas: RepasMenu[] = [];

  // Regex pour détecter les sections de repas
  // Ex: "## Déjeuner", "### Petit-déjeuner", "## Dîner (40%)"
  const repasRegex = /^##\s+(.+?)(?:\s*\((\d+)%\))?$/gm;

  let match;
  const sections: { nom: string; pourcentage?: number; start: number }[] = [];

  while ((match = repasRegex.exec(body)) !== null) {
    const nom = match[1].trim();
    const pourcentage = match[2] ? parseInt(match[2], 10) : undefined;
    sections.push({ nom, pourcentage, start: match.index + match[0].length });
  }

  // Parser chaque section
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const nextSection = sections[i + 1];
    const sectionEnd = nextSection ? nextSection.start : body.length;
    const sectionContent = body.substring(section.start, sectionEnd);

    const ingredients = parseIngredients(sectionContent, warnings);
    const instructions = extractInstructions(sectionContent);

    repas.push({
      nom: section.nom,
      pourcentage_calories: section.pourcentage,
      ingredients,
      instructions,
    });
  }

  return repas;
}

/**
 * Parse les ingrédients d'une section
 */
function parseIngredients(
  content: string,
  warnings: string[]
): IngredientMenu[] {
  const ingredients: IngredientMenu[] = [];

  // Regex pour lignes comme : "- 150g de Riz basmati"
  const ingredientRegex = /^[-*]\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç]+)\s+(?:de\s+)?(.+?)(?:\s*\(([^)]+)\))?$/gim;

  let match;
  while ((match = ingredientRegex.exec(content)) !== null) {
    const quantite = parseFloat(match[1]);
    const unite = match[2].trim();
    const nom = match[3].trim();
    const notes = match[4]?.trim();

    ingredients.push({
      nom,
      quantite,
      unite,
      notes,
    });
  }

  return ingredients;
}

/**
 * Extrait les instructions d'une section
 */
function extractInstructions(content: string): string | undefined {
  // Chercher une section "Instructions" ou "Préparation"
  const instructionsMatch = content.match(
    /(?:instructions?|préparation)\s*:?\s*\n([\s\S]+?)(?=\n##|$)/i
  );

  if (instructionsMatch) {
    return instructionsMatch[1].trim();
  }

  return undefined;
}

/**
 * Parse les valeurs nutritionnelles
 */
function parseValeursNutritionnelles(
  frontmatter: any,
  body: string,
  warnings: string[]
) {
  // Essayer depuis le frontmatter
  if (frontmatter.nutrition || frontmatter.valeurs_nutritionnelles) {
    const nutrition =
      frontmatter.nutrition || frontmatter.valeurs_nutritionnelles;

    return {
      energie_kcal: parseFloat(nutrition.energie || nutrition.kcal || 0),
      proteines_g: parseFloat(nutrition.proteines || 0),
      lipides_g: parseFloat(nutrition.lipides || 0),
      glucides_g: parseFloat(nutrition.glucides || 0),
      fibres_g: parseFloat(nutrition.fibres || 0),
      eau_g: nutrition.eau ? parseFloat(nutrition.eau) : undefined,
    };
  }

  // Essayer depuis le body (section "Valeurs nutritionnelles")
  const nutritionMatch = body.match(
    /valeurs?\s+nutritionnelles?\s*:?\s*\n([\s\S]+?)(?=\n##|$)/i
  );

  if (nutritionMatch) {
    const nutritionText = nutritionMatch[1];

    return {
      energie_kcal: extractNutritionValue(nutritionText, "énergie|kcal"),
      proteines_g: extractNutritionValue(nutritionText, "protéines"),
      lipides_g: extractNutritionValue(nutritionText, "lipides"),
      glucides_g: extractNutritionValue(nutritionText, "glucides"),
      fibres_g: extractNutritionValue(nutritionText, "fibres"),
      eau_g: extractNutritionValue(nutritionText, "eau"),
    };
  }

  warnings.push("Valeurs nutritionnelles manquantes, définies à 0");
  return {
    energie_kcal: 0,
    proteines_g: 0,
    lipides_g: 0,
    glucides_g: 0,
    fibres_g: 0,
  };
}

/**
 * Extrait une valeur nutritionnelle depuis du texte
 */
function extractNutritionValue(text: string, pattern: string): number {
  const regex = new RegExp(`(?:${pattern})\\s*:?\\s*(\\d+(?:\\.\\d+)?)`, "i");
  const match = text.match(regex);

  if (match) {
    return parseFloat(match[1]);
  }

  return 0;
}

/**
 * Extrait les notes depuis le body
 */
function extractNotesFromBody(body: string): string | undefined {
  const notesMatch = body.match(
    /(?:notes?|remarques?)\s*:?\s*\n([\s\S]+?)(?=\n##|$)/i
  );

  if (notesMatch) {
    return notesMatch[1].trim();
  }

  return undefined;
}

/**
 * Extrait les variantes saisonnières depuis le body
 */
function extractVariantesFromBody(body: string): string | undefined {
  const variantesMatch = body.match(
    /variantes?\s+saisonnières?\s*:?\s*\n([\s\S]+?)(?=\n##|$)/i
  );

  if (variantesMatch) {
    return variantesMatch[1].trim();
  }

  return undefined;
}

/**
 * Extrait les conseils de préparation depuis le body
 */
function extractConseilsFromBody(body: string): string | undefined {
  const conseilsMatch = body.match(
    /conseils?\s+(?:de\s+)?préparation\s*:?\s*\n([\s\S]+?)(?=\n##|$)/i
  );

  if (conseilsMatch) {
    return conseilsMatch[1].trim();
  }

  return undefined;
}

/**
 * Parse plusieurs fichiers de menus
 */
export function parseMultipleMenus(
  files: { name: string; content: string }[]
): {
  menus: Menu[];
  results: { filename: string; result: ParseMenuResult }[];
} {
  const menus: Menu[] = [];
  const results: { filename: string; result: ParseMenuResult }[] = [];

  for (const file of files) {
    const result = parseMenuMarkdown(file.content, file.name);
    results.push({ filename: file.name, result });

    if (result.success && result.menu) {
      menus.push(result.menu);
    }
  }

  return { menus, results };
}
