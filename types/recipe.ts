/**
 * Types pour le système de recettes
 * Phase 11.2 - Générateur de recettes définitif
 */

import { Saison } from "./aliment";

/**
 * Type de recette
 */
export type TypeRecette =
  | "plat_principal"
  | "entree"
  | "soupe"
  | "dessert"
  | "accompagnement";

/**
 * Repas cible de la recette
 */
export type RepasCible = "REPAS_1" | "REPAS_2" | "LES_DEUX";

/**
 * Catégorie d'ingrédient
 */
export type CategorieIngredient =
  | "proteine"
  | "feculent"
  | "legume"
  | "lipide"
  | "produit_laitier"
  | "fruit"
  | "assaisonnement"
  | "autre";

/**
 * Difficulté de la recette
 */
export type DifficulteRecette = "facile" | "moyen" | "difficile";

/**
 * Coût estimé de la recette
 */
export type CoutEstime = "faible" | "moyen" | "eleve";

/**
 * Ingrédient dans une recette
 */
export interface IngredientRecette {
  nom: string;
  quantite: number;
  unite: string;
  categorie: CategorieIngredient;
  notes?: string;
  optionnel?: boolean;
}

/**
 * Étape de préparation
 */
export interface EtapeRecette {
  numero: number;
  titre: string;
  description: string;
  duree_min?: number;
  temperature?: string;
  materiel?: string[];
  conseils?: string[];
}

/**
 * Détails des lipides
 */
export interface LipidesDetail {
  mct_coco_g: number;
  huile_olive_g: number;
  huile_sesame_g?: number;
  naturels_proteines_g: number;
  autres_g: number;
}

/**
 * Informations nutritionnelles
 */
export interface NutritionRecette {
  calories: number;
  proteines_g: number;
  lipides_g: number;
  glucides_g: number;
  fibres_g: number;
  lipides_detail: LipidesDetail;
  ig_moyen?: number;
}

/**
 * Variante de recette
 */
export interface VarianteRecette {
  nom: string;
  modifications: string;
  notes?: string;
  nutrition_modifiee?: Partial<NutritionRecette>;
}

/**
 * Instructions de stockage
 */
export interface StockageRecette {
  refrigerateur_jours?: number;
  congelateur_mois?: number;
  instructions?: string;
}

/**
 * Recette complète
 */
export interface Recipe {
  id: string;
  titre: string;
  type: TypeRecette;
  repas_cible: RepasCible;
  saison: Saison[];

  // Temps
  temps_preparation_min: number;
  temps_cuisson_min: number;
  temps_total_min: number;
  portions: number;

  // Ingrédients et préparation
  ingredients: IngredientRecette[];
  etapes: EtapeRecette[];

  // Nutrition
  nutrition: NutritionRecette;

  // Informations complémentaires
  conseils?: string[];
  variantes?: VarianteRecette[];
  materiel_requis?: string[];
  tags?: string[];

  // Métadonnées
  difficulte: DifficulteRecette;
  cout_estime: CoutEstime;
  stockage?: StockageRecette;

  // Pour la base de données
  date_creation?: string;
  date_modification?: string;
  auteur?: string;

  // Statistiques d'utilisation
  nb_utilisations?: number;
  note_moyenne?: number;
  favoris?: boolean;
}

/**
 * Filtre de recherche de recettes
 */
export interface RecipeFilters {
  type?: TypeRecette;
  repas_cible?: RepasCible;
  saison?: Saison;
  difficulte?: DifficulteRecette;
  temps_max_min?: number;
  calories_max?: number;
  lipides_max_g?: number;
  tags?: string[];
  recherche_texte?: string;
}

/**
 * Résultat de recherche de recettes
 */
export interface RecipeSearchResult {
  recipes: Recipe[];
  total: number;
  filtres_appliques: RecipeFilters;
}

/**
 * Options de génération de recettes
 */
export interface RecipeGenerationOptions {
  repas_cible: RepasCible;
  saison: Saison;
  type_proteine?: "poulet" | "dinde" | "boeuf" | "poisson_maigre" | "poisson_gras";
  preferences?: {
    sans_gluten?: boolean;
    sans_lactose?: boolean;
    rapide?: boolean; // < 30 min
    meal_prep?: boolean;
  };
  contraintes_nutritionnelles?: {
    calories_max?: number;
    lipides_max_g?: number;
    proteines_min_g?: number;
  };
}

/**
 * Collection de recettes
 */
export interface RecipeCollection {
  id: string;
  nom: string;
  description?: string;
  recettes: Recipe[];
  tags?: string[];
  date_creation?: string;
  publique?: boolean;
}

/**
 * Tags prédéfinis pour les recettes
 */
export const RECIPE_TAGS = {
  DIETETIQUE: [
    "sans_gluten",
    "sans_lactose",
    "ig_bas",
    "pauvre_en_lipides",
    "riche_en_proteines",
    "riche_en_fibres",
  ],
  PRATIQUE: [
    "facile",
    "rapide",
    "meal_prep",
    "batch_cooking",
    "une_casserole",
    "sans_cuisson",
  ],
  OCCASION: [
    "quotidien",
    "special",
    "fetes",
    "invites",
  ],
  SAISON: [
    "printemps",
    "ete",
    "automne",
    "hiver",
    "toute_saison",
  ],
  CUISSON: [
    "vapeur",
    "four",
    "poele",
    "mijoteuse",
    "cru",
  ],
} as const;

