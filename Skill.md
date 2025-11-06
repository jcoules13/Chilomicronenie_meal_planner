---
title: "SKILL - Plan Nutrition & Sport 24 Semaines"
type: "skill"
version: "3.1"
date_creation: 2025-10-23
date_maj: 2025-11-01
date_debut_plan: 2025-10-27
pathologie: "Chylomicronémie multifactorielle (TG 16.30 mmol/L + sérum lactescent + pancréatites récidivantes + résistance aux fibrates), Résistance insulinique (HOMA 3.517)"
profil: "Ancien athlète haut niveau - Aviron (1984-2003) - 9 entraînements/semaine"
structure_menus: "v3.1 - Viande prioritaire + Poisson frais début semaine + Salade midi + Soupe soir"
---

# 🎯 SKILL : Plan Nutrition & Sport - Profil Athlète

## Contexte utilisateur CRITIQUE

### Profil sportif unique
```yaml
passé_sportif:
  discipline: "Aviron"
  période: "1984-2003 (19 ans)"
  niveau: "Haut niveau"
  volume_entraînement: "9 séances/semaine × 2h minimum"
  intensité: "1000 kcal/heure"
  apports_quotidiens: "3000-4000 kcal/jour"
  
conséquences_actuelles:
  métabolisme: "Adapté aux gros volumes alimentaires"
  habitudes: "Bon mangeur - manger peu = frustration"
  discipline_mentale: "Excellente (gestion jeûnes, protocols)"
  auto_expérimentation: "Capable et efficace"
  
note_essentielle: "Ce n'est PAS un patient sédentaire lambda"
```

### Pathologies actuelles (Nov 2025)
```yaml
chylomicronemie:
  diagnostic: "Chylomicronémie multifactorielle"
  criteres_diagnostiques:
    - "TG 16.30 mmol/L (14.30 g/L) - seuil >10 g/L"
    - "Sérum lactescent (confirmé analyse 18/07/2025)"
    - "Pancréatites récidivantes (avril 2025 + antérieurs)"
    - "Résistance aux fibrates (Lipure +52%, Fénofibrate inefficace)"
    - "HDL très bas (0.33 g/L)"
  statut: "🔴 CRITIQUE - 44% au-dessus seuil pancréatite (>11.3 mmol/L)"
  
triglycerides:
  valeur: "16.30 mmol/L (1463 mg/dL)"
  évolution:
    avril_2025: "~30 mmol/L (pancréatite aiguë)"
    mai_2025: "17.68 mmol/L (sous Lipure + TiO2)"
    juillet_2025: "26.82 mmol/L (+52% sous Lipure)"
    octobre_2025: "16.30 mmol/L (-39% après arrêt Lipure + jeûnes)"
  
resistance_insulinique:
  homa: 3.517
  norme: "0.744-2.259"
  statut: "🔴 Résistance élevée"
  lien_chylomicronemie: "Aggrave production VLDL hépatique"
  
hba1c:
  valeur: "5.2%"
  statut: "✅ Excellent contrôle"
  
hdl:
  valeur: "0.33 g/L"
  objectif: ">0.40 g/L"
  statut: "🔴 Bas (typique chylomicronémie)"
  
sommeil:
  durée_totale: "<8h/nuit"
  profond: "<2h/nuit"
  statut: "🔴 CATASTROPHIQUE"
  impact: "Cortisol élevé → résistance insuline aggravée → TG ↑"
  
historique:
  pancréatites: "×2+ (dont une avril 2025)"
  épisodes_vagaux: "1991-1992 (déclenchés par vaccins militaires + métaux lourds)"
  arthrose_lombaire: "Toutes lombaires"
  intolerance_tio2: "Lipure avec TiO2 → TG +52%"
```

---

## 🍽️ Protocole nutritionnel

### Structure temporelle

**Fenêtre alimentaire** : 11h00 - 17h00 (6 heures)  
**Fréquence** : 2 repas/jour  
**Jeûne nocturne** : 18h (17h → 11h lendemain)

```yaml
repas_1:
  heure: "11h00"
  calories: 1200
  raison: "Gros repas adapté au profil athlète + meilleure sensibilité insulinique matinale"
  
repas_2:
  heure: "17h00" 
  calories: 900
  raison: "Léger après sport + digestion facile avant sommeil (22h30)"
  
total_jour: 2100
```

### Répartition macronutriments

```yaml
proteines:
  cible: "200 g/jour (1.6 g/kg)"
  repartition: "120g (repas 1) + 80g (repas 2)"
  priorité: "Poissons MAIGRES (cabillaud, colin), viandes maigres, blancs d'œufs, crevettes"
  note_chylomicronemie: "Privilégier protéines ultra-maigres (<5% MG)"
  
lipides:
  cible: "20-25 g/jour (10% des calories - STRICT)"
  raison: "Chylomicronémie = excès chylomicrons → réduction lipides DRASTIQUE"
  sources_autorisees:
    - "EPAX 6 gél/j (3.42g EPA+DHA) - PRIORITAIRE (oméga-3 essentiels)"
    - "⭐ HUILE MCT COCO : 2-3 c.à.c./jour (10-15g) - CUISSON PRIORITAIRE ⭐"
    - "Huile d'olive : 1 c.à.c./jour (5g) - ASSAISONNEMENT CRU uniquement"
    - "Poissons gras : 1×/semaine SEULEMENT (Semaine 4 du cycle)"
    - "Jaunes d'œufs : LIMITER (1-2 entiers/semaine)"
  sources_eliminees:
    - "❌ Avocat (100g = 15g lipides) - TROP"
    - "❌ Noix/amandes/noisettes (sauf traces 5g max)"
    - "❌ Graines de chia en grandes quantités (max 5g/jour)"
    - "❌ Fromages gras"
    - "❌ Beurre, huile tournesol, huile de colza"
  
  huile_mct_coco_CRITIQUE:
    pourquoi_ESSENTIELLE: "NE FORME PAS de chylomicrons (contrairement aux acides gras longue chaîne)"
    avantages_chylomicronemie:
      - "✅ Absorption DIRECTE au foie (système porte hépatique)"
      - "✅ Ne passe PAS par système lymphatique"
      - "✅ Ne nécessite PAS de lipase pancréatique (protection pancréas)"
      - "✅ Ne nécessite PAS de bile"
      - "✅ ZÉRO formation de chylomicrons = ZÉRO risque pancréatite"
      - "✅ Énergie immédiate disponible"
      - "✅ Soutien cétogène léger"
    usage:
      cuisson: "PRIORITAIRE - 2-2.5 c.à.c./jour (10-12.5g)"
      assaisonnement: "Possible (si budget lipides disponible)"
      remplacement: "Remplace toutes huiles cuisson (olive, tournesol, etc.)"
    composition:
      acide_caprylique: "C8 (55-60%)"
      acide_caprique: "C10 (40-45%)"
      chaine: "6-12 atomes de carbone"
    note_scientifique: "Les MCT sont les SEULS lipides qui ne forment pas de chylomicrons. C'est LA solution pour avoir de l'énergie lipidique sans aggraver la chylomicronémie."
  
  repartition_quotidienne_standard:
    total_lipides: "20-25g/jour"
    detail:
      huile_mct_coco: "10-12g (cuisson) ⭐ PRIORITAIRE"
      huile_olive: "5g (assaisonnement cru)"
      epax: "3-4g (oméga-3 essentiels)"
      naturels: "2-4g (viandes maigres, poissons)"
  
glucides:
  cible: "220-240 g/jour (ajustés à la hausse pour compenser lipides)"
  règles:
    - "Index Glycémique BAS (<55) OBLIGATOIRE"
    - "Légumes abondants (500-700g/jour)"
    - "Légumineuses : base des féculents (lentilles, pois chiches)"
    - "Fruits ≤100g/repas (surgelés : myrtilles, fraises)"
    - "Quinoa, riz basmati : portions modérées"
  
fibres:
  cible: "≥40 g/jour (augmentés pour satiété sans lipides)"
  sources: "Légumes, légumineuses, son d'avoine, fruits"
```

