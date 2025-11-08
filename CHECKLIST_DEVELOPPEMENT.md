# ✅ CHECKLIST DÉVELOPPEMENT - Application Nutrition & Santé

## 🎯 PIVOT MAJEUR - Version 0.2.0 (Novembre 2025)

### 🔄 Nouvelle Architecture : Système basé sur CIQUAL + Recettes

**Problème identifié** : L'approche actuelle (menus figés avec calories fixes 2100 kcal) ne permet pas :
- ✗ Calculs nutritionnels précis
- ✗ Adaptation dynamique au profil utilisateur (lipides, allergènes, exclusions)
- ✗ Gestion des contraintes individuelles (chylomicronémie, diabète)
- ✗ Évolutivité (ajout de nouveaux menus/recettes)

**Nouvelle approche** :
- ✅ **Base CIQUAL complète** (~3000 aliments avec valeurs nutritionnelles pour 100g)
- ✅ **Recettes décortiquées** en ingrédients + quantités
- ✅ **Calculs dynamiques** selon profil utilisateur
- ✅ **Contraintes flexibles** (allergènes, exclusions, lipides max, etc.)
- ✅ **Import IA + Interface manuelle** pour ajouter recettes

---

## 📋 PLAN C : MIGRATION PROGRESSIVE (Hybride Intelligent)

### Pourquoi Plan C ?
- ✅ Préserve l'existant (18 menus dans `fiche_menu/`)
- ✅ Architecture propre dès le début (CIQUAL + Recettes)
- ✅ Migration progressive (pas de casse brutale)
- ✅ Testable immédiatement avec vraies données

---

## 🏗️ NOUVELLE ARCHITECTURE TECHNIQUE

### Structure Base de Données (IndexedDB v4)

