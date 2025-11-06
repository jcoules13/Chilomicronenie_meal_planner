/**
 * Parser pour fichier 12_Soupes_Saisonnieres.md
 *
 * Structure attendue :
 * - Frontmatter YAML (nom, type, portions, lipides_max, compatible)
 * - 4 sections saison (## AUTOMNE, ## HIVER, ## PRINTEMPS, ## ÉTÉ)
 * - Chaque soupe : ### Nom, Ingrédients, Préparation, Valeurs nutritionnelles
 */

import matter from "gray-matter";
import {
  RecetteSoupe,
  FichierSoupesSaisonnieres,
  IngredientSoupe,
  ValeursSoupe,
  LipideRecette,
  TypeLipide,
  PORTION_STANDARD_ML,
} from "@/types/soupe";
import { Saison } from "@/types/aliment";
import { v4 as uuidv4 } from "uuid";

export interface ParseSoupeResult {
  success: boolean;
  fichier?: FichierSoupesSaisonnieres;
  warnings: string[];
  errors: string[];
}

/**
 * Parser le fichier 12_Soupes_Saisonnieres.md
 */
export function parseSoupesMarkdown(content: string): ParseSoupeResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Parser frontmatter + body
    const { data: frontmatter, content: body } = matter(content);

    // Extraire métadonnées globales
    const nom = frontmatter.nom || "12 Recettes de Soupes Saisonnières";
    const portions_standard = frontmatter.portions_standard || "4-6 portions de 250ml";
    const lipides_max = parseFloat(frontmatter.lipides_max) || 2.5;

    // Parser soupes par saison
    const automne = parseSoupesSaison(body, "AUTOMNE", "Automne", warnings);
    const hiver = parseSoupesSaison(body, "HIVER", "Hiver", warnings);
    const printemps = parseSoupesSaison(body, "PRINTEMPS", "Printemps", warnings);
    const ete = parseSoupesSaison(body, "ÉTÉ", "Été", warnings);

    // Parser conseils pratiques (optionnel)
    const conseils_preparation = parseConseils(body, "Préparation en grande quantité");
    const conseils_conservation = parseConseils(body, "Conservation");
    const astuces_budget_lipides = parseConseils(body, "Astuces budget lipides");

    const fichier: FichierSoupesSaisonnieres = {
      nom,
      type: "recettes_soupes",
      portions_standard,
      lipides_max_par_portion: lipides_max,
      compatible: "chylomicronémie",
      automne,
      hiver,
      printemps,
      ete,
      conseils_preparation,
      conseils_conservation,
      astuces_budget_lipides,
      date_maj: new Date(),
      version: frontmatter.version || "1.0",
    };

    const total_soupes = automne.length + hiver.length + printemps.length + ete.length;
    if (total_soupes !== 12) {
      warnings.push(`⚠️ ${total_soupes} soupes trouvées (attendu: 12)`);
    }

    return {
      success: true,
      fichier,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Erreur parsing : ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      warnings,
      errors,
    };
  }
}

/**
 * Parser soupes d'une saison spécifique
 */
