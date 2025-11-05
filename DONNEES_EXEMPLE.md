# 🧪 DONNÉES D'EXEMPLE - Pour Tests & Développement

Ce fichier contient des exemples de données structurées pour faciliter les tests durant le développement.

---

## 👤 PROFIL UTILISATEUR EXEMPLE

### Profil avec Chylomicronémie (votre profil actuel)

```typescript
const profileChylomicronemie: UserProfile = {
  // Informations personnelles
  age: 56,
  sexe: "M",
  taille_cm: 180,
  poids_actuel_kg: 106.0,
  tour_taille_cm: 115,
  imc: 32.7, // calculé auto
  
  // Pathologies
  pathologies: [
    "chylomicronemie",
    "diabete_type2",
    "syndrome_metabolique"
  ],
  
  // Type de régime
  regimes: ["hyper_proteine"],
  
  // Objectif
  objectif: "prise_masse_musculaire",
  
  // Contraintes nutritionnelles (calculées auto)
  macros: {
    kcal_jour: 2200,
    proteines_g: 170,
    lipides_g: 30, // STRICT pour chylomicronémie
    glucides_g: 220,
    fibres_g: 35
  },
  
  // Sport
  fc_max: 164,
  zones_cardiaques: {
    z1: { min: 0, max: 98 },
    z2: { min: 99, max: 114 },
    z3: { min: 115, max: 131 },
    z4: { min: 132, max: 147 },
    z5: { min: 148, max: 164 }
  },
  
  // Paramètres régime
  fenetre_alimentaire: {
    debut: "11:00",
    fin: "18:00"
  },
  nombre_repas_jour: 2,
  jeune_mensuel: true,
  
  // Niveau assouplissement
  assouplissement_regime: 0 // 0% = strict au début
};
```

### Profil Diabète Type 2 (exemple alternatif)

```typescript
const profileDiabete: UserProfile = {
  age: 48,
  sexe: "F",
  taille_cm: 165,
  poids_actuel_kg: 75.0,
  tour_taille_cm: 90,
  imc: 27.5,
  
  pathologies: ["diabete_type2"],
  regimes: ["mediterraneen"],
  objectif: "perte_poids",
  
  macros: {
    kcal_jour: 1800,
    proteines_g: 120,
    lipides_g: 55,
    glucides_g: 180,
    fibres_g: 30
  },
  
  fc_max: 172,
  zones_cardiaques: {
    z1: { min: 0, max: 103 },
    z2: { min: 103, max: 120 },
    z3: { min: 120, max: 137 },
    z4: { min: 137, max: 154 },
    z5: { min: 154, max: 172 }
  },
  
  fenetre_alimentaire: {
    debut: "08:00",
    fin: "20:00"
  },
  nombre_repas_jour: 3,
  jeune_mensuel: false,
  assouplissement_regime: 20
};
```

---

## 🥗 ALIMENTS EXEMPLES

### Aliment 1 : Ail (Excellent pour chylomicronémie)

```typescript
const alimentAil: Aliment = {
  id: "ail-001",
  nom: "Ail",
  categorie: "Aromate",
  saison: "Toute année",
  
  // Compatibilités pathologies
  compatibilites: {
    chylomicronemie: {
      niveau: "EXCELLENT",
      etoiles: 3,
      emoji: "🟢"
    },
    diabete_type2: {
      niveau: "BON",
      etoiles: 2,
      emoji: "🟢"
    },
    syndrome_metabolique: {
      niveau: "EXCELLENT",
      etoiles: 3,
      emoji: "🟢"
    }
  },
  
  // Valeurs nutritionnelles (pour 100g)
  nutrition: {
    energie_kcal: 149,
    proteines_g: 6.4,
    glucides_g: 33,
    lipides_g: 0.5,
    fibres_g: 2.1,
    eau_g: 58.6
  },
  
  // Index glycémique
  index_glycemique: {
    valeur: 30,
    categorie: "BAS" // BAS < 55, MOYEN 55-69, ELEVE > 70
  },
  
  // Micronutriments clés
  micronutriments: {
    vitamine_b6_mg: 1.2,
    vitamine_c_mg: 31,
    manganese_mg: 1.67,
    selenium_mcg: 14
  },
  
  // Composés bioactifs
  composes_bioactifs: [
    "Allicine (anti-inflammatoire puissant)"
  ],
  
  // Conseils utilisation
  utilisation: {
    quantite_typique: "2-5g (1-2 gousses)",
    preparations: ["Cru écrasé", "Sauté", "Confit"],
    astuces: "Écraser 10 min avant cuisson pour libérer allicine"
  },
  
  // Conservation
  conservation: "Endroit sec et sombre, 2-3 mois",
  
  // Notes additionnelles
  notes: "Usage quotidien recommandé - propriétés santé exceptionnelles"
};
```

