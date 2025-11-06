# ✅ CHECKLIST DÉVELOPPEMENT - Application Nutrition & Santé

## 📋 PHASES DE DÉVELOPPEMENT

### Phase 1 : Setup & Infrastructure ✅
- [x] 1.1 Initialisation projet Next.js + Tailwind + shadcn/ui
- [x] 1.2 Configuration IndexedDB (wrapper + schéma + CRUD)
- [x] 1.3 Layout global (Sidebar + Header + Dark mode)
- [x] ✅ **Validation Phase 1** : App démarre, navigation OK, IndexedDB opérationnel

---

### Phase 2 : Base de Données Aliments ✅
- [x] 2.1 Types & modèles Aliment
- [x] 2.2 Parser Markdown (import .md Obsidian)
- [x] 2.3 Page liste aliments (grid + filtres + recherche)
- [x] 2.4 CRUD aliments (create, read, update, delete)
- [x] 2.5 Import/Export Markdown
- [x] ✅ **Validation Phase 2** : API corrigée (fiche_aliment/), import fonctionnel, CRUD complet, filtres efficaces

---

### Phase 3 : Profil Utilisateur & Calculs ✅
- [x] 3.1 Page profil (formulaire complet)
- [x] 3.2 Calculs auto (IMC, macros, zones FC, limite lipidique adaptative selon TG)
- [x] 3.3 Assouplissement régime (limite lipidique 10-20g selon zone TG)
- [x] 3.4 Protocole de jeûne (cycle 4 semaines avec réalimentation progressive)
- [x] ✅ **Validation Phase 3** : Profil sauvegardé, macros calculées, zones FC exactes, limite lipidique adaptative opérationnelle

---

### Phase 4 : Générateur de Menus 🔄
- [x] 4.1 Logique génération (algorithme + contraintes)
  - ✅ Génération semaine complète (7 jours)
  - ✅ Rotation automatique protéines (Poulet, Boeuf, Dinde, Poisson, Végé)
  - ✅ Sélection aliments depuis IndexedDB avec filtres (chylo, IG, saison)
  - ✅ Respect contraintes profil (macros, lipides adaptatives)
  - ✅ Structure REPAS 1: Salade + Protéine + Légumes + Féculents + Dessert
  - ✅ Structure REPAS 2: Soupe + Protéine + Légumes + Légumineuses
- [x] 4.2 Interface génération (options + prévisualisation)
  - ✅ Page `/menus/generer` avec formulaire
  - ✅ Affichage contraintes profil
  - ✅ Sélection saisons
  - ✅ Prévisualisation menus générés
- [ ] 4.3 Gestion jeûnes (protocole J1-J11) - À implémenter
- [ ] 4.4 Export menus Markdown + génération liste courses - À implémenter
- [ ] ✅ **Validation Phase 4** : Menu généré respecte pathologie, export MD, liste courses OK

---

### Phase 5 : Listes de Courses ⬜
- [ ] 5.1 Génération auto (hebdo/mensuel)
- [ ] 5.2 Interface (checkboxes + impression)
- [ ] ✅ **Validation Phase 5** : Liste générée correcte, UI pratique

---

### Phase 6 : Programme Sportif ⬜
- [ ] 6.1 Générateur 24 semaines (progression + deload)
- [ ] 6.2 Interface calendrier (vue 24 semaines + détail)
- [ ] 6.3 Journal séances (formulaire + historique)
- [ ] 6.4 Graphiques progression
- [ ] ✅ **Validation Phase 6** : Programme cohérent, journal fonctionnel

---

### Phase 7 : Journal Quotidien ⬜
- [ ] 7.1 Formulaire saisie quotidienne
- [ ] 7.2 Historique & graphiques (poids, sommeil, corrélations)
- [ ] 7.3 Export données CSV
- [ ] ✅ **Validation Phase 7** : Saisie fluide, graphiques pertinents

---

### Phase 8 : Suivi Médical (Analyses) ⬜
- [ ] 8.1 Formulaire analyses sanguines
- [ ] 8.2 Dashboard analyses (cards + indicateurs)
- [ ] 8.3 Graphiques évolution (TG, HbA1c, HOMA + seuils)
- [ ] 8.4 Intégration assouplissement auto
- [ ] ✅ **Validation Phase 8** : Analyses saisies OK, graphiques lisibles, assouplissement auto

---

### Phase 9 : Rendez-vous (Optionnel) ⬜
- [ ] 9.1 Simple calendrier RDV (CRUD + notes + export iCal)
- [ ] ✅ **Validation Phase 9** : Calendrier fonctionnel

