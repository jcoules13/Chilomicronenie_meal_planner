import { TypeProteine, FrequenceMenu, BudgetLipides } from "@/types/menu";

/**
 * Helper pour afficher les badges de type de protéine
 */
export function getProteineInfo(type: TypeProteine): {
  label: string;
  icon: string;
  color: string;
} {
  switch (type) {
    case "Poulet":
      return { label: "Poulet", icon: "🐔", color: "text-amber-600" };
    case "Dinde":
      return { label: "Dinde", icon: "🦃", color: "text-orange-600" };
    case "Boeuf":
      return { label: "Bœuf", icon: "🥩", color: "text-red-600" };
    case "Porc":
      return { label: "Porc", icon: "🐷", color: "text-pink-600" };
    case "Poisson Maigre":
      return { label: "Poisson Maigre", icon: "🐟", color: "text-blue-600" };
    case "Poisson Gras":
      return { label: "Poisson Gras", icon: "🐠", color: "text-cyan-600" };
    case "Végétarien":
      return { label: "Végétarien", icon: "🥚", color: "text-green-600" };
    case "Végétalien":
      return { label: "Végétalien", icon: "🌱", color: "text-emerald-600" };
    default:
      return { label: type, icon: "🍽️", color: "text-gray-600" };
  }
}

/**
 * Helper pour afficher les badges de fréquence
 */
export function getFrequenceInfo(frequence: FrequenceMenu): {
  label: string;
  icon: string;
  color: string;
  bgClass: string;
} {
  switch (frequence) {
    case "QUOTIDIEN":
      return {
        label: "Quotidien",
        icon: "✅",
        color: "text-green-700",
        bgClass: "bg-green-100",
      };
    case "HEBDOMADAIRE":
      return {
        label: "Hebdomadaire",
        icon: "📅",
        color: "text-blue-700",
        bgClass: "bg-blue-100",
      };
    case "SEMAINE_4":
      return {
        label: "Semaine 4 uniquement",
        icon: "⚠️",
        color: "text-purple-700",
        bgClass: "bg-purple-100",
      };
    case "OCCASIONNEL":
      return {
        label: "Occasionnel",
        icon: "🔸",
        color: "text-gray-700",
        bgClass: "bg-gray-100",
      };
    case "SPECIAL":
      return {
        label: "Spécial",
        icon: "⭐",
        color: "text-amber-700",
        bgClass: "bg-amber-100",
      };
    default:
      return {
        label: frequence,
        icon: "📋",
        color: "text-gray-700",
        bgClass: "bg-gray-100",
      };
  }
}

/**
 * Helper pour évaluer la qualité du budget lipides
 */
export function getBudgetLipidesQuality(budget: BudgetLipides): {
  status: "excellent" | "bon" | "acceptable" | "attention";
  label: string;
  icon: string;
  color: string;
  bgClass: string;
} {
  const pctMCT = budget.pct_mct;
  const pctChylo = budget.pct_formation_chylomicrons;
  const total = budget.total_g;

  // Excellent : >50% MCT, <50% chylo, total ≤20g
  if (pctMCT >= 50 && pctChylo <= 50 && total <= 20) {
    return {
      status: "excellent",
      label: "Excellent",
      icon: "⭐",
      color: "text-green-700",
      bgClass: "bg-green-100",
    };
  }

  // Bon : >30% MCT, <70% chylo, total ≤25g
  if (pctMCT >= 30 && pctChylo <= 70 && total <= 25) {
    return {
      status: "bon",
      label: "Bon",
      icon: "✅",
      color: "text-blue-700",
      bgClass: "bg-blue-100",
    };
  }

  // Acceptable : <70% chylo, total ≤30g
  if (pctChylo <= 70 && total <= 30) {
    return {
      status: "acceptable",
      label: "Acceptable",
      icon: "✓",
      color: "text-yellow-700",
      bgClass: "bg-yellow-100",
    };
  }

  // Attention : dépassement des recommandations
  return {
    status: "attention",
    label: "Attention",
    icon: "⚠️",
    color: "text-red-700",
    bgClass: "bg-red-100",
  };
}

/**
 * Formater le budget lipides pour affichage
 */
export function formatBudgetLipides(budget: BudgetLipides): string {
  return `${budget.total_g.toFixed(1)}g (${budget.pct_mct}% MCT)`;
}
