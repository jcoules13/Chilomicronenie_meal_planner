# 🚀 Workflow Git Simplifié

## 🌿 Ta branche de travail

Tu travailles sur : **`claude/fix-project-crash-011CUsCEe8wYLixu76uM8peG`**

> 💡 **Astuce** : Considère cette branche comme ta branche "main". C'est ta seule branche de travail !

---

## 📝 Commandes essentielles (mémoire de poisson rouge friendly !)

### 🔍 Voir où tu en es

```bash
git status
```
→ Montre les fichiers modifiés, la branche actuelle, etc.

---

### 💾 Sauvegarder ton travail

**Méthode classique (3 étapes) :**

```bash
# 1. Ajouter tous les fichiers modifiés
git add -A

# 2. Créer un commit avec un message
git commit -m "Description de tes changements"

# 3. Envoyer sur le serveur
git push
```

**Méthode rapide (tout en une ligne) :**

```bash
git add -A && git commit -m "Description" && git push
```

---

### 🔄 Récupérer les derniers changements

```bash
git pull
```
→ À faire au début de chaque session de travail

---

### 📜 Voir l'historique

```bash
# Les 10 derniers commits (court)
git log --oneline -10

# Historique détaillé avec graphique
git log --graph --oneline --all --decorate
```

---

### 🆘 En cas de problème

**J'ai modifié des fichiers par erreur :**
```bash
# Annuler les modifications d'un fichier
git restore nom-du-fichier

# Annuler TOUTES les modifications
git restore .
```

**J'ai ajouté des fichiers par erreur (avant commit) :**
```bash
git restore --staged nom-du-fichier
```

**Je veux voir ce qui a changé :**
```bash
# Voir les différences non commitées
git diff

# Voir les différences d'un fichier spécifique
git diff nom-du-fichier
```

---

## 🎯 Workflow complet pour une session

**1. Commencer à travailler :**
```bash
cd ~/Chilomicronenie_meal_planner
git pull                    # Récupérer les derniers changements
git status                  # Vérifier qu'on est sur la bonne branche
```

**2. Travailler normalement...**
- Modifier des fichiers
- Ajouter des features
- Corriger des bugs

**3. Terminer la session :**
```bash
git status                  # Voir ce qui a changé
git add -A                  # Ajouter tous les changements
git commit -m "Description claire de ce que tu as fait"
git push                    # Envoyer sur le serveur
```

---

## 💡 Aide-mémoire express

| Commande | Action |
|----------|--------|
| `git status` | Où j'en suis ? |
| `git pull` | Récupérer les changements |
| `git add -A` | Ajouter tous les fichiers |
| `git commit -m "..."` | Sauvegarder avec message |
| `git push` | Envoyer au serveur |
| `git log --oneline -10` | Historique récent |
| `git diff` | Voir les modifications |

---

## 🔧 Script utile

Pour voir un rappel rapide :
```bash
./git-memo.sh
```

---

**Dernière mise à jour** : 2025-11-08
