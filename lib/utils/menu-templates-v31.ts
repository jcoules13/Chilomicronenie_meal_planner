/**
 * Templates et builders pour menus structure v3.1 (Skill.md)
 *
 * Structure REPAS 1 (11h00 - 1200 kcal) :
 * - Entrée : Salade + vinaigre
 * - Protéine : Viande/Poisson
 * - Légumes : Accompagnement
 * - Féculents : IG bas prioritaire
 * - Dessert : Skyr + fruits
 *
 * Structure REPAS 2 (17h00 - 900 kcal) :
 * - Entrée : Soupe maison (250ml)
 * - Protéine : Viande/Poisson
 * - Légumes d'accompagnement
 * - Légumineuses : Lentilles, pois chiches
 */

import {
  MenuV31,
  RepasStructureV31,
  ComposantRepas,
  BudgetLipides,
  IngredientMenu,
  TypeProteine,
  FrequenceMenu,
  CIBLES_MENU_V31,
  calculerPourcentageMCT,
  calculerPourcentageFormationChylomicrons,
} from "@/types/menu";
import { Saison } from "@/types/aliment";
import { TypeLipide } from "@/types/soupe";

/**
 * Créer un budget lipides vide
 */
export function creerBudgetLipidesVide(): BudgetLipides {
  return {
    total_g: 0,
    mct_coco_g: 0,
    huile_olive_g: 0,
    huile_sesame_g: 0,
    naturels_proteines_g: 0,
    autres_g: 0,
    pct_mct: 0,
    pct_formation_chylomicrons: 0,
  };
}

/**
 * Calculer budget lipides à partir des sources
 */
export function calculerBudgetLipides(
  mct_coco_g: number = 0,
  huile_olive_g: number = 0,
  huile_sesame_g: number = 0,
  naturels_proteines_g: number = 0,
  autres_g: number = 0
): BudgetLipides {
  const total_g = mct_coco_g + huile_olive_g + huile_sesame_g + naturels_proteines_g + autres_g;

  const budget: BudgetLipides = {
    total_g,
    mct_coco_g,
    huile_olive_g,
    huile_sesame_g,
    naturels_proteines_g,
    autres_g,
    pct_mct: 0,
    pct_formation_chylomicrons: 0,
  };

  budget.pct_mct = calculerPourcentageMCT(budget);
  budget.pct_formation_chylomicrons = calculerPourcentageFormationChylomicrons(budget);

  return budget;
}

/**
 * Template composant : Salade vinaigrée (entrée REPAS 1)
 */
export function creerComposantSaladeVinegree(
  ingredients_base?: IngredientMenu[]
): ComposantRepas {
  const ingredients_default: IngredientMenu[] = [
    { nom: "Tomates", quantite: 150, unite: "g" },
    { nom: "Concombre", quantite: 100, unite: "g" },
    { nom: "Salade verte", quantite: 50, unite: "g" },
    { nom: "Carottes râpées", quantite: 50, unite: "g" },
  ];

  return {
    nom: "ENTRÉE",
    description: "Salade vinaigrée",
    ingredients: ingredients_base || ingredients_default,
    assaisonnement: "Vinaigre balsamique (2 c.à.s.) + Moutarde (1 c.à.c.) + Huile d'olive (1 c.à.c. / 5g)",
    lipides: [
      {
        type: "OLIVE",
        quantite_g: 5,
        portions: 1,
        quantite_par_portion_g: 5,
        note: "MAX 5g pour entrée"
      }
    ],
    calories: 150,
  };
}

/**
 * Template composant : Soupe maison (entrée REPAS 2)
 */
export function creerComposantSoupeMaison(
  nom_soupe: string = "Soupe de saison",
  saison?: Saison
): ComposantRepas {
  return {
    nom: "ENTRÉE",
    description: `Soupe maison - ${nom_soupe}`,
    ingredients: [
      { nom: nom_soupe, quantite: 250, unite: "ml", notes: "Préparée à l'avance (4-7 portions)" }
    ],
    calories: 80,
    variantes_saison: saison ? [
      {
        saison,
        ingredients: [{ nom: `Soupe ${saison}`, quantite: 250, unite: "ml" }],
        notes: `Voir recettes soupes ${saison}`
      }
    ] : undefined,
  };
}

