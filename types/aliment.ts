export type CompatibilitePathologie = "EXCELLENT" | "BON" | "MODERE" | "DECONSEILLE";

export type CategorieAliment =
  | "Légumes"
  | "Protéines"
  | "Féculents"
  | "Fruits"
  | "Aromates"
  | "Condiments"
  | "Produits laitiers"
  | "Noix et graines"
  | "Légumineuses"
  | "Huiles et matières grasses"
  | "Boissons"
  | "Autres";

export type Saison = "Printemps" | "Été" | "Automne" | "Hiver" | "Toute année";

export interface ValeursNutritionnelles {
  energie_kcal: number;
  proteines_g: number;
  glucides_g: number;
  lipides_g: number;
  fibres_g: number;
  eau_g?: number;
}

export interface Micronutriments {
  vitamine_a_ug?: number;
  vitamine_b1_mg?: number;
  vitamine_b2_mg?: number;
  vitamine_b3_mg?: number;
  vitamine_b6_mg?: number;
  vitamine_b9_ug?: number;
  vitamine_b12_ug?: number;
  vitamine_c_mg?: number;
  vitamine_d_ug?: number;
  vitamine_e_mg?: number;
  vitamine_k_ug?: number;
  calcium_mg?: number;
  fer_mg?: number;
  magnesium_mg?: number;
  phosphore_mg?: number;
  potassium_mg?: number;
  sodium_mg?: number;
  zinc_mg?: number;
  selenium_ug?: number;
}

export interface Aliment {
  id: string; // généré automatiquement
  nom: string;
  categorie: CategorieAliment;
  saison: Saison[];
  compatible_chylomicronemie: CompatibilitePathologie;
  index_glycemique: number;
  valeurs_nutritionnelles_100g: ValeursNutritionnelles;
  micronutriments?: Micronutriments;
  utilisation?: string; // conseils de préparation
  conservation?: string;
  notes?: string;
  // Métadonnées
  date_creation: Date;
  date_modification: Date;
}
