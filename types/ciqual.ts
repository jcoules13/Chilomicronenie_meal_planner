/**
 * Types pour l'architecture v0.2.0 basée sur CIQUAL
 * Phase 11: Intégration CIQUAL & Nouvelle Architecture
 */

// ============================================================================
// ENUMS & TYPES DE BASE
// ============================================================================

export type Saison = "PRINTEMPS" | "ETE" | "AUTOMNE" | "HIVER" | "TOUTE_ANNEE";

export type TypeProteine =
  | "POULET"
  | "DINDE"
  | "POISSON_BLANC"
  | "POISSON_GRAS"
  | "FRUITS_MER"
  | "OEUF"
  | "TOFU"
  | "LEGUMINEUSES"
  | "AUCUNE";

export type TypeRecette =
  | "PLAT_PRINCIPAL"
  | "ENTREE"
  | "DESSERT"
  | "ACCOMPAGNEMENT"
  | "SOUPE";

export type RegimeAlimentaire =
  | "OMNIVORE"
  | "PESCETARIEN"
  | "VEGETARIEN"
  | "VEGAN"
  | "SANS_GLUTEN"
  | "SANS_LACTOSE";

export type SourceIngredient = "CIQUAL" | "MANUEL" | "IMPORT";

export type NomRepas = "REPAS 1" | "REPAS 2";

// ============================================================================
// NUTRITION (pour 100g)
// ============================================================================

export interface Nutrition100g {
  // Macronutriments
  energie_kcal: number;
  proteines_g: number;
  lipides_g: number;
  glucides_g: number;
  fibres_g: number;
  sel_g: number;
  eau_g?: number;

  // Détail lipides
  acides_gras_satures_g?: number;
  acides_gras_monoinsatures_g?: number;
  acides_gras_polyinsatures_g?: number;
  cholesterol_mg?: number;

  // Détail glucides
  sucres_g?: number;
  amidon_g?: number;

  // Micronutriments (vitamines)
  vitamine_a_µg?: number;
  vitamine_b1_mg?: number;
  vitamine_b2_mg?: number;
  vitamine_b3_mg?: number;
  vitamine_b5_mg?: number;
  vitamine_b6_mg?: number;
  vitamine_b9_µg?: number;
  vitamine_b12_µg?: number;
  vitamine_c_mg?: number;
  vitamine_d_µg?: number;
  vitamine_e_mg?: number;
  vitamine_k_µg?: number;

  // Micronutriments (minéraux)
  calcium_mg?: number;
  cuivre_mg?: number;
  fer_mg?: number;
  iode_µg?: number;
  magnesium_mg?: number;
  manganese_mg?: number;
  phosphore_mg?: number;
  potassium_mg?: number;
  selenium_µg?: number;
  sodium_mg?: number;
  zinc_mg?: number;
}

// ============================================================================
// STORE 1: INGREDIENTS_CIQUAL
// ============================================================================

export interface IngredientCiqual {
  id: string; // UUID généré
  code_ciqual: string; // Code CIQUAL officiel (ex: "4044")
  nom_fr: string; // Nom français (ex: "Patate douce")
  nom_en?: string; // Nom anglais
  groupe: string; // Groupe alimentaire (ex: "Viandes", "Légumes", "Féculents")
  sous_groupe?: string; // Sous-groupe (ex: "Tubercules")

  // Nutrition pour 100g
  nutrition_100g: Nutrition100g;

  // Compatibilité chylomicronémie
  compatible_chylo: boolean;
  index_glycemique?: number;

  // Allergènes et restrictions
  allergenes: string[]; // Ex: ["gluten", "lactose", "fruits_coque"]
  regime_exclusions: RegimeAlimentaire[]; // Régimes qui excluent cet ingrédient

  // Saisonnalité
  saisons: Saison[];

  // Métadonnées
  source: SourceIngredient;
  date_import: string; // ISO 8601
  date_modification?: string; // ISO 8601
  notes?: string;
}

// ============================================================================
// STORE 2: RECETTES
// ============================================================================

export interface IngredientRecette {
  ingredient_id: string; // Référence vers ingredients_ciqual.id
  quantite_g: number; // Quantité en grammes
  notes?: string; // Ex: "cuit à la vapeur", "cru", "pelé"
}

export interface InstructionCuisson {
  etape: number;
  description: string;
  duree_minutes?: number;
  temperature_celsius?: number;
}

export interface InformationsConservation {
  refrigerateur_jours?: number;
  congelateur_mois?: number;
  temperature_ambiante_jours?: number;
  instructions_speciales?: string;
}

export interface NutritionCalculee {
  // Calculé dynamiquement à partir des ingrédients
  energie_kcal: number;
  proteines_g: number;
  lipides_g: number;
  glucides_g: number;
  fibres_g: number;
  sel_g: number;

  // Poids total de la recette
  poids_total_g: number;

