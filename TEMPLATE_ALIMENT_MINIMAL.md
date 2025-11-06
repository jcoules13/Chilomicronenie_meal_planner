---
nom: "NOM_ALIMENT"
categorie: "CATEGORIE"
saison: "Toute année"
compatible_chylomicronemie: "BON"
index_glycemique: "50"
lipides_100g: "3"
---

# NOM_ALIMENT

> **Catégorie** : CATEGORIE
> **Compatibilité chylomicronémie** : 🔵 BON ⭐⭐

## 📊 VALEURS NUTRITIONNELLES (pour 100g)

| Nutriment | Quantité |
|-----------|----------|
| **Énergie** | XXX kcal |
| **Protéines** | XXg |
| **Glucides** | XXg |
| **Lipides** | XXg |
| **Fibres** | XXg |

## 🎯 INDEX GLYCÉMIQUE
**IG** : ~XX

---

## 📝 VERSION MINIMALE

Ce template contient uniquement les **champs obligatoires** pour créer une fiche aliment fonctionnelle.

### Champs OBLIGATOIRES dans le frontmatter (---) :
- `nom` : Nom de l'aliment
- `categorie` : Catégorie (voir liste ci-dessous)
- `saison` : Saison principale ou "Toute année"
- `compatible_chylomicronemie` : EXCELLENT / BON / MODERE / DECONSEILLE
- `index_glycemique` : Valeur numérique (0-100)
- `lipides_100g` : Valeur numérique en grammes

### Champs OBLIGATOIRES dans le tableau nutritionnel :
- Énergie (kcal)
- Protéines (g)
- Glucides (g)
- Lipides (g)
- Fibres (g)

### Catégories possibles :
Légumes, Fruits, Protéines, Féculents, Légumineuses, Produits laitiers, Noix et graines, Huiles et matières grasses, Aromates, Condiments, Boissons

### Compatibilité chylomicronémie :
- **EXCELLENT** : Lipides <2g/100g
- **BON** : Lipides 2-5g/100g
- **MODERE** : Lipides 5-10g/100g
- **DECONSEILLE** : Lipides >10g/100g

---

## 💡 EXEMPLE REMPLI

```markdown
---
nom: "Brocoli"
categorie: "Légumes"
saison: "Automne"
compatible_chylomicronemie: "EXCELLENT"
index_glycemique: "15"
lipides_100g: "0.4"
---

# Brocoli

> **Catégorie** : Légumes
> **Compatibilité chylomicronémie** : 🟢 EXCELLENT ⭐⭐⭐

## 📊 VALEURS NUTRITIONNELLES (pour 100g)

| Nutriment | Quantité |
|-----------|----------|
| **Énergie** | 35 kcal |
| **Protéines** | 2.8g |
| **Glucides** | 7g |
| **Lipides** | 0.4g |
| **Fibres** | 2.6g |

## 🎯 INDEX GLYCÉMIQUE
**IG** : ~15
```

---

**Tous les autres champs sont OPTIONNELS** et peuvent être ajoutés plus tard via l'interface web.