### Aliment 2 : Saumon (Excellent, riche oméga-3)

```typescript
const alimentSaumon: Aliment = {
  id: "saumon-001",
  nom: "Saumon",
  categorie: "Poisson gras",
  saison: "Toute année",
  
  compatibilites: {
    chylomicronemie: {
      niveau: "EXCELLENT",
      etoiles: 3,
      emoji: "🟢"
    },
    diabete_type2: {
      niveau: "EXCELLENT",
      etoiles: 3,
      emoji: "🟢"
    },
    syndrome_metabolique: {
      niveau: "EXCELLENT",
      etoiles: 3,
      emoji: "🟢"
    }
  },
  
  nutrition: {
    energie_kcal: 206,
    proteines_g: 25.4,
    glucides_g: 0,
    lipides_g: 12.3,
    fibres_g: 0,
    eau_g: 62
  },
  
  index_glycemique: {
    valeur: 0,
    categorie: "BAS"
  },
  
  micronutriments: {
    vitamine_d_mcg: 11,
    vitamine_b12_mcg: 3.2,
    selenium_mcg: 36,
    omega3_epa_dha_g: 2.5
  },
  
  composes_bioactifs: [
    "EPA + DHA (oméga-3 anti-inflammatoires)",
    "Astaxanthine (antioxydant)"
  ],
  
  utilisation: {
    quantite_typique: "150-200g/portion",
    preparations: ["Au four", "Grillé", "Vapeur", "Papillote"],
    astuces: "3-4×/semaine recommandé pour oméga-3"
  },
  
  conservation: "Frais 2 jours max, congélation jusqu'à 3 mois",
  notes: "Privilégier saumon sauvage si possible"
};
```

### Aliment 3 : Avocat (Modéré - lipides élevés)

```typescript
const alimentAvocat: Aliment = {
  id: "avocat-001",
  nom: "Avocat",
  categorie: "Fruit gras",
  saison: "Toute année (import)",
  
  compatibilites: {
    chylomicronemie: {
      niveau: "MODERE",
      etoiles: 1,
      emoji: "🟡"
    },
    diabete_type2: {
      niveau: "BON",
      etoiles: 2,
      emoji: "🟢"
    },
    syndrome_metabolique: {
      niveau: "BON",
      etoiles: 2,
      emoji: "🟢"
    }
  },
  
  nutrition: {
    energie_kcal: 160,
    proteines_g: 2,
    glucides_g: 8.5,
    lipides_g: 14.7, // ATTENTION : élevé
    fibres_g: 6.7,
    eau_g: 73
  },
  
  index_glycemique: {
    valeur: 10,
    categorie: "BAS"
  },
  
  micronutriments: {
    potassium_mg: 485,
    vitamine_k_mcg: 21,
    folates_mcg: 81,
    vitamine_e_mg: 2.1
  },
  
  utilisation: {
    quantite_typique: "50-100g (1/2 à 1 avocat)",
    preparations: ["Cru en salade", "Écrasé (guacamole)", "Tartine"],
    astuces: "Limiter à 1/2 avocat/jour max si chylomicronémie"
  },
  
  conservation: "Température ambiante jusqu'à maturité, puis frigo 2-3 jours",
  notes: "⚠️ À limiter fortement en cas de chylomicronémie (lipides élevés)"
};
```

### Aliment 4 : Pain Blanc (Déconseillé - IG élevé)

