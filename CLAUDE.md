# CLAUDE.md - AI Assistant Guide

**Last Updated**: 2025-11-14
**Repository**: Chilomicronenie Meal Planner
**Status**: Planning & Documentation Phase
**Primary Language**: French

---

## Project Overview

This repository contains comprehensive planning documentation for a **medical nutrition management application** focused on **chylomicronemia** (severe hypertriglyceridemia) and related metabolic conditions. The project is currently in the documentation/planning phase with no code implementation yet.

### Core Purpose

Design and build a Next.js web application to help manage:
- Chylomicronemia (triglycerides >11.3 mmol/L - critical condition)
- Type 2 Diabetes
- Metabolic Syndrome
- Obesity management with strict dietary protocols

### Critical Context

**THIS IS MEDICAL SOFTWARE** - The dietary restrictions are STRICT and potentially life-saving:
- **Lipids**: Maximum 20-35g/day (critical for chylomicronemia)
- **Low Glycemic Index**: Required for diabetes management
- **High Protein**: 1.6-2.0g/kg body weight
- **Fiber**: Minimum 35g/day

**NEVER suggest relaxing these constraints without explicit medical reasoning.**

---

## Repository Structure

```
Chilomicronenie_meal_planner/
├── ARCHITECTURE_TECHNIQUE.md    # Detailed technical architecture (Next.js app)
├── CHECKLIST_DEVELOPPEMENT.md   # Development roadmap (10 phases)
├── DONNEES_EXEMPLE.md           # Sample data structures and examples
│
├── fiche_aliment/               # Food item database (markdown files)
│   ├── Ail.md                  # Example: Garlic nutritional info
│   ├── Betterave.md            # Beet
│   ├── Merlan.md               # Whiting fish
│   ├── Patate_Douce.md         # Sweet potato
│   └── [~15+ food items]
│
├── menu/                        # Meal plan templates
│   ├── Menu_Poulet_01_Classique.md        # Chicken menu #1
│   ├── Menu_Boeuf_02_Braise.md            # Beef menu #2
│   ├── Menu_Poisson_Gras_01_Saumon.md     # Salmon menu
│   ├── 12_Soupes_Saisonnieres.md          # Seasonal soups
│   └── [~15+ menu variations]
│
└── [Root level duplicate files]  # Same food items (to be cleaned)
```

### Important Notes

1. **Duplicate Files**: Food items exist both in root AND in `fiche_aliment/` directory
2. **Language**: All content is in French
3. **No Code Yet**: This is 100% documentation/planning phase
4. **YAML Frontmatter**: All markdown files use YAML frontmatter for structured data

---

## File Format Conventions

### Food Item Files (fiche_aliment/*.md)

**Structure**:
```markdown
---
nom: "Ail"
categorie: "Aromate"
saison: "Toute année"
compatible_chylomicronemie: "EXCELLENT"
index_glycemique: "30"
lipides_100g: "0.5g"
---

# 🧄 AIL

> **Catégorie** : Aromate / Condiment
> **Compatibilité chylomicronémie** : 🟢 EXCELLENT ⭐⭐⭐

## 📊 VALEURS NUTRITIONNELLES (pour 100g CRU)
[Table with Énergie, Protéines, Glucides, Lipides, Fibres]

## 🎯 INDEX GLYCÉMIQUE
[GI value and category]

## ⚕️ COMPATIBILITÉ CHYLOMICRONÉMIE
[Rating: EXCELLENT/BON/MODERE/DECONSEILLE]

## 💊 MICRONUTRIMENTS & COMPOSÉS BIOACTIFS
[Key vitamins, minerals, bioactive compounds]

## 🍳 UTILISATION
[Usage amounts, preparations, cooking tips]

## 💡 CONSEILS
[Storage, digestibility, practical tips]
```

**Key Fields**:
- `nom`: Food name
- `categorie`: Category (Aromate, Poisson gras, Légume, etc.)
- `saison`: Season availability
- `compatible_chylomicronemie`: EXCELLENT/BON/MODERE/DECONSEILLE
- `index_glycemique`: Glycemic index value (string)
- `lipides_100g`: Lipids per 100g (critical for filtering)

### Menu Files (menu/*.md)

