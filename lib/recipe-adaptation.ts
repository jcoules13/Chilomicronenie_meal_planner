/**
 * Adaptation intelligente des recettes au profil utilisateur
 * Système basé sur templates CIQUAL avec calcul automatique des quantités
 */

import type { RecipeTemplate, Recipe, IngredientRecette } from "@/types/recipe";
import type { UserProfile } from "@/types/profile";
import type { IngredientCiqual, Nutrition100g } from "@/types/ciqual";
import { getIngredientByCodeCiqual } from "@/lib/db/ciqual-import";

/**
 * Besoins nutritionnels pour un repas
 */
interface BesoinsRepas {
  proteines_g: number;
  lipides_max_g: number;
  fibres_g: number;
  ig_moyen_max: number;
  calories_cible?: number;
}

/**
 * Résultat du calcul de quantités
 */
interface QuantitesCalculees {
  ingredients: Array<{
    code_ciqual: string;
    nom: string;
    quantite_g: number;
    nutrition: {
      calories: number;
      proteines_g: number;
      lipides_g: number;
      glucides_g: number;
      fibres_g: number;
    };
  }>;
  totaux: {
    calories: number;
    proteines_g: number;
    lipides_g: number;
    glucides_g: number;
    fibres_g: number;
  };
  respect_contraintes: {
    proteines_ok: boolean;
    lipides_ok: boolean;
    fibres_ok: boolean;
  };
}

/**
 * Calculer les besoins nutritionnels pour un repas selon le profil
 */
export function calculerBesoinsRepas(
  profile: UserProfile,
  repas_cible: "REPAS_1" | "REPAS_2"
): BesoinsRepas {
  // Trouver le repas dans la config
  const repas = profile.repas?.find(r =>
    (repas_cible === "REPAS_1" && r.nom === "Déjeuner") ||
    (repas_cible === "REPAS_2" && r.nom === "Dîner")
  );

  if (!repas || !profile.valeurs_calculees) {
    throw new Error("Profil incomplet : repas ou valeurs calculées manquants");
  }

  const pourcentage = repas.pourcentage_calories / 100;

  // Calculer les besoins pour ce repas
  const proteines_totales = profile.valeurs_calculees.macros_quotidiens.proteines_g;
  const lipides_max_total = profile.valeurs_calculees.macros_quotidiens.lipides_g;

  // Fibres : utiliser la préférence utilisateur ou 30g par défaut
  const fibres_totales = profile.preferences_nutritionnelles?.objectif_fibres_g_jour || 30;

  // IG cible : diabète ou préférence utilisateur
  const ig_cible = profile.preferences_nutritionnelles?.ig_cible_max ||
                   (profile.contraintes_sante?.diabete ? 55 : 70);

  return {
    proteines_g: proteines_totales * pourcentage,
    lipides_max_g: lipides_max_total * pourcentage, // ✅ CORRECTION : répartition selon % repas
    fibres_g: fibres_totales * pourcentage,
    ig_moyen_max: ig_cible,
    calories_cible: profile.valeurs_calculees.besoins_energetiques_kcal * pourcentage,
  };
}

/**
 * Calculer les quantités intelligentes d'ingrédients
 * Optimise les protéines avec blanc d'œuf si nécessaire
 */
