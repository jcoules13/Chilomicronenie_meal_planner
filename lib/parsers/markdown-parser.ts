import matter from "gray-matter";
import { Aliment, CompatibilitePathologie, CategorieAliment, Saison } from "@/types/aliment";
import { generateId } from "@/lib/db/queries";

export interface ParseResult {
  success: boolean;
  aliment?: Aliment;
  warnings: string[];
  errors: string[];
}

/**
 * Parse un fichier Markdown d'aliment (format Obsidian)
 * Gère les anciens formats incomplets et les nouveaux formats complets
 */
export function parseAlimentMarkdown(
  content: string,
  filename?: string
): ParseResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Parse frontmatter YAML
    const { data: frontmatter, content: body } = matter(content);

    // 2. Validation champs obligatoires frontmatter
    if (!frontmatter.nom) {
      errors.push("Champ 'nom' manquant dans le frontmatter");
      return { success: false, warnings, errors };
    }

    // 3. Extraire les valeurs nutritionnelles du tableau
    const nutrition = extractNutritionTable(body);
    if (!nutrition) {
      errors.push("Tableau des valeurs nutritionnelles introuvable ou invalide");
      return { success: false, warnings, errors };
    }

    // 4. Construire l'objet Aliment
    const aliment: Aliment = {
      id: generateId(),
      nom: frontmatter.nom,
      categorie: parseCategorie(frontmatter.categorie, warnings),
      saison: parseSaison(frontmatter.saison, warnings),
      compatible_chylomicronemie: parseCompatibilite(
        frontmatter.compatible_chylomicronemie,
        warnings
      ),
      index_glycemique: parseIndexGlycemique(
        frontmatter.index_glycemique,
        body,
        warnings
      ),
      valeurs_nutritionnelles_100g: nutrition,
      micronutriments: extractMicronutriments(body),
      utilisation: extractUtilisation(body),
      conservation: extractConservation(body),
      notes: extractNotes(body),
      date_creation: new Date(),
      date_modification: new Date(),
    };

    return {
      success: true,
      aliment,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Erreur lors du parsing : ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, warnings, errors };
  }
}

/**
 * Parse multiple fichiers Markdown
 */
export async function parseMultipleAliments(
  files: File[]
): Promise<{
  success: Aliment[];
  failed: Array<{ filename: string; errors: string[] }>;
  warnings: Array<{ filename: string; warnings: string[] }>;
}> {
  const success: Aliment[] = [];
  const failed: Array<{ filename: string; errors: string[] }> = [];
  const warnings: Array<{ filename: string; warnings: string[] }> = [];

  for (const file of files) {
    const content = await file.text();
    const result = parseAlimentMarkdown(content, file.name);

    if (result.success && result.aliment) {
      success.push(result.aliment);
      if (result.warnings.length > 0) {
        warnings.push({ filename: file.name, warnings: result.warnings });
      }
    } else {
      failed.push({ filename: file.name, errors: result.errors });
    }
  }

  return { success, failed, warnings };
}

// ===== FONCTIONS D'EXTRACTION =====

/**
 * Extrait le tableau des valeurs nutritionnelles
 */
function extractNutritionTable(content: string) {
  const lines = content.split("\n");
  const nutrition: any = {
    energie_kcal: 0,
    proteines_g: 0,
    glucides_g: 0,
    lipides_g: 0,
    fibres_g: 0,
  };

  let inTable = false;

  for (const line of lines) {
    // Détecter début du tableau
    if (line.includes("VALEURS NUTRITIONNELLES") || line.includes("Nutriment")) {
      inTable = true;
      continue;
    }

    // Fin du tableau
    if (inTable && line.trim().startsWith("#")) {
      break;
    }

    if (inTable && line.includes("|")) {
      // Extraire les valeurs
      if (line.includes("Énergie") || line.includes("Energie")) {
        nutrition.energie_kcal = extractNumber(line);
      } else if (line.includes("Protéines") || line.includes("Proteines")) {
        nutrition.proteines_g = extractNumber(line);
      } else if (line.includes("Glucides")) {
        nutrition.glucides_g = extractNumber(line);
      } else if (line.includes("Lipides")) {
        nutrition.lipides_g = extractNumber(line);
      } else if (line.includes("Fibres")) {
        nutrition.fibres_g = extractNumber(line);
      } else if (line.includes("Eau")) {
        nutrition.eau_g = extractNumber(line);
      }
    }
  }

  // Validation : au moins les valeurs de base doivent être présentes
  if (
    nutrition.energie_kcal === 0 &&
    nutrition.proteines_g === 0 &&
    nutrition.lipides_g === 0 &&
    nutrition.glucides_g === 0
  ) {
    return null;
  }

  return nutrition;
}

/**
 * Extrait un nombre d'une ligne (ex: "| **Énergie** | 149 kcal |" → 149)
 */