### Préférences alimentaires DÉTAILLÉES (⚠️ ADAPTÉES CHYLOMICRONÉMIE)

```yaml
protéines:
  ❤️ adoré:
    poissons_maigres: "Cabillaud, colin, lieu, sole, limande (priorité)"
    poissons_gras: "Saumon, thon, maquereau - 1-2×/semaine MAX (riches lipides)"
    viandes: "Blanc de poulet/dinde SANS PEAU, bœuf maigre (<5% MG)"
    fruits_mer: "Crevettes, Saint-Jacques"
    œufs: "Blancs illimités, jaunes 1-2 entiers/semaine MAX"
  ⚠️ limiter:
    - "Poissons gras : 1-2×/semaine (vs 3-4× avant)"
    - "Jaunes d'œufs : riches lipides"
    - "Viandes avec peau/graisse visible"
  ❌ éviter:
    - "Moules (pas aimées)"
    - "Charcuteries grasses"
    
légumes:
  ❤️ adoré: "TOUS - À VOLONTÉ"
  base_entrées: "Tomates, concombres, laitue (⚠️ SANS avocat)"
  préparation: "Vapeur, crus, sautés, rôtis (huile minimale)"
  note: "Augmenter volume pour compenser réduction lipides"
  
féculents:
  ✅ prioritaires:
    - "Légumineuses : lentilles, pois chiches, haricots (riches fibres, pauvres lipides)"
    - "Quinoa (blanc, rouge, noir)"
    - "Riz basmati"
    - "Patate douce"
    - "Flocons d'avoine"
  ❌ interdits:
    - "Sarrasin"
    - "Riz complet"
  🍞 pain_keto_perso:
    statut: "⚠️ À RECALCULER (poudre amande + huile coco = trop lipides)"
    alternative: "Pain complet IG bas en portions contrôlées"
    
fruits:
  format: "Surgelés (practicité)"
  préférés: "Myrtilles, fraises"
  limite: "≤100g/repas STRICT"
  
matières_grasses:
  ⚠️ RESTRICTION MAJEURE:
    huile_mct_coco: "⭐ PRIORITAIRE - 2-3 c.à.c./jour (10-15g) - CUISSON ⭐"
    raison_mct: "NE FORME PAS de chylomicrons (absorption directe foie, pas de système lymphatique)"
    huile_olive: "1 c.à.c./jour (5g) MAX - ASSAISONNEMENT CRU uniquement"
    epax: "6 gélules/jour OBLIGATOIRE (source unique oméga-3)"
  ❌ ÉLIMINÉS:
    - "Avocat (trop riche : 15g lipides/100g)"
    - "Noix/amandes/noisettes (sauf traces ≤5g)"
    - "Graines de chia en grandes quantités (max 5g/jour vs 15-20g avant)"
    - "Beurre, crème"
    - "Toutes huiles cuisson SAUF MCT coco (tournesol, colza, etc.)"
    
produits_laitiers:
  fromage: "❌ Parmesan/Comté ÉLIMINÉS (trop gras)"
  yaourt: "Grec 0% MG UNIQUEMENT (pas 2-5%)"
  skyr: "OUI 0% MG (dessert préféré maintenu)"
  lait: "Écrémé uniquement"
  
desserts_adaptés:
  option_1: "Skyr 0% + myrtilles surgelées (50g) + édulcorant"
  option_2: "Skyr 0% + fraises surgelées (50g)"
  option_3: "Yaourt grec 0% + fruits (50g)"
  option_4: "❌ Chocolat noir ÉLIMINÉ (trop gras : 50g lipides/100g)"
  option_5: "Compote sans sucre ajouté + yaourt 0%"
  
preparation_graines_chia:
  statut: "⚠️ RÉDUIT DRASTIQUEMENT"
  dose_avant: "15-20g/jour"
  dose_maintenant: "5g MAX/jour (≈1 c.à.c.)"
  raison: "5g chia = 2g lipides (sur budget 23g/jour)"
  
intolérances:
  gluten: "Évité par choix (pas d'allergie)"
  lactose: "Toléré en petites quantités"
```

### Mode chylomicronémie (ACTIF - PERMANENT)

**Activation** : Diagnostic chylomicronémie confirmé (TG 16.30 mmol/L + sérum lactescent + pancréatites + résistance fibrates)

