/**
 * Recettes d'exemple pour tester le système
 * Phase 11.2 - Générateur de recettes définitif
 */

import { Recipe } from "@/types/recipe";

export const EXAMPLE_RECIPES: Recipe[] = [
  // REPAS 1 - Poulet vapeur aux lentilles vertes
  {
    id: "r1-poulet-lentilles-vertes-001",
    titre: "Poulet Vapeur aux Lentilles Vertes et Légumes de Saison",
    type: "plat_principal",
    repas_cible: "REPAS_1",
    saison: ["Printemps", "Été", "Automne", "Hiver"],
    temps_preparation_min: 15,
    temps_cuisson_min: 25,
    temps_total_min: 40,
    portions: 1,

    ingredients: [
      {
        nom: "Blanc de poulet sans peau",
        quantite: 200,
        unite: "g",
        categorie: "proteine",
        notes: "poids cru",
      },
      {
        nom: "Lentilles vertes",
        quantite: 80,
        unite: "g",
        categorie: "feculent",
        notes: "poids sec - environ 200g cuit",
      },
      {
        nom: "Carottes",
        quantite: 150,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Courgettes",
        quantite: 150,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Brocolis",
        quantite: 100,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Huile MCT coco",
        quantite: 5,
        unite: "g",
        categorie: "lipide",
        notes: "1 cuillère à café",
      },
      {
        nom: "Huile d'olive",
        quantite: 5,
        unite: "g",
        categorie: "lipide",
        notes: "1 cuillère à café",
      },
      {
        nom: "Tomates",
        quantite: 100,
        unite: "g",
        categorie: "legume",
        notes: "pour la salade d'entrée",
      },
      {
        nom: "Concombre",
        quantite: 80,
        unite: "g",
        categorie: "legume",
        notes: "pour la salade d'entrée",
      },
      {
        nom: "Skyr 0% MG",
        quantite: 150,
        unite: "g",
        categorie: "produit_laitier",
        notes: "pour le dessert",
      },
      {
        nom: "Myrtilles surgelées",
        quantite: 50,
        unite: "g",
        categorie: "fruit",
        notes: "pour le dessert",
      },
    ],

    etapes: [
      {
        numero: 1,
        titre: "Préparation des lentilles",
        description: "Rincer les lentilles vertes à l'eau froide dans une passoire. Porter une casserole d'eau à ébullition (ratio 1 volume de lentilles pour 3 volumes d'eau).",
        duree_min: 3,
        materiel: ["casserole", "passoire"],
      },
      {
        numero: 2,
        titre: "Cuisson des lentilles",
        description: "Ajouter les lentilles dans l'eau bouillante. Cuire à feu moyen pendant 20-25 minutes jusqu'à ce qu'elles soient tendres mais pas trop molles. Égoutter et réserver.",
        duree_min: 25,
        temperature: "100°C (ébullition)",
        materiel: ["casserole"],
      },
      {
        numero: 3,
        titre: "Préparation des légumes",
        description: "Pendant la cuisson des lentilles, laver et couper les carottes en rondelles de 0.5cm d'épaisseur. Couper les courgettes en demi-rondelles. Séparer le brocoli en petits bouquets.",
        duree_min: 5,
        materiel: ["couteau", "planche à découper"],
      },
      {
        numero: 4,
        titre: "Cuisson vapeur du poulet et légumes",
        description: "Placer le blanc de poulet entier au centre du panier vapeur. Disposer les carottes, courgettes et brocolis autour. Cuire à la vapeur pendant 15-20 minutes. Le poulet doit atteindre une température interne de 75°C à cœur.",
        duree_min: 20,
        temperature: "100°C (vapeur)",
        materiel: ["cuit-vapeur ou panier vapeur", "thermomètre de cuisine (optionnel)"],
        conseils: [
          "Si vous n'avez pas de thermomètre, vérifiez que le jus qui s'écoule du poulet est transparent et non rosé",
        ],
      },
      {
        numero: 5,
        titre: "Préparation de la salade d'entrée",
        description: "Laver et couper les tomates en quartiers. Éplucher et couper le concombre en rondelles. Mélanger dans un bol. Assaisonner avec l'huile d'olive, du vinaigre balsamique, sel et poivre.",
        duree_min: 5,
        materiel: ["bol", "couteau"],
      },
      {
        numero: 6,
        titre: "Assaisonnement des lentilles",
        description: "Dans un bol, mélanger les lentilles égouttées avec l'huile MCT coco. Assaisonner avec sel, poivre, ail en poudre et herbes de Provence selon votre goût.",
        duree_min: 2,
        materiel: ["bol"],
      },
      {
        numero: 7,
        titre: "Dressage",
        description: "Commencer par servir la salade d'entrée. Pour le plat principal, disposer les lentilles au centre de l'assiette. Couper le poulet en tranches d'environ 1cm d'épaisseur et les disposer sur les lentilles. Entourer des légumes vapeur. Terminer avec le skyr mélangé aux myrtilles pour le dessert.",
        duree_min: 5,
      },
    ],

    nutrition: {
      calories: 1150,
      proteines_g: 58,
      lipides_g: 13,
      glucides_g: 68,
      fibres_g: 15,
      lipides_detail: {
        mct_coco_g: 5,
        huile_olive_g: 5,
        naturels_proteines_g: 3,
        autres_g: 0,
      },
      ig_moyen: 32,
    },

    // Système d'adaptation aux budgets lipides
    lipides_incompressibles_g: 3, // Lipides naturels du poulet

    adaptations_budget: {
      strict: {
        nom: "strict",
        budget_min_g: 0,
        budget_max_g: 6,
        lipides_totaux_g: 3,
        lipides_detail: {
          mct_coco_g: 0,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [
          {
            action: "RETIRER",
            ingredient: "Huile MCT coco",
            de: "5g",
            vers: "0g",
            economie_g: 5,
            description: "Retirer l'huile MCT coco des lentilles - assaisonner uniquement avec épices et herbes",
          },
          {
            action: "RETIRER",
            ingredient: "Huile d'olive",
            de: "5g",
            vers: "0g",
            economie_g: 5,
            description: "Retirer l'huile d'olive de la salade - utiliser citron et vinaigre balsamique",
          },
        ],
        instructions_speciales: [
          "Assaisonner les lentilles uniquement avec sel, poivre, ail en poudre et herbes de Provence",
          "Assaisonner la salade avec du jus de citron, vinaigre balsamique, moutarde, sel et poivre",
        ],
      },
      modere: {
        nom: "modere",
        budget_min_g: 7,
        budget_max_g: 9,
        lipides_totaux_g: 8,
        lipides_detail: {
          mct_coco_g: 2.5,
          huile_olive_g: 2.5,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [
          {
            action: "REDUIRE",
            ingredient: "Huile MCT coco",
            de: "5g",
            vers: "2.5g",
            economie_g: 2.5,
            description: "Réduire l'huile MCT de moitié (1/2 cuillère à café)",
          },
          {
            action: "REDUIRE",
            ingredient: "Huile d'olive",
            de: "5g",
            vers: "2.5g",
            economie_g: 2.5,
            description: "Réduire l'huile d'olive de moitié (1/2 cuillère à café)",
          },
        ],
        instructions_speciales: [
          "Utiliser 1/2 cuillère à café d'huile MCT pour les lentilles",
          "Utiliser 1/2 cuillère à café d'huile d'olive pour la salade, compléter avec du citron",
        ],
      },
      souple: {
        nom: "souple",
        budget_min_g: 10,
        budget_max_g: 12,
        lipides_totaux_g: 10,
        lipides_detail: {
          mct_coco_g: 3.5,
          huile_olive_g: 3.5,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [
          {
            action: "REDUIRE",
            ingredient: "Huile MCT coco",
            de: "5g",
            vers: "3.5g",
            economie_g: 1.5,
            description: "Légère réduction de l'huile MCT",
          },
          {
            action: "REDUIRE",
            ingredient: "Huile d'olive",
            de: "5g",
            vers: "3.5g",
            economie_g: 1.5,
            description: "Légère réduction de l'huile d'olive",
          },
        ],
        instructions_speciales: [],
      },
    },

    conseils: [
      "Vérifier la cuisson du poulet avec un thermomètre : 75°C à cœur",
      "Les lentilles peuvent être cuites à l'avance et conservées 3-4 jours au réfrigérateur",
      "Varier les légumes selon la saison pour plus de diversité nutritionnelle",
      "Pour gagner du temps, cuire les lentilles en grande quantité et congeler en portions",
    ],

    variantes: [
      {
        nom: "Version dinde",
        modifications: "Remplacer le poulet par du blanc de dinde sans peau (même quantité)",
        notes: "Temps de cuisson identique, texture légèrement différente",
      },
      {
        nom: "Lentilles corail",
        modifications: "Remplacer les lentilles vertes par des lentilles corail",
        notes: "Temps de cuisson réduit à 10-12 minutes, texture plus fondante",
      },
      {
        nom: "Version automne-hiver",
        modifications: "Remplacer courgettes par chou-fleur ou navets",
        notes: "Adapter le temps de cuisson vapeur selon la densité des légumes",
      },
    ],

    materiel_requis: [
      "Casserole moyenne",
      "Cuit-vapeur ou panier vapeur",
      "Passoire",
      "Couteau de cuisine",
      "Planche à découper",
      "2 bols",
      "Thermomètre de cuisine (optionnel mais recommandé)",
    ],

    tags: [
      "sans_gluten",
      "sans_lactose",
      "ig_bas",
      "pauvre_en_lipides",
      "riche_en_proteines",
      "riche_en_fibres",
      "facile",
      "meal_prep",
      "vapeur",
      "toute_saison",
    ],

    difficulte: "facile",
    cout_estime: "moyen",

    stockage: {
      refrigerateur_jours: 3,
      congelateur_mois: 2,
      instructions:
        "Conserver le poulet et les légumes séparément des lentilles dans des contenants hermétiques. Réchauffer à la vapeur ou au micro-ondes (couvrir et chauffer 2-3 minutes).",
    },

    date_creation: new Date().toISOString(),
    auteur: "Système",
  },

  // REPAS 1 - Dinde poêlée au quinoa
  {
    id: "r1-dinde-quinoa-002",
    titre: "Dinde Poêlée au Quinoa et Poivrons Grillés",
    type: "plat_principal",
    repas_cible: "REPAS_1",
    saison: ["Printemps", "Été", "Automne"],
    temps_preparation_min: 12,
    temps_cuisson_min: 20,
    temps_total_min: 32,
    portions: 1,

    ingredients: [
      {
        nom: "Blanc de dinde sans peau",
        quantite: 190,
        unite: "g",
        categorie: "proteine",
        notes: "poids cru",
      },
      {
        nom: "Quinoa",
        quantite: 75,
        unite: "g",
        categorie: "feculent",
        notes: "poids sec - environ 225g cuit",
      },
      {
        nom: "Poivrons rouges",
        quantite: 150,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Haricots verts",
        quantite: 150,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Tomates cerises",
        quantite: 100,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Huile MCT coco",
        quantite: 6,
        unite: "g",
        categorie: "lipide",
        notes: "pour cuisson dinde",
      },
      {
        nom: "Huile d'olive",
        quantite: 4,
        unite: "g",
        categorie: "lipide",
        notes: "pour salade",
      },
      {
        nom: "Yaourt grec 0% MG",
        quantite: 150,
        unite: "g",
        categorie: "produit_laitier",
      },
      {
        nom: "Fraises surgelées",
        quantite: 50,
        unite: "g",
        categorie: "fruit",
      },
    ],

    etapes: [
      {
        numero: 1,
        titre: "Cuisson du quinoa",
        description: "Rincer le quinoa à l'eau froide jusqu'à ce que l'eau soit claire. Porter 150ml d'eau à ébullition, ajouter le quinoa, couvrir et réduire à feu doux. Cuire 12-15 minutes jusqu'à absorption complète. Laisser reposer 5 minutes hors du feu.",
        duree_min: 20,
        materiel: ["petite casserole avec couvercle", "passoire fine"],
        conseils: ["Le quinoa est cuit quand le germe blanc apparaît"],
      },
      {
        numero: 2,
        titre: "Préparation des légumes",
        description: "Laver et couper les poivrons en lanières. Équeuter les haricots verts. Laver les tomates cerises et les couper en deux.",
        duree_min: 5,
        materiel: ["couteau", "planche"],
      },
      {
        numero: 3,
        titre: "Cuisson des haricots verts",
        description: "Cuire les haricots verts à la vapeur ou dans l'eau bouillante salée pendant 8-10 minutes. Ils doivent rester légèrement croquants.",
        duree_min: 10,
        materiel: ["casserole ou cuit-vapeur"],
      },
      {
        numero: 4,
        titre: "Cuisson de la dinde",
        description: "Couper la dinde en escalopes fines (environ 1cm). Chauffer une poêle antiadhésive à feu moyen-vif. Ajouter l'huile MCT coco. Cuire la dinde 4-5 minutes de chaque côté jusqu'à ce qu'elle soit dorée et cuite à cœur (75°C).",
        duree_min: 10,
        temperature: "Feu moyen-vif",
        materiel: ["poêle antiadhésive"],
      },
      {
        numero: 5,
        titre: "Poivrons grillés",
        description: "Dans la même poêle (après la dinde), faire griller les lanières de poivrons 5-6 minutes en remuant régulièrement jusqu'à ce qu'ils soient légèrement dorés et tendres.",
        duree_min: 6,
        materiel: ["poêle"],
      },
      {
        numero: 6,
        titre: "Dressage",
        description: "Disposer le quinoa au centre de l'assiette. Ajouter la dinde coupée en tranches. Entourer des haricots verts et poivrons grillés. Ajouter les tomates cerises assaisonnées à l'huile d'olive. Servir le yaourt grec avec les fraises en dessert.",
        duree_min: 3,
      },
    ],

    nutrition: {
      calories: 1180,
      proteines_g: 55,
      lipides_g: 12,
      glucides_g: 72,
      fibres_g: 13,
      lipides_detail: {
        mct_coco_g: 6,
        huile_olive_g: 4,
        naturels_proteines_g: 2,
        autres_g: 0,
      },
      ig_moyen: 38,
    },

    // Système d'adaptation aux budgets lipides
    lipides_incompressibles_g: 2, // Lipides naturels de la dinde

    adaptations_budget: {
      strict: {
        nom: "strict",
        budget_min_g: 0,
        budget_max_g: 6,
        lipides_totaux_g: 2,
        lipides_detail: {
          mct_coco_g: 0,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 2,
          autres_g: 0,
        },
        modifications: [
          {
            action: "RETIRER",
            ingredient: "Huile MCT coco",
            de: "6g",
            vers: "0g",
            economie_g: 6,
            description: "Retirer l'huile MCT - cuire la dinde dans une poêle antiadhésive sans matière grasse",
          },
          {
            action: "RETIRER",
            ingredient: "Huile d'olive",
            de: "4g",
            vers: "0g",
            economie_g: 4,
            description: "Retirer l'huile d'olive - assaisonner les tomates cerises avec citron et herbes",
          },
          {
            action: "MODIFIER",
            description: "Utiliser une poêle antiadhésive bien chaude pour griller la dinde sans matière grasse",
          },
        ],
        instructions_speciales: [
          "Chauffer la poêle antiadhésive à feu moyen-vif avant d'ajouter la dinde",
          "Cuire la dinde 4-5 min de chaque côté dans la poêle sèche",
          "Assaisonner les tomates cerises avec du jus de citron, vinaigre balsamique et herbes fraîches",
        ],
      },
      modere: {
        nom: "modere",
        budget_min_g: 7,
        budget_max_g: 9,
        lipides_totaux_g: 7,
        lipides_detail: {
          mct_coco_g: 3,
          huile_olive_g: 2,
          huile_sesame_g: 0,
          naturels_proteines_g: 2,
          autres_g: 0,
        },
        modifications: [
          {
            action: "REDUIRE",
            ingredient: "Huile MCT coco",
            de: "6g",
            vers: "3g",
            economie_g: 3,
            description: "Réduire l'huile MCT de moitié (1/2 cuillère à café)",
          },
          {
            action: "REDUIRE",
            ingredient: "Huile d'olive",
            de: "4g",
            vers: "2g",
            economie_g: 2,
            description: "Réduire l'huile d'olive de moitié",
          },
        ],
        instructions_speciales: [
          "Utiliser 1/2 cuillère à café d'huile MCT pour la cuisson de la dinde",
          "Utiliser 1/2 cuillère à café d'huile d'olive pour les tomates cerises",
        ],
      },
      souple: {
        nom: "souple",
        budget_min_g: 10,
        budget_max_g: 12,
        lipides_totaux_g: 10,
        lipides_detail: {
          mct_coco_g: 5,
          huile_olive_g: 3,
          huile_sesame_g: 0,
          naturels_proteines_g: 2,
          autres_g: 0,
        },
        modifications: [
          {
            action: "REDUIRE",
            ingredient: "Huile MCT coco",
            de: "6g",
            vers: "5g",
            economie_g: 1,
            description: "Légère réduction de l'huile MCT",
          },
          {
            action: "REDUIRE",
            ingredient: "Huile d'olive",
            de: "4g",
            vers: "3g",
            economie_g: 1,
            description: "Légère réduction de l'huile d'olive",
          },
        ],
        instructions_speciales: [],
      },
    },

    conseils: [
      "Ne pas trop cuire la dinde pour éviter qu'elle soit sèche",
      "Le quinoa peut être préparé la veille et réchauffé",
      "Mariner la dinde 30 min dans du citron et des herbes pour plus de saveur",
    ],

    variantes: [
      {
        nom: "Version poulet",
        modifications: "Remplacer la dinde par du blanc de poulet",
      },
      {
        nom: "Riz basmati",
        modifications: "Remplacer le quinoa par du riz basmati (même poids sec)",
        notes: "IG légèrement plus élevé (50 vs 35)",
      },
    ],

    materiel_requis: [
      "Casserole avec couvercle",
      "Poêle antiadhésive",
      "Couteau",
      "Planche à découper",
      "Passoire fine",
    ],

    tags: [
      "sans_gluten",
      "sans_lactose",
      "ig_bas",
      "pauvre_en_lipides",
      "riche_en_proteines",
      "rapide",
      "facile",
      "poele",
    ],

    difficulte: "facile",
    cout_estime: "moyen",

    stockage: {
      refrigerateur_jours: 2,
      congelateur_mois: 1,
      instructions: "Séparer quinoa et protéines. La dinde peut sécher au réchauffage.",
    },

    date_creation: new Date().toISOString(),
    auteur: "Système",
  },

  // REPAS 2 - Soupe butternut + cabillaud
  {
    id: "r2-soupe-butternut-cabillaud-003",
    titre: "Velouté de Butternut et Cabillaud Vapeur aux Lentilles Corail",
    type: "plat_principal",
    repas_cible: "REPAS_2",
    saison: ["Automne", "Hiver"],
    temps_preparation_min: 15,
    temps_cuisson_min: 30,
    temps_total_min: 45,
    portions: 1,

    ingredients: [
      {
        nom: "Courge butternut",
        quantite: 300,
        unite: "g",
        categorie: "legume",
        notes: "pour la soupe (environ 250ml de soupe)",
      },
      {
        nom: "Filet de cabillaud",
        quantite: 180,
        unite: "g",
        categorie: "proteine",
        notes: "poids cru",
      },
      {
        nom: "Lentilles corail",
        quantite: 70,
        unite: "g",
        categorie: "feculent",
        notes: "poids sec - environ 175g cuit",
      },
      {
        nom: "Épinards frais",
        quantite: 200,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Champignons de Paris",
        quantite: 100,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Huile MCT coco",
        quantite: 5,
        unite: "g",
        categorie: "lipide",
        notes: "pour les lentilles",
      },
      {
        nom: "Oignon",
        quantite: 50,
        unite: "g",
        categorie: "legume",
        notes: "pour la soupe",
      },
      {
        nom: "Bouillon de légumes",
        quantite: 400,
        unite: "ml",
        categorie: "autre",
        notes: "sans sel ajouté",
      },
    ],

    etapes: [
      {
        numero: 1,
        titre: "Préparation de la soupe",
        description: "Éplucher et couper la courge butternut en cubes de 2cm. Émincer l'oignon. Dans une casserole, faire revenir l'oignon à sec (poêle antiadhésive) jusqu'à transparence. Ajouter la courge et le bouillon.",
        duree_min: 5,
        materiel: ["casserole", "couteau", "planche"],
      },
      {
        numero: 2,
        titre: "Cuisson de la soupe",
        description: "Porter à ébullition puis réduire à feu moyen. Couvrir et laisser mijoter 25-30 minutes jusqu'à ce que la courge soit très tendre. Mixer jusqu'à obtenir une texture veloutée. Assaisonner avec sel, poivre et muscade.",
        duree_min: 30,
        materiel: ["casserole", "mixeur plongeant"],
        temperature: "Feu moyen",
      },
      {
        numero: 3,
        titre: "Cuisson des lentilles corail",
        description: "Rincer les lentilles. Dans une petite casserole, porter 200ml d'eau à ébullition. Ajouter les lentilles et cuire 10-12 minutes jusqu'à ce qu'elles soient tendres. Égoutter.",
        duree_min: 12,
        materiel: ["petite casserole", "passoire"],
      },
      {
        numero: 4,
        titre: "Cuisson du cabillaud",
        description: "Placer le filet de cabillaud dans le panier vapeur. Cuire à la vapeur 12-15 minutes. Le poisson doit être opaque et se défaire facilement à la fourchette.",
        duree_min: 15,
        materiel: ["cuit-vapeur"],
        temperature: "100°C (vapeur)",
      },
      {
        numero: 5,
        titre: "Préparation des légumes",
        description: "Laver les épinards. Nettoyer et émincer les champignons. Faire revenir les champignons dans une poêle antiadhésive 5 minutes. Ajouter les épinards et cuire 2-3 minutes jusqu'à ce qu'ils soient flétris.",
        duree_min: 8,
        materiel: ["poêle antiadhésive"],
      },
      {
        numero: 6,
        titre: "Assemblage",
        description: "Mélanger les lentilles égouttées avec l'huile MCT coco et les épices. Servir la soupe en entrée (250ml). Pour le plat principal, disposer les lentilles, ajouter le cabillaud, entourer des épinards et champignons.",
        duree_min: 3,
      },
    ],

    nutrition: {
      calories: 880,
      proteines_g: 52,
      lipides_g: 8,
      glucides_g: 58,
      fibres_g: 14,
      lipides_detail: {
        mct_coco_g: 5,
        huile_olive_g: 0,
        naturels_proteines_g: 3,
        autres_g: 0,
      },
      ig_moyen: 35,
    },

    // Système d'adaptation aux budgets lipides
    lipides_incompressibles_g: 3, // Lipides naturels du cabillaud

    adaptations_budget: {
      strict: {
        nom: "strict",
        budget_min_g: 0,
        budget_max_g: 6,
        lipides_totaux_g: 3,
        lipides_detail: {
          mct_coco_g: 0,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [
          {
            action: "RETIRER",
            ingredient: "Huile MCT coco",
            de: "5g",
            vers: "0g",
            economie_g: 5,
            description: "Retirer l'huile MCT - assaisonner les lentilles uniquement avec épices et herbes",
          },
        ],
        instructions_speciales: [
          "Assaisonner les lentilles avec sel, poivre, cumin, coriandre et persil frais",
          "Le cabillaud à la vapeur ne nécessite aucune matière grasse",
        ],
      },
      modere: {
        nom: "modere",
        budget_min_g: 7,
        budget_max_g: 9,
        lipides_totaux_g: 6,
        lipides_detail: {
          mct_coco_g: 3,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [
          {
            action: "REDUIRE",
            ingredient: "Huile MCT coco",
            de: "5g",
            vers: "3g",
            economie_g: 2,
            description: "Réduire l'huile MCT à 3g (1/2 cuillère à café)",
          },
        ],
        instructions_speciales: [
          "Utiliser 1/2 cuillère à café d'huile MCT pour les lentilles",
        ],
      },
      souple: {
        nom: "souple",
        budget_min_g: 10,
        budget_max_g: 12,
        lipides_totaux_g: 8,
        lipides_detail: {
          mct_coco_g: 5,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [],
        instructions_speciales: [
          "Recette complète sans modification - déjà compatible avec le budget souple",
        ],
      },
    },

    conseils: [
      "La soupe peut être préparée en grande quantité et congelée en portions de 250ml",
      "Le cabillaud ne doit pas être trop cuit pour rester moelleux",
      "Ajouter du gingembre frais râpé dans la soupe pour plus de saveur",
      "Les lentilles corail cuisent rapidement, surveiller pour éviter qu'elles ne deviennent en bouillie",
    ],

    variantes: [
      {
        nom: "Version colin",
        modifications: "Remplacer le cabillaud par du colin",
        notes: "Temps de cuisson identique",
      },
      {
        nom: "Soupe potiron",
        modifications: "Remplacer la butternut par du potiron",
        notes: "Texture plus liquide, ajuster le bouillon",
      },
      {
        nom: "Version printemps",
        modifications: "Remplacer épinards par des asperges vapeur",
      },
    ],

    materiel_requis: [
      "Casserole moyenne",
      "Petite casserole",
      "Cuit-vapeur",
      "Poêle antiadhésive",
      "Mixeur plongeant",
      "Couteau",
      "Planche à découper",
    ],

    tags: [
      "sans_gluten",
      "sans_lactose",
      "ig_bas",
      "pauvre_en_lipides",
      "riche_en_proteines",
      "riche_en_fibres",
      "automne",
      "hiver",
      "soupe",
      "meal_prep",
      "vapeur",
    ],

    difficulte: "moyen",
    cout_estime: "moyen",

    stockage: {
      refrigerateur_jours: 3,
      congelateur_mois: 3,
      instructions:
        "La soupe se congèle très bien en portions de 250ml. Le poisson et les lentilles séparément, max 2 jours au frigo.",
    },

    date_creation: new Date().toISOString(),
    auteur: "Système",
  },

  // REPAS 2 - Poulet rôti au four + pois chiches
  {
    id: "r2-poulet-roti-pois-chiches-004",
    titre: "Poulet Rôti au Four avec Pois Chiches et Légumes Méditerranéens",
    type: "plat_principal",
    repas_cible: "REPAS_2",
    saison: ["Printemps", "Été", "Automne", "Hiver"],
    temps_preparation_min: 10,
    temps_cuisson_min: 35,
    temps_total_min: 45,
    portions: 1,

    ingredients: [
      {
        nom: "Blanc de poulet sans peau",
        quantite: 180,
        unite: "g",
        categorie: "proteine",
        notes: "poids cru",
      },
      {
        nom: "Pois chiches cuits (boîte)",
        quantite: 200,
        unite: "g",
        categorie: "feculent",
        notes: "poids égoutté (ou 70g sec)",
      },
      {
        nom: "Tomates",
        quantite: 150,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Courgettes",
        quantite: 150,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Aubergine",
        quantite: 100,
        unite: "g",
        categorie: "legume",
      },
      {
        nom: "Huile MCT coco",
        quantite: 6,
        unite: "g",
        categorie: "lipide",
        notes: "pour le poulet",
      },
      {
        nom: "Poivron vert",
        quantite: 100,
        unite: "g",
        categorie: "legume",
        notes: "pour la soupe d'entrée",
      },
      {
        nom: "Céleri branche",
        quantite: 50,
        unite: "g",
        categorie: "legume",
        notes: "pour la soupe",
      },
      {
        nom: "Bouillon de légumes",
        quantite: 300,
        unite: "ml",
        categorie: "autre",
      },
    ],

    etapes: [
      {
        numero: 1,
        titre: "Préparation de la soupe",
        description: "Laver et couper le poivron et le céleri en morceaux. Dans une casserole, porter le bouillon à ébullition. Ajouter les légumes et cuire 15 minutes. Mixer grossièrement ou laisser en morceaux selon préférence.",
        duree_min: 20,
        materiel: ["casserole", "mixeur (optionnel)"],
        temperature: "Feu moyen",
      },
      {
        numero: 2,
        titre: "Préchauffage du four",
        description: "Préchauffer le four à 190°C (thermostat 6-7).",
        duree_min: 5,
        temperature: "190°C",
      },
      {
        numero: 3,
        titre: "Préparation des légumes",
        description: "Couper les tomates en quartiers, les courgettes en rondelles, l'aubergine en dés de 2cm. Rincer et égoutter les pois chiches.",
        duree_min: 5,
        materiel: ["couteau", "planche"],
      },
      {
        numero: 4,
        titre: "Marinade du poulet",
        description: "Dans un bol, mélanger l'huile MCT coco avec de l'ail en poudre, du paprika, thym, sel et poivre. Badigeonner le poulet de cette marinade.",
        duree_min: 3,
        materiel: ["bol", "pinceau de cuisine"],
      },
      {
        numero: 5,
        titre: "Cuisson au four",
        description: "Dans un plat allant au four, disposer les légumes (tomates, courgettes, aubergine) et les pois chiches. Poser le poulet dessus. Enfourner pour 25-30 minutes. Le poulet doit être doré et atteindre 75°C à cœur.",
        duree_min: 30,
        temperature: "190°C",
        materiel: ["plat à four", "thermomètre"],
        conseils: ["Retourner les légumes à mi-cuisson pour une cuisson homogène"],
      },
      {
        numero: 6,
        titre: "Repos et service",
        description: "Laisser reposer le poulet 5 minutes avant de le trancher. Servir la soupe en entrée (250ml), puis le poulet tranché avec les légumes rôtis et les pois chiches.",
        duree_min: 5,
      },
    ],

    nutrition: {
      calories: 920,
      proteines_g: 54,
      lipides_g: 9,
      glucides_g: 62,
      fibres_g: 16,
      lipides_detail: {
        mct_coco_g: 6,
        huile_olive_g: 0,
        naturels_proteines_g: 3,
        autres_g: 0,
      },
      ig_moyen: 30,
    },

    // Système d'adaptation aux budgets lipides
    lipides_incompressibles_g: 3, // Lipides naturels du poulet

    adaptations_budget: {
      strict: {
        nom: "strict",
        budget_min_g: 0,
        budget_max_g: 6,
        lipides_totaux_g: 3,
        lipides_detail: {
          mct_coco_g: 0,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [
          {
            action: "RETIRER",
            ingredient: "Huile MCT coco",
            de: "6g",
            vers: "0g",
            economie_g: 6,
            description: "Retirer l'huile MCT de la marinade - utiliser uniquement les épices",
          },
          {
            action: "MODIFIER",
            description: "Badigeonner le poulet uniquement avec les épices sèches (ail, paprika, thym) sans matière grasse",
          },
        ],
        instructions_speciales: [
          "Mélanger les épices sèches (ail en poudre, paprika, thym, sel, poivre) et frotter sur le poulet",
          "Cuire au four sans matière grasse - les légumes et pois chiches cuisent dans leur propre humidité",
          "Couvrir le plat d'une feuille d'aluminium les 15 premières minutes pour éviter le dessèchement",
        ],
      },
      modere: {
        nom: "modere",
        budget_min_g: 7,
        budget_max_g: 9,
        lipides_totaux_g: 6,
        lipides_detail: {
          mct_coco_g: 3,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [
          {
            action: "REDUIRE",
            ingredient: "Huile MCT coco",
            de: "6g",
            vers: "3g",
            economie_g: 3,
            description: "Réduire l'huile MCT de moitié dans la marinade",
          },
        ],
        instructions_speciales: [
          "Utiliser 1/2 cuillère à café d'huile MCT dans la marinade",
          "Étaler finement sur le poulet pour une répartition homogène",
        ],
      },
      souple: {
        nom: "souple",
        budget_min_g: 10,
        budget_max_g: 12,
        lipides_totaux_g: 9,
        lipides_detail: {
          mct_coco_g: 6,
          huile_olive_g: 0,
          huile_sesame_g: 0,
          naturels_proteines_g: 3,
          autres_g: 0,
        },
        modifications: [],
        instructions_speciales: [
          "Recette complète sans modification - déjà compatible avec le budget souple",
        ],
      },
    },

    conseils: [
      "Pour un poulet plus savoureux, mariner 1-2 heures au réfrigérateur",
      "Surveiller la cuisson des légumes : l'aubergine cuit plus vite que les courgettes",
      "Les pois chiches peuvent être croustillants si on les fait sécher avant cuisson",
      "La soupe peut être remplacée par n'importe quel velouté de légumes",
    ],

    variantes: [
      {
        nom: "Version dinde",
        modifications: "Remplacer le poulet par de la dinde",
      },
      {
        nom: "Lentilles vertes",
        modifications: "Remplacer les pois chiches par des lentilles vertes cuites",
        notes: "Ajouter les lentilles en fin de cuisson pour éviter qu'elles ne sèchent",
      },
      {
        nom: "Papillote",
        modifications: "Cuire le poulet et légumes en papillote pour plus de moelleux",
        notes: "Même température, temps de cuisson identique",
      },
    ],

    materiel_requis: [
      "Plat à four",
      "Casserole",
      "Four",
      "Couteau",
      "Planche à découper",
      "Bol",
      "Pinceau de cuisine",
    ],

    tags: [
      "sans_gluten",
      "sans_lactose",
      "ig_bas",
      "pauvre_en_lipides",
      "riche_en_proteines",
      "riche_en_fibres",
      "four",
      "facile",
      "toute_saison",
      "meal_prep",
    ],

    difficulte: "facile",
    cout_estime: "faible",

    stockage: {
      refrigerateur_jours: 3,
      congelateur_mois: 2,
      instructions:
        "Séparer poulet et légumes dans des contenants hermétiques. Réchauffer au four 10 min à 160°C ou au micro-ondes.",
    },

    date_creation: new Date().toISOString(),
    auteur: "Système",
  },
];

/**
 * Obtenir une recette par ID
 */
export function getRecipeById(id: string): Recipe | undefined {
  return EXAMPLE_RECIPES.find(r => r.id === id);
}

/**
 * Obtenir toutes les recettes pour un repas
 */
export function getRecipesByRepas(repas: "REPAS_1" | "REPAS_2"): Recipe[] {
  return EXAMPLE_RECIPES.filter(
    r => r.repas_cible === repas || r.repas_cible === "LES_DEUX"
  );
}

/**
 * Obtenir toutes les recettes pour une saison
 */
export function getRecipesBySaison(saison: string): Recipe[] {
  return EXAMPLE_RECIPES.filter(r => r.saison.includes(saison as any));
}
