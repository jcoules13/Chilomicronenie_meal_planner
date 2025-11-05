# 🏛️ ARCHITECTURE TECHNIQUE - Application Nutrition & Santé

## 📐 VUE D'ENSEMBLE

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js + React)               │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐│
│  │   Components    │  │      Pages      │  │     UI      ││
│  │   (Business)    │  │   (App Router)  │  │  (shadcn)   ││
│  └─────────────────┘  └─────────────────┘  └─────────────┘│
│           │                    │                    │       │
│           └────────────────────┼────────────────────┘       │
│                                │                            │
│  ┌─────────────────────────────┴───────────────────────┐   │
│  │              LIB (Business Logic)                   │   │
│  │  • Calculations  • Generators  • Parsers  • Utils  │   │
│  └─────────────────────────────┬───────────────────────┘   │
│                                │                            │
│  ┌─────────────────────────────┴───────────────────────┐   │
│  │           DATA LAYER (IndexedDB + LocalStorage)     │   │
│  │  • Aliments  • Menus  • Journal  • Analyses         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ STRUCTURE DOSSIERS DÉTAILLÉE

```
nutrition-app/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout global (sidebar + header + dark mode)
│   ├── page.tsx                  # Dashboard principal
│   ├── globals.css               # Styles globaux Tailwind
│   │
│   ├── aliments/                 # Module Aliments
│   │   ├── page.tsx              # Liste + filtres
│   │   ├── [id]/
│   │   │   └── page.tsx          # Détail/édition
│   │   └── nouveau/
│   │       └── page.tsx          # Création nouvel aliment
│   │
│   ├── menus/                    # Module Menus
│   │   ├── page.tsx              # Liste menus
│   │   ├── generer/
│   │   │   └── page.tsx          # Générateur de menus
│   │   └── [id]/
│   │       └── page.tsx          # Détail/édition menu
│   │
│   ├── courses/                  # Module Listes de Courses
│   │   └── page.tsx              # Listes hebdo + mensuelle
│   │
│   ├── sport/                    # Module Programme Sportif
│   │   ├── page.tsx              # Vue programme 24 semaines
│   │   ├── semaine/
│   │   │   └── [numero]/
│   │   │       └── page.tsx      # Détail semaine
│   │   └── journal/
│   │       └── page.tsx          # Journal séances
│   │
│   ├── journal/                  # Module Journal Quotidien
│   │   └── page.tsx              # Formulaire + historique
│   │
│   ├── analyses/                 # Module Suivi Médical
│   │   ├── page.tsx              # Dashboard + graphiques
│   │   └── nouvelle/
│   │       └── page.tsx          # Saisie nouvelle analyse
│   │
│   ├── profil/                   # Module Profil Utilisateur
│   │   └── page.tsx              # Formulaire profil + paramètres
│   │
│   └── rendez-vous/              # Module RDV (priorité basse)
│       └── page.tsx              # Calendrier rendez-vous
│
├── components/                   # Composants React
│   │
│   ├── ui/                       # shadcn/ui components (générés)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── ... (autres composants shadcn)
│   │
│   ├── layout/                   # Composants layout
│   │   ├── Sidebar.tsx           # Navigation principale
│   │   ├── Header.tsx            # Header avec dark mode switch
│   │   └── DashboardCard.tsx     # Card générique dashboard
│   │
│   ├── aliments/                 # Composants module aliments
│   │   ├── AlimentCard.tsx       # Card affichage aliment
│   │   ├── AlimentForm.tsx       # Formulaire création/édition
│   │   ├── AlimentFilters.tsx    # Filtres recherche
│   │   └── AlimentBadge.tsx      # Badge compatibilité
│   │
│   ├── menus/                    # Composants module menus
│   │   ├── MenuCard.tsx          # Card menu
│   │   ├── MenuGenerator.tsx     # Interface générateur
│   │   ├── RepasEditor.tsx       # Éditeur repas (drag & drop)
│   │   └── RecapMacros.tsx       # Récapitulatif macros
│   │
│   ├── courses/                  # Composants listes de courses
│   │   ├── ListeCoursesCard.tsx  # Card liste
│   │   └── ItemCourse.tsx        # Item avec checkbox
│   │
│   ├── sport/                    # Composants module sport
│   │   ├── ProgrammeCalendar.tsx # Vue calendrier 24 semaines
│   │   ├── SemaineCard.tsx       # Card détail semaine
│   │   ├── SeanceCard.tsx        # Card séance
│   │   └── JournalForm.tsx       # Formulaire journal séance
│   │
│   ├── journal/                  # Composants journal quotidien
│   │   ├── JournalForm.tsx       # Formulaire saisie
│   │   └── JournalHistory.tsx    # Historique + graphiques
│   │
│   ├── analyses/                 # Composants analyses médicales
│   │   ├── AnalyseForm.tsx       # Formulaire saisie analyse
│   │   ├── BiomarkerCard.tsx     # Card biomarqueur
│   │   └── BiomarkerChart.tsx    # Graphique évolution
│   │
│   └── profil/                   # Composants profil
│       └── ProfilForm.tsx        # Formulaire profil complet
│
├── lib/                          # Logique métier & utilitaires
│   │
│   ├── db/                       # Gestion base de données
│   │   ├── indexedDB.ts          # Wrapper IndexedDB
│   │   ├── queries.ts            # Fonctions CRUD
│   │   └── schemas.ts            # Schémas stores
│   │
│   ├── calculations/             # Calculs métier
│   │   ├── macros.ts             # Calcul macros selon profil
│   │   ├── zones-cardiaques.ts   # Calcul zones FC
│   │   ├── imc.ts                # Calcul IMC
│   │   └── calories.ts           # Calcul DET, déficit, etc.
│   │
│   ├── generators/               # Générateurs
│   │   ├── menu-generator.ts     # Génération menus auto
│   │   ├── sport-generator.ts    # Génération programme sport
│   │   └── liste-courses.ts      # Génération listes courses
│   │
│   ├── parsers/                  # Parsers & exporters
│   │   ├── markdown-parser.ts    # Parse fichiers Obsidian .md
│   │   └── markdown-exporter.ts  # Export en .md
│   │
│   ├── filters/                  # Logique filtrage
│   │   ├── aliment-filters.ts    # Filtrage aliments selon pathologie
│   │   └── compatibility.ts      # Calcul compatibilité
│   │
│   ├── validators/               # Validation données
│   │   ├── aliment-validator.ts
│   │   ├── menu-validator.ts
│   │   └── profil-validator.ts
│   │
│   └── utils/                    # Utilitaires génériques
│       ├── date-helpers.ts       # Manipulation dates
│       ├── format-helpers.ts     # Formatage texte/nombres
│       ├── sort-helpers.ts       # Tris
│       └── constants.ts          # Constantes globales
│
├── types/                        # Types TypeScript
│   ├── aliment.ts                # Types aliments
│   ├── user.ts                   # Types profil utilisateur
│   ├── menu.ts                   # Types menus
│   ├── sport.ts                  # Types programme sportif
│   ├── analyse.ts                # Types analyses médicales
│   ├── journal.ts                # Types journal quotidien
│   └── common.ts                 # Types communs
│
├── hooks/                        # Custom React hooks
│   ├── useAliments.ts            # Hook gestion aliments
│   ├── useMenus.ts               # Hook gestion menus
│   ├── useProfil.ts              # Hook profil utilisateur
│   ├── useJournal.ts             # Hook journal quotidien
│   ├── useAnalyses.ts            # Hook analyses médicales
│   └── useTheme.ts               # Hook dark/light mode
│
├── context/                      # React Context
│   ├── ThemeContext.tsx          # Context dark/light mode
│   └── ProfilContext.tsx         # Context profil utilisateur
│
├── public/                       # Fichiers publics
│   ├── imports/                  # Dossier import fichiers Obsidian
│   └── icons/                    # Icônes personnalisées
│
├── styles/                       # Styles additionnels
│   └── charts.css                # Styles graphiques
│
├── config/                       # Configuration
│   ├── pathologies.ts            # Config pathologies
│   ├── categories.ts             # Catégories aliments
│   ├── saisons.ts                # Définition saisons
│   └── seuils.ts                 # Seuils médicaux
│
└── tests/                        # Tests (optionnel)
    ├── unit/
    └── integration/
```