---

### Phase 10 : Polish & Optimisations ⬜
- [ ] 10.1 Responsive design (mobile/tablette)
- [ ] 10.2 Performance (lazy loading, optimisations)
- [ ] 10.3 Tests end-to-end (workflows complets)
- [ ] ✅ **Validation Phase 10** : Application complète, fluide, sans bugs

---

## 🎯 PRIORITÉS

| Fonctionnalité | Priorité | Phase |
|----------------|----------|-------|
| Base de données aliments | 5 ⭐⭐⭐⭐⭐ | Phase 2 |
| Générateur de menus | 5 ⭐⭐⭐⭐⭐ | Phase 4 |
| Programme sportif | 5 ⭐⭐⭐⭐⭐ | Phase 6 |
| Suivi quotidien | 5 ⭐⭐⭐⭐⭐ | Phase 7 |
| Suivi médical | 4 ⭐⭐⭐⭐ | Phase 8 |
| Listes de courses | Auto (Phase 4) | Phase 5 |
| Gestion RDV | 1 ⭐ | Phase 9 |

---

## 📊 AVANCEMENT GLOBAL

```
[████████████████░░░░░░░░░░░░░░] 50% - Phases 1-3 complètes + Phase 4 en cours

Phase actuelle : Phase 4 - Générateur de Menus (60% complet)
Prochaine étape : Export Markdown + Liste de courses automatique
```

---

## 🔧 COMMANDES UTILES

```bash
# Démarrer le développement
npm run dev

# Build production
npm run build

# Ajouter un composant shadcn/ui
npx shadcn-ui@latest add [component-name]

# Vérifier TypeScript
npm run type-check
```

---

## 📝 NOTES & DÉCISIONS

### Décisions techniques prises :
- [ ] Framework : Next.js (App Router) ✅
- [ ] Styling : Tailwind CSS + shadcn/ui ✅
- [ ] Base de données : IndexedDB (locale) ✅
- [ ] Dark mode : Provider + switch soleil/lune ✅

### Points d'attention :
- ⚠️ Chylomicronémie = lipides 10-20g/jour selon niveau TG (recommandations NLA 2025)
  - TG ≥ 10 g/L (critique) → 10g lipides/jour
  - TG 5-10 g/L (danger) → 15g lipides/jour
  - TG 2-5 g/L (modéré) → 18g lipides/jour
  - TG < 2 g/L (limite/normal) → 20g lipides/jour
- ⚠️ Calcul macros : Protéines priorité > Lipides selon pathologie > Glucides = reste
- ⚠️ Protocole jeûne : cycle 4 semaines (S1: Test | S2: Jeûne | S3: Suite | S4: Deload)
- ⚠️ Zones cardiaques calculées depuis FC Max (formule Tanaka)

### Questions en suspens :
- _Aucune pour le moment_

---

## 🐛 BUGS & PROBLÈMES

_Aucun bug détecté pour le moment_

---

## ✨ AMÉLIORATIONS FUTURES (v2)

- [ ] Base de recettes
- [ ] Notifications/rappels
- [ ] IA suggestions menus
- [ ] Photos plats/aliments
- [ ] Sync cloud (backup optionnel)
- [ ] Version multi-utilisateurs (coach/nutritionniste)
- [ ] Export PDF complet pour médecin
- [ ] Intégration API nutritionnelles externes
- [ ] Scan code-barres aliments

---

**Dernière mise à jour** : 2025-11-06
**Version actuelle** : 0.1.0 (développement)

---

## 🔄 CHANGELOG

### 2025-11-06
- ✅ Phase 1 complète : Setup & Infrastructure
- ✅ Phase 2 complète : Base de données aliments (bug API corrigé : fiche_aliment/)
- ✅ Phase 3 complète : Profil utilisateur avec limite lipidique adaptative selon TG
- 🔧 Correction recommandations lipides : 10-20g/jour selon zone TG (sources NLA 2025)
- 🚀 Phase 4 en cours : Générateur de menus (60% complet)
  - ✅ Algorithme génération semaine complète (7 jours)
  - ✅ Rotation automatique protéines (Poulet → Boeuf → Dinde → Poisson → Végé)
  - ✅ Sélection aliments intelligente (filtres chylo, IG, saison)
  - ✅ Page `/menus/generer` avec formulaire et prévisualisation
  - ✅ Structure repas: REPAS 1 (Salade + Plat + Dessert) / REPAS 2 (Soupe + Plat)
  - ⏳ Reste à faire: Export Markdown + Liste de courses auto
