/**
 * Types pour les menus (Format adapté aux fichiers Markdown)
 * Version 3.1 : Structure Skill.md (Salade MIDI / Soupe SOIR)
 */

import { Saison } from "./aliment";
import { TypeLipide, LipideRecette } from "./soupe";

/**
 * Type de protéine du menu (pour classification)
 */
export type TypeProteine =
  | "Poulet"
  | "Dinde"
  | "Boeuf"
  | "Porc"
  | "Poisson Maigre" // Cabillaud, Colin, Merlan, Sole, Lieu
  | "Poisson Gras" // Saumon, Thon, Maquereau (limité)
  | "Végétarien"
  | "Végétalien";

/**
 * Fréquence recommandée du menu
 */
export type FrequenceMenu =
  | "QUOTIDIEN" // Peut être utilisé tous les jours
  | "HEBDOMADAIRE" // 2-3×/semaine
  | "SEMAINE_4" // Réservé à la semaine 4 du cycle (poissons gras)
  | "OCCASIONNEL" // 1-2×/mois maximum
  | "SPECIAL"; // Occasions particulières

export type CategorieMenu =
  | "Viande Blanche"
  | "Viande Rouge"
  | "Poisson Maigre"
  | "Poisson Gras"
  | "Végétarien"
  | "Jeûne"
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
  poids_cru?: number; // Poids avant cuisson si différent
  poids_cuit?: number; // Poids après cuisson
}

/**
 * Budget lipides détaillé (distinction MCT vs autres)
 */
export interface BudgetLipides {
  total_g: number; // Total lipides du repas/menu
  mct_coco_g: number; // Lipides MCT coco (NE FORME PAS chylomicrons)
  huile_olive_g: number; // Huile d'olive (forme chylomicrons)
  huile_sesame_g: number; // Huile sésame (forme chylomicrons)
  naturels_proteines_g: number; // Lipides naturels des protéines (poulet, poisson)
  autres_g: number; // Autres sources (yaourt, légumes, etc.)

  // Pourcentages
  pct_mct: number; // % de MCT sur total (idéalement élevé)
  pct_formation_chylomicrons: number; // % qui forme des chylomicrons (à minimiser)
}

/**
 * Composant d'un repas (selon structure v3.1)
 */
export interface ComposantRepas {
  nom: string; // "ENTRÉE", "PROTÉINE", "LÉGUMES", "FÉCULENTS", "DESSERT", "SOUPE"
  description: string; // Description du composant
  ingredients: IngredientMenu[];
  lipides?: LipideRecette[]; // Lipides utilisés pour ce composant
  cuisson?: string; // Méthode de cuisson
  assaisonnement?: string; // Assaisonnement spécifique
  calories?: number; // Calories du composant
  variantes_saison?: VarianteSaisonniere[]; // Variantes selon saison
}

/**
 * Variante saisonnière pour un composant
 */
export interface VarianteSaisonniere {
  saison: Saison;
  ingredients: IngredientMenu[];
  notes?: string;
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
 * Repas selon structure v3.1 (Skill.md)
 */
export interface RepasStructureV31 {
  nom: "REPAS 1" | "REPAS 2"; // Repas 1 (11h) ou Repas 2 (17h)
  heure: string; // "11h00" ou "17h00"
  calories_cibles: number; // 1200 ou 900
  proteines_cibles_g: number; // 100 ou 70
  lipides_cibles_g: number; // 10 ou 10
  glucides_cibles_g: number; // 160 ou 120

  // Composants du repas
  composants: ComposantRepas[];

  // Budget lipides détaillé
  budget_lipides: BudgetLipides;

  // Instructions générales
  instructions?: string[];
  notes?: string[];
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
 * Menu complet selon structure v3.1 (Skill.md)
 */
export interface MenuV31 {
  id: string;
  nom: string; // "Menu Poulet 01 - Classique"
  numero: number; // 1, 2, 3, 4...

  // Classification
  type_proteine: TypeProteine;
  categorie: CategorieMenu;
  frequence: FrequenceMenu;
  saisons: Saison[]; // Saisons compatibles

  // Cibles nutritionnelles
  calories_cibles: number; // 2100 généralement
  proteines_cibles_g: number; // 170 généralement
  lipides_cibles_g: number; // 20g (30g pour poisson gras)
  glucides_cibles_g: number; // 280 généralement

  // Composition des repas (structure v3.1)
  repas_1: RepasStructureV31; // 11h00 - 1200 kcal
  repas_2: RepasStructureV31; // 17h00 - 900 kcal

  // Budget lipides détaillé (cumul jour)
  budget_lipides_journee: BudgetLipides;

