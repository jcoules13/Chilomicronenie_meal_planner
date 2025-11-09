/**
 * Générateur de recettes
 * Phase 11.2 - Système de génération de recettes définitif
 */

import {
  Recipe,
  RecipeFilters,
  RecipeGenerationOptions,
  RecipeSearchResult,
  ResultatAdaptation,
  getRandomRecipe,
  validerRecette,
} from "@/types/recipe";
import { Saison } from "@/types/aliment";
import { MenuV31, RepasStructureV31, ComposantRepas } from "@/types/menu";

/**
 * Rechercher des recettes selon des critères
 */
export function searchRecipes(
  allRecipes: Recipe[],
  filters: RecipeFilters
): RecipeSearchResult {
  let filteredRecipes = allRecipes;

  // Appliquer les filtres
  if (filters.type) {
    filteredRecipes = filteredRecipes.filter(r => r.type === filters.type);
  }

  if (filters.repas_cible) {
    filteredRecipes = filteredRecipes.filter(
      r => r.repas_cible === filters.repas_cible || r.repas_cible === "LES_DEUX"
    );
  }

  if (filters.saison) {
    filteredRecipes = filteredRecipes.filter(r => r.saison.includes(filters.saison!));
  }

  if (filters.difficulte) {
    filteredRecipes = filteredRecipes.filter(r => r.difficulte === filters.difficulte);
  }

  if (filters.temps_max_min) {
    filteredRecipes = filteredRecipes.filter(
      r => r.temps_total_min <= filters.temps_max_min!
    );
  }

  if (filters.calories_max) {
    filteredRecipes = filteredRecipes.filter(
      r => r.nutrition.calories <= filters.calories_max!
    );
  }

  if (filters.lipides_max_g) {
    filteredRecipes = filteredRecipes.filter(
      r => r.nutrition.lipides_g <= filters.lipides_max_g!
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredRecipes = filteredRecipes.filter(r =>
      filters.tags!.every(tag => r.tags?.includes(tag))
    );
  }

  if (filters.recherche_texte) {
    const texte = filters.recherche_texte.toLowerCase();
    filteredRecipes = filteredRecipes.filter(r => {
      const dans_titre = r.titre.toLowerCase().includes(texte);
      const dans_ingredients = r.ingredients.some(i =>
        i.nom.toLowerCase().includes(texte)
      );
      return dans_titre || dans_ingredients;
    });
  }

  return {
    recipes: filteredRecipes,
    total: filteredRecipes.length,
    filtres_appliques: filters,
  };
}

/**
 * Générer une recette aléatoire selon les options
 */
export function generateRandomRecipe(
  allRecipes: Recipe[],
  options: RecipeGenerationOptions
): Recipe | null {
  const filters: RecipeFilters = {
    repas_cible: options.repas_cible,
    saison: options.saison,
  };

  // Ajouter les préférences
  if (options.preferences) {
    const tags: string[] = [];
    if (options.preferences.sans_gluten) tags.push("sans_gluten");
    if (options.preferences.sans_lactose) tags.push("sans_lactose");
    if (options.preferences.rapide) {
      filters.temps_max_min = 30;
      tags.push("rapide");
    }
    if (options.preferences.meal_prep) tags.push("meal_prep");
    if (tags.length > 0) filters.tags = tags;
  }

  // Ajouter les contraintes nutritionnelles
  if (options.contraintes_nutritionnelles) {
    if (options.contraintes_nutritionnelles.calories_max) {
      filters.calories_max = options.contraintes_nutritionnelles.calories_max;
    }
    if (options.contraintes_nutritionnelles.lipides_max_g) {
      filters.lipides_max_g = options.contraintes_nutritionnelles.lipides_max_g;
    }
  }

  // Filtrer par type de protéine si spécifié
  let candidateRecipes = allRecipes;
  if (options.type_proteine) {
    candidateRecipes = candidateRecipes.filter(r => {
      const hasProteine = r.ingredients.some(i =>
        i.categorie === "proteine" &&
        i.nom.toLowerCase().includes(options.type_proteine!)
      );
      return hasProteine;
    });
  }

  return getRandomRecipe(candidateRecipes, filters);
}

/**
 * Adapter une recette au BMR de l'utilisateur
 */
export function adapteRecipeToBMR(
  recipe: Recipe,
  bmr_utilisateur: number,
  bmr_reference: number = 1800
): Recipe {
  const ratio = bmr_utilisateur / bmr_reference;

  // Cloner la recette
  const adapted: Recipe = JSON.parse(JSON.stringify(recipe));

  // Adapter les quantités d'ingrédients
  adapted.ingredients = adapted.ingredients.map(ing => ({
    ...ing,
    quantite: Math.round(ing.quantite * ratio),
  }));

  // Adapter les valeurs nutritionnelles
  adapted.nutrition = {
    ...adapted.nutrition,
    calories: Math.round(adapted.nutrition.calories * ratio),
    proteines_g: Math.round(adapted.nutrition.proteines_g * ratio),
    lipides_g: Math.round(adapted.nutrition.lipides_g * ratio * 10) / 10, // 1 décimale
    glucides_g: Math.round(adapted.nutrition.glucides_g * ratio),
    fibres_g: Math.round(adapted.nutrition.fibres_g * ratio),
    lipides_detail: {
      mct_coco_g: Math.round(adapted.nutrition.lipides_detail.mct_coco_g * ratio * 10) / 10,
      huile_olive_g: Math.round(adapted.nutrition.lipides_detail.huile_olive_g * ratio * 10) / 10,
      huile_sesame_g: adapted.nutrition.lipides_detail.huile_sesame_g
        ? Math.round(adapted.nutrition.lipides_detail.huile_sesame_g * ratio * 10) / 10
        : 0,
      naturels_proteines_g: Math.round(adapted.nutrition.lipides_detail.naturels_proteines_g * ratio * 10) / 10,
      autres_g: Math.round(adapted.nutrition.lipides_detail.autres_g * ratio * 10) / 10,
    },
  };

  return adapted;
}

/**
 * Adapter une recette selon le budget lipides disponible
 *
 * @param recipe - La recette à adapter
 * @param budget_lipides_repas_g - Budget lipides disponible pour ce repas (en grammes)
 * @returns Résultat de l'adaptation avec la recette adaptée ou raison d'incompatibilité
 */
export function adapterRecetteAuBudget(
  recipe: Recipe,
  budget_lipides_repas_g: number
): ResultatAdaptation {
  // Vérifier si la recette a des adaptations configurées
  if (!recipe.adaptations_budget) {
    // Pas d'adaptation configurée - vérifier si compatible directement
    if (recipe.nutrition.lipides_g <= budget_lipides_repas_g) {
      return {
        compatible: true,
        recette_adaptee: recipe,
      };
    } else {
      return {
        compatible: false,
        raison_incompatibilite: `Recette sans adaptations: ${recipe.nutrition.lipides_g}g de lipides dépassent le budget de ${budget_lipides_repas_g}g`,
      };
    }
  }

  // Vérifier si les lipides incompressibles dépassent le budget
  if (recipe.lipides_incompressibles_g > budget_lipides_repas_g) {
    return {
      compatible: false,
      raison_incompatibilite: `Lipides naturels incompressibles (${recipe.lipides_incompressibles_g}g) dépassent le budget disponible (${budget_lipides_repas_g}g). Cette recette nécessite un budget lipides plus élevé.`,
    };
  }

  // Sélectionner le niveau d'adaptation approprié
  let niveau: "strict" | "modere" | "souple";
  let adaptation;

  if (budget_lipides_repas_g <= recipe.adaptations_budget.strict.budget_max_g) {
    niveau = "strict";
    adaptation = recipe.adaptations_budget.strict;
  } else if (budget_lipides_repas_g <= recipe.adaptations_budget.modere.budget_max_g) {
    niveau = "modere";
    adaptation = recipe.adaptations_budget.modere;
  } else {
    niveau = "souple";
    adaptation = recipe.adaptations_budget.souple;
  }

  // Vérifier que l'adaptation choisie respecte le budget
  if (adaptation.lipides_totaux_g > budget_lipides_repas_g) {
    return {
      compatible: false,
      raison_incompatibilite: `Même avec l'adaptation ${niveau} (${adaptation.lipides_totaux_g}g), la recette dépasse le budget de ${budget_lipides_repas_g}g`,
    };
  }

  // Créer la recette adaptée
  const recette_adaptee: Recipe = {
    ...recipe,
    nutrition: {
      ...recipe.nutrition,
      lipides_g: adaptation.lipides_totaux_g,
      lipides_detail: adaptation.lipides_detail,
    },
  };

  // Créer un badge d'adaptation pour l'affichage
  let badge_adaptation = "";
  if (niveau === "strict") {
    badge_adaptation = "🔴 Adaptation stricte - Budget limité";
  } else if (niveau === "modere") {
    badge_adaptation = "🟡 Adaptation modérée";
  } else {
    badge_adaptation = "🟢 Recette complète";
  }

  return {
    compatible: true,
    niveau_applique: niveau,
    recette_adaptee,
    modifications_appliquees: adaptation.modifications,
    badge_adaptation,
  };
}

/**
 * Convertir une recette en composant de repas (pour intégration dans MenuV31)
 */
export function recipeToComposantRepas(recipe: Recipe): ComposantRepas {
  // Regrouper les ingrédients par catégorie
  const ingredients_proteines = recipe.ingredients.filter(i => i.categorie === "proteine");
  const ingredients_feculents = recipe.ingredients.filter(i => i.categorie === "feculent");
  const ingredients_legumes = recipe.ingredients.filter(i => i.categorie === "legume");
  const ingredients_lipides = recipe.ingredients.filter(i => i.categorie === "lipide");

  // Créer le composant principal
  const composant: ComposantRepas = {
    nom: recipe.type === "plat_principal" ? "PLAT PRINCIPAL" : recipe.type.toUpperCase(),
    description: recipe.titre,
    ingredients: recipe.ingredients.map(ing => ({
      nom: ing.nom,
      quantite: ing.quantite,
      unite: ing.unite,
      notes: ing.notes,
    })),
    calories: recipe.nutrition.calories,
  };

  // Ajouter les instructions de cuisson (résumé des étapes)
  const etapes_cuisson = recipe.etapes.filter(e =>
    e.titre.toLowerCase().includes("cuisson") ||
    e.description.toLowerCase().includes("cuire")
  );

  if (etapes_cuisson.length > 0) {
    composant.cuisson = etapes_cuisson
      .map(e => e.description)
      .join(" ");
  } else if (recipe.etapes.length > 0) {
    // Sinon, utiliser un résumé général
    composant.cuisson = `Suivre les ${recipe.etapes.length} étapes de la recette "${recipe.titre}"`;
  }

  // Ajouter les lipides détaillés
  if (ingredients_lipides.length > 0) {
    composant.lipides = ingredients_lipides.map(lip => {
      let type: "MCT_COCO" | "OLIVE" | "SESAME" | "AUCUN" = "AUCUN";

      if (lip.nom.toLowerCase().includes("mct") || lip.nom.toLowerCase().includes("coco")) {
        type = "MCT_COCO";
      } else if (lip.nom.toLowerCase().includes("olive")) {
        type = "OLIVE";
      } else if (lip.nom.toLowerCase().includes("sésame") || lip.nom.toLowerCase().includes("sesame")) {
        type = "SESAME";
      }

      return {
        type,
        quantite_g: lip.quantite,
        portions: 1,
        quantite_par_portion_g: lip.quantite,
        note: lip.notes,
      };
    });
  }

  // Ajouter des notes si disponibles
  if (recipe.conseils && recipe.conseils.length > 0) {
    composant.notes_importantes = recipe.conseils;
  }

  return composant;
}

/**
 * Générer un repas complet à partir de recettes
 */
export function generateRepasFromRecipes(params: {
  repas_type: "REPAS_1" | "REPAS_2";
  recette_principale: Recipe;
  recette_entree?: Recipe;
  recette_dessert?: Recipe;
  bmr_utilisateur?: number;
}): RepasStructureV31 {
  const { repas_type, recette_principale, recette_entree, recette_dessert, bmr_utilisateur } = params;

  // Adapter les recettes au BMR si nécessaire
  const bmr_ref = 1800;
  let principale = recette_principale;
  let entree = recette_entree;
  let dessert = recette_dessert;

  if (bmr_utilisateur && bmr_utilisateur !== bmr_ref) {
    principale = adapteRecipeToBMR(recette_principale, bmr_utilisateur, bmr_ref);
    if (entree) entree = adapteRecipeToBMR(entree, bmr_utilisateur, bmr_ref);
    if (dessert) dessert = adapteRecipeToBMR(dessert, bmr_utilisateur, bmr_ref);
  }

  // Convertir en composants
  const composants: ComposantRepas[] = [];

  if (entree) {
    composants.push(recipeToComposantRepas(entree));
  }

  composants.push(recipeToComposantRepas(principale));

  if (dessert) {
    composants.push(recipeToComposantRepas(dessert));
  }

  // Calculer le budget lipides total
  const calcul_lipides = (r: Recipe) => r.nutrition.lipides_detail;

  let mct = calcul_lipides(principale).mct_coco_g;
  let olive = calcul_lipides(principale).huile_olive_g;
  let sesame = calcul_lipides(principale).huile_sesame_g || 0;
  let naturels = calcul_lipides(principale).naturels_proteines_g;
  let autres = calcul_lipides(principale).autres_g;

  if (entree) {
    const lip_entree = calcul_lipides(entree);
    mct += lip_entree.mct_coco_g;
    olive += lip_entree.huile_olive_g;
    sesame += lip_entree.huile_sesame_g || 0;
    naturels += lip_entree.naturels_proteines_g;
    autres += lip_entree.autres_g;
  }

  if (dessert) {
    const lip_dessert = calcul_lipides(dessert);
    mct += lip_dessert.mct_coco_g;
    olive += lip_dessert.huile_olive_g;
    sesame += lip_dessert.huile_sesame_g || 0;
    naturels += lip_dessert.naturels_proteines_g;
    autres += lip_dessert.autres_g;
  }

  const total_lipides = mct + olive + sesame + naturels + autres;
  const pct_mct = total_lipides > 0 ? (mct / total_lipides) * 100 : 0;

  // Calculer % formation chylomicrons (lipides non-MCT)
  const lipides_formant_chylomicrons = total_lipides - mct;
  const pct_formation_chylomicrons = total_lipides > 0
    ? (lipides_formant_chylomicrons / total_lipides) * 100
    : 0;

  const budget_lipides = {
    total_g: total_lipides,
    mct_coco_g: mct,
    huile_olive_g: olive,
    huile_sesame_g: sesame,
    naturels_proteines_g: naturels,
    autres_g: autres,
    pct_mct,
    pct_formation_chylomicrons,
  };

  // Calculer les totaux nutritionnels
  let calories_totales = principale.nutrition.calories;
  let proteines_totales = principale.nutrition.proteines_g;
  let glucides_totaux = principale.nutrition.glucides_g;

  if (entree) {
    calories_totales += entree.nutrition.calories;
    proteines_totales += entree.nutrition.proteines_g;
    glucides_totaux += entree.nutrition.glucides_g;
  }

  if (dessert) {
    calories_totales += dessert.nutrition.calories;
    proteines_totales += dessert.nutrition.proteines_g;
    glucides_totaux += dessert.nutrition.glucides_g;
  }

  // Cibles par défaut
  const cibles_repas_1 = {
    calories: 1200,
    proteines: 50,
    lipides: 12,
    glucides: 70,
  };

  const cibles_repas_2 = {
    calories: 900,
    proteines: 50,
    lipides: 10,
    glucides: 60,
  };

  const cibles = repas_type === "REPAS_1" ? cibles_repas_1 : cibles_repas_2;
  const nom_repas = repas_type === "REPAS_1" ? "REPAS 1" : "REPAS 2";

  return {
    nom: nom_repas,
    heure: repas_type === "REPAS_1" ? "11h00" : "17h00",
    calories_cibles: cibles.calories,
    proteines_cibles_g: cibles.proteines,
    lipides_cibles_g: cibles.lipides,
    glucides_cibles_g: cibles.glucides,
    composants,
    budget_lipides,
  };
}

/**
 * Valider une collection de recettes
 */
export function validateRecipes(recipes: Recipe[]): {
  valides: Recipe[];
  invalides: Array<{ recipe: Recipe; erreurs: string[]; avertissements: string[] }>;
} {
  const valides: Recipe[] = [];
  const invalides: Array<{ recipe: Recipe; erreurs: string[]; avertissements: string[] }> = [];

  recipes.forEach(recipe => {
    const validation = validerRecette(recipe);
    if (validation.valide) {
      valides.push(recipe);
    } else {
      invalides.push({
        recipe,
        erreurs: validation.erreurs,
        avertissements: validation.avertissements,
      });
    }
  });

  return { valides, invalides };
}

/**
 * Obtenir les recettes favorites
 */
export function getFavoriteRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.filter(r => r.favoris === true);
}

