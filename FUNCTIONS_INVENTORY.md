# 📚 Inventaire des Fonctions - Application Chilomicronémie Meal Planner

**Date de création** : 2025-01-XX
**Version** : 1.0
**Objectif** : Document de référence pour comprendre l'architecture et les fonctions existantes

---

## 🎯 Vue d'ensemble de l'application

Cette application aide les personnes atteintes de **chylomicronémie** (hypertriglycéridémie sévère) à gérer leur alimentation avec des contraintes strictes de lipides.

### Pathologie : Chylomicronémie
- **Condition** : Niveau élevé de triglycérides (TG) dans le sang
- **Risque** : Pancréatite aiguë si TG ≥ 10 g/L
- **Traitement** : Régime très pauvre en lipides (10-20g/jour selon niveau TG)
- **Objectif** : Ramener TG < 1.5 g/L (zone normale)

---

## 🔑 Système de Profil Utilisateur

### 📍 Localisation
- **Hook** : `/hooks/useProfile.ts`
- **Types** : `/types/profile.ts`
- **Calculs** : `/lib/utils/profile-calculations.ts`
- **Page UI** : `/app/profil/page.tsx`
- **Stockage** : `localStorage` (clé: `chilomicronenie_user_profile`)

### 📊 Données du Profil

#### Informations personnelles
```typescript
{
  id: string;
  prenom?: string;
  nom?: string;
  sexe: "HOMME" | "FEMME";
  date_naissance?: Date;

  // Données physiques
  poids_kg: number;
  taille_cm: number;
  niveau_activite: NiveauActivite;
  objectif: ObjectifSante;

  // BMR (Métabolisme de base)
  bmr_manuel_kcal?: number; // Optionnel : BMR mesuré par montre/balance
}
```

#### Contraintes de santé
```typescript
contraintes_sante: {
  chylomicronemie: boolean;
  diabete: boolean;
  hypertension: boolean;
  limite_sodium_mg_jour?: number;
  autre_pathologie?: string;
}
```

#### Suivi des triglycérides (TG)
```typescript
{
  niveau_tg_g_l?: number; // Niveau actuel (ex: 14.0 g/L)
  date_derniere_analyse?: Date;
}
```

### 🧮 Fonction TG → Lipides (CENTRALE)

**Fonction** : `determinerZoneTG(niveau_tg_g_l: number)`
**Fichier** : `/lib/utils/profile-calculations.ts` (lignes 130-160)

#### Seuils et Zones (NON LINÉAIRE !)

```typescript
export const ZONES_TG = {
  CRITIQUE: {
    min: 10,              // TG ≥ 10 g/L
    limite_lipides_g: 10  // → 10g lipides/jour MAX
    alerte: "🚨 DANGER CRITIQUE : Risque pancréatite"
  },
  HAUTE: {
    min: 5,               // 5 ≤ TG < 10
    limite_lipides_g: 15  // → 15g lipides/jour MAX
    alerte: "⚠️ DANGER : Zone de risque"
  },
  MODEREE: {
    min: 2,               // 2 ≤ TG < 5
    limite_lipides_g: 18  // → 18g lipides/jour MAX
    alerte: "✓ SÉCURISÉ : Hors danger pancréatite"
  },
  LIMITE: {
    min: 1.5,             // 1.5 ≤ TG < 2
    limite_lipides_g: 20  // → 20g lipides/jour MAX
    alerte: "✓ BON : Proches de l'objectif"
  },
  NORMALE: {
    min: 0,               // TG < 1.5
    max: 1.5,
    limite_lipides_g: 20  // → 20g lipides/jour MAX
    alerte: "✅ EXCELLENT : Objectif atteint"
  }
}
```

**Exemple utilisateur actuel** :
- TG = 14 g/L
- Zone = CRITIQUE
- **Limite lipides = 10g/jour**

### 📐 Calculs Automatiques