function extractNumber(line: string): number {
  const match = line.match(/(\d+\.?\d*)\s*(kcal|g|mg|µg|mcg)?/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Extrait les micronutriments (section optionnelle)
 */
function extractMicronutriments(content: string) {
  const micronutriments: any = {};
  const lines = content.split("\n");
  let inMicroSection = false;

  for (const line of lines) {
    if (line.includes("MICRONUTRIMENTS") || line.includes("Vitamines") || line.includes("Minéraux")) {
      inMicroSection = true;
      continue;
    }

    if (inMicroSection && line.trim().startsWith("#")) {
      break;
    }

    if (inMicroSection && line.includes("**")) {
      // Exemple: - **Vitamine B6** : 1.2 mg
      const vitMatch = line.match(/\*\*(.+?)\*\*\s*:\s*(\d+\.?\d*)\s*(mg|µg|mcg|g)?/);
      if (vitMatch) {
        const key = vitMatch[1].toLowerCase().replace(/\s+/g, "_") + "_" + (vitMatch[3] || "");
        micronutriments[key] = parseFloat(vitMatch[2]);
      }
    }
  }

  return Object.keys(micronutriments).length > 0 ? micronutriments : undefined;
}

/**
 * Extrait la section Utilisation
 */
function extractUtilisation(content: string): string | undefined {
  return extractSection(content, "UTILISATION");
}

/**
 * Extrait la section Conservation
 */
function extractConservation(content: string): string | undefined {
  return extractSection(content, "Conservation");
}

/**
 * Extrait les notes additionnelles
 */
function extractNotes(content: string): string | undefined {
  const notes = extractSection(content, "CONSEILS");
  return notes || undefined;
}

/**
 * Extrait une section complète par son titre
 */
function extractSection(content: string, sectionTitle: string): string | undefined {
  const lines = content.split("\n");
  let inSection = false;
  let sectionContent: string[] = [];

  for (const line of lines) {
    if (line.includes(sectionTitle)) {
      inSection = true;
      continue;
    }

    if (inSection && line.trim().startsWith("##")) {
      break;
    }

    if (inSection) {
      sectionContent.push(line);
    }
  }

  const result = sectionContent.join("\n").trim();
  return result.length > 0 ? result : undefined;
}

// ===== FONCTIONS DE PARSING =====

/**
 * Parse la catégorie avec valeur par défaut
 */
function parseCategorie(value: any, warnings: string[]): CategorieAliment {
  const categories: CategorieAliment[] = [
    "Légumes",
    "Protéines",
    "Féculents",
    "Fruits",
    "Aromates",
    "Condiments",
    "Produits laitiers",
    "Noix et graines",
    "Légumineuses",
    "Huiles et matières grasses",
    "Boissons",
    "Autres",
  ];

  if (!value) {
    warnings.push("Catégorie manquante, définie sur 'Autres'");
    return "Autres";
  }

  if (categories.includes(value)) {
    return value;
  }

  warnings.push(`Catégorie '${value}' inconnue, définie sur 'Autres'`);
  return "Autres";
}

/**
 * Parse la saison avec valeur par défaut
 */
function parseSaison(value: any, warnings: string[]): Saison[] {
  if (!value) {
    warnings.push("Saison manquante, définie sur 'Toute année'");
    return ["Toute année"];
  }

  // Si c'est une string, la convertir en array
  if (typeof value === "string") {
    return [value as Saison];
  }

  // Si c'est déjà un array
  if (Array.isArray(value)) {
    return value as Saison[];
  }

  warnings.push("Format de saison invalide, définie sur 'Toute année'");
  return ["Toute année"];
}

/**
 * Parse la compatibilité chylomicronémie
 */
function parseCompatibilite(
  value: any,
  warnings: string[]
): CompatibilitePathologie {
  const validValues: CompatibilitePathologie[] = [
    "EXCELLENT",
    "BON",
    "MODERE",
    "DECONSEILLE",
  ];

  if (!value) {
    warnings.push("Compatibilité chylomicronémie manquante, définie sur 'BON'");
    return "BON";
  }

  const upperValue = String(value).toUpperCase();
  if (validValues.includes(upperValue as CompatibilitePathologie)) {
    return upperValue as CompatibilitePathologie;
  }

  warnings.push(
    `Compatibilité '${value}' invalide, définie sur 'BON'`
  );
  return "BON";
}

/**
 * Parse l'index glycémique depuis frontmatter OU contenu
 */
function parseIndexGlycemique(
  frontmatterValue: any,
  content: string,
  warnings: string[]
): number {
  // 1. Essayer depuis frontmatter
  if (frontmatterValue) {
    const num = parseFloat(String(frontmatterValue));
    if (!isNaN(num) && num >= 0 && num <= 120) {
      return num;
    }
  }

  // 2. Essayer d'extraire du contenu (section "INDEX GLYCÉMIQUE")
  const igMatch = content.match(/INDEX GLYCÉMIQUE.*?~?(\d+)/i);
  if (igMatch) {
    const num = parseFloat(igMatch[1]);
    if (!isNaN(num) && num >= 0 && num <= 120) {
      return num;
    }
  }

  warnings.push("Index glycémique manquant ou invalide, défini sur 50 (par défaut)");
  return 50;
}