---

## 🔧 TECHNOLOGIES & VERSIONS

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest", // composants shadcn/ui
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    
    "date-fns": "^3.0.0", // manipulation dates
    "recharts": "^2.10.0", // graphiques
    "zustand": "^4.4.0", // state management (optionnel)
    "gray-matter": "^4.0.3", // parse frontmatter markdown
    "marked": "^11.0.0" // parse markdown
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 🗄️ SCHÉMA BASE DE DONNÉES (IndexedDB)

### Store : `aliments`

```typescript
interface Aliment {
  id: string;                     // UUID généré
  nom: string;                    // "Ail", "Saumon"
  categorie: CategorieAliment;    // "Aromate", "Poisson gras"
  saison: Saison | "Toute année"; // "Automne", "Hiver"
  
  compatibilites: {
    [pathologie: string]: {
      niveau: "EXCELLENT" | "BON" | "MODERE" | "DECONSEILLE";
      etoiles: 0 | 1 | 2 | 3;
      emoji: "🟢" | "🟡" | "🔴";
    }
  };
  
  nutrition: {
    energie_kcal: number;
    proteines_g: number;
    glucides_g: number;
    lipides_g: number;
    fibres_g: number;
    eau_g?: number;
  };
  
  index_glycemique: {
    valeur: number;
    categorie: "BAS" | "MOYEN" | "ELEVE";
  };
  
  micronutriments?: Record<string, number>;
  composes_bioactifs?: string[];
  
  utilisation?: {
    quantite_typique?: string;
    preparations?: string[];
    astuces?: string;
  };
  
  conservation?: string;
  notes?: string;
  
  created_at: Date;
  updated_at: Date;
}
```

