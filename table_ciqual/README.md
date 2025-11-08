# Table CIQUAL - Instructions

Ce dossier contient la table CIQUAL complète pour l'import dans l'application.

## 📥 Téléchargement

**Source officielle :** https://ciqual.anses.fr/#/cms/download/node/20

Ou version 2020 : https://www.data.gouv.fr/datasets/table-de-composition-nutritionnelle-des-aliments-ciqual-2020

## 📂 Fichiers attendus

Placez ici le fichier CSV CIQUAL **dézippé** :
- Nom suggéré : `ciqual_2025.csv` ou `Table_Ciqual_2020.csv`
- Format : CSV avec séparateur point-virgule ou virgule
- Encodage : UTF-8

## 📋 Structure CSV attendue

Le fichier doit contenir au minimum ces colonnes :
- `alim_code` ou `Code` : Code CIQUAL
- `alim_nom_fr` ou `Nom` : Nom français
- `alim_grp_nom_fr` ou `Groupe` : Groupe alimentaire
- `Energie (kcal/100 g)` : Énergie
- `Protéines (g/100 g)` : Protéines
- `Lipides (g/100 g)` : Lipides
- `Glucides (g/100 g)` : Glucides
- `Fibres alimentaires (g/100 g)` : Fibres

## 🚀 Import

Une fois le fichier placé ici, utilisez l'interface `/ingredients` pour lancer l'import automatique.
