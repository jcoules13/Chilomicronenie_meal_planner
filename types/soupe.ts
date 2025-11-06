import { Saison } from "./aliment";

/**
 * Type de lipide utilisé dans la recette
 */
export type TypeLipide =
  | "MCT_COCO" // Huile MCT coco - NE FORME PAS de chylomicrons ⭐
  | "OLIVE" // Huile d'olive - Formation chylomicrons ⚠️
  | "SESAME" // Huile de sésame
  | "AUCUN"; // Pas de matière grasse ajoutée

/**
 * Informations sur un lipide utilisé
 */
export interface LipideRecette {
  type: TypeLipide;
  quantite_g: number; // Quantité totale pour toute la recette
  portions: number; // Nombre de portions
  quantite_par_portion_g: number; // Calculé automatiquement
  note?: string; // Ex: "POUR TOUTE LA SOUPE"
}

/**
 * Ingrédient de soupe
 */
export interface IngredientSoupe {
  nom: string;
  quantite: number;
  unite: string; // "g", "ml", "c.à.soupe", "c.à.café", "unité"
  preparation?: string; // Ex: "pelé, en dés", "émincé"
  optionnel?: boolean;
}

/**
 * Valeurs nutritionnelles par portion de soupe
 */
export interface ValeursSoupe {
  portion_ml: number; // Taille de la portion (généralement 250ml)
  energie_kcal: number;
  proteines_g: number;
  lipides_g: number;
  glucides_g: number;
  fibres_g: number;
  sucres_g?: number;
  sel_g?: number;
}

/**
 * Recette de soupe complète
 */
export interface RecetteSoupe {
  id: string;
  nom: string; // "Soupe Potimarron Veloutée"
  saison: Saison; // Saison principale
  portions: number; // Nombre de portions (généralement 4-6)
  temps_preparation_min: number;
  temps_cuisson_min: number;

  // Ingrédients
  ingredients: IngredientSoupe[];
  lipides: LipideRecette[]; // Un ou plusieurs lipides (séparés pour traçabilité)

  // Instructions
  preparation: string[]; // Étapes numérotées
  astuces?: string[];

  // Nutrition
  valeurs_nutritionnelles: ValeursSoupe;

  // Conservation
  conservation_frigo_jours: number; // Généralement 4-5
  congelable: boolean; // Généralement true sauf gaspacho

  // Compatibilité
  compatible_chylomicronemie: boolean; // Toujours true pour vos soupes
  vegetarien: boolean;
  vegan: boolean;

  // Bonus nutritionnels
  bonus?: string[]; // Ex: ["Riche en bêta-carotène", "Anti-inflammatoire"]

  // Métadonnées
  date_creation: Date;
  date_modification: Date;
  version: string; // Ex: "1.0"
}

/**
 * Fichier 12 soupes saisonnières
 */
export interface FichierSoupesSaisonnieres {
  nom: string; // "12 Recettes de Soupes Saisonnières"
  type: "recettes_soupes";
  portions_standard: string; // "4-6 portions de 250ml"
  lipides_max_par_portion: number; // 2.5g généralement
  compatible: string; // "chylomicronémie"

  // Soupes organisées par saison
  automne: RecetteSoupe[];
  hiver: RecetteSoupe[];
  printemps: RecetteSoupe[];
  ete: RecetteSoupe[];

  // Conseils pratiques
  conseils_preparation?: string[];
  conseils_conservation?: string[];
  astuces_budget_lipides?: string[];

  date_maj: Date;
  version: string;
}

/**
 * Catégorie de soupe pour filtres
 */
export type CategorieSoupe =
  | "VELOUTE" // Soupe mixée lisse
  | "MOULINEE" // Soupe grossièrement mixée
  | "MORCEAUX" // Soupe avec morceaux
  | "FROIDE"; // Gaspacho, etc.

/**
 * Constantes pour soupes
 */
export const PORTION_STANDARD_ML = 250;
export const PORTIONS_SEMAINE = 4-6; // Préparation hebdomadaire
export const CONSERVATION_FRIGO_JOURS = 4-5;
export const LIPIDES_MAX_PAR_PORTION_G = 2.5; // Budget pour chylomicronémie

/**
 * Labels pour types de lipides
 */
export const LABELS_TYPE_LIPIDE: Record<TypeLipide, { label: string; icon: string; note: string }> = {
  MCT_COCO: {
    label: "Huile MCT Coco",
    icon: "⭐",
    note: "NE FORME PAS de chylomicrons - PRIORITAIRE pour chylomicronémie"
  },
  OLIVE: {
    label: "Huile d'olive",
    icon: "⚠️",
    note: "Formation chylomicrons - À limiter strictement"
  },
  SESAME: {
    label: "Huile de sésame",
    icon: "⚠️",
    note: "Formation chylomicrons - Occasionnel uniquement"
  },
  AUCUN: {
    label: "Sans matière grasse ajoutée",
    icon: "✅",
    note: "Idéal pour réduire au maximum les lipides"
  }
};

/**
 * Configuration pour préparation hebdomadaire soupes
 */
export interface PreparationHebdomadaireSoupes {
  jour_preparation: string; // "Dimanche" ou "Lundi"
  recettes_selectionnees: string[]; // IDs des soupes
  portions_par_recette: number;
  conservation_prevue_jours: number;
}