### Store : `profil`

```typescript
interface UserProfile {
  id: "user-001"; // Single record
  
  age: number;
  sexe: "M" | "F";
  taille_cm: number;
  poids_actuel_kg: number;
  tour_taille_cm: number;
  imc: number; // calculé auto
  
  pathologies: Pathologie[];
  regimes: TypeRegime[];
  objectif: Objectif;
  
  macros: {
    kcal_jour: number;
    proteines_g: number;
    lipides_g: number;
    glucides_g: number;
    fibres_g: number;
  };
  
  fc_max: number;
  zones_cardiaques: {
    z1: { min: number; max: number };
    z2: { min: number; max: number };
    z3: { min: number; max: number };
    z4: { min: number; max: number };
    z5: { min: number; max: number };
  };
  
  fenetre_alimentaire: {
    debut: string; // "11:00"
    fin: string;   // "18:00"
  };
  nombre_repas_jour: number;
  jeune_mensuel: boolean;
  
  assouplissement_regime: number; // 0-100%
  
  updated_at: Date;
}
```

### Store : `menus`

```typescript
interface Menu {
  id: string;
  nom: string;
  date_creation: Date;
  type: "journalier" | "hebdomadaire" | "mensuel";
  
  repas: Repas[];
  
  totaux: {
    kcal: number;
    proteines: number;
    lipides: number;
    glucides: number;
    fibres: number;
  };
  
  compatible_pathologies: string[];
  notes?: string;
}

interface Repas {
  heure: string;
  kcal_total: number;
  plats: Plat[];
}

interface Plat {
  type: "entree" | "proteine" | "legumes" | "feculent" | "lipides" | "dessert" | "complement";
  aliment: string; // nom aliment
  quantite_g: number;
  preparation?: string;
  kcal: number;
  proteines: number;
  lipides: number;
  glucides: number;
  fibres?: number;
}
```

### Store : `journal_quotidien`

```typescript
interface JournalQuotidien {
  date: Date; // keyPath
  
  poids_kg: number;
  tour_taille_cm?: number;
  
  qualite_sommeil: number; // 1-10
  duree_sommeil_total_h: number;
  duree_sommeil_profond_h?: number;
  
  energie_ressentie: number; // 1-10
  symptomes?: string;
  
  menu_suivi: boolean;
  ecarts_alimentaires?: string;
  
  seance_effectuee: boolean;
  seance_details?: {
    type: string;
    duree_minutes: number;
    zone: string;
    ressenti: number; // 1-10
    fatigue: number; // 1-10
    notes?: string;
  };
  
  notes_generales?: string;
}
```

### Store : `analyses`