/**
 * Template composant : Protéine
 */
export function creerComposantProteine(
  type: "poulet" | "dinde" | "boeuf" | "poisson_maigre" | "poisson_gras",
  quantite_cru_g: number,
  lipides_naturels_g: number,
  cuisson?: string
): ComposantRepas {
  const noms: Record<typeof type, string> = {
    poulet: "Blanc de poulet SANS PEAU",
    dinde: "Blanc de dinde SANS PEAU",
    boeuf: "Bœuf haché 5% MG",
    poisson_maigre: "Poisson maigre (cabillaud, colin, lieu, sole)",
    poisson_gras: "Poisson gras (saumon, thon)"
  };

  const cuissons_default: Record<typeof type, string> = {
    poulet: "Vapeur (15-20 min) ou Poché dans bouillon",
    dinde: "Vapeur (15-20 min) ou Four 180°C (20-25 min)",
    boeuf: "Poêle antiadhésive sans MG",
    poisson_maigre: "Vapeur (12-15 min) ou Poché",
    poisson_gras: "Vapeur ou Four sans MG"
  };

  // Calories par gramme (cru) selon type
  const kcal_par_g: Record<typeof type, number> = {
    poulet: 1.65,        // ~165 kcal/100g
    dinde: 1.35,         // ~135 kcal/100g
    boeuf: 1.30,         // ~130 kcal/100g (5% MG)
    poisson_maigre: 0.90, // ~90 kcal/100g
    poisson_gras: 2.00   // ~200 kcal/100g (saumon)
  };

  const quantite_cuit = quantite_cru_g * 0.8; // Approximation perte cuisson
  const calories = Math.round(quantite_cru_g * kcal_par_g[type]);

  return {
    nom: "PROTÉINE",
    description: noms[type],
    ingredients: [
      {
        nom: noms[type],
        quantite: quantite_cru_g,
        unite: "g",
        notes: "poids cru",
        poids_cru: quantite_cru_g,
        poids_cuit: quantite_cuit
      }
    ],
    cuisson: cuisson || cuissons_default[type],
    calories: calories,
  };
}

/**
 * Template composant : Légumes
 */
export function creerComposantLegumes(
  ingredients: IngredientMenu[],
  cuisson: string = "Vapeur 12-15 min",
  utilise_mct: boolean = false
): ComposantRepas {
  return {
    nom: "LÉGUMES",
    description: "Légumes d'accompagnement",
    ingredients,
    cuisson,
    lipides: utilise_mct ? [
      {
        type: "MCT_COCO",
        quantite_g: 5,
        portions: 1,
        quantite_par_portion_g: 5,
        note: "Huile MCT coco pour cuisson"
      }
    ] : undefined,
    calories: 150,
  };
}

/**
 * Template composant : Féculents
 */
export function creerComposantFeculents(
  type: "lentilles_vertes" | "lentilles_corail" | "pois_chiches" | "quinoa" | "riz_basmati" | "patate_douce",
  quantite_sec_g: number
): ComposantRepas {
  const noms: Record<typeof type, string> = {
    lentilles_vertes: "Lentilles vertes",
    lentilles_corail: "Lentilles corail",
    pois_chiches: "Pois chiches",
    quinoa: "Quinoa",
    riz_basmati: "Riz basmati",
    patate_douce: "Patate douce"
  };

  const ig: Record<typeof type, number> = {
    lentilles_vertes: 30,
    lentilles_corail: 30,
    pois_chiches: 28,
    quinoa: 35,
    riz_basmati: 50,
    patate_douce: 46
  };

  const cuisson: Record<typeof type, string> = {
    lentilles_vertes: "Rincer, cuire 20-25 min dans eau bouillante (ratio 1:3)",
    lentilles_corail: "Rincer, cuire 10-12 min dans eau bouillante",
    pois_chiches: "Rincer si boîte, ou cuire 60-90 min si sec",
    quinoa: "Rincer, cuire 12-15 min (ratio 1:2), laisser gonfler 5 min",
    riz_basmati: "Rincer jusqu'à eau claire, cuire 10-12 min (ratio 1:1.5)",
    patate_douce: "Vapeur ou bouilli 20-25 min (cubes)"
  };

  const quantite_cuit = type.includes("lentilles") || type === "pois_chiches"
    ? quantite_sec_g * 2.5
    : type === "quinoa" || type === "riz_basmati"
    ? quantite_sec_g * 3
    : quantite_sec_g * 0.9; // patate douce

  return {
    nom: "FÉCULENTS",
    description: `${noms[type]} (IG ${ig[type]})`,
    ingredients: [
      {
        nom: noms[type],
        quantite: quantite_sec_g,
        unite: type === "patate_douce" ? "g" : "g SEC",
        notes: type !== "patate_douce" ? `= ~${Math.round(quantite_cuit)}g cuit` : undefined,
        poids_cru: quantite_sec_g,
        poids_cuit: quantite_cuit
      }
    ],
    cuisson: cuisson[type],
    calories: 300,
  };
}