**Structure**:
```markdown
---
nom: "Menu Poulet Classique"
type_proteine: "Poulet"
numero: 1
lipides_totaux: "18-22g"
ig_moyen: "Bas (<50)"
variantes_saison: 4
adaptatif_bmr: true
---

# 🍗 Menu Poulet 01 - Classique

> ⚠️ **IMPORTANT** : Ce menu s'adapte automatiquement à votre BMR actuel

## 📊 Informations nutritionnelles CIBLES
[Table with meals, calories, macros]

## 🍽️ REPAS 1 - 11h00 (1200 kcal)
### 🥗 ENTRÉE
### 🍗 PROTÉINE
### 🥦 LÉGUMES
### 🍚 FÉCULENTS
### 🍨 DESSERT

## 🥣 REPAS 2 - 17h00 (900 kcal)
[Same structure]

## 📊 RÉCAPITULATIF NUTRITIONNEL JOURNÉE
[Summary table]

## ⚠️ POINTS CRITIQUES - CHYLOMICRONÉMIE
[Critical warnings and validations]

## 🔄 ADAPTATION AU BMR ACTUEL
[BMR adjustment formulas]
```

**Key Fields**:
- `lipides_totaux`: Total daily lipids (MUST be ≤35g)
- `adaptatif_bmr`: Whether menu adjusts to BMR changes
- `ig_moyen`: Average glycemic index
- `variantes_saison`: Number of seasonal variations

---

## Core Domain Concepts

### 1. Pathologies (Medical Conditions)

```typescript
type Pathologie =
  | "chylomicronemie"          // Primary condition - CRITICAL
  | "diabete_type2"            // Type 2 Diabetes
  | "syndrome_metabolique"     // Metabolic Syndrome
  | "steatose_hepatique"       // Fatty liver
  | "pancreatite_chronique"    // Chronic pancreatitis
```

### 2. Compatibility Levels

```typescript
type CompatibilityLevel = {
  niveau: "EXCELLENT" | "BON" | "MODERE" | "DECONSEILLE";
  etoiles: 0 | 1 | 2 | 3;  // Star rating
  emoji: "🟢" | "🟡" | "🔴";
}
```

**Filtering Rules for Chylomicronemia**:
- **EXCELLENT** (⭐⭐⭐): Use freely, prioritize
- **BON** (⭐⭐): Use regularly
- **MODERE** (⭐): Limited quantities only (requires "assouplissement" >10%)
- **DECONSEILLE**: NEVER use (blocks menu generation)

### 3. Glycemic Index Categories

```typescript
type IndexGlycemique = {
  valeur: number;           // 0-100
  categorie: "BAS" | "MOYEN" | "ELEVE";
}

// Categories:
// BAS: < 55      (✅ Prioritize)
// MOYEN: 55-69   (⚠️ Moderate use)
// ELEVE: > 70    (❌ Avoid for diabetes)
```

### 4. Nutritional Targets

**For 106kg male, chylomicronemia profile**:
```typescript
{
  kcal_jour: 2200,
  proteines_g: 170,      // 1.6g/kg
  lipides_g: 30,         // STRICT LIMIT (20-35g)
  glucides_g: 220,       // Remainder after P+L
  fibres_g: 35           // Minimum
}
```

### 5. BMR Calculations

**Mifflin-St Jeor Formula**:
```typescript
// Men:
MBR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5

// Women:
MBR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161

// DET (Daily Energy Expenditure):
DET = MBR × activity_factor  // 1.2 - 1.9
```

### 6. Progressive Regime Relaxation

```typescript
// Based on triglyceride levels
if (TG_mmol >= 11.3) assouplissement = 0%;   // STRICT mode
if (TG_mmol < 11.3)  assouplissement = 10%;  // Slight relaxation
if (TG_mmol < 8.0)   assouplissement = 20%;
if (TG_mmol < 4.0)   assouplissement = 30%;
if (TG_mmol < 1.7)   assouplissement = 50%;  // Normal range

// Affects food filtering:
// 0%: Only EXCELLENT + BON
// 10-30%: + MODERE in small quantities
// 50%+: + MODERE without limits
// DECONSEILLE always excluded
```

---

## Planned Tech Stack

**Frontend**: Next.js 14 (App Router)
**UI**: Tailwind CSS + shadcn/ui
**Database**: IndexedDB (client-side, local-first)
**State**: React Context + Zustand (optional)
**Charts**: Recharts
**Parsing**: gray-matter + marked (for markdown import)

### Directory Structure (Future Implementation)