```typescript
interface AnalyseSanguine {
  date: Date; // keyPath
  
  biomarqueurs: {
    // Lipides
    triglycerides_mmol?: number;
    triglycerides_mg_dl?: number;
    hdl_g_l?: number;
    cholesterol_total_g_l?: number;
    ldl_g_l?: number;
    
    // Diabète
    hba1c_pourcentage?: number;
    glycemie_jeun_g_l?: number;
    
    // Résistance insulinique
    homa?: number;
    insuline_mui_l?: number;
    peptide_c_ng_ml?: number;
    
    // Foie
    alat_ui_l?: number;
    asat_ui_l?: number;
    ggt_ui_l?: number;
    
    // Pancréas
    lipase_u_l?: number;
    amylase_u_l?: number;
    
    // Rein
    clairance_ml_min?: number;
    creatinine_mg_l?: number;
    
    // Autres
    psa_ng_ml?: number;
    vitamine_b12_pg_ml?: number;
    vitamine_d_ng_ml?: number;
  };
  
  notes?: string;
  fichier_pdf?: string; // nom fichier si upload
}
```

### Store : `programme_sportif`

```typescript
interface ProgrammeSportif {
  semaine: number; // 1-24
  phase: 1 | 2 | 3;
  type: "normale" | "deload";
  volume_total_minutes: number;
  
  seances: Seance[];
  objectifs_semaine: string[];
}

interface Seance {
  jour: string;
  type: "velo" | "marche" | "rameur" | "gainage" | "hiit";
  duree_minutes: number;
  zone_cardiaque: "Z1" | "Z2" | "Z3" | "Z4" | "Z5" | null;
  niveau_resistance?: number;
  fc_cible?: string;
  exercices?: string[];
  notes?: string;
}
```

### Store : `seances_realisees`

```typescript
interface SeanceRealisee {
  id: string;
  date: Date;
  semaine_programme: number;
  
  type: string;
  duree_minutes: number;
  zone_cardiaque?: string;
  
  ressenti: number; // 1-10
  fatigue: number; // 1-10
  fc_moyenne?: number;
  fc_max?: number;
  
  notes?: string;
}
```

---

## 🎨 DESIGN TOKENS (Tailwind + shadcn/ui)

### Variables CSS (tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

### Badges de Compatibilité

```typescript
const compatibilityStyles = {
  EXCELLENT: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  BON: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
  MODERE: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
  DECONSEILLE: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
};
```

---

## 🔄 FLUX DE DONNÉES PRINCIPAUX

### 1. Génération Menu Automatique

```
┌──────────────────────────────────────────────────┐
│ User clique "Générer Menu"                       │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Récupération Profil Utilisateur                  │
│ - Pathologies                                    │
│ - Objectif                                       │
│ - Macros cibles                                  │
│ - Assouplissement %                              │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Filtrage Aliments DB                             │
│ - Compatible pathologie                          │
│ - Saison actuelle                                │
│ - Selon assouplissement                          │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Algorithme Génération Menu                       │
│ - Respect macros (±5%)                           │
│ - Diversité aliments                             │
│ - Contraintes dures (lipides max, IG bas)       │
│ - Contraintes souples (poissons 3×/sem, etc)    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Prévisualisation Menu                            │
│ - Affichage repas générés                       │
│ - Récap macros                                   │
│ - Option édition manuelle                        │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Validation & Sauvegarde                          │
│ - Store dans IndexedDB                           │
│ - Génération auto liste courses                  │
└──────────────────────────────────────────────────┘
```

### 2. Calcul Macros Automatique

```
┌──────────────────────────────────────────────────┐
│ User modifie Profil (poids, objectif, etc)      │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Calcul MBR (Mifflin-St Jeor)                    │
│ Formule selon sexe                               │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Application Facteur Activité                     │
│ Selon niveau sport (1.2 - 1.9)                  │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Ajustement selon Objectif                        │
│ - Perte poids: -400 kcal                        │
│ - Prise masse: +300 kcal                        │
│ - Stabilisation: DET                             │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Répartition Macronutriments                      │
│ 1. Protéines (priorité)                         │
│ 2. Lipides (selon pathologie)                   │
│ 3. Glucides (reste kcal disponibles)            │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Mise à jour Profil & Filtres                     │
│ Automatique sans intervention user               │
└──────────────────────────────────────────────────┘
```

### 3. Assouplissement Régime Progressif