/**
 * Obtenir les recettes les plus utilisées
 */
export function getMostUsedRecipes(recipes: Recipe[], limit: number = 10): Recipe[] {
  return recipes
    .filter(r => r.nb_utilisations !== undefined && r.nb_utilisations > 0)
    .sort((a, b) => (b.nb_utilisations || 0) - (a.nb_utilisations || 0))
    .slice(0, limit);
}

/**
 * Obtenir les recettes par saison
 */
export function getRecipesBySeason(recipes: Recipe[], saison: Saison): Recipe[] {
  return recipes.filter(r => r.saison.includes(saison));
}

/**
 * Générer des suggestions de recettes pour la semaine
 */
export function generateWeeklyRecipeSuggestions(
  allRecipes: Recipe[],
  saison: Saison,
  preferences?: {
    variete_proteines?: boolean; // alterner les types de protéines
    eviter_repetitions?: boolean;
  }
): {
  repas_1: Recipe[];
  repas_2: Recipe[];
} {
  const recettes_saison = getRecipesBySeason(allRecipes, saison);

  // Séparer les recettes par repas cible
  const recettes_r1 = recettes_saison.filter(
    r => r.repas_cible === "REPAS_1" || r.repas_cible === "LES_DEUX"
  );
  const recettes_r2 = recettes_saison.filter(
    r => r.repas_cible === "REPAS_2" || r.repas_cible === "LES_DEUX"
  );

  const suggestions_r1: Recipe[] = [];
  const suggestions_r2: Recipe[] = [];

  // Types de protéines pour la rotation
  const types_proteines = ["poulet", "dinde", "boeuf", "poisson_maigre"];
  let index_proteine = 0;

  // Générer 7 jours de suggestions
  for (let i = 0; i < 7; i++) {
    // REPAS 1
    let candidats_r1 = [...recettes_r1];

    // Éviter les répétitions
    if (preferences?.eviter_repetitions && suggestions_r1.length > 0) {
      const dernieres_recettes = suggestions_r1.slice(-2).map(r => r.id);
      candidats_r1 = candidats_r1.filter(r => !dernieres_recettes.includes(r.id));
    }

    // Varier les protéines
    if (preferences?.variete_proteines) {
      const proteine_jour = types_proteines[index_proteine % types_proteines.length];
      const avec_proteine = candidats_r1.filter(r =>
        r.ingredients.some(ing =>
          ing.categorie === "proteine" &&
          ing.nom.toLowerCase().includes(proteine_jour)
        )
      );

      if (avec_proteine.length > 0) {
        candidats_r1 = avec_proteine;
      }
    }

    const recette_r1 = candidats_r1[Math.floor(Math.random() * candidats_r1.length)];
    if (recette_r1) suggestions_r1.push(recette_r1);

    // REPAS 2
    let candidats_r2 = [...recettes_r2];

    if (preferences?.eviter_repetitions && suggestions_r2.length > 0) {
      const dernieres_recettes = suggestions_r2.slice(-2).map(r => r.id);
      candidats_r2 = candidats_r2.filter(r => !dernieres_recettes.includes(r.id));
    }

    if (preferences?.variete_proteines) {
      const proteine_jour = types_proteines[index_proteine % types_proteines.length];
      const avec_proteine = candidats_r2.filter(r =>
        r.ingredients.some(ing =>
          ing.categorie === "proteine" &&
          ing.nom.toLowerCase().includes(proteine_jour)
        )
      );

      if (avec_proteine.length > 0) {
        candidats_r2 = avec_proteine;
      }
    }

    const recette_r2 = candidats_r2[Math.floor(Math.random() * candidats_r2.length)];
    if (recette_r2) suggestions_r2.push(recette_r2);

    // Passer à la protéine suivante
    if (preferences?.variete_proteines) {
      index_proteine++;
    }
  }

  return {
    repas_1: suggestions_r1,
    repas_2: suggestions_r2,
  };
}