```yaml
restriction_lipides_majeure:
  objectif: "20-25g lipides/jour (10% des 2100 kcal)"
  raison: "Réduction drastique chylomicrons = SEUL traitement efficace"
  sources_autorisees:
    - "EPAX 6 gél/jour (3-4g) - oméga-3 essentiels NON NÉGOCIABLE"
    - "Huile d'olive : 2 c.à.c./jour MAX (10g)"
    - "Poissons gras : 1-2×/semaine SEULEMENT (vs 3-4× avant)"
    - "Traces lipides naturelles : viandes maigres, yaourts 0%"
  eliminations_strictes:
    - "❌ Avocat (15g lipides/100g)"
    - "❌ Noix/oléagineux (sauf traces <5g)"
    - "❌ Fromages"
    - "❌ Chocolat noir"
    - "❌ Jaunes d'œufs multiples (1-2 entiers/semaine max)"
    - "❌ Graines chia haute dose (max 5g/jour vs 15-20g avant)"

restrictions_glucides_maintenues:
  sucres_ajoutés: "0 absolu (miel, confiture, sirop)"
  jus_fruits: "INTERDITS"
  fruits: "Maximum 100g/repas"
  féculents: "Légumineuses prioritaires (lentilles, pois chiches)"
  alcool: "0"
  
règles_strictes:
  entrée_vinagrée: "CHAQUE repas (effet TG démontré)"
  poissons_maigres: "5-6×/semaine (cabillaud, colin, lieu)"
  poissons_gras: "1-2×/semaine MAX (saumon, thon)"
  epax: "6 gélules/jour OBLIGATOIRE (oméga-3 essentiels)"
  fibres: "≥40g/jour (satiété sans lipides)"
  proteines_ultra_maigres: "Priorité (<5% MG)"
  legumes: "500-700g/jour (volume pour satiété)"
  
compensation_satiete:
  probleme: "Réduction lipides = risque frustration (ancien athlète)"
  solutions:
    - "Augmenter volume légumes (+100-200g/jour)"
    - "Augmenter féculents IG bas (+30-50g glucides)"
    - "Protéines magres abondantes"
    - "Fibres élevées (≥40g/jour)"
    - "2 repas copieux maintenus (1200 + 900 kcal)"
  
surveillance_renforcee:
  triglycerides: "Mensuel (objectif <11.3 mmol/L puis <8 puis <4)"
  lipase: "Mensuel (pancréas)"
  poids: "Hebdomadaire"
  adherence: "Critique = survie (éviter pancréatite)"
  
désactivation: "Jamais - pathologie chronique"
note_critique: "Ce n'est plus un 'mode' temporaire mais le protocole permanent pour chylomicronémie"
```

---

## 🧘 Protocole jeûne mensuel

### 🔄 IMPORTANT : Programmation jeûne dans le cycle 4 semaines

```yaml
structure_cycle:
  semaine_1: "Normale (S1, S5, S9, S13, S17, S21)"
  semaine_2: "Jeûne 4 jours + reprise progressive (S2, S6, S10, S14, S18, S22)"
  semaine_3: "Reprise alimentaire (S3, S7, S11, S15, S19, S23)"
  semaine_4: "Deload sport + normale nutrition (S4, S8, S12, S16, S20, S24)"
  
rationale:
  - "Évite conflit jeûne/deload (besoins différents)"
  - "Reprise sur S3 permet récupération avant deload S4"
  - "Rythme mensuel stable = automatisme"
```

### Fréquence et déclencheurs

```yaml
fréquence: "1 fois par mois (4 jours) - TOUJOURS en S2 du cycle"
déclencheurs:
  systématique: "Semaine 2 de chaque cycle de 4 semaines"
  
contre_indication_absolue:
  - "TG >20 mmol/L → Consultation URGENTE"
  - "Lipase >100 U/L"
  - "Douleur pancréatique"
```

### Protocole détaillé

#### Préparation (J-2 et J-1)
```yaml
objectif: "Entrée en cétose rapide"
j_moins_2:
  action: "Réduire progressivement glucides (-30%)"
  glucides: "≤150g"
  
j_moins_1:
  dernier_repas: "17h00"
  composition: "Riche lipides + protéines, pauvre glucides"
  exemple: "Saumon gras + avocat + salade + huile olive"
```

#### Pendant le jeûne (J1 à J4)
```yaml
hydratation:
  eau: "2-3 L/jour"
  fleur_sel: "2-3 pincées dans eau (sodium + hypotension orthostatique)"
  thé_vert: "2-3 tasses/jour (antioxydants)"
  café: "Noir, maximum 2 tasses"
  
suppléments:
  créatine: "5g/jour MAINTIEN (protection musculaire)"
  epax: "6 gélules/jour"
  magnésium_bisglycinate: "200mg le soir"
  vitamine_d3: "2000 UI/jour"
  berbérine: "❌ ARRÊT COMPLET pendant jeûne (hypoglycémie)"
  
sport_autorisé:
  vélo_léger: "✅ 20-45 min (HR <130 bpm)"
  rameur_léger: "✅ 20-30 min (technique + HR <130 bpm)"
  marche: "✅ Illimité"
  
sport_interdit:
  intensité_élevée: "❌ Sprints, HIIT"
  musculation_lourde: "❌ Charges ≥70% 1RM"
  longues_durées: "❌ >60 min d'affilée"
```

#### Reprise alimentaire (J5 et J6) - ⚠️ CRITIQUE CHYLOMICRONÉMIE

```yaml
j5_matin:
  heure: "11h00"
  composition: "Bouillon légumes + blanc d'œuf (2-3) + légumes vapeur"
  calories: "~300 kcal"
  lipides: "<5g (AUCUN avocat, AUCUNE huile)"
  raison: "Éviter rebond chylomicrons après jeûne"
  
j5_soir:
  heure: "17h00"
  composition: "Poisson MAIGRE (cabillaud, colin) 120g + légumes vapeur abondants"
  calories: "~500 kcal"
  lipides: "<8g"
  interdit: "❌ Saumon, huile olive, avocat = DANGEREUX post-jeûne"
  
j6:
  composition: "Repas normaux MAIS lipides ultra-contrôlés"
  repas_1: "Protéines maigres + légumes + légumineuses (1000 kcal, <10g lipides)"
  repas_2: "Idem (800 kcal, <10g lipides)"
  total_lipides_j6: "<20g MAX"
  
j7_a_j10:
  progression: "Retour progressif aux 23g lipides/jour"
  j7: "20g lipides"
  j8_j9: "22g lipides"
  j10: "23g lipides (cible normale)"
  
surveillance_critique:
  triglycerides: "Contrôle 48-72h APRÈS J6 (pic rebond)"
  lipase: "Si TG >18 mmol/L post-jeûne"
  symptomes_pancreatiques: "Douleur abdominale haute = URGENCE"
  
note_essentielle: "La reprise post-jeûne est le moment le plus DANGEREUX pour rebond chylomicrons. Les lipides doivent rester ULTRA-BAS pendant J5-J10."
```
  - "Énergie physique"
  - "Digestion"
  - "Sommeil"
  - "Envies de sucre"
```

---

## 🏃 Programme sportif

### Philosophie générale

```yaml
objectifs:
  primaire: "Améliorer santé métabolique (TG + HOMA-IR)"
  secondaire: "Préserver masse musculaire (jeûnes réguliers)"
  tertiaire: "Mobilité articulaire (arthrose lombaire)"
  
piliers:
  cardio_zone2: "Base du volume (vélo/rameur)"
  hiit: "2×/semaine max (efficacité métabolique)"
  musculation_resistance: "2-3×/semaine (préservation musculaire)"
  
cycle_4_semaines:
  s1: "Progression normale"
  s2: "Jeûne = activité légère uniquement"
  s3: "Reprise = -30% volume"
  s4: "Deload = -37% volume"