```
┌──────────────────────────────────────────────────┐
│ User saisit Nouvelle Analyse Sanguine            │
│ Date + Biomarqueurs (TG, HbA1c, HOMA, etc)      │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Analyse Évolution TG (si chylomicronémie)       │
│ - TG >= 11.3 mmol/L → assouplissement = 0%      │
│ - TG < 11.3 mmol/L → assouplissement = 10%      │
│ - TG < 8.0 mmol/L → assouplissement = 20%       │
│ - TG < 4.0 mmol/L → assouplissement = 30%       │
│ - TG < 1.7 mmol/L → assouplissement = 50%       │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Mise à jour Profil.assouplissement_regime        │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ Impact sur Filtrage Aliments                     │
│ - 0% : EXCELLENT + BON uniquement                │
│ - 10-30% : + MODERE autorisé en petites qtés    │
│ - 50%+ : + MODERE sans limite                   │
│ - DECONSEILLE toujours exclus                   │
└──────────────────────────────────────────────────┘
```

---

## 🧪 FONCTIONS CLÉS À IMPLÉMENTER

### `/lib/calculations/macros.ts`

```typescript
export function calculerMacros(profil: UserProfile): Macros {
  // 1. MBR selon formule Mifflin-St Jeor
  const mbr = profil.sexe === "M"
    ? (10 * profil.poids_actuel_kg) + (6.25 * profil.taille_cm) - (5 * profil.age) + 5
    : (10 * profil.poids_actuel_kg) + (6.25 * profil.taille_cm) - (5 * profil.age) - 161;
  
  // 2. DET avec facteur activité
  const facteurActivite = determinerFacteurActivite(profil);
  const det = mbr * facteurActivite;
  
  // 3. Kcal cible selon objectif
  const kcalCible = ajusterSelonObjectif(det, profil.objectif);
  
  // 4. Protéines (priorité)
  const protG = profil.objectif === "prise_masse_musculaire"
    ? profil.poids_actuel_kg * 2.0
    : profil.poids_actuel_kg * 1.6;
  
  // 5. Lipides (selon pathologie)
  const lipG = determinerLipides(profil.pathologies);
  
  // 6. Glucides (reste)
  const kcalProt = protG * 4;
  const kcalLip = lipG * 9;
  const kcalGluc = kcalCible - kcalProt - kcalLip;
  const glucG = kcalGluc / 4;
  
  return {
    kcal_jour: Math.round(kcalCible),
    proteines_g: Math.round(protG),
    lipides_g: Math.round(lipG),
    glucides_g: Math.round(glucG),
    fibres_g: 35 // minimum
  };
}
```

### `/lib/generators/menu-generator.ts`

```typescript
export async function genererMenu(
  profil: UserProfile,
  options: MenuGeneratorOptions
): Promise<Menu> {
  // 1. Récupérer aliments compatibles
  const alimentsDisponibles = await filtrerAliments(profil);
  
  // 2. Générer repas selon contraintes
  const repas = [];
  
  for (let i = 0; i < profil.nombre_repas_jour; i++) {
    const repasGenere = await genererRepas({
      profil,
      alimentsDisponibles,
      macrosRestantes: calculerMacrosRestantes(repas, profil.macros),
      contraintes: extraireContraintes(profil)
    });
    
    repas.push(repasGenere);
  }
  
  // 3. Vérifier respect des macros
  const totaux = calculerTotaux(repas);
  const respect = verifierRespectMacros(totaux, profil.macros);
  
  if (!respect) {
    // Réessayer ou ajuster
    return genererMenu(profil, options); // Récursif
  }
  
  return {
    id: generateId(),
    nom: options.nom || `Menu ${new Date().toISOString()}`,
    date_creation: new Date(),
    type: options.type,
    repas,
    totaux,
    compatible_pathologies: profil.pathologies
  };
}
```

### `/lib/parsers/markdown-parser.ts`

```typescript
import matter from 'gray-matter';
import { marked } from 'marked';

export function parseAlimentMarkdown(content: string): Aliment {
  // 1. Parse frontmatter YAML
  const { data: frontmatter, content: body } = matter(content);
  
  // 2. Parse body markdown
  const html = marked(body);
  
  // 3. Extract structured data
  const nutrition = extractNutritionTable(html);
  const compatibilites = extractCompatibilites(html);
  const indexGlycemique = extractIG(html);
  
  // 4. Construct Aliment object
  return {
    id: generateId(),
    nom: frontmatter.nom,
    categorie: frontmatter.categorie,
    saison: frontmatter.saison,
    compatibilites,
    nutrition,
    index_glycemique: indexGlycemique,
    // ... autres champs
    created_at: new Date(),
    updated_at: new Date()
  };
}

function extractNutritionTable(html: string): Nutrition {
  // Regex pour extraire tableau valeurs nutritionnelles
  // ...
}
```