```typescript
// Store 1: ingredients_ciqual
Ingredient {
  id: string                    // ID unique
  code_ciqual: string          // Code CIQUAL officiel
  nom_fr: string               // Nom français
  nom_en?: string              // Nom anglais (optionnel)
  groupe: string               // "Viandes", "Légumes", "Féculents", etc.
  sous_groupe?: string         // Détail groupe

  // Nutrition pour 100g (base CIQUAL)
  nutrition_100g: {
    energie_kcal: number
    proteines_g: number
    lipides_g: number
    glucides_g: number
    fibres_g: number
    eau_g?: number
    sucres_g?: number
    sel_g?: number
    // Micronutriments (optionnels)
    calcium_mg?: number
    fer_mg?: number
    vitamine_c_mg?: number
    // etc.
  }

  // Métadonnées chylomicronémie
  compatible_chylo: boolean
  index_glycemique?: number
  charge_glycemique?: number

  // Allergènes et exclusions
  allergenes: string[]         // ["gluten", "lactose", "fruits à coque"]
  regime_exclusions: string[]  // ["vegan", "vegetarien", "halal", "casher"]

  // Saisonnalité
  saisons: Saison[]            // ["Automne", "Hiver", "Printemps", "Été"]

  // Source et traçabilité
  source: "CIQUAL" | "MANUEL" | "IMPORT"
  date_ajout: Date
  date_modification: Date
}

// Store 2: recettes
Recette {
  id: string
  nom: string
  description?: string

  // Catégorisation
  type: "PLAT_PRINCIPAL" | "ENTREE" | "DESSERT" | "ACCOMPAGNEMENT" | "SOUPE"
  categorie_proteine: TypeProteine  // "Poulet", "Boeuf", "Poisson Maigre", etc.
  tags: string[]                     // ["IG bas", "Sans gluten", "Rapide", "Batch cooking"]

  // Composition
  ingredients: {
    ingredient_id: string      // Référence vers ingredients_ciqual
    quantite_g: number         // Quantité de base (pour 1 portion référence)
    notes?: string             // "poids cru", "sans peau", etc.
  }[]

  // Instructions
  instructions_cuisson: InstructionsCuisson[]
  temps_preparation_min?: number
  temps_cuisson_min?: number

  // Informations pratiques
  conservation?: InformationsConservation
  preparation_avance?: string[]
  variantes_express?: string[]

  // Nutrition calculée (pour quantités de base)
  portions_reference: number        // Ex: 1 portion
  nutrition_calculee: NutritionCalculee  // Calculé dynamiquement

  // Métadonnées
  source: "IMPORT_MD" | "MANUEL" | "IA"
  fichier_source?: string          // "Menu_Poulet_01_Classique.md"
  date_creation: Date
  date_modification: Date
}

// Store 3: menus_personnalises (nouveau format)
MenuPersonnalise {
  id: string
  utilisateur_id: string
  nom: string
  date_creation: Date

  // Composition
  repas: {
    nom: "REPAS 1" | "REPAS 2"
    heure: string
    recettes: {
      recette_id: string
      portions: number           // Adapté au profil utilisateur
    }[]
  }[]

  // Calculs dynamiques (recalculés à chaque affichage)
  nutrition_totale: NutritionCalculee
  respect_contraintes: {
    lipides_ok: boolean
    proteines_ok: boolean
    calories_ok: boolean
    allergenes_ok: boolean
    exclusions_ok: boolean
  }

  // Métadonnées
  statut: "BROUILLON" | "VALIDE" | "ARCHIVE"
}

// Store 4: contraintes_utilisateur (nouveau)
ContraintesUtilisateur {
  id: string
  utilisateur_id: string

  // Objectifs nutritionnels (depuis profil)
  objectif_calories: number
  objectif_proteines_g: number
  objectif_lipides_max_g: number
  objectif_glucides_g: number

  // Contraintes médicales
  pathologie_chylomicronemie: boolean
  niveau_triglycerides?: number
  diabete_type_2: boolean

  // Exclusions alimentaires
  allergenes_exclus: string[]       // ["gluten", "lactose", "arachide"]
  ingredients_exclus: string[]      // IDs d'ingrédients spécifiques
  categories_exclues: string[]      // ["Porc", "Crustacés"]

  // Préférences régime
  regime: "OMNIVORE" | "VEGETARIEN" | "VEGAN" | "PESCETARIEN" | "SANS_GLUTEN" | "HALAL" | "CASHER"
  preferences: string[]             // ["IG bas", "Sans lactose", "Bio"]

  date_modification: Date
}
```

---

## 🚀 PHASES DE DÉVELOPPEMENT (v0.2.0)

### ✅ PHASES COMPLÉTÉES (v0.1.0)

<details>
<summary>📦 Phase 1 : Setup & Infrastructure ✅</summary>

- [x] 1.1 Initialisation projet Next.js + Tailwind + shadcn/ui
- [x] 1.2 Configuration IndexedDB (wrapper + schéma + CRUD)
- [x] 1.3 Layout global (Sidebar + Header + Dark mode)
- [x] ✅ **Validation Phase 1** : App démarre, navigation OK, IndexedDB opérationnel
</details>

<details>
<summary>📊 Phase 2 : Base de Données Aliments ✅</summary>

- [x] 2.1 Types & modèles Aliment
- [x] 2.2 Parser Markdown (import .md Obsidian)
- [x] 2.3 Page liste aliments (grid + filtres + recherche)
- [x] 2.4 CRUD aliments (create, read, update, delete)
- [x] 2.5 Import/Export Markdown
- [x] ✅ **Validation Phase 2** : API corrigée, import fonctionnel, CRUD complet
</details>

<details>
<summary>👤 Phase 3 : Profil Utilisateur & Calculs ✅</summary>

- [x] 3.1 Page profil (formulaire complet)
- [x] 3.2 Calculs auto (IMC, macros, zones FC, limite lipidique adaptative)
- [x] 3.3 Assouplissement régime (limite lipidique 10-20g selon TG)
- [x] 3.4 Protocole de jeûne (cycle 4 semaines)
- [x] 3.5 Correction calculs protéines (séquestration splanchnique selon âge)
- [x] ✅ **Validation Phase 3** : Profil complet, calculs scientifiquement validés
</details>

