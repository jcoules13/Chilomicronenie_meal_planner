/**
 * Générateur automatique de menus pour une semaine complète
 * Respecte les contraintes du profil utilisateur (chylomicronémie, macros, IG)
 */

import { UserProfile } from "@/types/profile";
import { MenuV31, TypeProteine, CIBLES_MENU_V31 } from "@/types/menu";
import { Aliment, Saison } from "@/types/aliment";
import { getAll } from "@/lib/db/queries";
import {
  creerComposantSaladeVinegree,
  creerComposantSoupeMaison,
  creerComposantProteine,
  creerComposantLegumes,
  creerComposantFeculents,
  creerComposantDessert,
  creerRepas1Template,
  creerRepas2Template,
  creerMenuV31Template,
} from "./menu-templates-v31";
import { getEtatJourDansProtocole } from "./fasting-protocol";
import { nanoid } from "nanoid";

interface OptionsGeneration {
  profile: UserProfile;
  dateDebut: Date;
  saisons: Saison[];
}

/**
 * Rotation des protéines pour une semaine (7 jours)
 * Semaine 4 : Poisson gras (au lieu de maigre)
 */
const ROTATION_PROTEINES: TypeProteine[] = [
  "Poulet",         // Jour 1
  "Boeuf",          // Jour 2
  "Dinde",          // Jour 3
  "Poisson Maigre", // Jour 4 (Poisson Gras en semaine 4)
  "Poulet",         // Jour 5
  "Boeuf",          // Jour 6
  "Végétarien",     // Jour 7
];

/**
 * Filtrer les aliments compatibles avec les contraintes
 */
function filtrerAlimentsCompatibles(
  aliments: Aliment[],
  contraintes: {
    chylomicronemie: boolean;
    saisons: Saison[];
    categorie?: string;
    lipides_max_100g?: number;
    ig_max?: number;
  }
): Aliment[] {
  return aliments.filter((aliment) => {
    // Compatibilité chylomicronémie
    if (contraintes.chylomicronemie) {
      const compat = aliment.compatible_chylomicronemie;
      if (compat !== "EXCELLENT" && compat !== "BON") return false;

      // Lipides stricts
      if (aliment.valeurs_nutritionnelles_100g.lipides_g > 5) return false;
    }

    // Lipides max (si spécifié)
    if (
      contraintes.lipides_max_100g !== undefined &&
      aliment.valeurs_nutritionnelles_100g.lipides_g > contraintes.lipides_max_100g
    ) {
      return false;
    }

    // Index glycémique max
    if (
      contraintes.ig_max !== undefined &&
      aliment.index_glycemique > contraintes.ig_max
    ) {
      return false;
    }

    // Catégorie
    if (
      contraintes.categorie &&
      aliment.categorie !== contraintes.categorie
    ) {
      return false;
    }

    // Saison (Toute année = toujours compatible)
    if (aliment.saison.includes("Toute année")) return true;

    // Au moins une saison en commun
    const saisonsCommunes = aliment.saison.filter((s) =>
      contraintes.saisons.includes(s)
    );
    if (saisonsCommunes.length === 0) return false;

    return true;
  });
}

/**
 * Sélectionner un aliment aléatoire dans une liste
 */
function selectionnerAleatoire<T>(liste: T[]): T | null {
  if (liste.length === 0) return null;
  return liste[Math.floor(Math.random() * liste.length)];
}

/**
 * Générer un menu pour un jour
 */
