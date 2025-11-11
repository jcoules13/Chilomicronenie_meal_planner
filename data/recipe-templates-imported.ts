/**
 * Templates de recettes importés automatiquement depuis /menu
 * Généré par scripts/import-menus-to-recipes.ts
 * Date: 2025-11-11T18:32:21.888Z
 */

import type { RecipeTemplate } from "@/types/recipe";

export const IMPORTED_RECIPE_TEMPLATES: RecipeTemplate[] = [
  {
    "id": "bœuf maigre-01-repas1",
    "titre": "Bœuf Maigre - Menu Bœuf Haché 5% MG (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Steak haché 5% MG sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "bœuf maigre",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "bœuf maigre-04-repas1",
    "titre": "Bœuf Maigre - Menu Bœuf Sauté Asiatique (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "6254",
        "nom": "Bœuf sauté 5% MG",
        "categorie": "proteine",
        "role": "proteine_principale",
        "notes": "À cuire sans matière grasse"
      },
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "9100",
        "nom": "Riz basmati",
        "categorie": "feculent",
        "role": "feculent",
        "notes": "Poids cru: 80g (cuit: ~240g)"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Bœuf sauté 5% MG sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "bœuf maigre",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "poisson maigre-01-repas1",
    "titre": "Poisson Maigre - Menu Cabillaud Vapeur (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "26009",
        "nom": "Cabillaud frais",
        "categorie": "proteine",
        "role": "proteine_principale",
        "notes": "À cuire sans matière grasse"
      },
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "20526",
        "nom": "Lentilles corail",
        "categorie": "feculent",
        "role": "feculent",
        "notes": "Poids cru: 90g (cuit: ~230g)"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Cabillaud frais sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "poisson maigre",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "dinde-01-repas1",
    "titre": "Dinde - Menu Dinde Rôtie (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "16300",
        "nom": "Escalope de dinde SANS PEAU",
        "categorie": "proteine",
        "role": "proteine_principale",
        "notes": "À cuire sans matière grasse"
      },
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "9410",
        "nom": "Quinoa",
        "categorie": "feculent",
        "role": "feculent",
        "notes": "Poids cru: 80g (cuit: ~240g)"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Escalope de dinde SANS PEAU sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "dinde",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "dinde-04-repas1",
    "titre": "Dinde - Menu Dinde Tandoori (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "16300",
        "nom": "Dinde tandoori",
        "categorie": "proteine",
        "role": "proteine_principale",
        "notes": "À cuire sans matière grasse"
      },
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Dinde tandoori sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "dinde",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "poisson maigre-04-repas1",
    "titre": "Poisson Maigre - Menu Sole Meunière (sans beurre) (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Sole fraîche sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "poisson maigre",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "poisson gras-02-repas1",
    "titre": "Poisson Gras - Menu Thon Mi-Cuit (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "9100",
        "nom": "Riz basmati",
        "categorie": "feculent",
        "role": "feculent",
        "notes": "Poids cru: 85g (cuit: ~255g)"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Pavé de thon frais sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "poisson gras",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "poulet-01-repas1",
    "titre": "Poulet - Menu Poulet Classique (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "16018",
        "nom": "Blanc de poulet SANS PEAU",
        "categorie": "proteine",
        "role": "proteine_principale",
        "notes": "À cuire sans matière grasse"
      },
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "20516",
        "nom": "Lentilles vertes",
        "categorie": "feculent",
        "role": "feculent",
        "notes": "Poids cru: 70g (cuit: ~180g)"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Blanc de poulet SANS PEAU sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "poulet",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  },
  {
    "id": "poulet-04-repas1",
    "titre": "Poulet - Menu Poulet Grillé Marinades (Repas 1)",
    "type": "plat_principal",
    "repas_cible": "REPAS_1",
    "saison": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "temps_preparation_min": 15,
    "temps_cuisson_min": 25,
    "temps_total_min": 40,
    "ingredients_template": [
      {
        "code_ciqual": "16018",
        "nom": "Poulet grillé mariné",
        "categorie": "proteine",
        "role": "proteine_principale",
        "notes": "À cuire sans matière grasse"
      },
      {
        "code_ciqual": "22000",
        "nom": "Blanc d'œuf liquide",
        "categorie": "proteine",
        "role": "proteine_complementaire",
        "notes": "Ajouté automatiquement si nécessaire pour atteindre l'objectif protéines"
      },
      {
        "code_ciqual": "9410",
        "nom": "Quinoa",
        "categorie": "feculent",
        "role": "feculent",
        "notes": "Poids cru: 85g (cuit: ~255g)"
      },
      {
        "code_ciqual": "20028",
        "nom": "Brocoli",
        "categorie": "legume",
        "role": "legume",
        "notes": "Cuisson vapeur 10-12 min"
      },
      {
        "code_ciqual": "17270",
        "nom": "Huile MCT coco",
        "categorie": "lipide",
        "role": "lipide",
        "notes": "Pour cuisson, respecter budget lipides"
      }
    ],
    "besoins_reference": {
      "proteines_g": 100,
      "lipides_max_g": 10,
      "fibres_g": 20,
      "ig_moyen_max": 55
    },
    "difficulte": "facile",
    "etapes": [
      {
        "numero": 1,
        "titre": "Préparation des ingrédients",
        "description": "Préparer et laver tous les ingrédients",
        "duree_min": 10
      },
      {
        "numero": 2,
        "titre": "Cuisson de la protéine",
        "description": "Cuire Poulet grillé mariné sans matière grasse (vapeur, poêle antiadhésive ou four)",
        "duree_min": 20
      },
      {
        "numero": 3,
        "titre": "Cuisson des accompagnements",
        "description": "Cuire les légumes et féculents selon les instructions",
        "duree_min": 15
      },
      {
        "numero": 4,
        "titre": "Assemblage et service",
        "description": "Disposer harmonieusement dans l'assiette",
        "duree_min": 5
      }
    ],
    "tags": [
      "chylomicronémie_compatible",
      "ig_bas",
      "poulet",
      "adaptatif"
    ],
    
    "cout_estime": "moyen",
    "favoris": false
  }
];

export default IMPORTED_RECIPE_TEMPLATES;