```typescript
const alimentPainBlanc: Aliment = {
  id: "pain-blanc-001",
  nom: "Pain Blanc",
  categorie: "Féculent raffiné",
  saison: "Toute année",
  
  compatibilites: {
    chylomicronemie: {
      niveau: "DECONSEILLE",
      etoiles: 0,
      emoji: "🔴"
    },
    diabete_type2: {
      niveau: "DECONSEILLE",
      etoiles: 0,
      emoji: "🔴"
    },
    syndrome_metabolique: {
      niveau: "DECONSEILLE",
      etoiles: 0,
      emoji: "🔴"
    }
  },
  
  nutrition: {
    energie_kcal: 265,
    proteines_g: 9,
    glucides_g: 49,
    lipides_g: 3.2,
    fibres_g: 2.7,
    eau_g: 36
  },
  
  index_glycemique: {
    valeur: 75,
    categorie: "ELEVE" // ⚠️ Problématique
  },
  
  utilisation: {
    quantite_typique: "50g (2 tranches)",
    preparations: ["Toasté", "Nature"],
    astuces: "Préférer pain complet, seigle ou keto"
  },
  
  conservation: "4-5 jours à température ambiante, congélation possible",
  notes: "❌ À ÉVITER - Remplacer par pain keto maison ou riz basmati"
};
```

---

## 🍽️ MENU EXEMPLE

### Menu A - 2200 kcal (P170 L30 G220)

```typescript
const menuA: Menu = {
  id: "menu-a-001",
  nom: "Menu A - Chylomicronémie",
  date_creation: "2025-11-05",
  
  repas: [
    {
      heure: "11:00",
      kcal_total: 1200,
      plats: [
        {
          type: "entree",
          aliment: "Salade verte",
          quantite_g: 100,
          preparation: "vinaigrette (vinaigre cidre + 1 c.c. huile olive)",
          kcal: 50,
          proteines: 1,
          lipides: 5,
          glucides: 2
        },
        {
          type: "proteine",
          aliment: "Saumon",
          quantite_g: 200,
          preparation: "au four papillote",
          kcal: 412,
          proteines: 50.8,
          lipides: 24.6,
          glucides: 0
        },
        {
          type: "legumes",
          aliment: "Brocoli",
          quantite_g: 300,
          preparation: "vapeur",
          kcal: 105,
          proteines: 8.4,
          lipides: 1.2,
          glucides: 21
        },
        {
          type: "feculent",
          aliment: "Quinoa",
          quantite_g: 180,
          preparation: "cuit à l'eau",
          kcal: 216,
          proteines: 7.2,
          lipides: 3.6,
          glucides: 38.9
        },
        {
          type: "dessert",
          aliment: "Skyr 0%",
          quantite_g: 170,
          preparation: "nature",
          kcal: 102,
          proteines: 17,
          lipides: 0.3,
          glucides: 6.8
        },
        {
          type: "dessert",
          aliment: "Myrtilles surgelées",
          quantite_g: 100,
          preparation: "nature",
          kcal: 57,
          proteines: 0.7,
          lipides: 0.3,
          glucides: 14.5
        },
        {
          type: "complement",
          aliment: "Graines de chia",
          quantite_g: 15,
          preparation: "mélangées au skyr",
          kcal: 73,
          proteines: 2.5,
          lipides: 4.6,
          glucides: 6.3,
          fibres: 5.5
        }
      ]
    },
    {
      heure: "17:00",
      kcal_total: 900,
      plats: [
        {
          type: "entree",
          aliment: "Endives",
          quantite_g: 200,
          preparation: "vinaigrées",
          kcal: 34,
          proteines: 2,
          lipides: 0.4,
          glucides: 7
        },
        {
          type: "proteine",
          aliment: "Blanc de poulet",
          quantite_g: 180,
          preparation: "grillé",
          kcal: 298,
          proteines: 59.4,
          lipides: 6.5,
          glucides: 0
        },
        {
          type: "legumes",
          aliment: "Poireaux",
          quantite_g: 250,
          preparation: "sautés",
          kcal: 155,
          proteines: 3.8,
          lipides: 0.8,
          glucides: 35.5
        },
        {
          type: "feculent",
          aliment: "Patate douce",
          quantite_g: 140,
          preparation: "rôtie au four",
          kcal: 120,
          proteines: 1.8,
          lipides: 0.1,
          glucides: 28.5
        },
        {
          type: "dessert",
          aliment: "Chocolat noir 85%",
          quantite_g: 20,
          preparation: "nature",
          kcal: 120,
          proteines: 2.4,
          lipides: 10,
          glucides: 4
        }
      ]
    }
  ],
  
  // Totaux journée (calculés auto)
  totaux: {
    kcal: 2100,
    proteines: 157,
    lipides: 57.4, // ⚠️ Légèrement au-dessus, à ajuster
    glucides: 164.5,
    fibres: 35.5
  },
  
  compatible_pathologies: ["chylomicronemie"],
  
  notes: "Menu riche en oméga-3 (saumon 200g). Lipides à 57g, ajuster en réduisant chia ou avocat si besoin."
};
```