/**
 * Template composant : Dessert
 */
export function creerComposantDessert(
  type: "skyr_myrtilles" | "skyr_fraises" | "yaourt_grec_fruits" | "compote_yaourt" = "skyr_myrtilles"
): ComposantRepas {
  const templates = {
    skyr_myrtilles: {
      ingredients: [
        { nom: "Skyr 0% MG", quantite: 150, unite: "g" },
        { nom: "Myrtilles surgelées", quantite: 50, unite: "g" }
      ],
      description: "Skyr 0% + Myrtilles"
    },
    skyr_fraises: {
      ingredients: [
        { nom: "Skyr 0% MG", quantite: 150, unite: "g" },
        { nom: "Fraises surgelées", quantite: 50, unite: "g" }
      ],
      description: "Skyr 0% + Fraises"
    },
    yaourt_grec_fruits: {
      ingredients: [
        { nom: "Yaourt grec 0% MG", quantite: 150, unite: "g" },
        { nom: "Fruits surgelés mélangés", quantite: 50, unite: "g" }
      ],
      description: "Yaourt grec 0% + Fruits"
    },
    compote_yaourt: {
      ingredients: [
        { nom: "Yaourt grec 0% MG", quantite: 100, unite: "g" },
        { nom: "Compote sans sucre ajouté", quantite: 100, unite: "g" }
      ],
      description: "Compote + Yaourt"
    }
  };

  const template = templates[type];

  return {
    nom: "DESSERT",
    description: template.description,
    ingredients: template.ingredients,
    assaisonnement: "Édulcorant naturel si besoin, cannelle (optionnel)",
    calories: 100,
  };
}

/**
 * Builder : Créer REPAS 1 complet (11h00 - 1200 kcal)
 */
export function creerRepas1Template(
  proteine: ComposantRepas,
  legumes: ComposantRepas,
  feculents: ComposantRepas,
  salade?: ComposantRepas,
  dessert?: ComposantRepas
): RepasStructureV31 {
  const composants: ComposantRepas[] = [
    salade || creerComposantSaladeVinegree(),
    proteine,
    legumes,
    feculents,
    dessert || creerComposantDessert()
  ];

  // Calculer budget lipides du repas
  let mct = 0, olive = 0, sesame = 0, naturels = 0, autres = 0;

  composants.forEach(comp => {
    if (comp.lipides) {
      comp.lipides.forEach(lip => {
        switch (lip.type) {
          case "MCT_COCO": mct += lip.quantite_g; break;
          case "OLIVE": olive += lip.quantite_g; break;
          case "SESAME": sesame += lip.quantite_g; break;
          case "AUCUN": break;
        }
      });
    }
  });

  const budget_lipides = calculerBudgetLipides(mct, olive, sesame, naturels, autres);

  return {
    nom: "REPAS 1",
    heure: "11h00",
    calories_cibles: CIBLES_MENU_V31.REPAS_1_KCAL,
    proteines_cibles_g: CIBLES_MENU_V31.REPAS_1_PROTEINES_G,
    lipides_cibles_g: CIBLES_MENU_V31.REPAS_1_LIPIDES_G,
    glucides_cibles_g: CIBLES_MENU_V31.REPAS_1_GLUCIDES_G,
    composants,
    budget_lipides,
  };
}

/**
 * Builder : Créer REPAS 2 complet (17h00 - 900 kcal)
 */
