/**
 * Import CIQUAL - Script d'importation de la table CIQUAL dans IndexedDB
 * Phase 11.1: Base Ingrédients CIQUAL
 */

import { initDB } from "./indexedDB";
import type { IngredientCiqual, Nutrition100g, Saison } from "@/types/ciqual";
import { v4 as uuidv4 } from "uuid";
import { CIQUAL_EXTENDED_DATA } from "./ciqual-data-extended";

// ============================================================================
// SAMPLE DATA - Ingrédients CIQUAL de base pour démarrage
// ============================================================================

/**
 * Données d'exemple extraites de CIQUAL
 * Source: https://ciqual.anses.fr/
 * TODO: Remplacer par import CSV complet
 */
const SAMPLE_CIQUAL_DATA: Omit<IngredientCiqual, "id" | "date_import">[] = [
  {
    code_ciqual: "4044",
    nom_fr: "Patate douce",
    nom_en: "Sweet potato",
    groupe: "Féculents",
    sous_groupe: "Tubercules",
    nutrition_100g: {
      energie_kcal: 76,
      proteines_g: 1.4,
      lipides_g: 0.1,
      glucides_g: 17.7,
      fibres_g: 2.5,
      sel_g: 0.01,
      eau_g: 77,
      sucres_g: 4.2,
      amidon_g: 13.5,
      vitamine_a_µg: 14187,
      vitamine_c_mg: 12.8,
      vitamine_b6_mg: 0.2,
      potassium_mg: 337,
      magnesium_mg: 25,
      calcium_mg: 30,
      fer_mg: 0.6,
    },
    compatible_chylo: true,
    index_glycemique: 46,
    allergenes: [],
    regime_exclusions: [],
    saisons: ["AUTOMNE", "HIVER"],
    source: "CIQUAL",
    notes: "Cuisson vapeur ou bouillie recommandée pour conserver IG bas",
  },
  {
    code_ciqual: "16018",
    nom_fr: "Poulet, blanc, cuit à la vapeur",
    nom_en: "Chicken breast, steamed",
    groupe: "Viandes",
    sous_groupe: "Volailles",
    nutrition_100g: {
      energie_kcal: 151,
      proteines_g: 31.0,
      lipides_g: 3.2,
      glucides_g: 0,
      fibres_g: 0,
      sel_g: 0.1,
      eau_g: 65,
      acides_gras_satures_g: 0.9,
      acides_gras_monoinsatures_g: 1.1,
      acides_gras_polyinsatures_g: 0.7,
      cholesterol_mg: 85,
      vitamine_b3_mg: 13.7,
      vitamine_b6_mg: 0.6,
      phosphore_mg: 220,
      selenium_µg: 27,
      zinc_mg: 1.0,
    },
    compatible_chylo: true,
    index_glycemique: 0,
    allergenes: [],
    regime_exclusions: ["VEGETARIEN", "VEGAN"],
    saisons: ["TOUTE_ANNEE"],
    source: "CIQUAL",
    notes: "Excellente source de protéines maigres",
  },
  {
    code_ciqual: "20047",
    nom_fr: "Lentilles corail, cuites",
    nom_en: "Red lentils, cooked",
    groupe: "Légumineuses",
    sous_groupe: "Lentilles",
    nutrition_100g: {
      energie_kcal: 100,
      proteines_g: 7.6,
      lipides_g: 0.4,
      glucides_g: 17.5,
      fibres_g: 3.9,
      sel_g: 0.01,
      eau_g: 70,
      sucres_g: 1.8,
      amidon_g: 15.7,
      fer_mg: 2.0,
      magnesium_mg: 18,
      phosphore_mg: 99,
      potassium_mg: 220,
      zinc_mg: 1.0,
    },
    compatible_chylo: true,
    index_glycemique: 30,
    allergenes: [],
    regime_exclusions: [],
    saisons: ["TOUTE_ANNEE"],
    source: "CIQUAL",
    notes: "IG excellent, priorité 1 pour féculents",
  },
  {
    code_ciqual: "20028",
    nom_fr: "Quinoa, cuit",
    nom_en: "Quinoa, cooked",
    groupe: "Féculents",
    sous_groupe: "Pseudo-céréales",
    nutrition_100g: {
      energie_kcal: 120,
      proteines_g: 4.4,
      lipides_g: 2.1,
      glucides_g: 21.3,
      fibres_g: 2.8,
      sel_g: 0.01,
      eau_g: 71,
      sucres_g: 0.9,
      amidon_g: 20.4,
      magnesium_mg: 64,
      fer_mg: 1.5,
      phosphore_mg: 152,
      potassium_mg: 172,
      zinc_mg: 1.1,
    },
    compatible_chylo: true,
    index_glycemique: 35,
    allergenes: [],
    regime_exclusions: [],
    saisons: ["TOUTE_ANNEE"],
    source: "CIQUAL",
    notes: "Sans gluten, complet en acides aminés",
  },
  {
    code_ciqual: "20001",
    nom_fr: "Courgette, cuite",
    nom_en: "Zucchini, cooked",
    groupe: "Légumes",
    sous_groupe: "Légumes fruits",
    nutrition_100g: {
      energie_kcal: 21,
      proteines_g: 1.3,
      lipides_g: 0.2,
      glucides_g: 3.0,
      fibres_g: 1.1,
      sel_g: 0.01,
      eau_g: 94,
      sucres_g: 2.5,
      vitamine_c_mg: 9,
      potassium_mg: 264,
      calcium_mg: 18,
      magnesium_mg: 20,
    },
    compatible_chylo: true,
    index_glycemique: 15,
    allergenes: [],
    regime_exclusions: [],
    saisons: ["ETE", "AUTOMNE"],
    source: "CIQUAL",
    notes: "Très faible en calories, riche en eau",
  },
  {
    code_ciqual: "26058",
    nom_fr: "Cabillaud, cuit à la vapeur",
    nom_en: "Cod, steamed",
    groupe: "Poissons",
    sous_groupe: "Poissons blancs",
    nutrition_100g: {
      energie_kcal: 105,
      proteines_g: 23.5,
      lipides_g: 0.9,
      glucides_g: 0,
      fibres_g: 0,
      sel_g: 0.15,
      eau_g: 75,
      acides_gras_satures_g: 0.2,
      acides_gras_monoinsatures_g: 0.1,
      acides_gras_polyinsatures_g: 0.4,
      cholesterol_mg: 50,
      vitamine_b12_µg: 1.0,
      iode_µg: 120,
      selenium_µg: 36,
      phosphore_mg: 200,
    },
    compatible_chylo: true,
    index_glycemique: 0,
    allergenes: ["poisson"],
    regime_exclusions: ["VEGETARIEN", "VEGAN"],
    saisons: ["TOUTE_ANNEE"],
    source: "CIQUAL",
    notes: "Poisson blanc maigre, excellente source d'iode",
  },
  {
    code_ciqual: "20032",
    nom_fr: "Tomate, crue",
    nom_en: "Tomato, raw",
    groupe: "Légumes",
    sous_groupe: "Légumes fruits",
    nutrition_100g: {
      energie_kcal: 18,
      proteines_g: 0.9,
      lipides_g: 0.2,
      glucides_g: 2.8,
      fibres_g: 1.2,
      sel_g: 0.01,
      eau_g: 94,
      sucres_g: 2.6,
      vitamine_c_mg: 18,
      vitamine_a_µg: 623,
      vitamine_k_µg: 7.9,
      potassium_mg: 237,
    },
    compatible_chylo: true,
    index_glycemique: 15,
    allergenes: [],
    regime_exclusions: [],
    saisons: ["ETE", "AUTOMNE"],
    source: "CIQUAL",
    notes: "Riche en lycopène (antioxydant)",
  },
  {
    code_ciqual: "20005",
    nom_fr: "Brocoli, cuit à la vapeur",
    nom_en: "Broccoli, steamed",
    groupe: "Légumes",
    sous_groupe: "Crucifères",
    nutrition_100g: {
      energie_kcal: 29,
      proteines_g: 2.6,
      lipides_g: 0.4,
      glucides_g: 4.0,
      fibres_g: 2.4,
      sel_g: 0.02,
      eau_g: 89,
      sucres_g: 1.4,
      vitamine_c_mg: 64,
      vitamine_k_µg: 141,
      vitamine_a_µg: 623,
      calcium_mg: 40,
      fer_mg: 0.7,
      potassium_mg: 293,
    },
    compatible_chylo: true,
    index_glycemique: 15,
    allergenes: [],
    regime_exclusions: [],
    saisons: ["AUTOMNE", "HIVER", "PRINTEMPS"],
    source: "CIQUAL",
    notes: "Très riche en vitamine C et K, anti-cancer",
  },
];

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

