/**
 * Types pour la gestion du Planning Hebdomadaire
 */

import { MenuV31 } from "./menu";

/**
 * Types de rotation de protéines disponibles
 */
export type TypeRotation =
  | "CLASSIQUE"
  | "LEGERE"
  | "POISSON_PLUS"
  | "VIANDE_PLUS";

/**
 * Configuration d'une rotation de protéines
 */
export interface RotationProteine {
  type: TypeRotation;
  label: string;
  description: string;
  sequence: string[]; // 7 jours de protéines ["Poulet", "Boeuf", ...]
}

/**
 * Rotations prédéfinies
 */
export const ROTATIONS_PROTEINES: Record<TypeRotation, RotationProteine> = {
  CLASSIQUE: {
    type: "CLASSIQUE",
    label: "Rotation Classique",
    description: "Équilibre varié de toutes les sources de protéines",
    sequence: ["Poulet", "Boeuf", "Dinde", "Poisson Maigre", "Poulet", "Boeuf", "Poisson Maigre"],
  },
  LEGERE: {
    type: "LEGERE",
    label: "Rotation Légère",
    description: "Focus sur volaille et poisson avec option végétarienne",
    sequence: ["Poulet", "Dinde", "Poisson Maigre", "Poulet", "Dinde", "Poisson Maigre", "Végétarien"],
  },
  POISSON_PLUS: {
    type: "POISSON_PLUS",
    label: "Rotation Poisson+",
    description: "Priorité aux poissons (3x par semaine)",
    sequence: ["Poisson Maigre", "Poulet", "Poisson Maigre", "Dinde", "Poisson Maigre", "Boeuf", "Poisson Maigre"],
  },
  VIANDE_PLUS: {
    type: "VIANDE_PLUS",
    label: "Rotation Viande+",
    description: "Focus sur viandes rouges et blanches",
    sequence: ["Boeuf", "Poulet", "Boeuf", "Dinde", "Poulet", "Boeuf", "Dinde"],
  },
};

/**
 * Menu assigné à un jour spécifique
 */
export interface JourPlanning {
  numero_jour: number; // 1-7
  nom_jour: string; // "Lundi", "Mardi", ...
  date: Date;
  proteine_imposee: string; // "Poulet", "Boeuf", etc.
  menu_selectionne: MenuV31 | null; // Menu choisi par l'utilisateur
}

/**
 * Mode de création du planning
 */
export type ModeCreation = "AUTO" | "PERSONNALISE" | "FRIGO";

/**
 * Planning hebdomadaire complet
 */
export interface PlanningHebdomadaire {
  id: string;
  date_creation: Date;
  date_debut_semaine: Date; // Lundi
  date_fin_semaine: Date; // Dimanche

  mode_creation: ModeCreation;
  rotation_type?: TypeRotation; // Uniquement pour PERSONNALISE

  jours: JourPlanning[]; // 7 jours

  // Stats calculées
  stats: {
    calories_totales_semaine: number;
    proteines_totales_g: number;
    lipides_totaux_g: number;
    glucides_totaux_g: number;
    lipides_moyens_par_jour: number;
  };

  est_valide: boolean; // Tous les jours ont un menu
  est_archive: boolean;
  date_archive?: Date;
}

/**
 * État de création d'un planning personnalisé
 */
export interface CreationPlanningEnCours {
  rotation_choisie: TypeRotation | null;
  date_debut: Date;
  jours_remplis: Map<number, MenuV31>; // numero_jour -> Menu
  etape_actuelle: "ROTATION" | "SELECTION_MENUS" | "VALIDATION";
}

/**
 * Statistiques d'un planning
 */
export interface StatsPlanningHebdo {
  nombre_plannings_total: number;
  planning_actuel?: PlanningHebdomadaire;
  dernier_planning_archive?: PlanningHebdomadaire;
  plannings_ce_mois: number;
}