/**
 * Catégories de protéines
 */
export const CATEGORIES_PROTEINES = {
  VIANDE_BLANCHE: ["poulet", "dinde"],
  VIANDE_ROUGE: ["boeuf"],
  POISSON_MAIGRE: ["cabillaud", "colin", "lieu", "sole", "merlan"],
  POISSON_GRAS: ["saumon", "thon", "maquereau"],
} as const;

/**
 * Valider qu'une recette respecte les contraintes
 */
export function validerRecette(recipe: Recipe): {
  valide: boolean;
  erreurs: string[];
  avertissements: string[];
} {
  const erreurs: string[] = [];
  const avertissements: string[] = [];

  // Vérifier les lipides
  const lipides_max = recipe.repas_cible === "REPAS_1" ? 12 : 10;
  if (recipe.nutrition.lipides_g > lipides_max) {
    erreurs.push(`Lipides (${recipe.nutrition.lipides_g}g) dépassent le maximum (${lipides_max}g)`);
  }

  // Vérifier les protéines
  if (recipe.nutrition.proteines_g < 45) {
    avertissements.push(`Protéines (${recipe.nutrition.proteines_g}g) en dessous de la cible (50-60g)`);
  }
  if (recipe.nutrition.proteines_g > 70) {
    avertissements.push(`Protéines (${recipe.nutrition.proteines_g}g) au-dessus de la cible (50-60g)`);
  }

  // Vérifier les calories
  const calories_cible = recipe.repas_cible === "REPAS_1" ? 1200 : 900;
  const tolerance = 100;
  if (Math.abs(recipe.nutrition.calories - calories_cible) > tolerance) {
    avertissements.push(
      `Calories (${recipe.nutrition.calories}) s'écartent de la cible (${calories_cible} ±${tolerance})`
    );
  }

  // Vérifier l'IG
  if (recipe.nutrition.ig_moyen && recipe.nutrition.ig_moyen > 55) {
    avertissements.push(`IG moyen (${recipe.nutrition.ig_moyen}) supérieur à 55`);
  }

  // Vérifier que les étapes sont numérotées correctement
  recipe.etapes.forEach((etape, index) => {
    if (etape.numero !== index + 1) {
      erreurs.push(`L'étape ${index + 1} a un numéro incorrect (${etape.numero})`);
    }
  });

  // Vérifier que les temps correspondent
  const temps_calcule = recipe.temps_preparation_min + recipe.temps_cuisson_min;
  if (recipe.temps_total_min < temps_calcule) {
    avertissements.push(
      `Temps total (${recipe.temps_total_min} min) inférieur à préparation + cuisson (${temps_calcule} min)`
    );
  }

  return {
    valide: erreurs.length === 0,
    erreurs,
    avertissements,
  };
}

/**
 * Calculer le pourcentage de MCT dans une recette
 */
export function calculerPourcentageMCT(recipe: Recipe): number {
  const { lipides_detail } = recipe.nutrition;
  const total = lipides_detail.mct_coco_g +
                lipides_detail.huile_olive_g +
                (lipides_detail.huile_sesame_g || 0) +
                lipides_detail.naturels_proteines_g +
                lipides_detail.autres_g;

  if (total === 0) return 0;
  return (lipides_detail.mct_coco_g / total) * 100;
}

/**
 * Obtenir une recette aléatoire selon les filtres
 */
export function getRandomRecipe(
  recipes: Recipe[],
  filters?: RecipeFilters
): Recipe | null {
  let filteredRecipes = recipes;

  if (filters) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      if (filters.type && recipe.type !== filters.type) return false;
      if (filters.repas_cible && recipe.repas_cible !== filters.repas_cible && recipe.repas_cible !== "LES_DEUX") return false;
      if (filters.saison && !recipe.saison.includes(filters.saison)) return false;
      if (filters.difficulte && recipe.difficulte !== filters.difficulte) return false;
      if (filters.temps_max_min && recipe.temps_total_min > filters.temps_max_min) return false;
      if (filters.calories_max && recipe.nutrition.calories > filters.calories_max) return false;
      if (filters.lipides_max_g && recipe.nutrition.lipides_g > filters.lipides_max_g) return false;
      if (filters.tags && !filters.tags.every(tag => recipe.tags?.includes(tag))) return false;

      if (filters.recherche_texte) {
        const texte = filters.recherche_texte.toLowerCase();
        const dans_titre = recipe.titre.toLowerCase().includes(texte);
        const dans_ingredients = recipe.ingredients.some(i =>
          i.nom.toLowerCase().includes(texte)
        );
        if (!dans_titre && !dans_ingredients) return false;
      }

      return true;
    });
  }

  if (filteredRecipes.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
  return filteredRecipes[randomIndex];
}
