# Template de Génération de Recettes - Chilomicronémie

## Instructions pour l'IA

Ce template doit être utilisé pour générer des recettes adaptées aux contraintes de la chilomicronémie.

### Contraintes STRICTES

1. **Lipides** : Maximum 20-25g par jour, répartis sur 2 repas
   - Priorité aux MCT (huile coco) : 30-40% des lipides totaux
   - Huile d'olive : 5-10g maximum par jour
   - Éviter ABSOLUMENT : beurre, crème, fromage, viandes grasses, charcuterie
   - Protéines maigres SANS PEAU : poulet, dinde, poisson maigre
   - Bœuf haché 5% MG maximum

2. **Protéines** : 50-60g par repas
   - Poulet/Dinde SANS PEAU
   - Poisson maigre (cabillaud, colin, lieu, sole)
   - Poisson gras (saumon, thon) - 1x/semaine MAX
   - Bœuf haché 5% MG

3. **Glucides** : Privilégier Index Glycémique BAS
   - Lentilles (vertes, corail) : IG 30
   - Pois chiches : IG 28
   - Quinoa : IG 35
   - Riz basmati : IG 50
   - Patate douce : IG 46

4. **Structure des repas**
   - REPAS 1 (11h00) : 1200 kcal - Salade + Protéine + Légumes + Féculents + Dessert
   - REPAS 2 (17h00) : 900 kcal - Soupe + Protéine + Légumes + Légumineuses

### Format de Recette Requis

Pour chaque recette, utiliser le format JSON suivant :

```json
{
  "id": "recette-001",
  "titre": "Poulet Vapeur aux Légumes et Lentilles Vertes",
  "type": "plat_principal",
  "repas_cible": "REPAS_1",
  "saison": ["printemps", "ete", "automne", "hiver"],
  "temps_preparation_min": 15,
  "temps_cuisson_min": 25,
  "temps_total_min": 40,
  "portions": 1,

  "ingredients": [
    {
      "nom": "Blanc de poulet sans peau",
      "quantite": 200,
      "unite": "g",
      "categorie": "proteine",
      "notes": "poids cru"
    },
    {
      "nom": "Lentilles vertes",
      "quantite": 80,
      "unite": "g",
      "categorie": "feculent",
      "notes": "poids sec"
    },
    {
      "nom": "Carottes",
      "quantite": 150,
      "unite": "g",
      "categorie": "legume"
    },
    {
      "nom": "Courgettes",
      "quantite": 150,
      "unite": "g",
      "categorie": "legume"
    },
    {
      "nom": "Huile MCT coco",
      "quantite": 5,
      "unite": "g",
      "categorie": "lipide",
      "notes": "1 cuillère à café"
    }
  ],

  "etapes": [
    {
      "numero": 1,
      "titre": "Préparation des lentilles",
      "description": "Rincer les lentilles vertes à l'eau froide. Porter une casserole d'eau à ébullition (ratio 1:3).",
      "duree_min": 2,
      "materiel": ["casserole", "passoire"]
    },
    {
      "numero": 2,
      "titre": "Cuisson des lentilles",
      "description": "Ajouter les lentilles dans l'eau bouillante. Cuire 20-25 minutes jusqu'à ce qu'elles soient tendres mais pas trop molles. Égoutter et réserver.",
      "duree_min": 25,
      "temperature": "100°C"
    },
    {
      "numero": 3,
      "titre": "Préparation des légumes",
      "description": "Laver et couper les carottes en rondelles de 0.5cm. Couper les courgettes en demi-rondelles.",
      "duree_min": 5,
      "materiel": ["couteau", "planche"]
    },
    {
      "numero": 4,
      "titre": "Cuisson vapeur",
      "description": "Placer le poulet et les légumes dans le panier vapeur. Cuire 15-20 minutes. Le poulet doit atteindre une température interne de 75°C.",
      "duree_min": 20,
      "temperature": "100°C",
      "materiel": ["cuit-vapeur"]
    },
    {
      "numero": 5,
      "titre": "Assaisonnement",
      "description": "Dans un bol, mélanger les lentilles égouttées avec l'huile MCT coco. Assaisonner avec sel, poivre et herbes au choix.",
      "duree_min": 2
    },
    {
      "numero": 6,
      "titre": "Dressage",
      "description": "Disposer les lentilles au centre de l'assiette. Ajouter le poulet coupé en tranches. Entourer des légumes vapeur. Servir immédiatement.",
      "duree_min": 3
    }
  ],

  "nutrition": {
    "calories": 520,
    "proteines_g": 55,
    "lipides_g": 8,
    "glucides_g": 60,
    "fibres_g": 12,
    "lipides_detail": {
      "mct_coco_g": 5,
      "huile_olive_g": 0,
      "naturels_proteines_g": 3,
      "autres_g": 0
    },
    "ig_moyen": 30
  },

  "conseils": [
    "Vérifier la cuisson du poulet avec un thermomètre : 75°C à cœur",
    "Les lentilles peuvent être cuites à l'avance et réchauffées",
    "Varier les légumes selon la saison pour plus de diversité"
  ],

  "variantes": [
    {
      "nom": "Version dinde",
      "modifications": "Remplacer le poulet par du blanc de dinde (même quantité)",
      "notes": "Temps de cuisson identique"
    },
    {
      "nom": "Lentilles corail",
      "modifications": "Remplacer les lentilles vertes par des lentilles corail",
      "notes": "Temps de cuisson réduit à 10-12 minutes"
    }
  ],

  "materiel_requis": [
    "Casserole",
    "Cuit-vapeur ou panier vapeur",
    "Passoire",
    "Couteau",
    "Planche à découper",
    "Bol"
  ],

  "tags": [
    "sans_gluten",
    "sans_lactose",
    "ig_bas",
    "pauvre_en_lipides",
    "riche_en_proteines",
    "facile",
    "meal_prep"
  ],

  "difficulte": "facile",
  "cout_estime": "moyen",

  "stockage": {
    "refrigerateur_jours": 3,
    "congelateur_mois": 2,
    "instructions": "Conserver le poulet et les légumes séparément des lentilles. Réchauffer à la vapeur ou au micro-ondes."
  }
}
```

