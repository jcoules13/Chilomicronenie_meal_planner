/**
 * Templates de recettes basés sur CIQUAL
 * Les quantités seront calculées dynamiquement selon le profil utilisateur
 */

import type { RecipeTemplate } from "@/types/recipe";
import { IMPORTED_RECIPE_TEMPLATES } from "./recipe-templates-imported";

/**
 * EXEMPLE : Dinde Poêlée au Quinoa et Poivrons Grillés
 *
 * Ingrédients en base 100g (codes CIQUAL)
 * Les quantités seront calculées selon les besoins de l'utilisateur
 */
export const TEMPLATE_DINDE_QUINOA: RecipeTemplate = {
  id: "template-dinde-quinoa-001",
  titre: "Dinde Poêlée au Quinoa et Poivrons Grillés",
  type: "plat_principal",
  repas_cible: "REPAS_1",
  saison: ["Printemps", "Été", "Automne"],

  // Temps
  temps_preparation_min: 15,
  temps_cuisson_min: 25,
  temps_total_min: 40,

  // Ingrédients TEMPLATE (sans quantités fixes)
  ingredients_template: [
    {
      code_ciqual: "16300", // Blanc de dinde sans peau (valeurs CIQUAL)
      nom: "Blanc de dinde sans peau",
      categorie: "proteine",
      role: "proteine_principale",
      notes: "À cuire à la poêle ou vapeur",
    },
    {
      code_ciqual: "22000", // Blanc d'œuf liquide
      nom: "Blanc d'œuf liquide",
      categorie: "proteine",
      role: "proteine_complementaire",
      notes: "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines",
    },
    {
      code_ciqual: "9410", // Quinoa cuit
      nom: "Quinoa",
      categorie: "feculent",
      role: "feculent",
      notes: "Cuisson : 2 volumes d'eau pour 1 volume de quinoa",
    },
    {
      code_ciqual: "20047", // Poivrons rouges
      nom: "Poivrons rouges",
      categorie: "legume",
      role: "legume",
      notes: "À griller au four ou à la poêle",
    },
    {
      code_ciqual: "20009", // Haricots verts
      nom: "Haricots verts",
      categorie: "legume",
      role: "legume",
      notes: "Cuisson vapeur 10-12 minutes",
    },
    {
      code_ciqual: "20182", // Tomates cerises
      nom: "Tomates cerises",
      categorie: "legume",
      role: "legume",
      notes: "Crues ou rôties",
    },
    {
      code_ciqual: "17270", // Huile MCT coco (pour cuisson dinde)
      nom: "Huile de coco (MCT)",
      categorie: "lipide",
      role: "lipide",
      notes: "Pour la cuisson de la dinde - quantité adaptée au budget lipides",
    },
    {
      code_ciqual: "17440", // Huile d'olive (pour salade)
      nom: "Huile d'olive",
      categorie: "lipide",
      role: "lipide",
      notes: "Pour assaisonner - quantité adaptée au budget lipides",
    },
  ],

  // Étapes de préparation
  etapes: [
    {
      numero: 1,
      titre: "Préparation du quinoa",
      description: "Rincer le quinoa à l'eau froide. Faire cuire dans 2 fois son volume d'eau salée pendant 15 minutes. Laisser reposer 5 minutes hors du feu.",
      duree_min: 20,
    },
    {
      numero: 2,
      titre: "Cuisson de la dinde",
      description: "Couper le blanc de dinde en morceaux. Faire chauffer l'huile MCT dans une poêle. Cuire la dinde 5-7 minutes de chaque côté jusqu'à ce qu'elle soit bien dorée.",
      duree_min: 15,
      conseils: ["Si budget lipides très strict : cuire à la vapeur sans huile"],
    },
    {
      numero: 3,
      titre: "Préparation des légumes",
      description: "Couper les poivrons en lanières et les griller à la poêle. Cuire les haricots verts à la vapeur 10 minutes. Laver les tomates cerises.",
      duree_min: 15,
    },
    {
      numero: 4,
      titre: "Assemblage",
      description: "Disposer le quinoa dans l'assiette. Ajouter la dinde, les légumes grillés, les haricots verts et les tomates cerises. Assaisonner avec un filet d'huile d'olive, sel, poivre et herbes de Provence.",
      duree_min: 5,
      conseils: ["Si budget lipides très strict : remplacer l'huile par du jus de citron et du vinaigre balsamique"],
    },
  ],

  // Besoins nutritionnels de référence (pour 1 repas type)
  besoins_reference: {
    proteines_g: 180, // Objectif pour utilisateur 102kg × 3g × 0.6 (repas 1)
    lipides_max_g: 5, // Budget strict pour TG=14
    fibres_g: 20,
    ig_moyen_max: 50,
  },

  // Informations complémentaires
  conseils: [
    "Cette recette s'adapte automatiquement à votre profil",
    "Si votre budget lipides est très strict, l'huile sera réduite ou supprimée",
    "Le blanc d'œuf sera ajouté automatiquement si nécessaire pour atteindre vos besoins en protéines",
    "Les quantités affichées sont calculées spécifiquement pour VOUS",
  ],

  variantes: [
    {
      nom: "Version poulet",
      modifications: "Remplacer la dinde par du blanc de poulet (même quantités)",
    },
    {
      nom: "Version riz basmati",
      modifications: "Remplacer le quinoa par du riz basmati (IG similaire)",
    },
  ],

  materiel_requis: [
    "Poêle antiadhésive",
    "Casserole pour quinoa",
    "Panier vapeur",
  ],

  tags: ["ig_bas", "riche_en_proteines", "pauvre_en_lipides", "adaptable"],

  difficulte: "facile",
  cout_estime: "moyen",

  stockage: {
    refrigerateur_jours: 2,
    congelateur_mois: 3,
    instructions: "Conserver les ingrédients séparés si possible. Réchauffer à la vapeur ou au micro-ondes.",
  },

  date_creation: new Date().toISOString(),
  auteur: "Chef Chilomicronémie",
};