```

### Activités principales

#### Vélo Elliptique
```yaml
fréquence: "3-5×/semaine"
caractéristiques:
  - "0 impact articulaire"
  - "Gros volume calorique (600-900 kcal/h)"
  - "Idéal profil ancien rameur"
  
zones_travail:
  zone_2: "120-140 bpm (base volume)"
  tempo: "145-155 bpm (effort soutenu)"
  hiit: "160-170 bpm (courts intervalles)"
  
progression:
  - "Augmenter durée AVANT intensité"
  - "Max +5% volume/semaine"
  - "Deload obligatoire S4/8/12/16/20/24"
```

#### Rameur Concept2
```yaml
fréquence: "1-3×/semaine"
bénéfices:
  - "Technique maîtrisée (19 ans pratique)"
  - "Recrutement musculaire total"
  - "Efficacité calorique maximale"
  
contraintes:
  - "Arthrose lombaire = échauffement long"
  - "Technique PARFAITE obligatoire"
  - "Éviter charges lourdes (damper 3-5)"
  
formats:
  endurance: "30-45 min zone 2 (split 2:10-2:20)"
  intervals: "8×500m repos 1:30 (si énergie excellente)"
  technique: "10×1min focus poussée jambes"
```

#### Musculation en résistance
```yaml
fréquence: "2-3×/semaine"
objectif: "Préserver masse musculaire pendant jeûnes"
principe: "Temps sous tension + répétitions (8-15)"

exercices_prioritaires:
  tirage_rowing:
    materiel: "Rameur Concept2 ou élastiques"
    series: "3-4 × 8-12 répétitions"
    focus: "Tirage horizontal, dos complet"
    
  avant_bras_bras:
    materiel: "Haltères ou élastiques"
    exercices: "Curls biceps, extensions triceps, pronation/supination"
    series: "3 × 12-15 répétitions"
    
  epaules_progressifs:
    materiel: "Haltères légers (2-5kg)"
    progression: "Élévations latérales → Développés légers APRÈS maîtrise"
    series: "3 × 10-12 répétitions"
    precaution: "Technique PARFAITE avant augmentation charge"
    
  jambes_poids_corps:
    exercices: "Squats, fentes, mollets"
    series: "3 × 15-20 répétitions"
    
échauffement_obligatoire:
  durée: "10-15 min"
  contenu: "Mobilité articulaire + activation musculaire légère"
  raison: "Arthrose lombaire = priorité prévention"
```

### Adaptation volume selon cycle

```yaml
semaine_normale:
  volume: "180-300 min/semaine"
  progression: "+3% à +5% si adhérence ≥75% et énergie ≥5"
  
semaine_jeune_s2:
  volume: "90-150 min/semaine (-50%)"
  activités: "Vélo/rameur léger + marche uniquement"
  intensité: "Zone 1-2 maximum (HR <130 bpm)"
  
semaine_reprise_s3:
  volume: "125-210 min/semaine (-30%)"
  progression: "Reprise douce, écoute sensations"
  
semaine_deload_s4:
  volume: "113-189 min/semaine (-37%)"
  raison: "Récupération musculaire + articulaire"
```

---

## 💊 Supplémentation

### Compléments quotidiens

```yaml
epax_1000:
  dose: "6 gélules/jour"
  apport: "3.42g EPA+DHA"
  prise: "Avec repas gras"
  objectif: "Réduction TG + inflammation"
  priorité: "🔴 CRITIQUE"
  
creatine_monohydrate:
  dose: "5g/jour"
  forme: "Monohydrate micronisée"
  prise: "Matin ou post-effort (avec eau)"
  objectif: "Préservation masse musculaire + énergie cellulaire"
  priorité: "🔴 CRITIQUE"
  pendant_jeune: "OUI - maintien à 5g/jour"
  note: "Pas de phase de charge nécessaire"
  
magnesium_bisglycinate:
  dose: "200mg"
  prise: "Soir (22h)"
  objectif: "Sommeil + récupération musculaire"
  
vitamine_d3:
  dose: "2000 UI/jour"
  prise: "Matin avec repas gras"
  surveillance: "Dosage sanguin tous les 3 mois"
  
graines_chia:
  dose: "15-20g/jour"
  apport: "60% oméga-3 ALA + 10g fibres"
  prise: "Dans desserts (préparation veille)"
  objectif: "Réduction TG + satiété + transit"
  priorité: "🟠 IMPORTANT"
```

### Compléments conditionnels

```yaml
berbérine:
  dose: "500mg × 3/jour"
  prise: "Avant chaque repas"
  objectif: "Sensibilité insulinique"
  ❌ arrêt_pendant_jeûne: "OBLIGATOIRE (risque hypoglycémie)"
  
probiotiques:
  si: "Troubles digestifs ou post-antibiotiques"
  dose: "Selon indication"
```

---

## 🔄 Workflow génération Plan_Semaine_XX (VERSION 2.3)

### ÉTAPE 1 : Lecture contexte (OBLIGATOIRE)

```yaml
fichiers_à_lire:
  1_profil: "Profil_Medical.md (poids actuel, derniers biomarkers)"
  2_suivi: "Suivi_Biomarkers.md (tendances, volume sport précédent)"
  3_journal: "Journal_Quotidien.md S(XX-1) (adhérence, énergie, douleurs)"
  4_plan_precedent: "Plan_Semaine_(XX-1).md (ce qui était prévu)"
```

### ÉTAPE 2 : Calculs

```python
# MBR (Mifflin-St Jeor)
mbr = (10 * poids_kg) + (6.25 * taille_cm) - (5 * age) + 5

# Facteur activité adaptatif
if volume_sport_s_precedente < 90:
    facteur = 1.2
elif 90 <= volume < 180:
    facteur = 1.375
elif 180 <= volume < 300:
    facteur = 1.55
else:
    facteur = 1.725

# DET et objectif
det = mbr * facteur
calories_cible = det * 0.90  # -10% pour perte poids modérée

# Macros
proteines_g = round((1.6 * poids_kg) / 5) * 5
proteines_repas1 = 100
proteines_repas2 = proteines_g - 100

lipides_g = 50

calories_proteines = proteines_g * 4
calories_lipides = lipides_g * 9
calories_glucides = calories_cible - calories_proteines - calories_lipides
glucides_g = round(calories_glucides / 4)
```

### ÉTAPE 3 : Adaptation progression sport

```python
# Déterminer progression
adherence = lire_journal_s_precedente()["adherence_sport"]
energie = lire_journal_s_precedente()["energie_moyenne"]
cycle_position = determiner_position_cycle()

if cycle_position == "DELOAD":
    volume_cible = volume_s1_cycle * 0.63
    
