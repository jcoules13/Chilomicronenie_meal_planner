/**
 * Types pour la gestion des listes de courses et archives
 */

export interface IngredientCourse {
  nom: string;
  quantite_totale: number;
  unite: string;
  categorie: string;
  checked: boolean;
}

export interface ArchiveListeCourses {
  id: string;
  date_creation: Date;
  date_archive: Date;
  nombre_menus: number;
  ingredients: IngredientCourse[];
  total_items: number;
  items_coches: number;
  progression: number; // Pourcentage (0-100)
  note?: string; // Note optionnelle ajoutée par l'utilisateur
}

export interface ArchivesCoursesStats {
  total_archives: number;
  derniere_archive?: ArchiveListeCourses;
  archives_ce_mois: number;
}