```
nutrition-app/
├── app/                    # Next.js App Router
│   ├── aliments/          # Food database UI
│   ├── menus/             # Menu generator & management
│   ├── sport/             # 24-week exercise program
│   ├── journal/           # Daily tracking
│   ├── analyses/          # Blood test tracking
│   └── profil/            # User profile
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── aliments/         # Food-related components
│   ├── menus/            # Menu components
│   └── ...
│
├── lib/                   # Business logic
│   ├── db/               # IndexedDB wrapper
│   ├── calculations/     # Macro calculations, zones
│   ├── generators/       # Menu/program generators
│   ├── parsers/          # Markdown import/export
│   ├── filters/          # Food filtering logic
│   └── validators/       # Data validation
│
└── types/                 # TypeScript types
```

---

## Development Workflow

### Current Phase: Phase 1 (Setup) - NOT STARTED

See `CHECKLIST_DEVELOPPEMENT.md` for full 10-phase roadmap:

1. **Phase 1**: Setup & Infrastructure
2. **Phase 2**: Food Database (import markdown → IndexedDB)
3. **Phase 3**: User Profile & Auto-calculations
4. **Phase 4**: Menu Generator (CRITICAL - complex algorithm)
5. **Phase 5**: Shopping Lists (auto-generated)
6. **Phase 6**: Exercise Program (24-week progression)
7. **Phase 7**: Daily Journal (weight, sleep, symptoms)
8. **Phase 8**: Medical Tracking (blood tests, biomarkers)
9. **Phase 9**: Appointments (low priority)
10. **Phase 10**: Polish & Optimization

### Git Workflow

- **Main branch**: Empty (initial commits only)
- **Feature branches**: Use `claude/` prefix as required
- **Commit style**: Analyze existing commits for patterns (currently simple "Add files" messages)

---

## Critical Implementation Rules

### 1. Lipid Budget Management

```typescript
// ALWAYS track lipids across all meal components
const lipideSources = {
  // Explicit sources (tracked carefully)
  huile_olive: 5g,
  huile_mct: 10g,

  // Inherent in protein sources (must account for)
  poulet_sans_peau_200g: 7.2g,
  saumon_200g: 24.6g,

  // Traces
  legumes_traces: 1-2g
};

// CRITICAL: Total MUST be ≤ 30-35g/day
// For chylomicronemia this is NON-NEGOTIABLE
```

### 2. Menu Generation Constraints

**Hard Constraints** (NEVER violate):
- ✅ Lipids ≤ 35g/day
- ✅ Only compatible foods (no DECONSEILLE)
- ✅ Protein ≥ target (1.6-2.0g/kg)
- ✅ Glycemic index: prioritize < 55

**Soft Constraints** (optimize for):
- Fish 3-4×/week (omega-3)
- Variety across days
- Seasonal preferences
- Fiber ≥ 35g

### 3. Macro Calculation Priority Order

```typescript
// ALWAYS calculate in this order:
1. PROTEIN  → Fixed first (1.6-2.0g/kg body weight)
2. LIPIDS   → Fixed by pathology (20-35g for chylo)
3. GLUCIDES → Remainder: (kcal_target - P_kcal - L_kcal) / 4

// NEVER calculate lipids last
// NEVER use percentages for lipids in chylomicronemia
```

### 4. Intermittent Fasting Protocol

**Monthly Fasting** (2nd week of each month):
```typescript
// J1-J4: Strict fast (vegan protein 40g, EAA, EPA)
// J5: Gentle refeeding (600 kcal, 1 meal)
// J6-J10: Progressive return (900-1800 kcal)
// J11+: Normal intake (2200 kcal)

// IMPORTANT: STOP berberine during fast
// IMPORTANT: Maintain 2-3L hydration + electrolytes
```

### 5. Biomarker Thresholds

```typescript
const SEUILS_CRITIQUES = {
  triglycerides_mmol: {
    normal: 1.7,
    elevated: 2.3,
    high: 5.6,
    very_high: 11.3,    // ⚠️ Pancreatitis risk
    critical: 23.53     // Actual user peak (July 2025)
  },

  hba1c_percentage: {
    normal: 5.7,
    prediabetes: 6.4,
    diabetes: 6.5
  },

  homa: {
    optimal: 1.0,
    normal: 2.259,
    moderate: 3.0,
    elevated: 3.517      // Current user value
  }
};
```

---

## AI Assistant Instructions