  // Index glycémique
  ig_moyen: number; // IG moyen du menu (cible <55)

  // Adaptivité
  adaptatif_bmr: boolean; // Si les portions s'adaptent au BMR
  bmr_reference: number; // BMR de référence (1910 généralement)

  // Variantes saisonnières
  variantes_saison_count: number; // Nombre de variantes par composant

  // Points critiques chylomicronémie
  compatible_chylomicronemie: boolean; // Toujours true
  points_critiques?: string[]; // Points à respecter
  eviter_absolument?: string[]; // Erreurs à éviter

  // Préparation
  preparation_avance?: string[]; // Conseils préparation à l'avance
  variantes_express?: string[]; // Alternatives rapides

  // Metadata
  date_creation: Date;
  date_modification: Date;
  version: string; // "1.0"
  source?: string; // "import", "manuel", "généré"
  teste_cliniquement?: boolean; // Si le menu a été testé
  feedback_utilisateur?: string;
  tags?: string[]; // #menu #poulet #adaptatif #ig-bas etc.
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
  Jeûne: "Jour de jeûne - Aucun repas",
  Végétalien: "100% végétal",
  Autre: "Mixte ou autre catégorie",
};

/**
 * Constantes nutritionnelles pour menus v3.1
 */
export const CIBLES_MENU_V31 = {
  // Calories
  TOTAL_KCAL: 2100,
  REPAS_1_KCAL: 1200,
  REPAS_2_KCAL: 900,

  // Protéines
  TOTAL_PROTEINES_G: 170,
  REPAS_1_PROTEINES_G: 100,
  REPAS_2_PROTEINES_G: 70,

  // Lipides (normal)
  TOTAL_LIPIDES_G: 20,
  REPAS_1_LIPIDES_G: 10,
  REPAS_2_LIPIDES_G: 10,

  // Lipides (poisson gras)
  TOTAL_LIPIDES_POISSON_GRAS_G: 30,

  // Glucides
  TOTAL_GLUCIDES_G: 280,
  REPAS_1_GLUCIDES_G: 160,
  REPAS_2_GLUCIDES_G: 120,

  // Fibres
  TOTAL_FIBRES_MIN_G: 40,

  // BMR référence
  BMR_REFERENCE: 1910,
};

/**
 * Labels pour fréquences
 */
export const LABELS_FREQUENCE: Record<FrequenceMenu, { label: string; icon: string; description: string }> = {
  QUOTIDIEN: {
    label: "Quotidien",
    icon: "✅",
    description: "Peut être utilisé tous les jours"
  },
  HEBDOMADAIRE: {
    label: "Hebdomadaire",
    icon: "📅",
    description: "2-3 fois par semaine recommandé"
  },
  SEMAINE_4: {
    label: "Semaine 4 uniquement",
    icon: "⚠️",
    description: "Réservé à la semaine 4 du cycle (poissons gras)"
  },
  OCCASIONNEL: {
    label: "Occasionnel",
    icon: "🔸",
    description: "1-2 fois par mois maximum"
  },
  SPECIAL: {
    label: "Spécial",
    icon: "⭐",
    description: "Occasions particulières seulement"
  }
};

/**
 * Helper : Calculer pourcentage MCT dans budget lipides
 */
export function calculerPourcentageMCT(budget: BudgetLipides): number {
  if (budget.total_g === 0) return 0;
  return Math.round((budget.mct_coco_g / budget.total_g) * 100);
}

/**
 * Helper : Calculer pourcentage formation chylomicrons
 */
export function calculerPourcentageFormationChylomicrons(budget: BudgetLipides): number {
  if (budget.total_g === 0) return 0;
  const formation = budget.huile_olive_g + budget.huile_sesame_g + budget.naturels_proteines_g + budget.autres_g;
  return Math.round((formation / budget.total_g) * 100);
}

/**
 * Helper : Valider budget lipides pour chylomicronémie
 */
export function validerBudgetLipides(budget: BudgetLipides, limite_g: number = 20): {
  valide: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (budget.total_g > limite_g) {
    warnings.push(`⚠️ Budget lipides dépassé : ${budget.total_g}g > ${limite_g}g`);
  }

  const pct_mct = calculerPourcentageMCT(budget);
  if (pct_mct < 30) {
    warnings.push(`⚠️ Pourcentage MCT faible : ${pct_mct}% (recommandé >30%)`);
  }

  const pct_chylo = calculerPourcentageFormationChylomicrons(budget);
  if (pct_chylo > 70) {
    warnings.push(`⚠️ Trop de lipides formant chylomicrons : ${pct_chylo}% (recommandé <70%)`);
  }

  return {
    valide: warnings.length === 0,
    warnings
  };
}
