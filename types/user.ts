export type Sexe = "M" | "F";

export type Pathologie =
  | "chylomicronemie"
  | "diabete_type2"
  | "hypertension"
  | "syndrome_metabolique"
  | "nafld"
  | "insuffisance_renale";

export type TypeRegime =
  | "keto"
  | "vegan"
  | "hyper_proteine"
  | "mediterraneen";

export type ObjectifNutrition =
  | "perte_poids"
  | "prise_poids"
  | "prise_masse_musculaire"
  | "stabilisation";

export interface Macros {
  kcal_jour: number;
  proteines_g: number;
  lipides_g: number;
  glucides_g: number;
  fibres_g: number;
}

export interface ZonesCardiaques {
  z1: { min: number; max: number }; // Récupération
  z2: { min: number; max: number }; // Aérobie base
  z3: { min: number; max: number }; // Aérobie
  z4: { min: number; max: number }; // Anaérobie
  z5: { min: number; max: number }; // Maximum
}

export interface FenetreAlimentaire {
  debut: string; // "11:00"
  fin: string; // "18:00"
}

export interface UserProfile {
  id: string;
  // Informations personnelles
  age: number;
  sexe: Sexe;
  taille_cm: number;
  poids_actuel_kg: number;
  tour_taille_cm: number;
  imc: number; // calculé automatiquement

  // Pathologies (multi-sélection)
  pathologies: Pathologie[];

  // Types de régime (multi-sélection)
  regimes: TypeRegime[];

  // Objectif principal
  objectif: ObjectifNutrition;

  // Contraintes nutritionnelles (calculées automatiquement)
  macros: Macros;

  // Sport
  fc_max: number;
  niveau_activite: number; // 1.2-1.9 (facteur activité)
  zones_cardiaques: ZonesCardiaques;

  // Paramètres régime
  fenetre_alimentaire: FenetreAlimentaire;
  nombre_repas_jour: number;
  jeune_mensuel: boolean;

  // Niveau d'assouplissement du régime (0-100%)
  assouplissement_regime: number;

  // Métadonnées
  date_creation: Date;
  date_modification: Date;
}
