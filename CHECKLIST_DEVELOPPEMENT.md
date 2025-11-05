# ✅ CHECKLIST DÉVELOPPEMENT - Application Nutrition & Santé

## 📋 PHASES DE DÉVELOPPEMENT

### Phase 1 : Setup & Infrastructure ⬜
- [ ] 1.1 Initialisation projet Next.js + Tailwind + shadcn/ui
- [ ] 1.2 Configuration IndexedDB (wrapper + schéma + CRUD)
- [ ] 1.3 Layout global (Sidebar + Header + Dark mode)
- [ ] ✅ **Validation Phase 1** : App démarre, navigation OK, IndexedDB opérationnel

---

### Phase 2 : Base de Données Aliments ⬜
- [ ] 2.1 Types & modèles Aliment
- [ ] 2.2 Parser Markdown (import .md Obsidian)
- [ ] 2.3 Page liste aliments (grid + filtres + recherche)
- [ ] 2.4 CRUD aliments (create, read, update, delete)
- [ ] 2.5 Import/Export Markdown
- [ ] ✅ **Validation Phase 2** : Import 120 fiches OK, CRUD complet, filtres efficaces

---

### Phase 3 : Profil Utilisateur & Calculs ⬜
- [ ] 3.1 Page profil (formulaire complet)
- [ ] 3.2 Calculs auto (IMC, macros, zones FC)
- [ ] 3.3 Assouplissement régime (slider 0-100%)
- [ ] ✅ **Validation Phase 3** : Profil sauvegardé, macros calculées, zones FC exactes

---

### Phase 4 : Générateur de Menus ⬜
- [ ] 4.1 Logique génération (algorithme + contraintes)
- [ ] 4.2 Interface génération (options + prévisualisation + édition)
- [ ] 4.3 Gestion jeûnes (protocole J1-J11)
- [ ] 4.4 Export menus Markdown + génération liste courses
- [ ] ✅ **Validation Phase 4** : Menu généré respecte pathologie, édition OK, export MD

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
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - Pas encore démarré

Phase actuelle : Phase 1 - Setup & Infrastructure
Prochaine étape : Initialisation projet Next.js
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
- ⚠️ Chylomicronémie = lipides max 30-35g/jour en mode strict
- ⚠️ Calcul macros : Protéines priorité > Lipides selon pathologie > Glucides = reste
- ⚠️ Jeûnes mensuels : protocole spécifique J1-J11 (2e semaine)
- ⚠️ Zones cardiaques calculées depuis FC Max

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

**Dernière mise à jour** : [Date à remplir]  
**Version actuelle** : 0.1.0 (développement)
