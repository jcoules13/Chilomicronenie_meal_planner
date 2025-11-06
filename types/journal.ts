export interface JournalQuotidien {
  id: string;
  date: Date;
  poids_kg: number;
  tour_taille_cm?: number;
  qualite_sommeil: number; // 1-10
  duree_sommeil_heures: number;
  duree_sommeil_profond_heures?: number;
  energie_ressentie: number; // 1-10
  symptomes?: string;
  menu_suivi: boolean;
  menu_suivi_notes?: string;
  seance_sport_effectuee: boolean;
}