#### Valeurs calculées
```typescript
valeurs_calculees: {
  // Indicateurs corporels
  imc: number;
  categorie_imc: "MAIGREUR" | "NORMAL" | "SURPOIDS" | "OBESITE";

  // Besoins énergétiques
  bmr_kcal: number;              // Métabolisme de base
  bmr_source: "MANUEL" | "CALCULE";  // Source du BMR
  besoins_energetiques_kcal: number; // Besoins totaux

  // Zones cardiaques
  fc_max: number;
  zone_cardio_brule_graisse: { min: number; max: number };
  zone_cardio_aerobie: { min: number; max: number };
  zone_cardio_anaerobie: { min: number; max: number };
  zone_cardio_maximum: { min: number; max: number };

  // Triglycérides et limites
  zone_tg?: ZoneTG;                    // CRITIQUE | HAUTE | MODEREE | LIMITE | NORMALE
  limite_lipides_adaptative_g?: number; // Limite selon TG
  limite_lipides_jeune_g?: number;      // Limite pendant protocole jeûne

  // Macronutriments quotidiens
  macros_quotidiens: {
    proteines_g: number;  // Basé sur poids × 1.6-2.0 g/kg + ajustement âge
    lipides_g: number;    // Selon zone TG (10-20g)
    glucides_g: number;   // Complète les calories restantes
  };
}
```

#### Formule BMR (Mifflin-St Jeor)
```typescript
// Homme: BMR = (10 × poids) + (6.25 × taille) - (5 × âge) + 5
// Femme: BMR = (10 × poids) + (6.25 × taille) - (5 × âge) - 161
```

#### Formule Besoins Énergétiques
```typescript
Besoins = BMR × Coefficient d'activité ± Ajustement objectif

Coefficients d'activité:
- SEDENTAIRE: 1.2
- LEGER: 1.375
- MODERE: 1.55
- ACTIF: 1.725
- TRES_ACTIF: 1.9

Ajustements objectif:
- PERTE_POIDS: -400 kcal
- MAINTIEN: 0 kcal
- PRISE_MASSE: +300 kcal
```

#### Calcul des Protéines (IMPORTANT : Ajustement âge)
```typescript
Protéines = poids_kg × ratio_objectif × coefficient_âge

Ratios par objectif:
- PERTE_POIDS: 1.6 g/kg
- MAINTIEN: 1.6 g/kg
- PRISE_MASSE: 2.0 g/kg

Coefficients d'âge (séquestration splanchnique):
- < 50 ans: × 1.0
- 50-64 ans: × 1.15  (+15%)
- 65-74 ans: × 1.25  (+25%)
- ≥ 75 ans: × 1.30   (+30%)
```

### 🍽️ Configuration des Repas

#### Structure
```typescript
{
  nombre_repas: 1 | 2 | 3 | 4 | 5;
  preset_repartition: "EQUILIBRE" | "MIDI_PLUS" | "MIDI_TRES_PLUS" | "SOIR_PLUS" | "SOIR_TRES_PLUS" | "CUSTOM";

  repas: Array<{
    id: string;
    nom: string;
    horaire: string;  // Format "HH:MM"
    pourcentage_calories: number;  // % des calories totales
    actif: boolean;
  }>
}
```

#### Presets pour 2 repas
```typescript
EQUILIBRE:      [50%, 50%]  // Déjeuner, Dîner
MIDI_PLUS:      [60%, 40%]
MIDI_TRES_PLUS: [70%, 30%]
SOIR_PLUS:      [40%, 60%]
SOIR_TRES_PLUS: [30%, 70%]
```

---

## 🥗 Système CIQUAL (Ingrédients)