async function genererMenuJour(
  numeroJour: number,
  date: Date,
  typeProteine: TypeProteine,
  aliments: Aliment[],
  options: OptionsGeneration
): Promise<MenuV31 | null> {
  const { profile, saisons } = options;
  const contrainteChylo = profile.contraintes_sante.chylomicronemie;

  // Vérifier l'état du jour selon le protocole de jeûne
  const etatJour = getEtatJourDansProtocole(date, profile.config_jeune);

  // Si en jeûne : ne pas générer de menu
  if (etatJour.etat === "EN_JEUNE") {
    return null; // Skip ce jour (jeûne = pas de repas)
  }

  // REPAS 1 : Salade + Protéine + Légumes + Féculents + Dessert
  const salade = creerComposantSaladeVinegree();

  // Protéine REPAS 1
  let proteine1;
  if (typeProteine === "Poulet") {
    proteine1 = creerComposantProteine("poulet", 200, 2);
  } else if (typeProteine === "Dinde") {
    proteine1 = creerComposantProteine("dinde", 200, 2);
  } else if (typeProteine === "Boeuf") {
    proteine1 = creerComposantProteine("boeuf", 180, 3);
  } else if (typeProteine === "Poisson Maigre") {
    proteine1 = creerComposantProteine("poisson_maigre", 220, 1);
  } else if (typeProteine === "Poisson Gras") {
    proteine1 = creerComposantProteine("poisson_gras", 180, 8);
  } else {
    // Végétarien : utiliser des œufs ou tofu
    proteine1 = creerComposantProteine("poulet", 200, 2); // Fallback
    proteine1.description = "Œufs (4 blancs + 2 jaunes) ou Tofu ferme";
  }

  // Légumes REPAS 1
  const legumesDispos = filtrerAlimentsCompatibles(aliments, {
    chylomicronemie: contrainteChylo,
    saisons,
    categorie: "Légumes",
    lipides_max_100g: 1,
  });
  const legume1 = selectionnerAleatoire(legumesDispos);
  const legume2 = selectionnerAleatoire(
    legumesDispos.filter((l) => l.id !== legume1?.id)
  );

  const legumes1 = creerComposantLegumes(
    [
      {
        nom: legume1?.nom || "Brocoli",
        quantite: 200,
        unite: "g",
      },
      {
        nom: legume2?.nom || "Courgettes",
        quantite: 150,
        unite: "g",
      },
    ],
    "Vapeur 12-15 min"
  );

  // Féculents REPAS 1 (IG bas prioritaire)
  const feculents1 = creerComposantFeculents("lentilles_vertes", 80);

  // Dessert
  const dessert1 = creerComposantDessert("skyr_myrtilles");

  // Calculer répartition des macros depuis le profil
  let macrosJour = {
    calories: profile.valeurs_calculees?.besoins_energetiques_kcal || 2100,
    proteines_g: profile.valeurs_calculees?.macros_quotidiens.proteines_g || 170,
    lipides_g: profile.valeurs_calculees?.macros_quotidiens.lipides_g || 15,
    glucides_g: profile.valeurs_calculees?.macros_quotidiens.glucides_g || 280,
  };

  // ⚠️ RÉALIMENTATION : Adapter les macros selon le protocole
  if (etatJour.etat === "REALIMENTATION" && etatJour.infos_jour) {
    const protocole = etatJour.infos_jour;

    // Override calories et lipides selon le protocole de réalimentation
    macrosJour.calories = protocole.calories_cibles;
    macrosJour.lipides_g = protocole.limite_lipides_g;

    // Recalculer les glucides pour maintenir l'équilibre calorique
    // Calories = (P × 4) + (L × 9) + (G × 4)
    const kcal_proteines = macrosJour.proteines_g * 4;
    const kcal_lipides = macrosJour.lipides_g * 9;
    const kcal_restantes = macrosJour.calories - kcal_proteines - kcal_lipides;
    macrosJour.glucides_g = Math.max(0, Math.round(kcal_restantes / 4));
  }

  // Déterminer le ratio de répartition selon le preset
  let ratioRepas1 = 0.6; // Par défaut MATIN_PLUS (60/40)
  let ratioRepas2 = 0.4;

  switch (profile.preset_repartition) {
    case "EQUILIBRE":
      ratioRepas1 = 0.5;
      ratioRepas2 = 0.5;
      break;
    case "MATIN_PLUS":
      ratioRepas1 = 0.6;
      ratioRepas2 = 0.4;
      break;
    case "MATIN_TRES_PLUS":
      ratioRepas1 = 0.7;
      ratioRepas2 = 0.3;
      break;
    case "SOIR_PLUS": // "Midi+" selon l'utilisateur (Repas 2 = 17h)
      ratioRepas1 = 0.4;
      ratioRepas2 = 0.6;
      break;
    case "SOIR_TRES_PLUS": // "Midi++" selon l'utilisateur
      ratioRepas1 = 0.3;
      ratioRepas2 = 0.7;
      break;
    default:
      // CUSTOM ou autre : utiliser 60/40 par défaut
      ratioRepas1 = 0.6;
      ratioRepas2 = 0.4;
  }

  const macrosRepas1 = {
    calories_cibles: Math.round(macrosJour.calories * ratioRepas1),
    proteines_cibles_g: Math.round(macrosJour.proteines_g * ratioRepas1),
    lipides_cibles_g: Math.round(macrosJour.lipides_g * ratioRepas1),
    glucides_cibles_g: Math.round(macrosJour.glucides_g * ratioRepas1),
  };

  const macrosRepas2 = {
    calories_cibles: Math.round(macrosJour.calories * ratioRepas2),
    proteines_cibles_g: Math.round(macrosJour.proteines_g * ratioRepas2),
    lipides_cibles_g: Math.round(macrosJour.lipides_g * ratioRepas2),
    glucides_cibles_g: Math.round(macrosJour.glucides_g * ratioRepas2),
  };

  const repas1 = creerRepas1Template(
    proteine1,
    legumes1,
    feculents1,
    salade,
    dessert1,
    macrosRepas1
  );

  // REPAS 2 : Soupe + Protéine + Légumes + Légumineuses
  const soupe = creerComposantSoupeMaison("Soupe de saison", saisons[0]);

  // Protéine REPAS 2 (même type que REPAS 1)
  let proteine2;
  if (typeProteine === "Poulet") {
    proteine2 = creerComposantProteine("poulet", 150, 1.5);
  } else if (typeProteine === "Dinde") {
    proteine2 = creerComposantProteine("dinde", 150, 1.5);
  } else if (typeProteine === "Boeuf") {
    proteine2 = creerComposantProteine("boeuf", 140, 2);
  } else if (typeProteine === "Poisson Maigre") {
    proteine2 = creerComposantProteine("poisson_maigre", 170, 1);
  } else if (typeProteine === "Poisson Gras") {
    proteine2 = creerComposantProteine("poisson_gras", 140, 6);
  } else {
    proteine2 = creerComposantProteine("poulet", 150, 1.5);
    proteine2.description = "Tofu ferme ou Tempeh";
  }

  // Légumes REPAS 2
  const legume3 = selectionnerAleatoire(
    legumesDispos.filter(
      (l) => l.id !== legume1?.id && l.id !== legume2?.id
    )
  );
  const legumes2 = creerComposantLegumes(
    [
      {
        nom: legume3?.nom || "Haricots verts",
        quantite: 250,
        unite: "g",
      },
    ],
    "Vapeur 12-15 min",
    false
  );

  // Légumineuses REPAS 2
  const legumineuses2 = creerComposantFeculents("lentilles_corail", 60);

  const repas2 = creerRepas2Template(proteine2, legumes2, legumineuses2, soupe, macrosRepas2);

  // Créer tags adaptés à l'état du jour
  const tags = ["Généré auto", saisons.join(", ")];
  let nomMenu = `Menu J${numeroJour} - ${typeProteine}`;

  if (etatJour.etat === "REALIMENTATION" && etatJour.jour_realimentation) {
    tags.push(`Réalimentation J+${etatJour.jour_realimentation}`);
    nomMenu = `Menu J${numeroJour} - ${typeProteine} (Réalimentation J+${etatJour.jour_realimentation})`;

    // Ajouter les alertes du protocole si présentes
    if (etatJour.infos_jour?.alerte) {
      tags.push(etatJour.infos_jour.alerte);
    }
  }

  // Créer le menu complet
  const menuTemplate = creerMenuV31Template({
    nom: nomMenu,
    numero: numeroJour,
    type_proteine: typeProteine,
    frequence: typeProteine === "Poisson Gras" ? "SEMAINE_4" : "HEBDOMADAIRE",
    saisons,
    repas_1: repas1,
    repas_2: repas2,
    ig_moyen: 42,
    tags,
    macros_profil: {
      calories_totales: macrosJour.calories,
      proteines_totales_g: macrosJour.proteines_g,
      lipides_totaux_g: macrosJour.lipides_g,
      glucides_totaux_g: macrosJour.glucides_g,
    },
  });

  // Ajouter métadonnées
  const menu: MenuV31 = {
    ...menuTemplate,
    id: nanoid(),
    date_creation: new Date(),
    date_modification: new Date(),
  };

  return menu;
}