<details>
<summary>🍽️ Phase 4 : Générateur de Menus (v0.1.0) ✅</summary>

- [x] 4.1 Logique génération basique
- [x] 4.2 Interface génération
- [x] 4.3 Export MD + liste courses
- [x] ✅ **Validation Phase 4** : Système fonctionnel mais limité (calories fixes)

**⚠️ NOTE** : Cette phase sera remplacée par Phase 11 (Système v0.2.0)
</details>

<details>
<summary>🛒 Phase 5 : Listes de Courses ✅</summary>

- [x] 5.1 Génération auto (hebdo/mensuel)
- [x] 5.2 Interface (checkboxes + impression)
- [x] 5.3 Système d'archivage
- [x] ✅ **Validation Phase 5** : Liste générée, archivage complet
</details>

---

### 🔄 PHASES EN COURS (v0.2.0) - REFONTE MAJEURE

### Phase 11 : Intégration CIQUAL & Nouvelle Architecture 🔄
**Durée estimée : 2-3h | Priorité : CRITIQUE ⭐⭐⭐⭐⭐**

#### Étape 1 : Base Ingrédients CIQUAL (45 min)
- [ ] 11.1.1 Télécharger table CIQUAL officielle (CSV)
  - Source : https://ciqual.anses.fr/
  - Format : CSV (~3000 aliments, ~60 colonnes nutritionnelles)
- [ ] 11.1.2 Script d'import CIQUAL → IndexedDB
  - Parser CSV
  - Nettoyer données (null, formats)
  - Mapper colonnes CIQUAL → structure Ingredient
  - Filtrer boissons (exclusion demandée)
- [ ] 11.1.3 Créer store `ingredients_ciqual` (IndexedDB v4)
  - Index par code_ciqual (unique)
  - Index par nom_fr (recherche)
  - Index par groupe (filtrage)
- [ ] 11.1.4 Interface recherche ingrédients
  - Barre recherche avec autocomplétion
  - Filtres par groupe (Viandes, Légumes, Féculents)
  - Affichage card avec nutrition pour 100g
  - Bouton "Voir détails"

**✅ Validation Étape 1** : CIQUAL importé, recherche fluide, 3000+ ingrédients disponibles

---

#### Étape 2 : Extraction Recettes depuis Menus Existants (60 min)
- [ ] 11.2.1 Parser amélioré pour extraction recettes
  - Analyser structure des 18 fichiers `fiche_menu/*.md`
  - Extraire sections ingrédients + quantités
  - Détecter composants (PROTÉINE, LÉGUMES, FÉCULENTS, etc.)
- [ ] 11.2.2 Mapping semi-automatique Ingrédients → CIQUAL
  - Algorithme matching fuzzy (nom similaire)
  - Interface validation manuelle
    - Ligne par ligne : "Poulet 200g" → Chercher dans CIQUAL
    - Proposer 3 meilleurs matches
    - Bouton "Valider" ou "Corriger"
  - Sauvegarder mappings pour réutilisation
- [ ] 11.2.3 Créer store `recettes` (IndexedDB v4)
  - Générer 1 recette par composant de menu
  - Ex: "Menu_Poulet_01" → 5 recettes (Salade, Poulet vapeur, Légumes, Lentilles, Dessert)
  - Lier ingrédients via `ingredient_id` (référence CIQUAL)
- [ ] 11.2.4 Interface "Convertir menus existants"
  - Page `/menus/import/convertir`
  - Upload .md ou sélection fichier local
  - Prévisualisation parsing
  - Étape mapping ingrédients
  - Validation et sauvegarde recettes

**✅ Validation Étape 2** : 18 menus convertis en ~90 recettes, ingrédients mappés CIQUAL

---