  // Nutrition pour 100g de la recette préparée
  par_100g: Nutrition100g;
}

export interface Recette {
  id: string; // UUID
  nom: string; // Ex: "Poulet vapeur aux légumes"
  description?: string;

  // Catégorisation
  type: TypeRecette;
  categorie_proteine: TypeProteine;

  // Composition
  ingredients: IngredientRecette[];

  // Préparation
  instructions_cuisson: InstructionCuisson[];
  temps_preparation_minutes?: number;
  temps_cuisson_minutes?: number;
  difficulte?: "FACILE" | "MOYEN" | "DIFFICILE";

  // Conservation
  conservation?: InformationsConservation;

  // Nutrition (calculée automatiquement)
  nutrition_calculee: NutritionCalculee;

  // Métadonnées
  date_creation: string; // ISO 8601
  date_modification?: string;
  createur: "SYSTEM" | "UTILISATEUR" | "IMPORT";
  source_menu_original?: string; // Référence si extrait d'un ancien menu
  tags?: string[];
  notes?: string;
}

// ============================================================================
// STORE 3: MENUS_PERSONNALISES
// ============================================================================

export interface RecetteMenu {
  recette_id: string; // Référence vers recettes.id
  portions: number; // Nombre de portions (adapté au profil utilisateur)
  notes?: string;
}

export interface RepasMenu {
  nom: NomRepas;
  heure_suggeree?: string; // Ex: "12:00", "19:00"
  recettes: RecetteMenu[];
}

export interface ValidationContraintes {
  lipides_ok: boolean;
  lipides_total_g: number;
  lipides_max_g: number;

  allergenes_ok: boolean;
  allergenes_detectes: string[];

  ingredients_exclus_ok: boolean;
  ingredients_exclus_detectes: string[];

  calories_ok: boolean;
  calories_total_kcal: number;
  calories_objectif_kcal: number;
  ecart_calories_pourcent: number;
}

export interface MenuPersonnalise {
  id: string; // UUID
  utilisateur_id: string; // Référence vers l'utilisateur
  nom: string; // Ex: "Menu Jeudi 8 Novembre"

  // Structure du menu
  repas: RepasMenu[];

  // Nutrition totale (calculée)
  nutrition_totale: NutritionCalculee;

  // Validation contraintes
  respect_contraintes: ValidationContraintes;
  est_valide: boolean; // true si toutes les contraintes respectées

  // Métadonnées
  date_creation: string; // ISO 8601
  date_modification?: string;
  date_planification?: string; // Date pour laquelle le menu est prévu
  est_favori: boolean;
  notes?: string;
}

// ============================================================================
// STORE 4: CONTRAINTES_UTILISATEUR
// ============================================================================

export interface ContraintesUtilisateur {
  id: string; // UUID
  utilisateur_id: string; // Référence vers l'utilisateur

  // Objectifs nutritionnels
  objectif_calories: number; // Ex: 2100
  objectif_lipides_max_g: number; // Ex: 40
  objectif_proteines_min_g?: number;
  objectif_glucides_min_g?: number;
  objectif_fibres_min_g?: number;

  // Allergies et exclusions
  allergenes_exclus: string[]; // Ex: ["gluten", "lactose", "arachides"]
  ingredients_exclus: string[]; // IDs d'ingrédients à exclure
  groupes_exclus: string[]; // Ex: ["Viandes rouges", "Charcuterie"]

  // Préférences
  regime: RegimeAlimentaire;
  saisons_preferees: Saison[];
  proteines_preferees: TypeProteine[];
  proteines_exclues: TypeProteine[];

  // Contraintes spéciales
  pathologie: string; // Ex: "chylomicronémie"
  notes_medicales?: string;

  // Métadonnées
  date_creation: string;
  date_modification?: string;
}

// ============================================================================
// TYPES UTILITAIRES
// ============================================================================

export interface CalculNutritionOptions {
  ingredients: IngredientRecette[];
  ratio_portions?: number; // Multiplicateur de portions (ex: 1.2 pour +20%)
}

export interface RechercheIngredientOptions {
  query: string;
  groupes?: string[];
  compatible_chylo_only?: boolean;
  allergenes_exclus?: string[];
  limit?: number;
}

export interface ValidationMenuResult {
  est_valide: boolean;
  contraintes: ValidationContraintes;
  suggestions?: string[];
  alertes?: string[];
}

// ============================================================================
// HELPERS TYPES
// ============================================================================

export type IngredientCiqualInput = Omit<IngredientCiqual, "id" | "date_import">;
export type RecetteInput = Omit<Recette, "id" | "nutrition_calculee" | "date_creation">;
export type MenuPersonnaliseInput = Omit<MenuPersonnalise, "id" | "nutrition_totale" | "respect_contraintes" | "est_valide" | "date_creation">;
export type ContraintesUtilisateurInput = Omit<ContraintesUtilisateur, "id" | "date_creation">;