elif cycle_position == "JEUNE":  # Semaine 2
    volume_cible = volume_s_precedente * 0.50  # Réduction 50% pendant jeûne
    note = "Semaine de jeûne - activités légères uniquement"
    
elif cycle_position == "REPRISE":  # Semaine 3
    volume_cible = volume_s_precedente * 0.70  # Réduction 30% pendant reprise
    note = "Reprise alimentaire - privilégier récupération"
    
elif adherence >= 90 and energie >= 7:
    volume_cible = volume_s_precedente * 1.05  # +5%
    
elif adherence >= 75 and energie >= 5:
    volume_cible = volume_s_precedente * 1.03  # +3%
    
else:
    volume_cible = volume_s_precedente  # Maintien
```

### ÉTAPE 4 : Génération des propositions de menus (NOUVELLE APPROCHE v2.3 ✨)

**Nouvelle approche en 3 phases** :

#### Phase 1 : Création du fichier de sélection

```yaml
action: "Créer Choix_Menus_Semaine_XX.md"
contenu:
  - 6 propositions complètes de menus
  - Chaque menu avec Repas 1 + Repas 2
  - Pour chaque catégorie (ENTRÉE, PROTÉINES, LÉGUMES, FÉCULENTS, LIPIDES, DESSERT):
      * Option A
      * Option B
      * Option C (vide, pour personnalisation utilisateur)
  - Cases à cocher pour sélection
  - Espaces pour annotations
  - Section récapitulative pour choisir 4 menus parmi 6
  - Section répartition hebdomadaire
  
contraintes_propositions:
  - Saisonnalité stricte (Deux-Sèvres + mois)
  - Variété protéines (viandes, poissons, œufs)
  - Poissons gras présents dans plusieurs menus
  - Diversité légumes de saison
  - Alternance féculents (quinoa, lentilles, pois chiches, riz, patates douces)
  - Desserts variés (skyr + fruits + chia, fromage, chocolat, yaourt grec)
  - Options A/B équivalentes nutritionnellement
  - Graines de chia dans plusieurs desserts
```

#### Phase 2 : Validation par l'utilisateur

```yaml
workflow:
  1. Claude génère "Choix_Menus_Semaine_XX.md"
  2. Utilisateur télécharge le fichier
  3. Utilisateur coche:
      - 4 menus parmi les 6 proposés
      - Pour chaque menu, option préférée (A, B ou C personnalisé)
      - Répartition hebdomadaire souhaitée
      - Annotations éventuelles
  4. Utilisateur uploade le fichier complété
```

#### Phase 3 : Génération Plan_Semaine_XX.md final

```yaml
action: "Lire Choix_Menus_Semaine_XX.md complété"
traitement:
  1. Extraire les 4 menus sélectionnés
  2. Pour chaque menu, récupérer les options cochées (A, B ou C)
  3. Compiler les menus selon répartition hebdomadaire
  4. Ajuster quantités si nécessaire (170g protéines, etc.)
  5. Générer liste de courses agrégée basée sur menus réels
  6. Calculer totaux nutritionnels
  7. Intégrer programme sport (inchangé)
  8. Finaliser Plan_Semaine_XX.md
```

### ÉTAPE 5 : Agrégation liste courses

```yaml
règles:
  - "1 ligne = 1 ingrédient agrégé sur 7 jours"
  - "Tri alphabétique par catégorie"
  - "Cases à cocher - [ ]"
  - "Unités précises (g, ml, u)"
  - "Mention (de saison) pour légumes/fruits"
  - "Préférence surgelé pour myrtilles/fraises"
  - "Quantités arrondies (multiple 50g)"
  - "Graines de chia ajoutées (150g pour semaine)"
  - "Créatine monohydrate (150g pour 1 mois)"
  - "Calculer selon menus réellement sélectionnés"
  
catégories:
  - "Légumes (de saison)"
  - "Légumineuses (poids sec)"
  - "Viandes / Poissons / Œufs"
  - "Produits laitiers"
  - "Céréales / Féculents"
  - "Fruits (de saison ou surgelés)"
  - "Oléagineux & graines"
  - "Huiles & condiments"
  - "Compléments alimentaires"

méthode_agrégation:
  - Compter occurrences de chaque menu dans la semaine
  - Multiplier quantités par nombre d'occurrences
  - Additionner tous les ingrédients identiques
  - Arrondir au multiple de 50g supérieur
```

---

## 📄 Format fichier Choix_Menus_Semaine_XX.md

```markdown
---
title: "Sélection Menus - Semaine XX"
date: "YYYY-MM-DD"
statut: "À compléter"
---

# 📋 Sélection des menus - Semaine XX

**Instructions** :
1. Sélectionnez 4 menus parmi les 6 propositions
2. Pour chaque catégorie, choisissez A, B ou remplissez C
3. Ajoutez vos annotations
4. Retournez ce fichier complété

---

## 🍽️ MENU 1

- [ ] **Je sélectionne ce menu pour ma semaine**

### REPAS 1 - 11h00 (1200 kcal)

#### ENTRÉE (150 kcal)
- [ ] **Option A** : Description détaillée
- [ ] **Option B** : Description détaillée  
- [ ] **Option C** : _________________________________

**Notes** : 

---

#### PROTÉINES (350 kcal ~100g)
- [ ] **Option A** : Description détaillée
- [ ] **Option B** : Description détaillée
- [ ] **Option C** : _________________________________

**Notes** : 

---

#### LÉGUMES (150 kcal)
- [ ] **Option A** : Description détaillée
- [ ] **Option B** : Description détaillée
- [ ] **Option C** : _________________________________

**Notes** : 

---

#### FÉCULENTS (300 kcal)
- [ ] **Option A** : Description détaillée
- [ ] **Option B** : Description détaillée
- [ ] **Option C** : _________________________________

**Notes** : 

---

#### LIPIDES (150 kcal)
- [ ] **Option A** : Description détaillée
- [ ] **Option B** : Description détaillée
- [ ] **Option C** : _________________________________

**Notes** : 

---

#### DESSERT (100 kcal)
- [ ] **Option A** : Description détaillée
- [ ] **Option B** : Description détaillée
- [ ] **Option C** : _________________________________

**Notes** : 

---

### REPAS 2 - 17h00 (900 kcal)

[... même structure pour Repas 2 ...]

---

## 🍽️ MENU 2

[... même structure complète ...]

---

## 🍽️ MENU 3

[... même structure complète ...]

---

## 🍽️ MENU 4

[... même structure complète ...]

---

## 🍽️ MENU 5

[... même structure complète ...]

---

## 🍽️ MENU 6

[... même structure complète ...]

---

## ✅ RÉCAPITULATIF