/**
 * Importe les données CIQUAL étendues dans IndexedDB (~93 ingrédients)
 */
export async function importSampleCiqualData(): Promise<{
  success: boolean;
  imported: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let imported = 0;

  try {
    const db = await initDB();

    for (const data of CIQUAL_EXTENDED_DATA) {
      try {
        const ingredient: IngredientCiqual = {
          ...data,
          id: uuidv4(),
          date_import: new Date().toISOString(),
        };

        const transaction = db.transaction("ingredients_ciqual", "readwrite");
        const store = transaction.objectStore("ingredients_ciqual");

        await new Promise<void>((resolve, reject) => {
          const request = store.add(ingredient);
          request.onsuccess = () => {
            imported++;
            resolve();
          };
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        errors.push(`Erreur import ${data.nom_fr}: ${error}`);
      }
    }

    return { success: errors.length === 0, imported, errors };
  } catch (error) {
    return {
      success: false,
      imported,
      errors: [`Erreur générale: ${error}`],
    };
  }
}

/**
 * Vérifie si des ingrédients CIQUAL existent déjà
 */
export async function ciqualDataExists(): Promise<boolean> {
  try {
    const db = await initDB();
    const transaction = db.transaction("ingredients_ciqual", "readonly");
    const store = transaction.objectStore("ingredients_ciqual");
    const countRequest = store.count();

    return new Promise((resolve) => {
      countRequest.onsuccess = () => resolve(countRequest.result > 0);
      countRequest.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Ajoute un ingrédient CIQUAL manuellement
 */
export async function addIngredientCiqual(
  data: Omit<IngredientCiqual, "id" | "date_import">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const db = await initDB();

    // Vérifier si le code CIQUAL existe déjà
    const existing = await getIngredientByCodeCiqual(data.code_ciqual);
    if (existing) {
      return {
        success: false,
        error: `Un ingrédient avec le code CIQUAL ${data.code_ciqual} existe déjà`,
      };
    }

    const ingredient: IngredientCiqual = {
      ...data,
      id: uuidv4(),
      date_import: new Date().toISOString(),
    };

    const transaction = db.transaction("ingredients_ciqual", "readwrite");
    const store = transaction.objectStore("ingredients_ciqual");

    return new Promise((resolve) => {
      const request = store.add(ingredient);
      request.onsuccess = () =>
        resolve({ success: true, id: ingredient.id });
      request.onerror = () =>
        resolve({ success: false, error: request.error?.message });
    });
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Récupère un ingrédient par son code CIQUAL
 */
export async function getIngredientByCodeCiqual(
  code: string
): Promise<IngredientCiqual | null> {
  try {
    const db = await initDB();
    const transaction = db.transaction("ingredients_ciqual", "readonly");
    const store = transaction.objectStore("ingredients_ciqual");
    const index = store.index("code_ciqual");

    return new Promise((resolve) => {
      const request = index.get(code);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Recherche d'ingrédients par nom (fuzzy search)
 */
export async function searchIngredientsByName(
  query: string,
  limit: number = 20
): Promise<IngredientCiqual[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction("ingredients_ciqual", "readonly");
    const store = transaction.objectStore("ingredients_ciqual");
    const index = store.index("nom_fr");

    return new Promise((resolve) => {
      const results: IngredientCiqual[] = [];
      const request = index.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && results.length < limit) {
          const ingredient = cursor.value as IngredientCiqual;
          const lowerQuery = query.toLowerCase();
          const lowerNom = ingredient.nom_fr.toLowerCase();

          // Fuzzy matching simple
          if (
            lowerNom.includes(lowerQuery) ||
            lowerQuery.includes(lowerNom) ||
            ingredient.nom_en?.toLowerCase().includes(lowerQuery)
          ) {
            results.push(ingredient);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Récupère tous les ingrédients d'un groupe
 */
export async function getIngredientsByGroupe(
  groupe: string
): Promise<IngredientCiqual[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction("ingredients_ciqual", "readonly");
    const store = transaction.objectStore("ingredients_ciqual");
    const index = store.index("groupe");

    return new Promise((resolve) => {
      const request = index.getAll(groupe);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Récupère tous les ingrédients compatibles chylomicronémie
 */
export async function getCompatibleChyloIngredients(): Promise<
  IngredientCiqual[]
> {
  try {
    const db = await initDB();
    const transaction = db.transaction("ingredients_ciqual", "readonly");
    const store = transaction.objectStore("ingredients_ciqual");

    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        const compatible = all.filter((ing: IngredientCiqual) => ing.compatible_chylo);
        resolve(compatible);
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Compte le nombre d'ingrédients CIQUAL importés
 */
export async function countCiqualIngredients(): Promise<number> {
  try {
    const db = await initDB();
    const transaction = db.transaction("ingredients_ciqual", "readonly");
    const store = transaction.objectStore("ingredients_ciqual");

    return new Promise((resolve) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
}

/**
 * Parse un fichier CSV CIQUAL et l'importe
 * TODO: Implémenter le parsing CSV complet
 */
export async function importFromCiqualCSV(
  csvContent: string
): Promise<{ success: boolean; imported: number; errors: string[] }> {
  // TODO: Phase 11.1.2 - Parser CSV et importer
  // Structure attendue du CSV CIQUAL:
  // alim_code, alim_nom_fr, alim_nom_eng, alim_grp_code, alim_grp_nom_fr,
  // Energie (kcal/100 g), Protéines (g/100 g), Lipides (g/100 g), etc.

  return {
    success: false,
    imported: 0,
    errors: ["Parsing CSV non implémenté - utilisez importSampleCiqualData()"],
  };
}
