export type TypePlat =
  | "entree"
  | "proteine"
  | "legumes"
  | "feculent"
  | "lipides"
  | "dessert";

export interface Plat {
  type: TypePlat;
  aliment: string; // nom de l'aliment
  quantite_g: number;
  preparation?: string; // ex: "vapeur", "grillé"
}

export interface Repas {
  heure: string; // "11:00" ou "17:00"
  plats: Plat[];
}

export interface TotauxNutritionnels {
  kcal: number;
  proteines: number;
  lipides: number;
  glucides: number;
  fibres: number;
}

export interface Menu {
  id: string;
  nom: string; // ex: "Menu A"
  date_debut?: Date; // si menu planifié pour une période spécifique
  date_fin?: Date;
  repas: Repas[];
  totaux: TotauxNutritionnels;
  compatible_pathologies: string[];
  notes?: string;
  // Métadonnées
  date_creation: Date;
  date_modification: Date;
}