---

## 🏃 SÉANCE SPORT EXEMPLE

### Semaine 1 - Phase 1 (Fondations)

```typescript
const semaineSport1: ProgrammeSportif = {
  semaine: 1,
  phase: 1,
  type: "normale",
  volume_total_minutes: 135,
  
  seances: [
    {
      jour: "lundi",
      type: "velo",
      duree_minutes: 45,
      zone_cardiaque: "Z2",
      niveau_resistance: 6,
      fc_cible: "99-114 bpm",
      notes: "Maintenir conversation facile"
    },
    {
      jour: "mercredi",
      type: "velo",
      duree_minutes: 45,
      zone_cardiaque: "Z2",
      niveau_resistance: 6,
      fc_cible: "99-114 bpm",
      notes: "Idem lundi"
    },
    {
      jour: "jeudi",
      type: "gainage",
      duree_minutes: 15,
      zone_cardiaque: null,
      exercices: [
        "Chat-chameau : 10 rép",
        "Curl-up McGill : 5×10 sec",
        "Planche latérale : 3×10 sec/côté",
        "Bird Dog : 5×10 sec/côté"
      ],
      notes: "Stabilisation lombaire - priorité technique"
    },
    {
      jour: "samedi",
      type: "velo",
      duree_minutes: 30,
      zone_cardiaque: "Z2",
      niveau_resistance: 6,
      fc_cible: "99-114 bpm",
      notes: "Séance plus courte week-end"
    }
  ],
  
  objectifs_semaine: [
    "Établir la base aérobie",
    "Renforcement lombaire de base",
    "Volume conservateur"
  ]
};
```

---

## 🩸 ANALYSE SANGUINE EXEMPLE

### Analyse Octobre 2025 (État actuel critique)

```typescript
const analyseOct2025: AnalyseSanguine = {
  date: new Date("2025-10-14"),
  
  biomarqueurs: {
    // Lipides - CRITIQUE
    triglycerides_mmol: 16.30,
    triglycerides_mg_dl: 1463,
    hdl_g_l: 0.33,
    cholesterol_total_g_l: null,
    
    // Diabète - Excellent contrôle
    hba1c_pourcentage: 5.2,
    glycemie_jeun_g_l: 1.06,
    
    // Résistance insulinique - Élevée
    homa: 3.517,
    insuline_mui_l: 13.45,
    peptide_c_ng_ml: 3.03,
    
    // Foie - Normal (malgré traitement)
    alat_ui_l: 21,
    asat_ui_l: 23,
    ggt_ui_l: 22,
    
    // Pancréas - Limite haute
    lipase_u_l: 55,
    
    // Rein - Normal
    clairance_ml_min: 99,
    
    // Autres
    psa_ng_ml: 6.228,
    vitamine_b12_pg_ml: 268
  },
  
  notes: "TG toujours critiques malgré amélioration vs juillet (-39%). HbA1c excellent. HOMA élevé = résistance insulinique problématique.",
  
  seuils_securite: {
    triglycerides_mmol: {
      danger: 11.3,
      objectif_intermediaire: 8.0,
      objectif_final: 1.7,
      statut: "CRITIQUE"
    },
    hba1c: {
      objectif: 5.7,
      statut: "EXCELLENT"
    },
    homa: {
      norme_max: 2.259,
      objectif: 2.5,
      statut: "ELEVE"
    }
  }
};
```

### Analyse Juillet 2025 (État précédent - pire)