function parseSoupesSaison(
  body: string,
  markerSaison: string,
  saisonNom: Saison,
  warnings: string[]
): RecetteSoupe[] {
  const soupes: RecetteSoupe[] = [];

  // Trouver section saison : ## 🍂 AUTOMNE, ## ❄️ HIVER, etc.
  const saisonRegex = new RegExp(`##\\s+[^\\n]*${markerSaison}[^\\n]*\\n([\\s\\S]*?)(?=##\\s+[^\\n]*(?:HIVER|PRINTEMPS|ÉTÉ|TABLEAU|CONSEILS|$))`, "i");
  const saisonMatch = body.match(saisonRegex);

  if (!saisonMatch) {
    warnings.push(`⚠️ Section ${markerSaison} non trouvée`);
    return soupes;
  }

  const saisonContent = saisonMatch[1];

  // Parser chaque soupe : ### Nom
  const soupeRegex = /###\s+(\d+)\.\s+(.+?)\n([\s\S]*?)(?=###|\n##|$)/g;
  let match;

  while ((match = soupeRegex.exec(saisonContent)) !== null) {
    const numero = parseInt(match[1]);
    const nom = match[2].trim();
    const contenu = match[3];

    try {
      const recette = parseSoupeRecette(nom, saisonNom, contenu, warnings);
      soupes.push(recette);
    } catch (error) {
      warnings.push(`⚠️ Erreur parsing soupe "${nom}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return soupes;
}

/**
 * Parser une recette de soupe individuelle
 */
function parseSoupeRecette(
  nom: string,
  saison: Saison,
  contenu: string,
  warnings: string[]
): RecetteSoupe {
  // Parser ingrédients
  const ingredients = parseIngredients(contenu);

  // Parser lipides utilisés
  const lipides = parseLipides(contenu);

  // Parser préparation
  const preparation = parsePreparation(contenu);

  // Parser valeurs nutritionnelles
  const valeurs = parseValeursNutritionnelles(contenu, warnings);

  // Extraire portions (généralement 6)
  const portionsMatch = contenu.match(/\((\d+)\s+portions\)/i);
  const portions = portionsMatch ? parseInt(portionsMatch[1]) : 6;

  // Extraire temps (approximatif)
  const temps_total = extraireTemps(contenu);

  // Extraire conservation
  const conservationMatch = contenu.match(/(\d+)-(\d+)\s+jours/i);
  const conservation_jours = conservationMatch ? parseInt(conservationMatch[1]) : 4;

  // Congelable ?
  const congelable = !nom.toLowerCase().includes("gaspacho") && !nom.toLowerCase().includes("froide");

  // Bonus nutritionnels
  const bonus = extraireBonus(contenu);

  // Astuces
  const astucesMatch = contenu.match(/\*\*(?:Astuce|Conseil|Note)\*\*\s*:\s*(.+)/i);
  const astuces = astucesMatch ? [astucesMatch[1].trim()] : undefined;

  return {
    id: uuidv4(),
    nom,
    saison,
    portions,
    temps_preparation_min: Math.floor(temps_total * 0.3), // ~30% prep
    temps_cuisson_min: Math.floor(temps_total * 0.7), // ~70% cuisson

    ingredients,
    lipides,

    preparation,
    astuces,

    valeurs_nutritionnelles: valeurs,

    conservation_frigo_jours: conservation_jours,
    congelable,

    compatible_chylomicronemie: true,
    vegetarien: !ingredients.some(ing => ing.nom.toLowerCase().includes("viande") || ing.nom.toLowerCase().includes("poisson")),
    vegan: !ingredients.some(ing =>
      ing.nom.toLowerCase().includes("lait") ||
      ing.nom.toLowerCase().includes("fromage") ||
      ing.nom.toLowerCase().includes("beurre")
    ),

    bonus,

    date_creation: new Date(),
    date_modification: new Date(),
    version: "1.0",
  };
}

/**
 * Parser ingrédients
 */
function parseIngredients(contenu: string): IngredientSoupe[] {
  const ingredients: IngredientSoupe[] = [];

  // Trouver section ingrédients
  const ingredientsMatch = contenu.match(/\*\*Ingrédients\*\*[\s\S]*?:\n([\s\S]*?)(?=\n\*\*|$)/);
  if (!ingredientsMatch) return ingredients;

  const lines = ingredientsMatch[1].split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("**")) continue;

    // Format : "- Potimarron : 800g (pelé, en dés)"
    const match = trimmed.match(/^[-*]\s*(.+?)\s*:\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç.]+)(?:\s*\(([^)]+)\))?/i);

    if (match) {
      ingredients.push({
        nom: match[1].trim(),
        quantite: parseFloat(match[2]),
        unite: match[3].trim(),
        preparation: match[4]?.trim(),
      });
    }
  }

  return ingredients;
}

/**
 * Parser lipides (huiles)
 */
function parseLipides(contenu: string): LipideRecette[] {
  const lipides: LipideRecette[] = [];

  // Chercher mentions d'huiles
  const huileMCTMatch = contenu.match(/Huile MCT coco\s*:\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç.]+)/i);
  if (huileMCTMatch) {
    const quantite_totale = parseFloat(huileMCTMatch[1]);
    const unite = huileMCTMatch[2];

    // Convertir en grammes si nécessaire
    let quantite_g = quantite_totale;
    if (unite.includes("c.à.soupe") || unite.includes("c.à.s")) {
      quantite_g = quantite_totale * 12; // 1 c.à.s ≈ 12g
    } else if (unite.includes("c.à.café") || unite.includes("c.à.c")) {
      quantite_g = quantite_totale * 4; // 1 c.à.c ≈ 4g
    }

    // Extraire nombre de portions
    const portionsMatch = contenu.match(/\((\d+)\s+portions\)/i);
    const portions = portionsMatch ? parseInt(portionsMatch[1]) : 6;

    lipides.push({
      type: "MCT_COCO",
      quantite_g,
      portions,
      quantite_par_portion_g: quantite_g / portions,
      note: "PRIORITAIRE pour cuisson"
    });
  }

  const huileOliveMatch = contenu.match(/Huile d'olive\s*:\s*(\d+(?:\.\d+)?)\s*([a-zéèêàç.]+)/i);
  if (huileOliveMatch) {
    const quantite_totale = parseFloat(huileOliveMatch[1]);
    const unite = huileOliveMatch[2];

    let quantite_g = quantite_totale;
    if (unite.includes("c.à.soupe") || unite.includes("c.à.s")) {
      quantite_g = quantite_totale * 10;
    } else if (unite.includes("c.à.café") || unite.includes("c.à.c")) {
      quantite_g = quantite_totale * 5;
    }

    const portionsMatch = contenu.match(/\((\d+)\s+portions\)/i);
    const portions = portionsMatch ? parseInt(portionsMatch[1]) : 6;

    lipides.push({
      type: "OLIVE",
      quantite_g,
      portions,
      quantite_par_portion_g: quantite_g / portions,
      note: "POUR TOUTE LA SOUPE"
    });
  }

  return lipides;
}

/**
 * Parser préparation (étapes)
 */
function parsePreparation(contenu: string): string[] {
  const preparation: string[] = [];

  const prepMatch = contenu.match(/\*\*Préparation\*\*\s*:\n([\s\S]*?)(?=\n\*\*|$)/);
  if (!prepMatch) return preparation;

  const lines = prepMatch[1].split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Format : "1. Faire revenir..."
    const match = trimmed.match(/^\d+\.\s*(.+)/);
    if (match) {
      preparation.push(match[1].trim());
    }
  }

  return preparation;
}

/**
 * Parser valeurs nutritionnelles
 */
function parseValeursNutritionnelles(contenu: string, warnings: string[]): ValeursSoupe {
  // Chercher section valeurs
  const valeursMatch = contenu.match(/\*\*Valeurs nutritionnelles\*\*\s*\((\d+)ml\)\s*:\n([\s\S]*?)(?=\n\*\*|---|\n##|$)/);

  if (!valeursMatch) {
    warnings.push("⚠️ Valeurs nutritionnelles non trouvées");
    return {
      portion_ml: PORTION_STANDARD_ML,
      energie_kcal: 0,
      proteines_g: 0,
      lipides_g: 0,
      glucides_g: 0,
      fibres_g: 0,
    };
  }

  const portion_ml = parseInt(valeursMatch[1]);
  const valeursText = valeursMatch[2];

  const extraire = (label: string): number => {
    const match = valeursText.match(new RegExp(`${label}\\s*:\\s*(\\d+(?:\\.\\d+)?)`, "i"));
    return match ? parseFloat(match[1]) : 0;
  };

  return {
    portion_ml,
    energie_kcal: extraire("Calories"),
    proteines_g: extraire("Protéines"),
    lipides_g: extraire("Lipides"),
    glucides_g: extraire("Glucides"),
    fibres_g: extraire("Fibres"),
  };
}

/**
 * Extraire temps total approximatif
 */
function extraireTemps(contenu: string): number {
  // Chercher mentions de temps dans préparation
  const tempsMatches = contenu.match(/(\d+)(?:-(\d+))?\s*min/gi);

  if (!tempsMatches) return 30; // Défaut 30 min

  let total = 0;
  tempsMatches.forEach(match => {
    const nums = match.match(/(\d+)/g);
    if (nums) {
      total += parseInt(nums[0]);
    }
  });

  return total || 30;
}

/**
 * Extraire bonus nutritionnels
 */
function extraireBonus(contenu: string): string[] | undefined {
  const bonusMatch = contenu.match(/\*\*Bonus\*\*\s*:\s*(.+)/i);
  return bonusMatch ? [bonusMatch[1].trim()] : undefined;
}

/**
 * Parser conseils pratiques
 */
function parseConseils(body: string, section: string): string[] | undefined {
  const regex = new RegExp(`###\\s+${section}\\s*:\\n([\\s\\S]*?)(?=###|##|$)`, "i");
  const match = body.match(regex);

  if (!match) return undefined;

  const conseils: string[] = [];
  const lines = match[1].split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.match(/^[-*]\s*\*\*.+\*\*\s*:/)) {
      conseils.push(trimmed.replace(/^[-*]\s*/, ""));
    }
  }

  return conseils.length > 0 ? conseils : undefined;
}