### When Working on This Repository

1. **Read First**:
   - `ARCHITECTURE_TECHNIQUE.md` - Complete technical vision
   - `CHECKLIST_DEVELOPPEMENT.md` - Current phase and tasks
   - `DONNEES_EXEMPLE.md` - Data structures and examples

2. **Language**:
   - User-facing content: **French only**
   - Code comments: French preferred, English acceptable
   - Variable names: English (camelCase/PascalCase)
   - Documentation: Match existing language (mostly French)

3. **Medical Sensitivity**:
   - NEVER suggest shortcuts that compromise dietary restrictions
   - ALWAYS validate lipid totals in menus
   - ALWAYS check glycemic index of carb sources
   - ASK before making any assumption about relaxing constraints

4. **Data Integrity**:
   - Food items: Validate lipid content per 100g
   - Menus: Verify daily lipid totals ≤ 35g
   - GI values: Cross-reference with medical sources
   - Portions: Always distinguish SEC (dry) vs CUIT (cooked)

5. **Code Style** (when implementation starts):
   - TypeScript strict mode
   - Functional components (React)
   - Custom hooks for business logic
   - shadcn/ui for all UI components
   - Tailwind for styling (no custom CSS)

### Common Tasks

#### Adding a New Food Item

```markdown
1. Create file: fiche_aliment/[Nom_Aliment].md
2. Use YAML frontmatter (see Ail.md as template)
3. Include all sections:
   - Valeurs nutritionnelles
   - Index glycémique
   - Compatibilité pathologies
   - Micronutriments
   - Utilisation pratique
4. CRITICAL: Verify lipides_100g is accurate
5. Verify compatibility rating is medically sound
```

#### Creating a New Menu

```markdown
1. Create file: menu/Menu_[Proteine]_[Numero]_[Nom].md
2. Use YAML frontmatter (see Menu_Poulet_01 as template)
3. Calculate ALL macros precisely
4. Verify lipides_totaux ≤ 35g
5. Include seasonal variations (4 seasons)
6. Add BMR adaptation formula
7. Include récapitulatif nutritionnel
8. Add POINTS CRITIQUES section with validations
```

#### Modifying Nutritional Targets

```markdown
⚠️ CAUTION: This affects medical safety

1. Check user profile in DONNEES_EXEMPLE.md
2. Recalculate using Mifflin-St Jeor formula
3. ALWAYS maintain lipid constraints
4. Update protein based on current weight
5. Glucides = remainder (calculated last)
6. Document reasoning in commit message
```

---

## Testing Considerations (Future)

### Critical Test Cases

1. **Lipid Budget**:
   - Generate 100 menus → all must be ≤ 35g lipids
   - Test edge cases (salmon + avocado = high risk)

2. **Macro Calculations**:
   - Test BMR formula accuracy
   - Verify macro distribution order (P → L → G)
   - Test adaptation to weight changes

3. **Food Filtering**:
   - Chylomicronemia: exclude DECONSEILLE
   - Respect assouplissement levels (0%, 10%, 30%, 50%)
   - Seasonal filtering

4. **Markdown Parsing**:
   - Import all 120+ food items without errors
   - Preserve YAML frontmatter
   - Handle special characters (French accents)

---

## Known Issues & Cleanup Needed

### Current Repository Issues

1. **Duplicate Files**:
   - Food items exist in BOTH root and `fiche_aliment/`
   - Decision needed: Keep only in `fiche_aliment/`?

2. **Minimal Git History**:
   - Recent commits are generic "Add files via upload"
   - Future: Use descriptive commit messages

3. **No Code Yet**:
   - This is 100% planning/documentation phase
   - No package.json, no dependencies, no actual app

4. **Readme Files**:
   - `fiche_aliment/Readme.md` and `menu/Readme.md` are placeholders
   - Should document folder purposes

### Future Cleanup Tasks

```markdown
- [ ] Remove duplicate food item files from root
- [ ] Create proper README.md for repository
- [ ] Add .gitignore (when code starts)
- [ ] Organize documentation into docs/ folder
- [ ] Create CONTRIBUTING.md
- [ ] Add LICENSE file
```

---

## Key Algorithms (Future Implementation)

### Menu Generation Algorithm

