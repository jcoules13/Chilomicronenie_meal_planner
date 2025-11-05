/**
 * Types pour le profil utilisateur
 */

export type Sexe = "HOMME" | "FEMME";

export type NiveauActivite =
  | "SEDENTAIRE"
  | "LEGER"
  | "MODERE"
  | "ACTIF"
  | "TRES_ACTIF";

export type ObjectifSante = "MAINTIEN" | "PERTE_POIDS" | "PRISE_MASSE";

/**
 * Preset de répartition calorique
 */
export type PresetRepartition =
  | "EQUILIBRE" // 50/50
  | "MATIN_PLUS" // 60/40
  | "MATIN_TRES_PLUS" // 70/30
  | "SOIR_PLUS" // 40/60
  | "SOIR_TRES_PLUS" // 30/70
  | "CUSTOM"; // Personnalisé

/**
 * Configuration d'un repas
 */
export interface ConfigRepas {
  id: string;
  nom: string; // "Petit-déjeuner", "Déjeuner", "Dîner", "Collation 1", etc.
  horaire: string; // Format HH:MM
  pourcentage_calories: number; // 0-100
  actif: boolean; // Le repas est-il actif ?
}

/**
 * Valeurs calculées automatiquement
 */
export interface ValeursCalculees {
  imc: number;
  categorie_imc: "MAIGREUR" | "NORMAL" | "SURPOIDS" | "OBESITE";
  besoins_energetiques_kcal: number; // Métabolisme de base + activité
  fc_max: number; // Fréquence cardiaque maximale
  zone_cardio_basse: { min: number; max: number }; // 60-70% FC Max
  zone_cardio_moderee: { min: number; max: number }; // 70-80% FC Max
  zone_cardio_intense: { min: number; max: number }; // 80-90% FC Max
  macros_quotidiens: {
    proteines_g: number;
    lipides_g: number;
    glucides_g: number;
  };
}

/**
 * Pathologies et contraintes
 */
export interface ContraintesSante {
  chylomicronemie: boolean;
  diabete: boolean;
  hypertension: boolean;
  autre_pathologie?: string;
  limite_lipides_g_jour?: number; // Limite quotidienne en lipides (chylomicronémie)
  limite_sodium_mg_jour?: number; // Limite quotidienne en sodium (hypertension)
}

/**
 * Profil utilisateur complet
 */
export interface UserProfile {
  id: string;

  // Informations personnelles
  nom?: string;
  prenom?: string;
  date_naissance?: Date;
  sexe: Sexe;

  // Données physiques
  poids_kg: number;
  taille_cm: number;
  niveau_activite: NiveauActivite;
  objectif: ObjectifSante;

  // Contraintes santé
  contraintes_sante: ContraintesSante;

  // Configuration des repas
  nombre_repas: number; // 1-5
  preset_repartition: PresetRepartition;
  repas: ConfigRepas[];

  // Valeurs calculées (auto-générées)
  valeurs_calculees?: ValeursCalculees;

  // Metadata
  date_creation: Date;
  date_modification: Date;
}

/**
 * Coefficients multiplicateurs pour le niveau d'activité
 * Utilisés pour calculer les besoins énergétiques totaux
 */
export const COEFFICIENTS_ACTIVITE: Record<NiveauActivite, number> = {
  SEDENTAIRE: 1.2, // Peu ou pas d'exercice
  LEGER: 1.375, // Exercice léger 1-3 jours/semaine
  MODERE: 1.55, // Exercice modéré 3-5 jours/semaine
  ACTIF: 1.725, // Exercice intense 6-7 jours/semaine
  TRES_ACTIF: 1.9, // Exercice très intense, travail physique
};

/**
 * Presets de répartition calorique
 */
export const PRESETS_REPARTITION: Record<
  PresetRepartition,
  { label: string; description: string }
> = {
  EQUILIBRE: {
    label: "Équilibré (50/50)",
    description: "Répartition égale entre matin et soir",
  },
  MATIN_PLUS: {
    label: "Matin+ (60/40)",
    description: "Plus de calories le matin",
  },
  MATIN_TRES_PLUS: {
    label: "Matin++ (70/30)",
    description: "Beaucoup plus de calories le matin",
  },
  SOIR_PLUS: {
    label: "Soir+ (40/60)",
    description: "Plus de calories le soir",
  },
  SOIR_TRES_PLUS: {
    label: "Soir++ (30/70)",
    description: "Beaucoup plus de calories le soir",
  },
  CUSTOM: {
    label: "Personnalisé",
    description: "Configuration manuelle",
  },
};

/**
 * Catégories d'IMC selon l'OMS
 */
export const CATEGORIES_IMC = {
  MAIGREUR: { min: 0, max: 18.5, label: "Maigreur", color: "text-yellow-600" },
  NORMAL: { min: 18.5, max: 25, label: "Normal", color: "text-green-600" },
  SURPOIDS: { min: 25, max: 30, label: "Surpoids", color: "text-orange-600" },
  OBESITE: { min: 30, max: 100, label: "Obésité", color: "text-red-600" },
} as const;