/**
 * Générer une semaine complète de menus (7 jours)
 */
export async function genererSemaineMenus(
  options: OptionsGeneration
): Promise<MenuV31[]> {
  // 1. Charger TOUS les aliments UNE SEULE FOIS (éviter requêtes multiples)
  const aliments = await getAll<Aliment>("aliments");

  if (aliments.length === 0) {
    throw new Error(
      "Aucun aliment dans la base. Veuillez d'abord charger les aliments depuis Markdown."
    );
  }

  // 2. Générer les 7 menus SÉQUENTIELLEMENT (pas en parallèle, éviter surcharge)
  const menus: MenuV31[] = [];

  for (let jour = 1; jour <= 7; jour++) {
    // Calculer la date du jour
    const dateJour = new Date(options.dateDebut);
    dateJour.setDate(dateJour.getDate() + (jour - 1));

    const typeProteine = ROTATION_PROTEINES[jour - 1];

    // Semaine 4 : remplacer Poisson Maigre par Poisson Gras
    const typeFinal =
      typeProteine === "Poisson Maigre" && jour === 4
        ? "Poisson Gras"
        : typeProteine;

    const menu = await genererMenuJour(jour, dateJour, typeFinal, aliments, options);

    // Si menu = null (jour de jeûne), skip ce jour
    if (menu !== null) {
      menus.push(menu);
    }
  }

  return menus;
}