```typescript
/**
 * Menu generation is COMPLEX - requires constraint satisfaction
 *
 * Inputs:
 * - User profile (pathologies, macros, assouplissement)
 * - Available foods (filtered by compatibility)
 * - Meal structure (2-3 meals/day, fenêtre alimentaire)
 *
 * Algorithm:
 * 1. Filter foods by pathology compatibility
 * 2. Filter by season (if enabled)
 * 3. Filter by assouplissement level
 * 4. For each meal:
 *    a. Select protein source (prioritize lean)
 *    b. Calculate lipids from protein
 *    c. Select vegetables (prioritize low-GI)
 *    d. Select carb source (GI < 55, fill remaining kcal)
 *    e. Verify meal doesn't exceed lipid budget
 * 5. Verify daily totals:
 *    - Lipids ≤ 35g (HARD constraint)
 *    - Protein ≥ target (HARD constraint)
 *    - Kcal within ±5% (SOFT constraint)
 * 6. If constraints violated: backtrack and retry
 * 7. Optimize for diversity and soft constraints
 *
 * Edge cases:
 * - Salmon (high lipid protein): adjust rest of day
 * - Small lipid budget remaining: choose pure protein
 * - High protein requirement: may need protein powder
 */
```

---

## Resources & References

### Medical References

- **Triglycerides Thresholds**: Based on ESC/EAS guidelines
- **Chylomicronemia Diet**: <5g lipids/100g foods
- **Glycemic Index**: International GI Database (University of Sydney)
- **Protein Requirements**: ISSN Position Stand on Protein (1.6-2.0g/kg)

### Technical References

- **Next.js App Router**: https://nextjs.org/docs/app
- **shadcn/ui**: https://ui.shadcn.com/
- **IndexedDB**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **Recharts**: https://recharts.org/

---

## Glossary

**French → English Terms**:

- `Aliment` → Food item
- `Fiche aliment` → Food data sheet
- `Aromate` → Herb/aromatic
- `Féculent` → Starchy food (rice, pasta, legumes)
- `Légumineuse` → Legume (lentils, beans)
- `IG` (Index Glycémique) → GI (Glycemic Index)
- `BMR` (Métabolisme de Base) → BMR (Basal Metabolic Rate)
- `DET` (Dépense Énergétique Totale) → TDEE (Total Daily Energy Expenditure)
- `Macros` → Macronutrients (protéines, lipides, glucides)
- `Assouplissement` → Relaxation/flexibility (of dietary restrictions)
- `Compatibilité` → Compatibility (food with pathology)
- `Valeurs nutritionnelles` → Nutritional values
- `Cuisson` → Cooking
- `SEC` → Dry weight (uncooked)
- `CUIT` → Cooked weight

**Medical Terms**:

- `Chylomicronémie` → Chylomicronemia (severe hypertriglyceridemia)
- `Triglycérides` → Triglycerides (TG)
- `Pancréatite` → Pancreatitis
- `Stéatose hépatique` → Fatty liver disease (NAFLD)
- `Syndrome métabolique` → Metabolic syndrome
- `HbA1c` → Glycated hemoglobin (diabetes marker)
- `HOMA` → Homeostatic Model Assessment (insulin resistance)
- `Zone cardiaque` → Heart rate zone

---

## Quick Reference Commands

```bash
# View food items
ls -la fiche_aliment/

# View menus
ls -la menu/

# Count total food items
find fiche_aliment/ -name "*.md" ! -name "Readme.md" | wc -l

# Search for specific food
grep -r "Saumon" fiche_aliment/

# Find high-lipid foods (dangerous for chylomicronemia)
grep -r "lipides_100g.*[1-9][0-9]" fiche_aliment/

# View git history
git log --oneline

# Check repository status
git status
```

---

## Contact & Contribution

**Primary User Profile**: 56M, 106kg, chylomicronemia + diabetes type 2
**Medical Context**: Critical triglycerides (16.3 mmol/L as of Oct 2025)
**Goal**: Reduce TG to <1.7 mmol/L through strict nutrition + exercise

**When in doubt**:
1. ✅ Prioritize medical safety over convenience
2. ✅ Ask for clarification rather than assume
3. ✅ Verify nutritional data from reliable sources
4. ✅ Document all medical reasoning in comments

---

## Version History

- **v0.1.0** (2025-11-14): Initial CLAUDE.md creation
  - Documentation phase
  - No code implementation yet
  - ~30 food items documented
  - ~15 menu templates created

---

**This document will evolve as the project progresses. Keep it updated!**