## Exemples de Recettes à Générer

Veuillez générer 20 recettes variées couvrant :

### REPAS 1 (11h00 - 1200 kcal)
1. Poulet vapeur + lentilles vertes + légumes + salade vinaigrée + skyr myrtilles
2. Dinde poêlée + quinoa + brocolis + salade + yaourt grec fruits
3. Cabillaud vapeur + riz basmati + carottes + salade + compote
4. Bœuf haché 5% + pois chiches + courgettes + salade + skyr fraises
5. Poulet citron + patate douce + haricots verts + salade + yaourt

### REPAS 2 (17h00 - 900 kcal)
6. Soupe butternut + dinde grillée + lentilles corail + épinards
7. Soupe tomate basilic + cabillaud poché + pois chiches + endives
8. Velouté carotte gingembre + poulet curry + lentilles vertes + brocolis
9. Soupe poireaux + bœuf haché + haricots rouges + champignons
10. Soupe potiron + colin vapeur + lentilles corail + chou-fleur

### REPAS SPÉCIAUX
11. Saumon vapeur + quinoa + asperges (1x/semaine - poisson gras)
12. Thon grillé + lentilles + tomates cerises (1x/semaine - poisson gras)

### VARIANTES SAISONNIÈRES
- **Printemps** : asperges, petits pois, radis, fèves
- **Été** : tomates, courgettes, aubergines, poivrons, concombre
- **Automne** : courges, champignons, choux, carottes
- **Hiver** : poireaux, céleris, choux, navets

## Consignes de Génération

1. **Respecter STRICTEMENT** les limites lipidiques (8-12g par repas)
2. **Privilégier** les méthodes de cuisson sans MG : vapeur, poché, four, grill
3. **Utiliser** uniquement MCT coco et huile d'olive (max 5g par repas)
4. **Varier** les protéines : poulet, dinde, poisson maigre, bœuf 5%
5. **Inclure** systématiquement des légumes (min 200g par repas)
6. **Choisir** des féculents IG bas : lentilles, pois chiches, quinoa
7. **Ajouter** des herbes aromatiques pour la saveur (sans lipides)
8. **Proposer** des variantes et alternatives
9. **Détailler** toutes les étapes de préparation
10. **Calculer** précisément les valeurs nutritionnelles

## Validation

Chaque recette doit être validée selon ces critères :

- [ ] Lipides totaux ≤ 12g pour REPAS 1, ≤ 10g pour REPAS 2
- [ ] Protéines entre 50-60g
- [ ] Glucides entre 60-80g pour REPAS 1, 50-70g pour REPAS 2
- [ ] Calories dans la cible (1200 ±100 pour R1, 900 ±100 pour R2)
- [ ] IG moyen ≤ 50
- [ ] Aucune source de lipides interdite
- [ ] Instructions claires et détaillées
- [ ] Temps de préparation réaliste
- [ ] Ingrédients facilement accessibles

## Notes pour l'IA

- **Soyez créatif** mais respectez les contraintes médicales STRICTEMENT
- **Variez** les saveurs : épices, herbes, marinades au citron, vinaigre
- **Pensez** aux textures : croquant, fondant, crémeux (sans crème !)
- **Proposez** des recettes meal-prep (préparation à l'avance)
- **Incluez** des recettes rapides (< 30 min) et des plus élaborées
- **Adaptez** les quantités pour 1 portion (mise à l'échelle possible)

Bon appétit et bonne génération ! 🍽️