/**
 * Exporter les menus en Markdown
 */
export function exporterMenusMarkdown(menus: MenuV31[]): string {
  const fichiers: string[] = [];

  menus.forEach((menu, index) => {
    const jour = index + 1;
    const dateMenu = new Date(menu.date_creation);
    const dateStr = dateMenu.toLocaleDateString("fr-FR");

    // YAML frontmatter
    let md = `---\n`;
    md += `nom: "${menu.nom}"\n`;
    md += `type_proteine: "${menu.type_proteine}"\n`;
    md += `numero: ${menu.numero}\n`;
    md += `date: "${dateStr}"\n`;
    md += `lipides_totaux: "${menu.lipides_cibles_g}g"\n`;
    md += `ig_moyen: "Bas"\n`;
    md += `genere_automatiquement: true\n`;
    md += `---\n\n`;

    // Titre
    const emoji = menu.type_proteine === "Poulet" ? "🍗" :
                  menu.type_proteine === "Boeuf" ? "🥩" :
                  menu.type_proteine === "Dinde" ? "🦃" :
                  menu.type_proteine.includes("Poisson") ? "🐟" : "🥗";
    md += `# ${emoji} ${menu.nom} - Jour ${jour}\n\n`;

    md += `> ⚠️ **Menu généré automatiquement**  \n`;
    md += `> Date de génération : ${dateStr}  \n`;
    md += `> Type de protéine : ${menu.type_proteine}\n\n`;
    md += `---\n\n`;

    // Objectifs nutritionnels
    md += `## 📊 Informations nutritionnelles CIBLES\n\n`;
    md += `| Repas | Calories | Protéines | Lipides | Glucides |\n`;
    md += `|-------|----------|-----------|---------|----------|\n`;
    md += `| **Repas 1 (11h)** | ${menu.repas_1.calories_cibles} kcal | ${menu.repas_1.proteines_cibles_g}g | ${menu.repas_1.lipides_cibles_g}g | ${menu.repas_1.glucides_cibles_g}g |\n`;
    md += `| **Repas 2 (17h)** | ${menu.repas_2.calories_cibles} kcal | ${menu.repas_2.proteines_cibles_g}g | ${menu.repas_2.lipides_cibles_g}g | ${menu.repas_2.glucides_cibles_g}g |\n`;

    const totalCal = menu.repas_1.calories_cibles + menu.repas_2.calories_cibles;
    const totalProt = menu.repas_1.proteines_cibles_g + menu.repas_2.proteines_cibles_g;
    const totalLip = menu.repas_1.lipides_cibles_g + menu.repas_2.lipides_cibles_g;
    const totalGluc = menu.repas_1.glucides_cibles_g + menu.repas_2.glucides_cibles_g;

    md += `| **TOTAL JOUR** | **${totalCal} kcal** | **${totalProt}g** | **${totalLip}g** | **${totalGluc}g** |\n\n`;
    md += `**Budget lipides strict** : ${menu.lipides_cibles_g}g/jour maximum (chylomicronémie)\n\n`;
    md += `---\n\n`;

    // REPAS 1
    md += `## 🍽️ REPAS 1 - 11h00 (${menu.repas_1.calories_cibles} kcal)\n\n`;

    // Entrée (Salade)
    const salade = menu.repas_1.composants.find(c => c.nom.includes("ENTRÉE") || c.nom.includes("Salade"));
    if (salade) {
      md += `### 🥗 ENTRÉE - ${salade.nom}\n\n`;
      md += `**Composition** :\n`;
      salade.ingredients.forEach(ing => {
        md += `- ${ing.nom} : ${ing.quantite}${ing.unite}\n`;
      });
      md += `\n**Assaisonnement STRICT** :\n`;
      md += `- Vinaigre balsamique : 2 c.à.soupe\n`;
      md += `- Moutarde : 1 c.à.café\n`;
      md += `- **Huile d'olive : 1 c.à.café (5g) MAX** ⚠️\n\n`;
      md += `---\n\n`;
    }

    // Protéine
    const proteine1 = menu.repas_1.composants.find(c => c.nom.includes("PROTÉINE"));
    if (proteine1) {
      md += `### ${emoji} PROTÉINE (${proteine1.calories || 0} kcal)\n\n`;
      md += `**${proteine1.description}**\n\n`;
      if (proteine1.ingredients.length > 0) {
        md += `**Quantité** : ${proteine1.ingredients[0].quantite}${proteine1.ingredients[0].unite}\n\n`;
      }
      md += `**Cuisson sans matière grasse** :\n`;
      md += `- Vapeur, poché, four 180°C ou poêle antiadhésive\n\n`;
      md += `---\n\n`;
    }

    // Légumes
    const legumes1 = menu.repas_1.composants.find(c => c.nom.includes("LÉGUMES"));
    if (legumes1) {
      md += `### 🥦 LÉGUMES (${legumes1.calories || 0} kcal)\n\n`;
      legumes1.ingredients.forEach(ing => {
        md += `- ${ing.nom} : ${ing.quantite}${ing.unite}\n`;
      });
      md += `\n**Cuisson** : ${legumes1.cuisson || "Vapeur, four ou poêle légère"}\n`;
      md += `**Assaisonnement** : Herbes, épices, citron\n\n`;
      md += `---\n\n`;
    }

    // Féculents
    const feculents = menu.repas_1.composants.find(c => c.nom.includes("FÉCULENTS"));
    if (feculents) {
      md += `### 🍚 FÉCULENTS (${feculents.calories || 0} kcal)\n\n`;
      md += `**${feculents.description}**\n\n`;
      if (feculents.ingredients.length > 0) {
        md += `**Quantité** : ${feculents.ingredients[0].quantite}${feculents.ingredients[0].unite}\n\n`;
      }
      md += `**⭐ IG BAS recommandé** : Privilégier lentilles (IG 30), quinoa (IG 35)\n\n`;
      md += `---\n\n`;
    }

    // Dessert
    const dessert = menu.repas_1.composants.find(c => c.nom.includes("DESSERT"));
    if (dessert) {
      md += `### 🍨 DESSERT (${dessert.calories || 0} kcal)\n\n`;
      dessert.ingredients.forEach(ing => {
        md += `- ${ing.nom} : ${ing.quantite}${ing.unite}\n`;
      });
      md += `\n`;
      md += `---\n\n`;
    }

    // REPAS 2
    md += `## 🥣 REPAS 2 - 17h00 (${menu.repas_2.calories_cibles} kcal)\n\n`;

    // Entrée (Soupe)
    const soupe = menu.repas_2.composants.find(c => c.nom.includes("ENTRÉE") || c.nom.includes("Soupe"));
    if (soupe) {
      md += `### 🍲 ENTRÉE - ${soupe.nom}\n\n`;
      md += `**Portion** : 250ml\n\n`;
      md += `**Composition** :\n`;
      soupe.ingredients.forEach(ing => {
        md += `- ${ing.nom} : ${ing.quantite}${ing.unite}\n`;
      });
      md += `\n**Préparation** : Cuire les légumes dans bouillon, mixer si souhaité\n\n`;
      md += `---\n\n`;
    }

    // Protéine
    const proteine2 = menu.repas_2.composants.find(c => c.nom.includes("PROTÉINE"));
    if (proteine2) {
      md += `### ${emoji} PROTÉINE (${proteine2.calories || 0} kcal)\n\n`;
      md += `**${proteine2.description}**\n\n`;
      if (proteine2.ingredients.length > 0) {
        md += `**Quantité** : ${proteine2.ingredients[0].quantite}${proteine2.ingredients[0].unite}\n\n`;
      }
      md += `---\n\n`;
    }

    // Légumes d'accompagnement
    const legumes2 = menu.repas_2.composants.find(c => c.nom.includes("LÉGUMES"));
    if (legumes2) {
      md += `### 🥦 LÉGUMES D'ACCOMPAGNEMENT (${legumes2.calories || 0} kcal)\n\n`;
      legumes2.ingredients.forEach(ing => {
        md += `- ${ing.nom} : ${ing.quantite}${ing.unite}\n`;
      });
      md += `\n**Cuisson** : ${legumes2.cuisson || "Vapeur ou poêle légère"}\n\n`;
      md += `---\n\n`;
    }

    // Légumineuses
    const legumineuses = menu.repas_2.composants.find(c => c.nom.includes("LÉGUMINEUSES"));
    if (legumineuses) {
      md += `### 🫘 LÉGUMINEUSES (${legumineuses.calories || 0} kcal)\n\n`;
      md += `**${legumineuses.description}**\n\n`;
      if (legumineuses.ingredients.length > 0) {
        md += `**Quantité** : ${legumineuses.ingredients[0].quantite}${legumineuses.ingredients[0].unite}\n\n`;
      }
      md += `**⭐ IG BAS** : Excellentes pour la glycémie\n\n`;
      md += `---\n\n`;
    }

    // Récapitulatif
    md += `## 📊 RÉCAPITULATIF NUTRITIONNEL JOURNÉE\n\n`;
    md += `| Nutriment | Cible | Réalisé | Statut |\n`;
    md += `|-----------|-------|---------|--------|\n`;
    md += `| **Calories** | ${totalCal} | ${totalCal} | ✅ |\n`;
    md += `| **Protéines** | ${totalProt}g | ${totalProt}g | ✅ |\n`;
    md += `| **Lipides** | ${totalLip}g | ${totalLip}g | ✅ Respecté |\n`;
    md += `| **Glucides** | ${totalGluc}g | ${totalGluc}g | ✅ |\n\n`;
    md += `---\n\n`;

    // Points critiques
    md += `## ⚠️ POINTS CRITIQUES - CHYLOMICRONÉMIE\n\n`;
    md += `### ✅ CE MENU RESPECTE :\n`;
    md += `1. **Budget lipides ${menu.lipides_cibles_g}g/jour** strictement contrôlé\n`;
    md += `2. **Protéines ultra-maigres** sélectionnées\n`;
    md += `3. **IG BAS** prioritaire\n`;
    md += `4. **Fibres élevées** pour satiété\n\n`;
    md += `### ❌ À ÉVITER ABSOLUMENT :\n`;
    md += `- ❌ Ajouter matières grasses supplémentaires\n`;
    md += `- ❌ Augmenter les portions sans ajustement\n`;
    md += `- ❌ Peau/graisses visibles sur protéines\n\n`;
    md += `---\n\n`;

    // Tags
    md += `## 🏷️ Tags & Métadonnées\n\n`;
    md += `#menu #${menu.type_proteine.toLowerCase().replace(" ", "-")} #genere-auto #ig-bas #chylomicronémie-compatible\n\n`;
    md += `**Date génération** : ${dateStr}\n`;
    md += `**Version** : 1.0 (auto)\n\n`;

    fichiers.push(md);
  });

  // Combiner tous les fichiers avec séparateur
  return fichiers.join("\n\n---\n\n# NOUVEAU MENU\n\n---\n\n");
}

