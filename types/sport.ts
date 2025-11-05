export type TypeSeance = "velo" | "marche" | "rameur" | "gainage" | "hiit";
export type ZoneCardiaque = "Z1" | "Z2" | "Z3" | "Z4" | "Z5";
export type JourSemaine = "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi" | "dimanche";

export interface Seance {
  id: string;
  jour: JourSemaine;
  type: TypeSeance;
  duree_minutes: number;
  zone_cardiaque: ZoneCardiaque;
  niveau_resistance?: number; // Pour vélo
  notes?: string;
}

export interface ProgrammeSportif {
  id: string;
  semaine: number; // 1-24
  phase: 1 | 2 | 3; // Phase 1 (S1-8), Phase 2 (S9-16), Phase 3 (S17-24)
  type: "normale" | "deload"; // Deload semaines 7, 13, 19
  seances: Seance[];
  volume_total_minutes: number;
}

export interface JournalSeance {
  id: string;
  seance_id: string;
  date: Date;
  duree_reelle_minutes: number;
  fc_moyenne?: number;
  fc_max?: number;
  ressenti: number; // 1-10
  fatigue: number; // 1-10
  notes?: string;
}
