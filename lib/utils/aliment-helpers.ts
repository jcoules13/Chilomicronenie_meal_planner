import { CompatibilitePathologie } from "@/types/aliment";

/**
 * Configuration des badges de compatibilité
 */
export const compatibilityBadges = {
  EXCELLENT: {
    icon: "⭐⭐⭐",
    emoji: "🟢",
    color: "success",
    label: "Excellent",
    bgClass: "bg-green-100 dark:bg-green-900",
    textClass: "text-green-800 dark:text-green-100",
    borderClass: "border-green-300 dark:border-green-700",
  },
  BON: {
    icon: "⭐⭐",
    emoji: "🔵",
    color: "primary",
    label: "Bon",
    bgClass: "bg-blue-100 dark:bg-blue-900",
    textClass: "text-blue-800 dark:text-blue-100",
    borderClass: "border-blue-300 dark:border-blue-700",
  },
  MODERE: {
    icon: "⭐",
    emoji: "🟡",
    color: "warning",
    label: "Modéré",
    bgClass: "bg-yellow-100 dark:bg-yellow-900",
    textClass: "text-yellow-800 dark:text-yellow-100",
    borderClass: "border-yellow-300 dark:border-yellow-700",
  },
  DECONSEILLE: {
    icon: "❌",
    emoji: "🔴",
    color: "destructive",
    label: "Déconseillé",
    bgClass: "bg-red-100 dark:bg-red-900",
    textClass: "text-red-800 dark:text-red-100",
    borderClass: "border-red-300 dark:border-red-700",
  },
} as const;

/**
 * Obtenir le badge de compatibilité
 */
export function getCompatibilityBadge(niveau: CompatibilitePathologie) {
  return compatibilityBadges[niveau];
}

/**
 * Catégorie d'index glycémique
 */
export function getCategorieIG(ig: number): {
  categorie: "BAS" | "MOYEN" | "ELEVE";
  color: string;
  label: string;
} {
  if (ig < 55) {
    return {
      categorie: "BAS",
      color: "text-green-600 dark:text-green-400",
      label: "Bas",
    };
  } else if (ig < 70) {
    return {
      categorie: "MOYEN",
      color: "text-yellow-600 dark:text-yellow-400",
      label: "Moyen",
    };
  } else {
    return {
      categorie: "ELEVE",
      color: "text-red-600 dark:text-red-400",
      label: "Élevé",
    };
  }
}

/**
 * Catégorie de lipides (pour chylomicronémie)
 */
export function getCategorieLipides(lipides: number): {
  categorie: "TRES_BAS" | "BAS" | "MODERE" | "ELEVE";
  color: string;
  label: string;
} {
  if (lipides < 2) {
    return {
      categorie: "TRES_BAS",
      color: "text-green-600 dark:text-green-400",
      label: "Très bas",
    };
  } else if (lipides < 5) {
    return {
      categorie: "BAS",
      color: "text-blue-600 dark:text-blue-400",
      label: "Bas",
    };
  } else if (lipides < 10) {
    return {
      categorie: "MODERE",
      color: "text-yellow-600 dark:text-yellow-400",
      label: "Modéré",
    };
  } else {
    return {
      categorie: "ELEVE",
      color: "text-red-600 dark:text-red-400",
      label: "Élevé",
    };
  }
}

/**
 * Formater les macros pour affichage
 */
export function formatMacros(
  proteines: number,
  lipides: number,
  glucides: number
): string {
  return `P: ${proteines.toFixed(1)}g | L: ${lipides.toFixed(1)}g | G: ${glucides.toFixed(1)}g`;
}