---

## 🚦 POINTS D'ATTENTION CRITIQUES

### 1. Performance IndexedDB

```typescript
// ❌ BAD : Multiple queries séparées
for (const menu of menus) {
  const aliments = await getAlimentsForMenu(menu.id);
  // Process...
}

// ✅ GOOD : Batch query
const allMenusWithAliments = await getAllMenusWithAliments();
```

### 2. Calcul des Macros - Ordre de Priorité

```typescript
// TOUJOURS respecter cet ordre :
// 1. Protéines (non négociable)
// 2. Lipides (selon pathologie, strict)
// 3. Glucides (le reste des kcal)

// ❌ NEVER calculer lipides en dernier
// ✅ ALWAYS calculer glucides en dernier
```

### 3. Filtrage Aliments Chylomicronémie

```typescript
// STRICT : Lipides < 5g/100g pour chylomicronémie
function filtrerPourChylo(aliments: Aliment[]): Aliment[] {
  return aliments.filter(a => 
    a.nutrition.lipides_g <= 5 &&
    a.compatibilites.chylomicronemie.niveau !== "DECONSEILLE"
  );
}
```

### 4. Gestion Jeûnes Mensuels

```typescript
// IMPORTANT : 2e semaine de chaque mois = jeûne
// Protocole J1-J11 non négociable
function isJeuneSemaine(date: Date): boolean {
  const weekOfMonth = getWeekOfMonth(date);
  return weekOfMonth === 2;
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### Layout Adaptatif

- **Mobile (< 768px)** : 
  - Sidebar → Bottom nav bar
  - Cards en single column
  - Graphiques simplifiés
  
- **Tablet (768-1024px)** :
  - Sidebar collapsible
  - Cards en 2 colonnes
  
- **Desktop (> 1024px)** :
  - Sidebar fixe
  - Cards en 3-4 colonnes
  - Graphiques complets

---

## 🔐 SÉCURITÉ & BONNES PRATIQUES

### Validation Input User

```typescript
// TOUJOURS valider les données utilisateur
import { z } from 'zod';

const AlimentSchema = z.object({
  nom: z.string().min(1).max(100),
  categorie: z.enum([...CATEGORIES]),
  nutrition: z.object({
    energie_kcal: z.number().min(0).max(1000),
    proteines_g: z.number().min(0).max(100),
    lipides_g: z.number().min(0).max(100),
    glucides_g: z.number().min(0).max(100),
    fibres_g: z.number().min(0).max(100)
  })
});
```

### TypeScript Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 📊 LIBRAIRIES GRAPHIQUES

### Recharts (Recommandé)

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Graphique TG avec seuils
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={analysesData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line 
      type="monotone" 
      dataKey="triglycerides_mmol" 
      stroke="#8884d8" 
      name="Triglycérides (mmol/L)"
    />
    <ReferenceLine 
      y={11.3} 
      label="Seuil danger" 
      stroke="red" 
      strokeDasharray="3 3" 
    />
    <ReferenceLine 
      y={1.7} 
      label="Objectif" 
      stroke="green" 
      strokeDasharray="3 3" 
    />
  </LineChart>
</ResponsiveContainer>
```

---

## 🧪 TESTS (Optionnel Phase 10)

### Tests Unitaires

```typescript
// lib/calculations/macros.test.ts
import { calculerMacros } from './macros';

describe('calculerMacros', () => {
  it('devrait calculer correctement pour chylomicronémie', () => {
    const profil = {
      sexe: "M",
      age: 56,
      taille_cm: 180,
      poids_actuel_kg: 106,
      objectif: "prise_masse_musculaire",
      pathologies: ["chylomicronemie"]
    };
    
    const macros = calculerMacros(profil);
    
    expect(macros.lipides_g).toBeLessThanOrEqual(35);
    expect(macros.proteines_g).toBeGreaterThanOrEqual(170);
  });
});
```

---

**Ce document servira de référence technique tout au long du développement.**