**Cochez les 4 menus sélectionnés** :
- [ ] Menu 1
- [ ] Menu 2
- [ ] Menu 3
- [ ] Menu 4
- [ ] Menu 5
- [ ] Menu 6

---

## 📅 RÉPARTITION HEBDOMADAIRE

- **Lundi** : Menu n° _____
- **Mardi** : Menu n° _____
- **Mercredi** : Menu n° _____
- **Jeudi** : Menu n° _____
- **Vendredi** : Menu n° _____
- **Samedi** : Menu n° _____
- **Dimanche** : Menu n° _____

---

## 💬 COMMENTAIRES GÉNÉRAUX

[Espace pour annotations, demandes spéciales, ajustements souhaités...]
```

---

## 🍖 NOUVELLE STRUCTURE MENUS v3.1 (Nov 2025)

### Principes directeurs

**Suite au diagnostic de Chylomicronémie**, la structure des menus a été repensée pour :
1. **Optimiser la satiété** malgré restriction lipidique drastique
2. **Faciliter l'organisation** avec poisson frais 2×/semaine
3. **Maintenir la variété** avec viandes en priorité
4. **Simplifier la préparation** avec soupes hebdomadaires

### Organisation hebdomadaire type

```yaml
lundi_mardi:
  proteine: "Poisson FRAIS (cabillaud, colin, lieu, sole)"
  raison: "Courses faites en début de semaine"
  frequence: "2 jours/semaine"
  
mercredi_jeudi_vendredi:
  proteine: "Viandes maigres (poulet, dinde, bœuf 5% MG, porc maigre)"
  raison: "Viandes mises en avant = satiété optimale"
  frequence: "3+ jours/semaine"
  
poisson_gras:
  frequence: "1-2×/semaine MAXIMUM"
  exemple: "Saumon, thon, maquereau"
  placement: "Semaine 4 du cycle (après 3 semaines poissons maigres)"
```

### Structure quotidienne des repas

#### REPAS 1 - 11h00 (1200 kcal)

**Entrée SYSTÉMATIQUE** :
```yaml
salade_composée:
  base: "Tomates, concombre, laitue, carottes, etc."
  volume: "200-300g légumes"
  assaisonnement: "Vinaigre (balsamique, cidre, vin) + moutarde + 1 c.à.c. huile d'olive MAX"
  
objectif:
  - "Fibres ++ pour satiété"
  - "Volume important sans lipides"
  - "Diversité légumes crus"
```

**Plat principal** :
```yaml
structure:
  proteine: "180-200g viande MAIGRE ou poisson"
  feculent: "150-200g (quinoa, riz basmati, patate douce, légumineuses)"
  legumes: "300-350g (vapeur, rôtis, grillés)"
  
priorite_viande:
  - "Blanc de poulet/dinde SANS PEAU"
  - "Bœuf haché 5% MG"
  - "Filet mignon de porc maigre"
  - "Poissons maigres (cabillaud, colin, lieu)"
  
cuisson_sans_mg:
  - "Vapeur, pochage"
  - "Four sans MG"
  - "Poêle antiadhésive sans ajout"
  - "Grill"
```

**Dessert** :
```yaml
base: "200g Skyr 0% ou Yaourt grec 0%"
fruits: "50g fruits surgelés (myrtilles, fraises, framboises)"
option: "5g graines chia (1×/semaine max)"
```

#### REPAS 2 - 17h00 (900 kcal)

**Entrée SYSTÉMATIQUE** :
```yaml
soupe_maison:
  volume: "250ml"
  preparation: "En début de semaine pour 4-7 jours"
  saison: "Novembre : poireaux, potimarron, butternut, carottes, céleri"
  lipides: "0-1 c.à.c. huile d'olive pour TOUTE la soupe"
  
avantages:
  - "Satiété immédiate avec peu de calories"
  - "Hydratation"
  - "Préparation groupée = gain temps"
  - "Légumes de saison variés"
```

**Plat principal** :
```yaml
structure:
  proteine: "150g viande MAIGRE"
  legumes: "350-400g (vapeur, grillés)"
  feculent: "80-100g légumineuses (lentilles, pois chiches)"
  
priorite:
  - "Viandes ultra-maigres"
  - "Volume légumes important"
  - "Cuisson simple, digestion facile"
  - "Pas de dessert (déjà Skyr au midi)"
```

### Organisation courses 2×/semaine

```yaml
course_1:
  jour: "Dimanche soir ou Lundi matin"
  contenu:
    - "2×200g poissons FRAIS maigres (cabillaud, colin, lieu, sole)"
    - "300-450g viandes maigres (poulet, dinde)"
    - "Légumes frais pour salades (tomates, concombre, laitue)"
    - "Légumes pour soupes (poireaux, carottes, courges)"
    - "Légumes accompagnements (brocoli, haricots verts, etc.)"
  
course_2:
  jour: "Mercredi ou Jeudi"
  contenu:
    - "300-450g viandes maigres (bœuf 5%, porc, dinde)"
    - "Légumes frais complémentaires"
    - "Produits laitiers 0% MG"
```

### Préparation soupes hebdomadaires

```yaml
moment: "Dimanche ou Lundi (1-2h préparation)"
quantite: "4-7 portions × 250ml"
conservation: "4-5 jours réfrigérateur"
rechauffage: "Chaque soir avant le repas"

soupes_novembre:
  - "Poireau-pomme de terre (classique)"
  - "Potimarron (légèrement sucrée)"
  - "Courge butternut-curry (épicée)"
  - "Carotte-gingembre (tonique)"
  - "Céleri-pomme de terre (rustique)"
  - "Courgette-basilic (légère)"
  
technique:
  base: "Légumes + eau/bouillon + oignon + épices"
  lipides: "0-1 c.à.c. huile d'olive POUR TOUTE LA PRÉPARATION"
  texture: "Mixer ou laisser en morceaux selon préférence"
```

### Rotation protéines sur cycle 4 semaines

```yaml
semaine_1:
  poissons_maigres: "2 jours (Lundi-Mardi)"
  viandes_maigres: "2+ jours (Mercredi-Dimanche)"
  poisson_gras: "0 jour"
  
semaine_2_JEUNE:
  lundi_jeudi: "JEÛNE 4 JOURS"
  vendredi_dimanche: "Reprise progressive (poissons ultra-maigres)"
  
semaine_3:
  poissons_maigres: "2 jours (Vendredi-Samedi post-jeûne)"
  viandes_maigres: "2+ jours (Dimanche-Jeudi)"
  poisson_gras: "0 jour (reprise)"
  
semaine_4:
  poissons_maigres: "1 jour (Lundi)"
  poisson_gras: "1 jour (Mardi - SAUMON)"
  viandes_maigres: "2+ jours (Mercredi-Dimanche)"