#### Étape 3 : Moteur de Calcul Nutritionnel (45 min)
- [ ] 11.3.1 Fonction `calculerNutritionRecette(recette, portions)`
  - Pour chaque ingrédient :
    - Récupérer nutrition_100g depuis CIQUAL
    - Calculer nutrition pour quantite_g
  - Sommer tous les ingrédients
  - Retourner NutritionCalculee
- [ ] 11.3.2 Fonction `adapterPortionsAuProfil(recette, profil)`
  - Récupérer objectifs utilisateur (calories, macros)
  - Calculer ratio portions nécessaire
  - Appliquer ratio à tous les ingrédients
  - Vérifier contraintes (lipides max, allergènes)
- [ ] 11.3.3 Créer store `contraintes_utilisateur`
  - Initialiser depuis profil existant
  - Ajouter exclusions/allergènes (UI à venir)
- [ ] 11.3.4 Fonction `verifierContraintes(menu, contraintes)`
  - Vérifier lipides <= lipides_max
  - Vérifier absence allergènes exclus
  - Vérifier absence ingrédients exclus
  - Retourner rapport (OK/KO avec détails)

**✅ Validation Étape 3** : Calculs précis, adaptation automatique au profil, contraintes respectées

---

#### Étape 4 : Nouvelle Interface Menus (30 min)
- [ ] 11.4.1 Refonte page `/menus/[id]`
  - Afficher recettes du menu
  - Pour chaque recette :
    - Liste ingrédients avec quantités ADAPTÉES au profil
    - Nutrition calculée dynamiquement
    - Warnings si contraintes non respectées
  - Totaux menu (calories, macros) en temps réel
- [ ] 11.4.2 Widget "Votre profil actuel"
  - Affichage objectifs (calories, protéines, lipides max)
  - Indicateur respect contraintes (✅/❌)
  - Bouton "Ajuster portions" (recalcule automatiquement)
- [ ] 11.4.3 Section "Ingrédients détaillés"
  - Tableau : Ingrédient | Quantité adaptée | Calories | P/L/G
  - Liens vers fiche CIQUAL complète
  - Export liste courses

**✅ Validation Étape 4** : Menu affiché dynamiquement, calculs en temps réel, UX claire

---

### Phase 12 : Templates & Interfaces d'Ajout 🔜
**Durée estimée : 2-3h | Priorité : HAUTE ⭐⭐⭐⭐**

#### Étape 1 : Template Markdown v2 pour IA (45 min)
- [ ] 12.1.1 Définir structure `.md` standardisée
  ```markdown
  ---
  nom: "Nom de la recette"
  type: "PLAT_PRINCIPAL"
  categorie_proteine: "Poulet"
  tags: ["IG bas", "Rapide"]
  portions_reference: 1
  ---

  # Nom de la recette

  ## Ingrédients (pour 1 portion)

  - [code_ciqual: 6254] Blanc de poulet sans peau : 200g (cru)
  - [code_ciqual: 20009] Lentilles vertes sèches : 60g
  - [code_ciqual: 20047] Tomates : 150g

  ## Instructions

  1. Cuire le poulet...
  2. ...

  ## Conservation

  - Frais : 2 jours
  - Congélation : 3 mois
  ```
- [ ] 12.1.2 Documentation template (fichier `TEMPLATE_RECETTE.md`)
- [ ] 12.1.3 Parser markdown → Recette
  - Extraire frontmatter
  - Parser ingrédients avec code_ciqual
  - Créer objet Recette
- [ ] 12.1.4 Page `/recettes/import`
  - Upload .md
  - Prévisualisation
  - Validation et sauvegarde

**✅ Validation Étape 1** : IA peut générer recettes au bon format, import fluide

---

#### Étape 2 : Interface Manuelle Ajout Recette (90 min)
- [ ] 12.2.1 Page `/recettes/nouvelle`
  - Formulaire nom, description, type, catégorie
  - Tags avec suggestions
- [ ] 12.2.2 Section "Ajouter ingrédients"
  - Recherche CIQUAL (autocomplétion)
  - Sélection ingrédient
  - Input quantité (g)
  - Bouton "Ajouter"
  - Liste ingrédients ajoutés (modifiable, supprimable)
  - Calcul nutrition en temps réel