export function creerRepas2Template(
  proteine: ComposantRepas,
  legumes: ComposantRepas,
  legumineuses: ComposantRepas,
  soupe?: ComposantRepas
): RepasStructureV31 {
  const composants: ComposantRepas[] = [
    soupe || creerComposantSoupeMaison(),
    proteine,
    legumes,
    legumineuses
  ];

  // Calculer budget lipides
  let mct = 0, olive = 0, sesame = 0, naturels = 0, autres = 0;

  composants.forEach(comp => {
    if (comp.lipides) {
      comp.lipides.forEach(lip => {
        switch (lip.type) {
          case "MCT_COCO": mct += lip.quantite_g; break;
          case "OLIVE": olive += lip.quantite_g; break;
          case "SESAME": sesame += lip.quantite_g; break;
          case "AUCUN": break;
        }
      });
    }
  });

  const budget_lipides = calculerBudgetLipides(mct, olive, sesame, naturels, autres);

  return {
    nom: "REPAS 2",
    heure: "17h00",
    calories_cibles: CIBLES_MENU_V31.REPAS_2_KCAL,
    proteines_cibles_g: CIBLES_MENU_V31.REPAS_2_PROTEINES_G,
    lipides_cibles_g: CIBLES_MENU_V31.REPAS_2_LIPIDES_G,
    glucides_cibles_g: CIBLES_MENU_V31.REPAS_2_GLUCIDES_G,
    composants,
    budget_lipides,
  };
}

/**
 * Builder : Créer menu v3.1 complet
 */
export function creerMenuV31Template(params: {
  nom: string;
  numero: number;
  type_proteine: TypeProteine;
  frequence: FrequenceMenu;
  saisons: Saison[];
  repas_1: RepasStructureV31;
  repas_2: RepasStructureV31;
  ig_moyen?: number;
  tags?: string[];
}): Omit<MenuV31, "id" | "date_creation" | "date_modification"> {
  // Calculer budget lipides journée
  const budget_journee = calculerBudgetLipides(
    params.repas_1.budget_lipides.mct_coco_g + params.repas_2.budget_lipides.mct_coco_g,
    params.repas_1.budget_lipides.huile_olive_g + params.repas_2.budget_lipides.huile_olive_g,
    params.repas_1.budget_lipides.huile_sesame_g + params.repas_2.budget_lipides.huile_sesame_g,
    params.repas_1.budget_lipides.naturels_proteines_g + params.repas_2.budget_lipides.naturels_proteines_g,
    params.repas_1.budget_lipides.autres_g + params.repas_2.budget_lipides.autres_g
  );

  // Déterminer catégorie
  let categorie: any = "Autre";
  if (params.type_proteine === "Poulet" || params.type_proteine === "Dinde") {
    categorie = "Viande Blanche";
  } else if (params.type_proteine === "Boeuf" || params.type_proteine === "Porc") {
    categorie = "Viande Rouge";
  } else if (params.type_proteine === "Poisson Maigre") {
    categorie = "Poisson Maigre";
  } else if (params.type_proteine === "Poisson Gras") {
    categorie = "Poisson Gras";
  }

  return {
    nom: params.nom,
    numero: params.numero,
    type_proteine: params.type_proteine,
    categorie,
    frequence: params.frequence,
    saisons: params.saisons,

    calories_cibles: CIBLES_MENU_V31.TOTAL_KCAL,
    proteines_cibles_g: CIBLES_MENU_V31.TOTAL_PROTEINES_G,
    lipides_cibles_g: params.frequence === "SEMAINE_4"
      ? CIBLES_MENU_V31.TOTAL_LIPIDES_POISSON_GRAS_G
      : CIBLES_MENU_V31.TOTAL_LIPIDES_G,
    glucides_cibles_g: CIBLES_MENU_V31.TOTAL_GLUCIDES_G,

    repas_1: params.repas_1,
    repas_2: params.repas_2,

    budget_lipides_journee: budget_journee,

    ig_moyen: params.ig_moyen || 45,

    adaptatif_bmr: true,
    bmr_reference: CIBLES_MENU_V31.BMR_REFERENCE,

    variantes_saison_count: 4, // Automne, Hiver, Printemps, Été

    compatible_chylomicronemie: true,

    version: "1.0",
    tags: params.tags || [],
  };
}