```typescript
const analyseJuil2025: AnalyseSanguine = {
  date: new Date("2025-07-15"),
  
  biomarqueurs: {
    triglycerides_mmol: 23.53,
    triglycerides_mg_dl: 2110,
    hba1c_pourcentage: 5.8,
    // ... autres valeurs
  },
  
  notes: "PIC maximal TG - Extrêmement critique. Risque pancréatite élevé.",
  
  seuils_securite: {
    triglycerides_mmol: {
      danger: 11.3,
      objectif_intermediaire: 8.0,
      objectif_final: 1.7,
      statut: "EXTREMEMENT_CRITIQUE"
    }
  }
};
```

---

## 📝 ENTRÉE JOURNAL QUOTIDIEN EXEMPLE

### Journée type normale

```typescript
const journalQuotidien1: JournalQuotidien = {
  date: new Date("2025-11-05"),
  
  // Anthropométrie
  poids_kg: 105.5,
  tour_taille_cm: 114,
  
  // Sommeil
  qualite_sommeil: 6,
  duree_sommeil_total_h: 7.5,
  duree_sommeil_profond_h: 2.2,
  
  // Énergie & ressenti
  energie_ressentie: 7,
  
  // Symptômes
  symptomes: "Léger mal de dos en fin de journée après séance vélo",
  
  // Nutrition
  menu_suivi: true,
  ecarts_alimentaires: null,
  
  // Sport
  seance_effectuee: true,
  seance_details: {
    type: "velo",
    duree_minutes: 45,
    zone: "Z2",
    ressenti: 7,
    fatigue: 4,
    notes: "Bon rythme, pas de douleur"
  },
  
  notes_generales: "Bonne journée, sommeil s'améliore. Continuer."
};
```

### Journée avec problème (mauvais sommeil)

```typescript
const journalQuotidien2: JournalQuotidien = {
  date: new Date("2025-11-06"),
  
  poids_kg: 106.2, // +0.7kg (rétention eau probable)
  tour_taille_cm: 114,
  
  qualite_sommeil: 3,
  duree_sommeil_total_h: 5.5,
  duree_sommeil_profond_h: 1.2,
  
  energie_ressentie: 4,
  
  symptomes: "Fatigue importante, difficulté concentration",
  
  menu_suivi: true,
  ecarts_alimentaires: null,
  
  seance_effectuee: false,
  seance_details: null,
  
  notes_generales: "⚠️ Mauvais sommeil → fatigue → pas de sport. Prioriser sommeil ce soir !"
};
```

---

## 🗓️ PROTOCOLE JEÛNE MENSUEL

### Semaine 2 du mois (J1-J11)

```typescript
const protocoleJeuneMensuel = {
  preparation_j_moins_1: {
    date_debut: "Premier dimanche du mois",
    consignes: [
      "Réduire glucides à <150g",
      "Dernier repas 17h riche lipides/protéines",
      "Hydratation importante",
      "Exemple : Saumon 200g + avocat + salade"
    ]
  },
  
  jeune_strict_j1_j4: {
    duree_jours: 4,
    proteines_vegan_g: 40,
    eaa_doses: 2,
    epax_gelules: 6,
    hydratation_l: "2-3L + fleur de sel",
    multivitamines: true,
    berberine: false, // ARRÊT pendant jeûne
    activite: "Marche légère uniquement",
    notes: "État cétose attendu J2-J3"
  },
  
  reprise_j5: {
    repas: 1,
    heure: "17:00",
    kcal_max: 600,
    exemple: "Soupe légumes 400ml + Poulet 100g + 1 c.c. huile olive",
    notes: "Mastication lente, arrêt si ballonnement"
  },
  
  reprise_j6: {
    repas: 2,
    kcal_max: 900,
    exemple_1: "Vapeur : brocoli 250g + cabillaud 120g + 1 c.c. huile",
    exemple_2: "Shake végan 40g + Skyr 170g",
    notes: "Intestins encore sensibles"
  },
  
  reprise_progressive_j7_j10: {
    kcal_max: 900,
    repas: 2,
    notes: "Augmentation progressive volume, IG bas strict"
  },
  
  transition_j11: {
    kcal_cible: "1600-1800",
    notes: "Retour progressif aux macros normales"
  },
  
  retour_normal_j12_plus: {
    kcal_cible: 2200,
    notes: "Retour au programme normal jusqu'à prochain jeûne"
  }
};
```