- [ ] 12.2.3 Section "Instructions"
  - Éditeur markdown simple
  - Champs : temps préparation, temps cuisson
- [ ] 12.2.4 Section "Informations pratiques"
  - Conservation (jours frigo, mois congélateur)
  - Préparation à l'avance (optionnel)
  - Variantes express (optionnel)
- [ ] 12.2.5 Bouton "Sauvegarder recette"
  - Validation (au moins 1 ingrédient)
  - Calcul nutrition finale
  - Sauvegarde IndexedDB

**✅ Validation Étape 2** : Utilisateur peut créer recettes manuellement, interface intuitive

---

### Phase 13 : Gestion Contraintes & Allergènes 🔜
**Durée estimée : 1-2h | Priorité : HAUTE ⭐⭐⭐⭐**

- [ ] 13.1 Page `/profil/contraintes`
  - Section "Allergènes"
    - Liste checkboxes allergènes courants
    - Input custom (ajouter allergène)
  - Section "Ingrédients exclus"
    - Recherche CIQUAL
    - Ajouter à liste exclusions
    - Liste modifiable
  - Section "Catégories exclues"
    - Checkboxes (Porc, Crustacés, etc.)
  - Section "Régime alimentaire"
    - Radio buttons (Omnivore, Végétarien, Vegan, etc.)
- [ ] 13.2 Intégration contraintes dans calculs
  - Filtrer recettes selon contraintes
  - Warning si recette incompatible
  - Suggestions alternatives
- [ ] 13.3 Interface "Remplacer ingrédient"
  - Dans fiche recette
  - Bouton "Remplacer" à côté ingrédient
  - Proposer alternatives compatibles CIQUAL
  - Recalcul automatique nutrition

**✅ Validation Phase 13** : Contraintes respectées, alternatives proposées, UX personnalisée

---

### Phase 14 : Migration Complète & Polish 🔜
**Durée estimée : 1h | Priorité : MOYENNE ⭐⭐⭐**

- [ ] 14.1 Migration données v0.1.0 → v0.2.0
  - Script conversion anciens menus
  - Backup IndexedDB v3
  - Upgrade vers IndexedDB v4
- [ ] 14.2 Nettoyage code legacy
  - Supprimer ancien système menus (MenuV31 figés)
  - Supprimer parsers obsolètes
  - Mise à jour types TypeScript
- [ ] 14.3 Documentation utilisateur
  - Guide "Ajouter une recette"
  - Guide "Importer depuis IA"
  - Guide "Gérer contraintes"
- [ ] 14.4 Tests complets
  - Calculs nutritionnels (précision)
  - Respect contraintes (edge cases)
  - Performance (3000+ ingrédients)

**✅ Validation Phase 14** : Migration complète, app stable, documentation à jour

---

## 🎯 PRIORITÉS v0.2.0

| Fonctionnalité | Priorité | Phase | Statut |
|----------------|----------|-------|--------|
| Base CIQUAL | 5 ⭐⭐⭐⭐⭐ | Phase 11.1 | 🔜 TODO |
| Extraction recettes | 5 ⭐⭐⭐⭐⭐ | Phase 11.2 | 🔜 TODO |
| Moteur calcul | 5 ⭐⭐⭐⭐⭐ | Phase 11.3 | 🔜 TODO |
| Interface menus v2 | 5 ⭐⭐⭐⭐⭐ | Phase 11.4 | 🔜 TODO |
| Template IA | 4 ⭐⭐⭐⭐ | Phase 12.1 | 🔜 TODO |
| Interface manuelle | 4 ⭐⭐⭐⭐ | Phase 12.2 | 🔜 TODO |
| Gestion contraintes | 4 ⭐⭐⭐⭐ | Phase 13 | 🔜 TODO |
| Migration & Polish | 3 ⭐⭐⭐ | Phase 14 | 🔜 TODO |