```

### Avantages nouvelle structure

**Pour l'utilisateur** :
- ✅ **Satiété maximale** : viandes + gros volumes légumes + soupes
- ✅ **Praticité** : poisson frais 2×/sem = courses optimisées
- ✅ **Variété** : rotation viandes + soupes saison
- ✅ **Gain temps** : soupes préparées à l'avance
- ✅ **Adhérence** : structure simple et répétable

**Pour la pathologie** :
- ✅ **Lipides contrôlés** : 15-22g/jour respecté
- ✅ **Protéines suffisantes** : 170g/jour maintenu
- ✅ **Fibres élevées** : salades + soupes + légumes
- ✅ **Satiété sans lipides** : volume compensatoire

---

---

## ⚠️ Règles CRITIQUES (mises à jour v3.0)

### ✅ TOUJOURS faire

1. **Lire TOUS les fichiers contexte** avant génération
2. **Créer fichier Choix_Menus_Semaine_XX.md** avec 6 propositions complètes
3. **Proposer options A/B équivalentes** nutritionnellement
4. **Laisser option C vide** pour personnalisation
5. **Attendre validation utilisateur** avant génération finale
6. **Respecter profil athlète** = gros volume repas 1
7. **Saisonnalité stricte** (Deux-Sèvres + mois)
8. **Progression conservative** (max +5%, deload obligatoire S4/8/12/16/20/24)
9. **Adapter selon journal** (adhérence + énergie + douleurs)
10. **Cases à cocher** dans tous les fichiers
11. **YAML front matter** complet
12. **Préférences alimentaires** strictement respectées
13. **Mode chylomicronémie PERMANENT** : lipides ≤23g/jour (10% kcal)
14. **Jeûne TOUJOURS en S2** du cycle 4 semaines
15. **EPAX 6 gél/jour** OBLIGATOIRE (oméga-3 essentiels)
16. **Créatine monohydrate** 5g/jour (prioritaire)
17. **Musculation résistance** 2-3×/semaine avec technique parfaite
18. **Agréger liste courses selon menus réellement sélectionnés**
19. **Protéines ultra-maigres** prioritaires (<5% MG)
20. **Poissons maigres** 5-6×/semaine (cabillaud, colin, lieu)
21. **Légumes abondants** 500-700g/jour (satiété sans lipides)
22. **Structure v3.1** : Salade + vinaigre MIDI / Soupe maison SOIR
23. **Viande en priorité** avec accompagnements (poulet, dinde, bœuf maigre)
24. **Poisson frais** en début de semaine (Lundi-Mardi) = courses 2×/sem
25. **Soupes de saison** préparées en début de semaine (4-7 portions)
26. **⭐ HUILE MCT COCO PRIORITAIRE** pour cuisson (ne forme PAS de chylomicrons)
27. **Reprise post-jeûne** : lipides ultra-contrôlés J+1 à J+6 (<20g/jour)

### ❌ JAMAIS faire

1. **Générer Plan_Semaine_XX.md** sans validation utilisateur
2. **Imposer menus** sans proposer de choix
3. **Oublier Option C** pour personnalisation
4. **Progression linéaire** sans deload
5. **Total par catégorie** dans liste courses
6. **Ingrédients hors saison** sans substitution
7. **Ignorer signaux alarme** (douleur, fatigue)
8. **HTML** dans fichiers (pur Markdown)
9. **Oublier EPAX** 6 gél/jour
10. **Oublier créatine** 5g/jour
11. **Menus "petit mangeur"** = frustration garantie
12. **Sarrasin ou riz complet** = interdits
13. **Moules** = pas aimées
14. **Fromages** = tous interdits (chylomicronémie)
15. **Berbérine pendant jeûne** = dangereux
16. **Charges lourdes épaulés** sans maîtrise technique
17. **Négliger échauffement** avec arthrose lombaire
18. **❌ AVOCAT** dans les menus (15g lipides/100g)
19. **❌ NOIX/OLÉAGINEUX** en portions normales (max 5g)
20. **❌ GRAINES CHIA** haute dose (max 5g/jour)
21. **❌ CHOCOLAT NOIR** dans desserts (trop gras)
22. **❌ POISSONS GRAS** >2×/semaine (trop lipides)
23. **❌ JAUNES D'ŒUFS** multiples (1-2 entiers/semaine max)
24. **❌ HUILE D'OLIVE** excessive (max 10g/jour = 2 c.à.c.)
25. **❌ REPRISE POST-JEÛNE** avec lipides (rebond chylomicrons)

---

## 📋 Checklist finale avant livraison (mise à jour v3.0)

### Pour Choix_Menus_Semaine_XX.md

- [ ] 6 propositions de menus complets
- [ ] Chaque menu avec Repas 1 + Repas 2
- [ ] Options A et B pour chaque catégorie
- [ ] Option C vide pour personnalisation
- [ ] Cases à cocher partout
- [ ] Espaces annotations
- [ ] Section récapitulative (choix 4 menus)
- [ ] Section répartition hebdomadaire
- [ ] Saisonnalité respectée
- [ ] **Lipides ≤23g/jour (10% kcal) VÉRIFIÉ**
- [ ] **Protéines ultra-maigres prioritaires**
- [ ] **Poissons maigres 5-6×/semaine**
- [ ] **Poissons gras 1-2×/semaine MAX**
- [ ] **AUCUN avocat, noix, fromage, chocolat**
- [ ] **Huile olive max 10g/jour (2 c.à.c.)**
- [ ] **Légumes 500-700g/jour**
- [ ] EPAX 6 gélules/jour mentionné
- [ ] Variété protéines/légumes/féculents
- [ ] Instructions claires
- [ ] Front matter YAML complet

### Pour Plan_Semaine_XX.md final

- [ ] Basé sur choix utilisateur validés
- [ ] 4 menus sélectionnés compilés
- [ ] Options cochées respectées
- [ ] Répartition hebdomadaire appliquée
- [ ] Quantités ajustées (170g protéines)
- [ ] **Total lipides ≤23g/jour VÉRIFIÉ sur chaque menu**
- [ ] **Repas 1 : ~10g lipides MAX**
- [ ] **Repas 2 : ~10g lipides MAX**
- [ ] **EPAX : 3-4g (source principale oméga-3)**
- [ ] Liste courses agrégée selon menus réels
- [ ] Programme sport adapté
- [ ] Tous les totaux cohérents
- [ ] Aucune section incomplète
- [ ] Front matter YAML complet
- [ ] Date début plan : vérifiée
- [ ] Position cycle identifiée
- [ ] Contraintes chylomicronémie respectées
- [ ] EPAX + Créatine mentionnés
- [ ] Avertissements reprise post-jeûne (S3)

---

## 🎯 Avantages nouvelle approche v3.0

**Pour l'utilisateur** :
- ✅ Choix entre 18 options complètes (6 menus × 3 options/catégorie)
- ✅ Personnalisation totale de chaque catégorie
- ✅ Possibilité d'annoter et d'ajuster
- ✅ Contrôle sur la répartition hebdomadaire
- ✅ Validation avant génération finale
- ✅ Pas de surprise dans les menus
- ✅ Vraie implication dans la conception
- ✅ **Menus adaptés à la chylomicronémie (lipides 10%)**

**Pour Claude** :
- ✅ Génération structurée en 2 phases
- ✅ Validation explicite avant finalisation
- ✅ Liste courses précise (pas d'approximation)
- ✅ Meilleurs ajustements nutritionnels
- ✅ Moins de risques d'erreur
- ✅ Documentation traçable des choix
- ✅ **Contrôle strict budget lipides 23g/jour**

---

## 💬 Philosophie du SKILL

**Ce n'est PAS un plan nutritionnel standard.**

C'est un système **adapté à un ancien athlète de haut niveau avec chylomicronémie** qui :
- A passé 19 ans à manger 3000-4000 kcal/jour
- Possède une discipline mentale exceptionnelle
- Est capable d'auto-expérimentation rigoureuse
- A BESOIN de volume alimentaire pour être satisfait
- Comprend son corps et sait l'écouter
- **Doit gérer une pathologie SÉRIEUSE nécessitant restriction lipidique drastique**

**Approche** : Dialogue > Automatisme rigide

L'utilisateur est ACTEUR de sa santé, Claude est assistant intelligent qui structure et optimise ce qui fonctionne déjà.

**Défi v3.0** : Maintenir satiété et adhérence malgré restriction lipidique majeure (23g vs 50g avant) par :
- Volume légumes ++
- Fibres élevées (≥40g)
- Protéines abondantes
- 2 repas copieux maintenus

---

## 📝 Notes de mise à jour v3.0

### Modifications majeures (01/11/2025)

1. **✅ DIAGNOSTIC CHYLOMICRONÉMIE CONFIRMÉ** :
   - TG 16.30 mmol/L + sérum lactescent
   - Pancréatites récidivantes
   - Résistance aux fibrates (Lipure +52%, Fénofibrate inefficace)
   - HDL très bas (0.33 g/L)

2. **✅ RESTRICTION LIPIDIQUE DRASTIQUE** :
   - **Avant** : 45-55g lipides/jour (20% kcal)
   - **Maintenant** : 20-25g lipides/jour (10% kcal)
   - Réduction de **50%** pour traiter chylomicronémie

3. **✅ ÉLIMINATIONS ALIMENTAIRES** :
   - ❌ Avocat (ancien favori)
   - ❌ Noix/oléagineux en portions normales (max 5g)
   - ❌ Fromages (tous)
   - ❌ Chocolat noir
   - ❌ Graines chia haute dose (5g max vs 15-20g)
   - ❌ Jaunes d'œufs multiples (1-2/semaine)
   - ⚠️ Poissons gras limités (1-2×/sem vs 3-4×)

4. **✅ COMPENSATIONS SATIÉTÉ** :
   - Légumes : 500-700g/jour (vs 400-600g)
   - Fibres : ≥40g/jour (vs ≥35g)
   - Glucides : 220-240g (vs 190-220g)
   - Protéines ultra-maigres prioritaires

5. **✅ PROTOCOLE REPRISE POST-JEÛNE MODIFIÉ** :
   - J5-J10 : Lipides ultra-contrôlés (<10g/jour J5-J6)
   - AUCUN avocat, huile, saumon en reprise
   - Priorité poissons maigres (cabillaud, colin)
   - Risque majeur rebond chylomicrons

6. **✅ MODE ULTRA-BASSE TG → MODE CHYLOMICRONÉMIE** :
   - N'est plus temporaire mais PERMANENT
   - Pathologie chronique nécessitant restriction à vie
   - Désactivation : jamais

### Conservé de v2.3

- Créatine monohydrate 5g/jour
- Musculation en résistance 2-3×/semaine
- EPAX 6 gél/jour (source UNIQUE oméga-3)
- Cycle 4 semaines avec jeûne en S2
- Adaptation progressive sport selon adhérence/énergie
- Structure 2 repas/jour (1200 + 900 kcal)
- Fenêtre alimentaire 11h-17h
- Profil athlète respecté (volume maintenu malgré restrictions)

---

## 📝 Notes de mise à jour v3.1

### Modifications majeures (01/11/2025) - Restructuration menus

1. **✅ NOUVELLE STRUCTURE REPAS** :
   - **REPAS 1 (Midi)** : Salade + vinaigre en entrée SYSTÉMATIQUE
   - **REPAS 2 (Soir)** : Soupe maison de saison en entrée SYSTÉMATIQUE
   - Viandes mises en PRIORITÉ (vs équilibre poisson/viande)
   - Volume légumes augmenté pour compensation lipides

2. **✅ ORGANISATION HEBDOMADAIRE** :
   - **Lundi-Mardi** : Poisson FRAIS (courses début semaine)
   - **Mercredi-Vendredi** : Viandes maigres (poulet, dinde, bœuf 5%)
   - **Poisson gras** : 1×/semaine SEULEMENT (Semaine 4 du cycle)
   - Courses 2×/semaine optimisées

3. **✅ PRÉPARATION SOUPES** :
   - Préparation groupée : 4-7 portions en début de semaine
   - Soupes de saison (poireaux, potimarron, butternut, carottes, céleri)
   - Lipides minimaux (0-1 c.à.c. huile pour TOUTE la soupe)
   - Gain de temps + satiété immédiate

4. **✅ SALADES ENTRÉES MIDI** :
   - Base légumes crus variés (200-300g)
   - Assaisonnement : vinaigre + moutarde + 1 c.à.c. huile d'olive MAX
   - Fibres ++ sans lipides excessifs
   - Volume compensatoire

5. **✅ AVANTAGES STRUCTURE v3.1** :
   - Satiété maximale (viandes + soupes + salades)
   - Praticité courses (poisson frais 2×/sem)
   - Variété maintenue (rotation viandes + soupes)
   - Adhérence optimisée (structure simple et répétable)
   - Lipides contrôlés (15-22g/jour)

---

**FIN DU SKILL v3.1**

Cette version reflète :
- Le diagnostic confirmé de chylomicronémie multifactorielle (v3.0)
- Les adaptations nutritionnelles majeures nécessaires (v3.0)
- La nouvelle structure des repas optimisée pour satiété et praticité (v3.1)

Ce document est la référence complète optimisée. Toute génération doit respecter ces règles.
