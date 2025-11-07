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
 * Semaine du cycle de 4 semaines
 */
export type SemaineCycle = "S1" | "S2" | "S3" | "S4";

/**
 * État du protocole de jeûne
 */
export type EtatJeune =
  | "INACTIF" // Pas de jeûne en cours
  | "EN_JEUNE" // En période de jeûne
  | "REALIMENTATION"; // En période de réalimentation progressive

/**
 * Historique d'un jeûne
 */
export interface HistoriqueJeune {
  id: string;
  date_debut: Date;
  date_fin: Date;
  duree_jours: number; // 3 ou 4
  semaine_cycle: SemaineCycle;
  tg_avant_g_l?: number; // TG avant le jeûne
  tg_apres_g_l?: number; // TG après le jeûne (à J+7)
  notes?: string;
}

/**
 * Configuration du protocole de jeûne
 */
export interface ConfigJeune {
  actif: boolean; // Le protocole de jeûne est-il activé ?
  semaine_jeune: SemaineCycle; // Semaine du jeûne (S1, S2, S3, ou S4)
  duree_jours: 3 | 4; // 3 ou 4 jours de jeûne

  // État actuel du cycle
  etat_actuel: EtatJeune;
  jour_cycle?: number; // Jour du cycle (1-28, si cycle de 4 semaines)
  jour_realimentation?: number; // Jour de réalimentation (J+1 à J+7)

  // Dates du cycle actuel
  date_debut_cycle?: Date; // Début du cycle de 4 semaines
  date_debut_jeune?: Date; // Début du jeûne actuel
  date_fin_jeune?: Date; // Fin du jeûne actuel

  // Historique
  historique?: HistoriqueJeune[];
}

/**
 * Zones de triglycérides avec risques associés
 */
export type ZoneTG =
  | "CRITIQUE" // ≥ 10 g/L - Risque élevé de pancréatite
  | "HAUTE" // 5-10 g/L - Risque modéré, surveillance étroite
  | "MODEREE" // 2-5 g/L - Élevé, nécessite contrôle
  | "LIMITE" // 1.5-2 g/L - Limite haute de la normale
  | "NORMALE"; // < 1.5 g/L - Objectif thérapeutique

/**
 * Historique des triglycérides
 */
export interface MesureTG {
  date: Date;
  valeur_g_l: number;
  zone: ZoneTG;
}

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
  bmr_kcal: number; // BMR utilisé (manuel ou calculé)
  bmr_source: "MANUEL" | "CALCULE"; // Source du BMR
  besoins_energetiques_kcal: number; // BMR × activité + ajustement objectif
  fc_max: number; // Fréquence cardiaque maximale
  zone_cardio_brule_graisse: { min: number; max: number }; // Zone 2: 60-70% FC Max
  zone_cardio_aerobie: { min: number; max: number }; // Zone 3: 70-80% FC Max
  zone_cardio_anaerobie: { min: number; max: number }; // Zone 4: 80-90% FC Max
  zone_cardio_maximum: { min: number; max: number }; // Zone 5: 90-100% FC Max
  zone_tg?: ZoneTG; // Zone de triglycérides si chylomicronémie
  limite_lipides_adaptative_g?: number; // Limite lipides adaptée selon TG
  limite_lipides_jeune_g?: number; // Limite lipides pendant réalimentation (si applicable)
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
  bmr_manuel_kcal?: number; // BMR mesuré (optionnel, remplace le calcul auto si fourni)

  // Contraintes santé
  contraintes_sante: ContraintesSante;

  // Suivi des triglycérides (chylomicronémie)
  niveau_tg_g_l?: number; // Niveau actuel de TG en g/L
  historique_tg?: MesureTG[]; // Historique des mesures

  // Protocole de jeûne (chylomicronémie)
  config_jeune?: ConfigJeune; // Configuration du protocole de jeûne

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
    description: "Plus de calories le matin (Repas 1 à 11h)",
  },
  MATIN_TRES_PLUS: {
    label: "Matin++ (70/30)",
    description: "Beaucoup plus de calories le matin (Repas 1 à 11h)",
  },
  SOIR_PLUS: {
    label: "Midi+ (40/60)",
    description: "Plus de calories le midi (Repas 2 à 17h)",
  },
  SOIR_TRES_PLUS: {
    label: "Midi++ (30/70)",
    description: "Beaucoup plus de calories le midi (Repas 2 à 17h)",
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

/**
 * Zones de triglycérides avec limites lipidiques adaptées
 * Basé sur recommandations médicales pour chylomicronémie
 */
export const ZONES_TG = {
  CRITIQUE: {
    min: 10,
    max: 999,
    label: "Zone critique",
    description: "Risque très élevé de pancréatite aiguë",
    color: "text-red-700",
    bg_color: "bg-red-50 dark:bg-red-950/20",
    border_color: "border-red-200 dark:border-red-800",
    limite_lipides_g: 10, // Restriction maximale
    alerte: "🚨 DANGER CRITIQUE : Risque pancréatite très élevé - Restriction maximale",
  },
  HAUTE: {
    min: 5,
    max: 10,
    label: "Zone de danger",
    description: "Zone de danger pancréatite - Risque élevé",
    color: "text-orange-600",
    bg_color: "bg-orange-50 dark:bg-orange-950/20",
    border_color: "border-orange-200 dark:border-orange-800",
    limite_lipides_g: 15, // Restriction stricte
    alerte: "⚠️ DANGER : Zone de risque pancréatite - Régime strict obligatoire",
  },
  MODEREE: {
    min: 2,
    max: 5,
    label: "Zone sécurisée",
    description: "Hors danger pancréatite - TG encore élevés",
    color: "text-yellow-600",
    bg_color: "bg-yellow-50 dark:bg-yellow-950/20",
    border_color: "border-yellow-200 dark:border-yellow-800",
    limite_lipides_g: 18, // Restriction modérée
    alerte: "✓ SÉCURISÉ : Hors danger pancréatite - Continuer amélioration",
  },
  LIMITE: {
    min: 1.5,
    max: 2,
    label: "Limite haute",
    description: "Limite haute de la normale",
    color: "text-blue-600",
    bg_color: "bg-blue-50 dark:bg-blue-950/20",
    border_color: "border-blue-200 dark:border-blue-800",
    limite_lipides_g: 20, // Assouplissement possible
    alerte: "✓ BON : TG proches de l'objectif - Vigilance maintenue",
  },
  NORMALE: {
    min: 0,
    max: 1.5,
    label: "Zone normale",
    description: "Objectif thérapeutique atteint",
    color: "text-green-600",
    bg_color: "bg-green-50 dark:bg-green-950/20",
    border_color: "border-green-200 dark:border-green-800",
    limite_lipides_g: 20, // Maximum autorisé même en zone normale
    alerte: "✅ EXCELLENT : Objectif atteint - Maintenir équilibre",
  },
} as const;