---

## 📊 AVANCEMENT GLOBAL

```
Version 0.1.0 (Phases 1-5) : [██████████████████████████████] 100% ✅
Version 0.2.0 (Phases 11-14) : [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% 🔜

Phase actuelle : Phase 11 - Intégration CIQUAL
Prochaine session : Étape 11.1 - Import table CIQUAL
Temps estimé restant : 6-10h de développement
```

---

## 🗂️ STRUCTURE FICHIERS & DOSSIERS

### Dossiers principaux
```
/app                    # Pages Next.js
  /recettes            # Nouveau : CRUD recettes
  /ingredients         # Nouveau : Recherche CIQUAL
  /menus               # Refonte complète
/lib
  /db
    indexedDB-v4.ts    # Nouvelle version avec stores v0.2.0
  /parsers
    ciqual-parser.ts   # Nouveau : Import CSV CIQUAL
    recette-parser.ts  # Nouveau : Parse MD → Recette
  /utils
    calcul-nutrition.ts  # Nouveau : Moteur calculs
/types
  ingredient.ts        # Nouveau : Type Ingredient CIQUAL
  recette.ts          # Nouveau : Type Recette
  contraintes.ts      # Nouveau : Type Contraintes
/fiche_menu           # Menus existants (à convertir)
/public
  TEMPLATE_RECETTE.md  # Nouveau : Template pour IA
```

---

## 🔧 COMMANDES UTILES

```bash
# Démarrer le développement
npm run dev

# Build production
npm run build

# Vérifier TypeScript
npm run type-check

# Import CIQUAL (script custom à créer)
npm run import:ciqual

# Migration v0.1.0 → v0.2.0 (script custom à créer)
npm run migrate:v0.2.0
```

---

## 📝 NOTES TECHNIQUES

### Base de Données : IndexedDB v4

**Stores** :
1. `profil` (existant, v0.1.0) ✅
2. `aliments` (existant, v0.1.0) ✅
3. `menus_legacy` (ancien système, à migrer) ⚠️
4. `courses` (existant, v0.1.0) ✅
5. `plannings_hebdomadaires` (existant, v0.1.0) ✅
6. **`ingredients_ciqual`** (nouveau, v0.2.0) 🆕
7. **`recettes`** (nouveau, v0.2.0) 🆕
8. **`menus_personnalises`** (nouveau, v0.2.0) 🆕
9. **`contraintes_utilisateur`** (nouveau, v0.2.0) 🆕

### Table CIQUAL

- **Source officielle** : https://ciqual.anses.fr/
- **Format** : CSV, ~3000 aliments
- **Colonnes pertinentes** :
  - Énergie (kcal)
  - Protéines (g)
  - Lipides (g)
  - Glucides (g)
  - Fibres (g)
  - Sucres (g)
  - Sel (g)
  - Micronutriments (fer, calcium, vitamines, etc.)
- **Exclusions** : Boissons (alcool, sodas, jus) - non pertinent pour menus

### Calculs Nutritionnels

**Formule de base** :
```typescript
// Pour 1 ingrédient
nutrition_ingredient = (nutrition_100g * quantite_g) / 100

// Pour 1 recette
nutrition_recette = Σ(nutrition_ingredient) pour tous les ingrédients

// Pour 1 menu
nutrition_menu = Σ(nutrition_recette) pour toutes les recettes
```

**Adaptation au profil** :
```typescript
// Ratio portions selon objectif calories
ratio_portions = objectif_calories_utilisateur / calories_menu_base

// Nouvelles quantités
quantite_adaptee = quantite_base * ratio_portions

// Vérification contraintes
lipides_menu <= lipides_max_utilisateur
allergenes_menu ∩ allergenes_exclus = ∅
ingredients_menu ∩ ingredients_exclus = ∅
```

---

## 🐛 PROBLÈMES CONNUS