export async function calculerQuantitesIntelligentes(
  template: RecipeTemplate,
  besoins: BesoinsRepas
): Promise<QuantitesCalculees> {
  const ingredients_ciqual: Map<string, IngredientCiqual> = new Map();

  // Charger tous les ingrédients CIQUAL
  for (const ing of template.ingredients_template) {
    const ciqual = await getIngredientByCodeCiqual(ing.code_ciqual);
    if (ciqual) {
      ingredients_ciqual.set(ing.code_ciqual, ciqual);
    }
  }

  // Identifier la protéine principale
  const proteine_principale = template.ingredients_template.find(
    ing => ing.role === "proteine_principale"
  );

  if (!proteine_principale) {
    throw new Error("Template invalide : pas de protéine principale");
  }

  const proteine_ciqual = ingredients_ciqual.get(proteine_principale.code_ciqual);
  if (!proteine_ciqual) {
    throw new Error(`Ingrédient CIQUAL non trouvé : ${proteine_principale.code_ciqual}`);
  }

  // Calculer la quantité de protéine principale
  const proteines_par_100g = proteine_ciqual.nutrition_100g.proteines_g;
  const lipides_par_100g = proteine_ciqual.nutrition_100g.lipides_g;

  // Quantité brute nécessaire pour atteindre l'objectif protéines
  let quantite_proteine_g = (besoins.proteines_g / proteines_par_100g) * 100;

  // Vérifier si cette quantité dépasse le budget lipides
  const lipides_proteine = (quantite_proteine_g * lipides_par_100g) / 100;

  let quantite_blanc_oeuf_g = 0;
  let proteines_blanc_oeuf = 0;

  // Si les lipides dépassent le budget, réduire et compléter avec blanc d'œuf
  if (lipides_proteine > besoins.lipides_max_g * 0.7) {
    // Utiliser 70% du budget lipides pour la protéine principale
    const lipides_target = besoins.lipides_max_g * 0.7;
    quantite_proteine_g = (lipides_target / lipides_par_100g) * 100;

    const proteines_proteine_principale = (quantite_proteine_g * proteines_par_100g) / 100;
    const proteines_manquantes = besoins.proteines_g - proteines_proteine_principale;

    // Blanc d'œuf : ~10.9g protéines/100g, 0g lipides
    const BLANC_OEUF_PROTEINES_100G = 10.9;
    quantite_blanc_oeuf_g = (proteines_manquantes / BLANC_OEUF_PROTEINES_100G) * 100;
    proteines_blanc_oeuf = proteines_manquantes;
  }

  // Construire la liste des ingrédients avec quantités
  const ingredients_calcules: QuantitesCalculees["ingredients"] = [];

  // Ajouter la protéine principale
  ingredients_calcules.push({
    code_ciqual: proteine_principale.code_ciqual,
    nom: proteine_principale.nom,
    quantite_g: Math.round(quantite_proteine_g),
    nutrition: calculerNutrition(proteine_ciqual.nutrition_100g, quantite_proteine_g),
  });

  // Ajouter le blanc d'œuf si nécessaire
  if (quantite_blanc_oeuf_g > 0) {
    // Code CIQUAL du blanc d'œuf : 22000 (à vérifier dans la base)
    ingredients_calcules.push({
      code_ciqual: "22000",
      nom: "Blanc d'œuf liquide",
      quantite_g: Math.round(quantite_blanc_oeuf_g),
      nutrition: {
        calories: Math.round(quantite_blanc_oeuf_g * 0.52),
        proteines_g: Math.round(proteines_blanc_oeuf * 10) / 10,
        lipides_g: 0,
        glucides_g: Math.round(quantite_blanc_oeuf_g * 0.73) / 10,
        fibres_g: 0,
      },
    });
  }

  // Calculer les autres ingrédients (féculents, légumes, lipides)
  let lipides_utilises = ingredients_calcules.reduce((sum, ing) => sum + ing.nutrition.lipides_g, 0);

  for (const ing of template.ingredients_template) {
    if (ing.role === "proteine_principale") continue; // Déjà traité

    const ciqual = ingredients_ciqual.get(ing.code_ciqual);
    if (!ciqual) continue;

    let quantite_g = 100; // Quantité de base

    // Ajuster selon le rôle
    if (ing.role === "feculent") {
      // Calculer pour atteindre les fibres et glucides
      quantite_g = 80; // À affiner selon les besoins
    } else if (ing.role === "legume") {
      quantite_g = 200; // Légumes en quantité généreuse
    } else if (ing.role === "lipide") {
      // Utiliser le reste du budget lipides
      const lipides_restants = besoins.lipides_max_g - lipides_utilises;
      const lipides_ingredient_100g = ciqual.nutrition_100g.lipides_g;

      if (lipides_restants > 0 && lipides_ingredient_100g > 0) {
        quantite_g = (lipides_restants / lipides_ingredient_100g) * 100;
      } else {
        quantite_g = 0; // Pas de budget restant
      }
    }

    if (quantite_g > 0) {
      ingredients_calcules.push({
        code_ciqual: ing.code_ciqual,
        nom: ing.nom,
        quantite_g: Math.round(quantite_g),
        nutrition: calculerNutrition(ciqual.nutrition_100g, quantite_g),
      });

      lipides_utilises += (quantite_g * ciqual.nutrition_100g.lipides_g) / 100;
    }
  }

  // Calculer les totaux
  const totaux = {
    calories: 0,
    proteines_g: 0,
    lipides_g: 0,
    glucides_g: 0,
    fibres_g: 0,
  };

  for (const ing of ingredients_calcules) {
    totaux.calories += ing.nutrition.calories;
    totaux.proteines_g += ing.nutrition.proteines_g;
    totaux.lipides_g += ing.nutrition.lipides_g;
    totaux.glucides_g += ing.nutrition.glucides_g;
    totaux.fibres_g += ing.nutrition.fibres_g;
  }

  // Vérifier le respect des contraintes
  const respect_contraintes = {
    proteines_ok: Math.abs(totaux.proteines_g - besoins.proteines_g) < besoins.proteines_g * 0.1,
    lipides_ok: totaux.lipides_g <= besoins.lipides_max_g,
    fibres_ok: totaux.fibres_g >= besoins.fibres_g * 0.5, // Au moins 50% des fibres
  };

  return {
    ingredients: ingredients_calcules,
    totaux,
    respect_contraintes,
  };
}