### 📍 Localisation
- **Hook** : `/hooks/useIngredients.ts`
- **Types** : `/types/ciqual.ts`
- **Recherche** : `/lib/db/ciqual-search.ts`
- **Page UI** : `/app/aliments/page.tsx` (remplace l'ancien système)
- **Stockage** : IndexedDB (base `chilomicronenie_db`, store `ingredients_ciqual`)

### 📦 Structure Ingrédient CIQUAL

```typescript
interface IngredientCiqual {
  id: string;  // UUID généré
  code_ciqual: string;  // Code CIQUAL officiel (ex: "4044")
  nom_complet: string;
  nom_affichage: string;

  // Nutrition pour 100g
  nutrition_100g: Nutrition100g;

  // Métadonnées
  source: "CIQUAL" | "MANUEL" | "IMPORT";
  categorie_ciqual?: string;
  sous_categorie_ciqual?: string;

  date_ajout: Date;
  date_modification: Date;
}
```

### 🔍 Recherche CIQUAL
```typescript
// Fonction: rechercherIngredientsCIQUAL(query: string)
// Fichier: /lib/db/ciqual-search.ts

// Recherche dans le CSV CIQUAL (~3200 aliments)
// Retourne les 50 meilleurs résultats
// Permet d'importer dans IndexedDB
```

### 💾 Import de données
- **CSV Source** : `/data/CIQUAL_2020_fr.csv` (~3200 aliments)
- **Sample** : `/data/ciqual_sample.json` (93 aliments pour tests)
- **Fonction import** : `importSampleData()` dans `useIngredients`

---

## 🍳 Système de Recettes (Phase 11.2 - NOUVEAU)

### 📍 Localisation
- **Types** : `/types/recipe.ts`
- **Générateur** : `/lib/recipe-generator.ts`
- **Exemples** : `/data/recipes-examples.ts`
- **Page liste** : `/app/recettes/page.tsx`
- **Page détail** : `/app/recettes/[id]/page.tsx`
- **Template IA** : `/docs/recipe-generation-template.md`

### 🎯 Structure Recette

```typescript
interface Recipe {
  id: string;
  titre: string;
  type: "plat_principal" | "entree" | "soupe" | "dessert" | "accompagnement";
  repas_cible: "REPAS_1" | "REPAS_2" | "LES_DEUX";
  saison: Saison[];  // ["Printemps", "Été", "Automne", "Hiver"]

  // Temps
  temps_preparation_min: number;
  temps_cuisson_min: number;
  temps_total_min: number;
  portions: number;

  // Ingrédients et préparation
  ingredients: IngredientRecette[];
  etapes: EtapeRecette[];

  // Nutrition (valeurs CALCULÉES pour les portions indiquées)
  nutrition: {
    calories: number;
    proteines_g: number;
    lipides_g: number;
    glucides_g: number;
    fibres_g: number;
    lipides_detail: {
      mct_coco_g: number;
      huile_olive_g: number;
      huile_sesame_g?: number;
      naturels_proteines_g: number;
      autres_g: number;
    };
    ig_moyen?: number;
  };

  // Informations complémentaires
  conseils?: string[];
  variantes?: VarianteRecette[];
  materiel_requis?: string[];
  tags?: string[];
  difficulte: "facile" | "moyen" | "difficile";
  cout_estime: "faible" | "moyen" | "eleve";
  stockage?: {
    refrigerateur_jours?: number;
    congelateur_mois?: number;
    instructions?: string;
  };
}
```

### ✅ Validation de Recette

```typescript
// Fonction: validerRecette(recipe: Recipe)
// Fichier: /types/recipe.ts

Vérifications:
- Lipides ≤ 12g pour REPAS_1
- Lipides ≤ 10g pour REPAS_2
- Protéines 45-70g
- Calories dans fourchette cible ±100
- IG moyen ≤ 55
- Numérotation des étapes correcte
```

### 🔄 Adaptation au Profil Utilisateur

```typescript
// Fonction: adapteRecipeToBMR(recipe, bmr_utilisateur, bmr_reference)
// Fichier: /lib/recipe-generator.ts

Principe:
- Ratio = bmr_utilisateur / bmr_reference (défaut: 1800)
- Toutes les quantités d'ingrédients × ratio
- Valeurs nutritionnelles × ratio

Exemple:
- BMR utilisateur: 2000 kcal
- BMR référence: 1800 kcal
- Ratio: 2000/1800 = 1.11
- Poulet: 200g → 222g
- Calories: 500 → 555 kcal
```

### 🔍 Recherche et Filtrage

```typescript
// Fonction: searchRecipes(allRecipes, filters)
// Fichier: /lib/recipe-generator.ts

Filtres disponibles:
- type: TypeRecette
- repas_cible: RepasCible
- saison: Saison
- difficulte: DifficulteRecette
- temps_max_min: number
- calories_max: number
- lipides_max_g: number
- tags: string[]
- recherche_texte: string
```

### 📚 Recettes d'Exemple (4 recettes complètes)

1. **Poulet Vapeur aux Lentilles Vertes** (REPAS_1)
   - 1150 kcal, 58g protéines, 13g lipides
   - Toutes saisons

2. **Dinde Poêlée au Quinoa** (REPAS_1)
   - 1180 kcal, 55g protéines, 12g lipides
   - Printemps, Été, Automne

3. **Velouté Butternut + Cabillaud** (REPAS_2)
   - 880 kcal, 52g protéines, 8g lipides
   - Automne, Hiver

4. **Poulet Rôti + Pois Chiches** (REPAS_2)
   - 920 kcal, 54g protéines, 9g lipides
   - Toutes saisons

**⚠️ PROBLÈME IDENTIFIÉ** : Ces recettes dépassent le budget de l'utilisateur (TG=14 → 10g/jour max) !

---

## 🍽️ Système de Menus (v3.1 - Ancien)

### 📍 Localisation
- **Types** : `/types/menu.ts`
- **Templates** : `/lib/utils/menu-templates-v31.ts`
- **Pages** : `/app/menus/`

### 📋 Structure Menu v3.1

```typescript
interface MenuV31 {
  nom: string;
  numero: number;
  type_proteine: TypeProteine;
  frequence: FrequenceMenu;
  saisons: Saison[];

  // Cibles nutritionnelles
  calories_cibles: number;
  proteines_cibles_g: number;
  lipides_cibles_g: number;
  glucides_cibles_g: number;

  // Structure 2 repas
  repas_1: RepasStructureV31;  // 11h00 - 1200 kcal
  repas_2: RepasStructureV31;  // 17h00 - 900 kcal

  // Budget lipides journée
  budget_lipides_journee: BudgetLipides;

  ig_moyen: number;
  adaptatif_bmr: boolean;
  bmr_reference: number;
}
```

### 🏗️ Builders de Menus

```typescript
// Créer composants
creerComposantSaladeVinegree()
creerComposantSoupeMaison()
creerComposantProteine(type, quantite, lipides_naturels)
creerComposantLegumes()
creerComposantFeculents()
creerComposantDessert()

// Créer repas complets
creerRepas1Template(proteine, legumes, feculents, salade?, dessert?)
creerRepas2Template(proteine, legumes, legumineuses, soupe?)

// Créer menu complet
creerMenuV31Template({...})
```

---

## 🔧 Protocole de Jeûne (Advanced)

### 📍 Localisation
- **Utilitaires** : `/lib/utils/fasting-protocol.ts`
- **Affichage** : `/app/profil/page.tsx` (lignes 538-871)

### 🗓️ Cycle de 4 semaines

```typescript
{
  actif: boolean;
  semaine_jeune: "S1" | "S2" | "S3" | "S4";
  duree_jours: 3 | 4;
  date_debut_cycle?: Date;
  date_debut_jeune?: Date;
  etat_actuel: "INACTIF" | "EN_JEUNE" | "REALIMENTATION";
}
```

### 📊 Protocole

```
S1 (Jours 1-7):   Test sport + Nutrition normale
S2 (Jours 8-14):  Jeûne 3-4 jours + Réalimentation 5-7 jours
S3 (Jours 15-21): Suite réalimentation
S4 (Jours 22-28): Deload sport (-40%) + Nutrition
```

### 🚫 Pendant le Jeûne
- **Autorisé** : Eau, sel, thé, café, EPAX, créatine, vitamines (SANS Berbérine)
- **INTERDIT** : Toute nourriture, sport (risque hypoglycémie)
- **Lipides** : 0g

### 🍽️ Réalimentation Progressive

```typescript
J+1: 400 kcal, 0g lipides, MCT interdit
J+2: 700 kcal, 0g lipides, MCT interdit
J+3: 1000 kcal, 10g lipides (MCT autorisé)
J+4: 1400 kcal, 15g lipides
J+5+: Normal selon profil
```

---

## 🎨 Interface Utilisateur

### 📂 Pages Principales

```
/                           → Dashboard
/profil                     → Configuration profil utilisateur
/aliments                   → Ingrédients CIQUAL (NEW, remplace /ingredients)
/recettes                   → Liste des recettes (NEW Phase 11.2)
/recettes/[id]              → Détail d'une recette (NEW Phase 11.2)
/menus                      → Liste des menus (v3.1)
/menus/[id]                 → Détail d'un menu
/menus/generer              → Gestion des menus (affiche profil)
/menus/generer/auto         → Génération automatique
/menus/generer/personnalise → Génération personnalisée
/menus/generer/frigo        → Génération selon frigo
/planning-hebdomadaire      → Planning de la semaine
/courses                    → Liste de courses
/journal                    → Journal alimentaire
/analyses                   → Analyses nutritionnelles
/sport                      → Suivi sportif
/rendez-vous                → Rendez-vous médicaux
```

### 🎨 Composants UI

- **Layout** : `/components/layout/MainLayout.tsx`, `Sidebar.tsx`, `Header.tsx`
- **Ingrédients** : `/components/ingredients/IngredientCard.tsx`, `IngredientFilters.tsx`, `AddIngredientModal.tsx`
- **UI Primitives** : `/components/ui/` (shadcn/ui)

---

## ⚠️ Problèmes Identifiés & À Faire

### 🔴 URGENT : Recettes incompatibles avec profil strict

**Problème** :
- Utilisateur : TG = 14 → Limite = 10g lipides/jour
- Recettes actuelles : 12-13g lipides par recette
- **Conséquence** : Impossible d'utiliser 2 recettes/jour sans dépasser

**Solution nécessaire** :
1. Créer nouvelles recettes ultra-strict (5-6g lipides max par recette)
2. Adapter automatiquement recettes au profil
3. Filtrer recettes incompatibles

### 📋 TODO Phase 2 : Adaptation Recettes au Profil

```typescript
// À implémenter dans /app/recettes/page.tsx

function AdaptedRecipeDisplay() {
  const { profile } = useProfile();

  // Adapter CHAQUE recette affichée
  const adaptedRecipes = recipes.map(recipe => {
    // Calculer ratio pour respecter limite lipides
    const limite = profile.valeurs_calculees.macros_quotidiens.lipides_g;
    const nb_repas = profile.nombre_repas;
    const lipides_par_repas = limite / nb_repas;

    // Si recette dépasse → adapter ou masquer
    if (recipe.nutrition.lipides_g > lipides_par_repas) {
      // Option 1: Réduire portions
      const ratio = lipides_par_repas / recipe.nutrition.lipides_g;
      return adapteRecipeToBMR(recipe, ratio * 1800, 1800);

      // Option 2: Masquer la recette
      return null;
    }

    return recipe;
  }).filter(Boolean);
}
```

### 📋 TODO Phase 3 : Nouvelles Recettes Ultra-Strict

Créer 10-15 recettes pour TG critique (10g/jour) :

**REPAS 1 (6g lipides max)** :
- Cabillaud vapeur + lentilles + légumes (5g)
- Blanc de poulet + quinoa + brocolis (5g)
- Dinde MCT + riz basmati + carottes (6g)

**REPAS 2 (4g lipides max)** :
- Soupe légumes + colin + pois chiches (3g)
- Velouté + poulet + lentilles corail (4g)

---

## 📖 Documentation Technique

### 🔧 Technologies
- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **UI** : shadcn/ui + Tailwind CSS
- **Storage** : localStorage (profil) + IndexedDB (ingrédients CIQUAL)
- **Validation** : Zod (si utilisé)

### 📦 Structure Projet

```
/app                 → Pages Next.js (App Router)
/components          → Composants React réutilisables
/hooks               → Custom React Hooks
/lib                 → Utilitaires et fonctions
  /db                → Base de données (IndexedDB)
  /utils             → Fonctions utilitaires
/types               → Types TypeScript
/data                → Données statiques (CSV, JSON)
/docs                → Documentation
/public              → Assets statiques
```

### 🎯 Bonnes Pratiques

1. **Profil = Source de Vérité** : Toujours charger le profil avec `useProfile()`
2. **Validation Stricte** : Vérifier les limites lipidiques AVANT affichage
3. **Adaptation Automatique** : Ne jamais afficher de valeurs non adaptées au profil
4. **Pas d'Alertes** : Filtrer en amont, ne pas proposer l'impossible
5. **BMR Prioritaire** : Respecter le BMR manuel si fourni

---

## 🚀 Session Suivante : Points Clés

### ✅ Ce qui existe déjà

- ✅ Système de profil complet avec TG → Lipides
- ✅ Calculs automatiques (BMR, macros, zones cardio)
- ✅ Base CIQUAL (3200 aliments)
- ✅ Système de recettes (types, validation, recherche)
- ✅ 4 recettes d'exemple (mais trop riches en lipides)
- ✅ Protocole de jeûne avancé

### ⚠️ Ce qui manque

- ❌ Adaptation automatique des recettes au profil
- ❌ Affichage des quantités adaptées
- ❌ Filtrage des recettes incompatibles
- ❌ Recettes ultra-strict (10g lipides/jour)
- ❌ Intégration recettes → planning hebdomadaire

### 🎯 Objectifs Prioritaires

1. **Adapter l'affichage** des recettes au profil (Phase 2)
2. **Créer 10-15 nouvelles recettes** ultra-strict (Phase 3)
3. **Intégrer** dans le générateur de menus

---

**FIN DU DOCUMENT D'INVENTAIRE**
*Ce document doit être lu en priorité lors de chaque nouvelle session de travail*