---

## 📈 RÈGLES DE CALCUL AUTOMATIQUES

### Calcul IMC

```typescript
function calculerIMC(poids_kg: number, taille_cm: number): number {
  const taille_m = taille_cm / 100;
  return poids_kg / (taille_m * taille_m);
}

// Exemple
calculerIMC(106, 180); // = 32.7 (Obésité classe 1)
```

### Calcul Zones Cardiaques

```typescript
function calculerZonesFC(fc_max: number) {
  return {
    z1: { min: 0, max: Math.round(fc_max * 0.6) },
    z2: { min: Math.round(fc_max * 0.6), max: Math.round(fc_max * 0.7) },
    z3: { min: Math.round(fc_max * 0.7), max: Math.round(fc_max * 0.8) },
    z4: { min: Math.round(fc_max * 0.8), max: Math.round(fc_max * 0.9) },
    z5: { min: Math.round(fc_max * 0.9), max: Math.round(fc_max * 1.0) }
  };
}

// Exemple
calculerZonesFC(164);
// Résultat: {
//   z1: { min: 0, max: 98 },
//   z2: { min: 99, max: 114 },
//   z3: { min: 115, max: 131 },
//   z4: { min: 132, max: 147 },
//   z5: { min: 148, max: 164 }
// }
```

### Calcul Macros selon Profil

Voir formule détaillée dans le prompt principal section "Calcul automatique des macros selon profil"

---

## 🚨 SEUILS D'ALERTE

### Triglycérides

```typescript
const seuilsTG = {
  normal: { max: 1.7, color: "green", label: "Normal" },
  limite: { min: 1.7, max: 2.3, color: "yellow", label: "Limite" },
  eleve: { min: 2.3, max: 5.6, color: "orange", label: "Élevé" },
  tres_eleve: { min: 5.6, max: 11.3, color: "red", label: "Très élevé" },
  critique: { min: 11.3, color: "darkred", label: "CRITIQUE - Risque pancréatite" }
};
```

### HbA1c

```typescript
const seuilsHbA1c = {
  normal: { max: 5.7, color: "green", label: "Normal" },
  prediabete: { min: 5.7, max: 6.4, color: "yellow", label: "Prédiabète" },
  diabete: { min: 6.4, color: "red", label: "Diabète" }
};
```

### HOMA (Résistance Insulinique)

```typescript
const seuilsHOMA = {
  optimal: { max: 1.0, color: "green", label: "Optimal" },
  normal: { min: 1.0, max: 2.259, color: "lightgreen", label: "Normal" },
  modere: { min: 2.259, max: 3.0, color: "yellow", label: "Modéré" },
  eleve: { min: 3.0, color: "red", label: "Élevé" }
};
```

---

## 💾 STRUCTURE INDEXEDDB

### Initialisation DB

```typescript
const DB_CONFIG = {
  name: "nutrition_app_db",
  version: 1,
  stores: [
    {
      name: "aliments",
      keyPath: "id",
      indexes: [
        { name: "nom", keyPath: "nom", unique: false },
        { name: "categorie", keyPath: "categorie", unique: false },
        { name: "saison", keyPath: "saison", unique: false }
      ]
    },
    {
      name: "menus",
      keyPath: "id",
      indexes: [
        { name: "date_creation", keyPath: "date_creation", unique: false }
      ]
    },
    {
      name: "journal_quotidien",
      keyPath: "date",
      indexes: []
    },
    {
      name: "analyses",
      keyPath: "date",
      indexes: []
    },
    {
      name: "seances_sport",
      keyPath: "id",
      indexes: [
        { name: "date", keyPath: "date", unique: false }
      ]
    },
    {
      name: "profil",
      keyPath: "id",
      indexes: []
    }
  ]
};
```

---

**Ce fichier contient toutes les données nécessaires pour démarrer les tests de chaque module.**

**Usage** : Copier-coller les objets TypeScript directement dans le code pendant le développement.