/**
 * Calculer la nutrition pour une quantité donnée
 */
function calculerNutrition(nutrition_100g: Nutrition100g, quantite_g: number) {
  const ratio = quantite_g / 100;

  return {
    calories: Math.round(nutrition_100g.energie_kcal * ratio),
    proteines_g: Math.round(nutrition_100g.proteines_g * ratio * 10) / 10,
    lipides_g: Math.round(nutrition_100g.lipides_g * ratio * 10) / 10,
    glucides_g: Math.round(nutrition_100g.glucides_g * ratio * 10) / 10,
    fibres_g: Math.round(nutrition_100g.fibres_g * ratio * 10) / 10,
  };
}

/**
 * Adapter une recette template au profil utilisateur
 * Retourne une recette complète avec quantités calculées
 */
export async function adapterRecetteAuProfil(
  template: RecipeTemplate,
  profile: UserProfile
): Promise<Recipe> {
  // Calculer les besoins pour le repas cible
  // Si la recette est pour "LES_DEUX", par défaut on utilise REPAS_1
  const repasCible = template.repas_cible === "LES_DEUX" ? "REPAS_1" : template.repas_cible;
  const besoins = calculerBesoinsRepas(profile, repasCible);

  // Calculer les quantités intelligentes
  const quantites = await calculerQuantitesIntelligentes(template, besoins);

  // Construire la recette adaptée
  const ingredients: IngredientRecette[] = quantites.ingredients.map(ing => ({
    nom: ing.nom,
    quantite: ing.quantite_g,
    unite: "g",
    categorie: "proteine", // À améliorer avec mapping
    code_ciqual: ing.code_ciqual,
  }));

  const recipe: Recipe = {
    id: template.id,
    titre: `${template.titre} (adaptée pour vous)`,
    type: template.type,
    repas_cible: template.repas_cible,
    saison: template.saison,
    temps_preparation_min: template.temps_preparation_min,
    temps_cuisson_min: template.temps_cuisson_min,
    temps_total_min: template.temps_total_min,
    portions: 1,
    ingredients,
    etapes: template.etapes,
    nutrition: {
      calories: quantites.totaux.calories,
      proteines_g: quantites.totaux.proteines_g,
      lipides_g: quantites.totaux.lipides_g,
      glucides_g: quantites.totaux.glucides_g,
      fibres_g: quantites.totaux.fibres_g,
      lipides_detail: {
        mct_coco_g: 0,
        huile_olive_g: 0,
        naturels_proteines_g: quantites.totaux.lipides_g,
        autres_g: 0,
      },
      ig_moyen: 45,
    },
    lipides_incompressibles_g: quantites.totaux.lipides_g,
    conseils: template.conseils,
    variantes: template.variantes,
    materiel_requis: template.materiel_requis,
    tags: [...(template.tags || []), "adaptee_profil"],
    difficulte: template.difficulte,
    cout_estime: template.cout_estime,
    stockage: template.stockage,
    date_creation: template.date_creation,
    date_modification: new Date().toISOString(),
    auteur: template.auteur,
  };

  return recipe;
}