### v0.1.0 (à corriger dans v0.2.0)
- ❌ Menus figés avec 2100 kcal (pas d'adaptation réelle)
- ❌ Pas de calculs nutritionnels précis
- ❌ Impossible de gérer allergènes/exclusions
- ❌ Structure non évolutive

### v0.2.0 (en cours)
- _Aucun problème pour l'instant (architecture à implémenter)_

---

## ✨ AMÉLIORATIONS FUTURES (v0.3.0+)

- [ ] Export/Import recettes (partage communauté)
- [ ] Suggestions IA personnalisées
- [ ] Scanner code-barres (ajout ingrédients)
- [ ] Photos recettes
- [ ] Système de notation/avis
- [ ] Planning mensuel intelligent
- [ ] Intégration autres bases (Open Food Facts)
- [ ] Version PWA (offline-first)
- [ ] Sync cloud (backup)
- [ ] Version coach/nutritionniste (multi-utilisateurs)

---

## 🔄 CHANGELOG

### 2025-11-08 (Session actuelle) - PIVOT MAJEUR v0.2.0 🚀
- 🎯 **Décision architecture** : Migration vers système CIQUAL + Recettes
- 📋 **Plan C adopté** : Migration progressive (hybride intelligent)
- 📚 **Documentation** : Refonte complète CHECKLIST_DEVELOPPEMENT.md
- 🏗️ **Architecture définie** : 4 nouveaux stores IndexedDB
- 🗺️ **Roadmap détaillée** : Phases 11-14 planifiées
- 🔜 **Prochaine étape** : Phase 11.1 - Import CIQUAL

### 2025-11-08 (Session précédente) - Enrichissement menus v0.1.0
- ✨ Enrichissement complet fiches menu (Phase 1-3)
- 🧹 Suppression 15 fiches aliment dupliquées (racine projet)
- 📚 Documentation workflow Git simplifié
- 🐛 Correction bug catégorisation menus (Poulet/Boeuf/Poisson)
- 🎨 UI/UX refondue avec onglets (Vue ensemble, Recette, Nutrition, Infos pratiques)
- 🔧 Parser enrichi (instructions cuisson, conservation, critères achat, BMR)
- 📦 Composants ajoutés (tabs, alert, collapsible)

### 2025-11-06 (Session 4) - SÉQUESTRATION SPLANCHNIQUE ⚠️ CRITIQUE
- 🔬 Recherche scientifique : Séquestration splanchnique validée (3 sources 2024)
- ✅ Correction MAJEURE calculs protéines avec coefficient d'âge
  - < 50 ans: ×1.0 | 50-64 ans: ×1.15 | 65-74 ans: ×1.25 | 75+ ans: ×1.30
- 💡 Évite fonte musculaire (sarcopénie) en compensant perte métabolique

### 2025-11-06 (Session 3) - Corrections suite retours utilisateur
- ✅ Correction calculs protéines (1.6-2.0 g/kg selon objectif)
- ✅ Navigation améliorée (bouton "Générer menus")
- ✅ Affichage détaillé proportions dans menus
- ✅ Page liste courses interactive (/courses)

### 2025-11-06 (Session 2)
- ✅ Phase 4 COMPLÈTE : Générateur de menus (100%)
- ✅ Export Markdown + liste courses automatique

### 2025-11-06 (Session 1)
- ✅ Phases 1-3 complètes
- 🚀 Phase 4 démarrée (60%)

---

**Dernière mise à jour** : 2025-11-08
**Version actuelle** : 0.2.0-alpha (refonte architecture)
**Prochaine milestone** : Phase 11 - Intégration CIQUAL

---

## 📞 CONTACT & CONTRIBUTION

Pour toute question ou suggestion sur l'architecture v0.2.0 :
- Ouvrir une issue GitHub
- Consulter la documentation technique
- Participer aux discussions sur la roadmap

---

**🎯 OBJECTIF v0.2.0** : Système de nutrition personnalisé avec calculs précis, gestion contraintes médicales, et interface intuitive pour créer/adapter recettes selon profil individuel.