/**
 * EXEMPLE 2 : Poulet Vapeur aux Lentilles Vertes
 */
export const TEMPLATE_POULET_LENTILLES: RecipeTemplate = {
  id: "template-poulet-lentilles-001",
  titre: "Poulet Vapeur aux Lentilles Vertes",
  type: "plat_principal",
  repas_cible: "REPAS_1",
  saison: ["Printemps", "Été", "Automne", "Hiver"],

  temps_preparation_min: 10,
  temps_cuisson_min: 30,
  temps_total_min: 40,

  ingredients_template: [
    {
      code_ciqual: "16018", // Poulet blanc cuit vapeur
      nom: "Blanc de poulet sans peau",
      categorie: "proteine",
      role: "proteine_principale",
      notes: "Cuisson vapeur recommandée",
    },
    {
      code_ciqual: "22000", // Blanc d'œuf
      nom: "Blanc d'œuf liquide",
      categorie: "proteine",
      role: "proteine_complementaire",
      notes: "Complément protéines si budget lipides strict",
    },
    {
      code_ciqual: "20516", // Lentilles vertes cuites
      nom: "Lentilles vertes",
      categorie: "feculent",
      role: "feculent",
      notes: "Trempage 2h recommandé, cuisson 25 min",
    },
    {
      code_ciqual: "20028", // Brocolis
      nom: "Brocolis",
      categorie: "legume",
      role: "legume",
      notes: "Cuisson vapeur 8-10 minutes",
    },
    {
      code_ciqual: "20010", // Carottes
      nom: "Carottes",
      categorie: "legume",
      role: "legume",
      notes: "Cuisson vapeur 15 minutes",
    },
  ],

  etapes: [
    {
      numero: 1,
      titre: "Préparation des lentilles",
      description: "Rincer les lentilles. Les faire cuire dans 2,5 fois leur volume d'eau salée pendant 25 minutes.",
      duree_min: 30,
    },
    {
      numero: 2,
      titre: "Cuisson du poulet",
      description: "Cuire le poulet à la vapeur pendant 20-25 minutes jusqu'à ce qu'il soit bien cuit.",
      duree_min: 25,
    },
    {
      numero: 3,
      titre: "Cuisson des légumes",
      description: "Cuire les brocolis et carottes à la vapeur (carottes 15 min, brocolis 8 min).",
      duree_min: 15,
    },
    {
      numero: 4,
      titre: "Assemblage",
      description: "Servir le poulet avec les lentilles et les légumes. Assaisonner avec sel, poivre, ail et herbes.",
      duree_min: 5,
    },
  ],

  besoins_reference: {
    proteines_g: 180,
    lipides_max_g: 5,
    fibres_g: 20,
    ig_moyen_max: 50,
  },

  conseils: [
    "Recette sans ajout de matières grasses - parfaite pour budget lipides strict",
    "Les lentilles apportent protéines végétales et fibres",
    "Cuisson vapeur préserve les nutriments",
  ],

  tags: ["ig_bas", "sans_huile", "riche_en_fibres", "facile"],

  difficulte: "facile",
  cout_estime: "faible",

  stockage: {
    refrigerateur_jours: 3,
    congelateur_mois: 3,
  },

  date_creation: new Date().toISOString(),
  auteur: "Chef Chilomicronémie",
};

/**
 * Tous les templates disponibles
 * Inclut les templates manuels et ceux importés automatiquement depuis /menu
 */
export const ALL_RECIPE_TEMPLATES: RecipeTemplate[] = [
  TEMPLATE_DINDE_QUINOA,
  TEMPLATE_POULET_LENTILLES,
  ...IMPORTED_RECIPE_TEMPLATES,
];