/**
 * Générer liste de courses à partir des menus
 */
export function genererListeCourses(menus: MenuV31[]): string {
  // Structure pour regrouper les ingrédients
  interface Ingredient {
    nom: string;
    quantite_totale: number;
    unite: string;
    categorie: string;
  }

  const ingredients = new Map<string, Ingredient>();

  // Parcourir tous les menus et leurs composants
  menus.forEach((menu) => {
    // REPAS 1
    menu.repas_1.composants.forEach((composant) => {
      const categorie = composant.nom.includes("PROTÉINE") ? "Protéines" :
                        composant.nom.includes("LÉGUMES") ? "Légumes" :
                        composant.nom.includes("FÉCULENTS") ? "Féculents" :
                        composant.nom.includes("ENTRÉE") || composant.nom.includes("Salade") ? "Entrées/Salades" :
                        composant.nom.includes("DESSERT") ? "Desserts" : "Autres";

      composant.ingredients.forEach((ingredient) => {
        const key = ingredient.nom.toLowerCase();

        // Convertir tout en grammes
        let quantite_g = ingredient.quantite;
        if (ingredient.unite === "ml") {
          quantite_g = ingredient.quantite; // 1ml ≈ 1g pour liquides
        } else if (ingredient.unite !== "g") {
          quantite_g = ingredient.quantite * 100; // Estimation pour unités
        }

        if (ingredients.has(key)) {
          const existing = ingredients.get(key)!;
          existing.quantite_totale += quantite_g;
        } else {
          ingredients.set(key, {
            nom: ingredient.nom,
            quantite_totale: quantite_g,
            unite: "g",
            categorie,
          });
        }
      });
    });

    // REPAS 2
    menu.repas_2.composants.forEach((composant) => {
      const categorie = composant.nom.includes("PROTÉINE") ? "Protéines" :
                        composant.nom.includes("LÉGUMES") ? "Légumes" :
                        composant.nom.includes("LÉGUMINEUSES") ? "Légumineuses" :
                        composant.nom.includes("ENTRÉE") || composant.nom.includes("Soupe") ? "Soupes" : "Autres";

      composant.ingredients.forEach((ingredient) => {
        const key = ingredient.nom.toLowerCase();

        // Convertir tout en grammes
        let quantite_g = ingredient.quantite;
        if (ingredient.unite === "ml") {
          quantite_g = ingredient.quantite;
        } else if (ingredient.unite !== "g") {
          quantite_g = ingredient.quantite * 100;
        }

        if (ingredients.has(key)) {
          const existing = ingredients.get(key)!;
          existing.quantite_totale += quantite_g;
        } else {
          ingredients.set(key, {
            nom: ingredient.nom,
            quantite_totale: quantite_g,
            unite: "g",
            categorie,
          });
        }
      });
    });
  });

  // Regrouper par catégorie
  const parCategorie = new Map<string, Ingredient[]>();

  ingredients.forEach((ingredient) => {
    if (!parCategorie.has(ingredient.categorie)) {
      parCategorie.set(ingredient.categorie, []);
    }
    parCategorie.get(ingredient.categorie)!.push(ingredient);
  });

  // Générer le Markdown
  let md = `# 🛒 Liste de courses - Semaine du ${new Date().toLocaleDateString("fr-FR")}\n\n`;
  md += `> 📋 Liste générée automatiquement pour ${menus.length} jours de menus  \n`;
  md += `> ⚠️ Quantités en grammes - À ajuster selon disponibilité magasin\n\n`;
  md += `---\n\n`;

  // Ordre des catégories
  const ordreCategories = [
    "Protéines",
    "Légumes",
    "Féculents",
    "Légumineuses",
    "Entrées/Salades",
    "Soupes",
    "Desserts",
    "Autres"
  ];

  ordreCategories.forEach((categorie) => {
    if (parCategorie.has(categorie)) {
      const items = parCategorie.get(categorie)!;

      // Emoji par catégorie
      const emoji = categorie === "Protéines" ? "🍖" :
                    categorie === "Légumes" ? "🥬" :
                    categorie === "Féculents" ? "🌾" :
                    categorie === "Légumineuses" ? "🫘" :
                    categorie === "Entrées/Salades" ? "🥗" :
                    categorie === "Soupes" ? "🍲" :
                    categorie === "Desserts" ? "🍨" : "📦";

      md += `## ${emoji} ${categorie}\n\n`;

      // Trier par ordre alphabétique
      items.sort((a, b) => a.nom.localeCompare(b.nom));

      items.forEach((item) => {
        // Arrondir les quantités
        const quantite = Math.ceil(item.quantite_totale);
        md += `- [ ] **${item.nom}** : ${quantite}${item.unite}\n`;
      });

      md += `\n`;
    }
  });

  // Section assaisonnements de base
  md += `---\n\n`;
  md += `## 🧂 Assaisonnements & Condiments de base\n\n`;
  md += `- [ ] **Huile d'olive** : 50ml (pour vinaigrettes)\n`;
  md += `- [ ] **Vinaigre balsamique** : 1 bouteille\n`;
  md += `- [ ] **Moutarde** : 1 pot\n`;
  md += `- [ ] **Sel, poivre** : À vérifier stock\n`;
  md += `- [ ] **Herbes** : Thym, romarin, basilic, persil\n`;
  md += `- [ ] **Épices** : Curcuma, curry, paprika, cannelle\n`;
  md += `- [ ] **Citron** : 3-4 unités\n`;
  md += `- [ ] **Ail, oignon** : À vérifier stock\n\n`;

  md += `---\n\n`;
  md += `## 📝 Conseils d'achat\n\n`;
  md += `### Conversions utiles :\n`;
  md += `- **Viande/Poisson** : Les quantités sont en grammes CRU\n`;
  md += `- **Féculents/Légumineuses** : Les quantités sont en grammes SEC (non cuit)\n`;
  md += `- **Légumes** : Les quantités sont en grammes NET (épluchés/nettoyés)\n\n`;
  md += `### Substitutions possibles :\n`;
  md += `- **Blanc de poulet** → Blanc de dinde (équivalent)\n`;
  md += `- **Poisson maigre** → Cabillaud, colin, lieu noir (interchangeables)\n`;
  md += `- **Lentilles vertes** ↔ Lentilles corail (IG similaire)\n`;
  md += `- **Légumes frais** → Surgelés nature (aussi nutritifs)\n\n`;
  md += `### Organisation courses :\n`;
  md += `1. **Rayon frais** : Viandes, poissons (acheter en dernier)\n`;
  md += `2. **Rayon fruits/légumes** : Vérifier fraîcheur, privilégier local\n`;
  md += `3. **Rayon sec** : Féculents, légumineuses (en vrac si possible)\n`;
  md += `4. **Rayon frais** : Produits laitiers (skyr, fromage blanc 0%)\n\n`;

  md += `---\n\n`;
  md += `## ⏰ Conservation & Préparation\n\n`;
  md += `### À préparer dès retour des courses :\n`;
  md += `1. **Laver et couper** les légumes → Boîtes hermétiques (3-4 jours)\n`;
  md += `2. **Diviser les viandes** en portions → Congeler ce qui sera utilisé après J+3\n`;
  md += `3. **Cuire les légumineuses** en grande quantité → Frigo 4-5 jours\n`;
  md += `4. **Préparer les soupes** de la semaine → Portions individuelles\n\n`;

  md += `### Durées de conservation (frigo 4°C) :\n`;
  md += `- Viande crue : 2-3 jours\n`;
  md += `- Poisson cru : 1-2 jours\n`;
  md += `- Légumes coupés : 3-4 jours\n`;
  md += `- Légumineuses cuites : 4-5 jours\n`;
  md += `- Soupes maison : 4-5 jours\n\n`;

  md += `---\n\n`;
  md += `**Dernière mise à jour** : ${new Date().toLocaleDateString("fr-FR")}\n`;
  md += `**Version** : 1.0 (auto)\n`;

  return md;
}
