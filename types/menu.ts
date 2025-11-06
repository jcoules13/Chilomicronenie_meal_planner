/**
 * Types pour les menus (Format adapté aux fichiers Markdown)
 */

import { Saison } from "./aliment";

export type CategorieMenu =
  | "Viande Blanche"
  | "Viande Rouge"
  | "Poisson Maigre"
  | "Poisson Gras"
  | "Végétarien"
  | "Végétalien"
  | "Autre";

/**
 * Ingrédient dans un repas
 */
export interface IngredientMenu {
  nom: string;
  quantite: number;
  unite: string; // "g", "ml", "unité", etc.
  notes?: string; // "poids cru", "sans croûte", etc.
}

/**
 * Repas dans un menu (petit-déj, déjeuner, dîner, collation)
 */
export interface RepasMenu {
  nom: string; // "Petit-déjeuner", "Déjeuner", "Dîner", "Collation"
  pourcentage_calories?: number; // Répartition calorique (ex: 30%)
  ingredients: IngredientMenu[];
  instructions?: string;
}

/**
 * Valeurs nutritionnelles d'un menu complet
 */
export interface ValeursNutritionnellesMenu {
  energie_kcal: number;
  proteines_g: number;
  lipides_g: number;
  glucides_g: number;
  fibres_g: number;
  eau_g?: number;
}

/**
 * Menu complet (journée)
 */
export interface Menu {
  id: string;
  nom: string;
  categorie: CategorieMenu;
  saisons: Saison[]; // Peut être plusieurs saisons
  portions: number; // Nombre de portions (généralement 1)

  // Timing
  temps_preparation_min?: number;
  temps_cuisson_min?: number;

  // Composition
  repas: RepasMenu[];

  // Nutrition
  valeurs_nutritionnelles: ValeursNutritionnellesMenu;

  // Notes et variantes
  notes?: string;
  variantes_saisonnieres?: string; // Suggestions de substitutions saisonnières
  conseils_preparation?: string;

  // Metadata
  date_creation: Date;
  date_modification: Date;
  source?: string; // "import", "manuel", "généré"
}

/**
 * Catégories de menus disponibles
 */
export const CATEGORIES_MENU: Record<CategorieMenu, string> = {
  "Viande Blanche": "Poulet, Dinde, Lapin",
  "Viande Rouge": "Boeuf, Veau, Agneau",
  "Poisson Maigre": "Cabillaud, Merlan, Sole",
  "Poisson Gras": "Saumon, Maquereau (limité)",
  Végétarien: "Avec oeufs et produits laitiers",
  Végétalien: "100% végétal",
  Autre: "Mixte ou autre catégorie",
};
