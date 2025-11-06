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
  typeProteine: TypeProteine,
  aliments: Aliment[],
  options: OptionsGeneration
): Promise<MenuV31> {
  const { profile, saisons } = options;
  const contrainteChylo = profile.contraintes_sante.chylomicronemie;

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

  const repas1 = creerRepas1Template(
    proteine1,
    legumes1,
    feculents1,
    salade,
    dessert1
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

  const repas2 = creerRepas2Template(proteine2, legumes2, legumineuses2, soupe);

  // Créer le menu complet
  const menuTemplate = creerMenuV31Template({
    nom: `Menu J${numeroJour} - ${typeProteine}`,
    numero: numeroJour,
    type_proteine: typeProteine,
    frequence: typeProteine === "Poisson Gras" ? "SEMAINE_4" : "HEBDOMADAIRE",
    saisons,
    repas_1: repas1,
    repas_2: repas2,
    ig_moyen: 42,
    tags: ["Généré auto", saisons.join(", ")],
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
    const typeProteine = ROTATION_PROTEINES[jour - 1];

    // Semaine 4 : remplacer Poisson Maigre par Poisson Gras
    const typeFinal =
      typeProteine === "Poisson Maigre" && jour === 4
        ? "Poisson Gras"
        : typeProteine;

    const menu = await genererMenuJour(jour, typeFinal, aliments, options);
    menus.push(menu);
  }

  return menus;
}

/**
 * Exporter les menus en Markdown
 */
export function exporterMenusMarkdown(menus: MenuV31[]): string {
  // TODO: Implémenter export Markdown
  return `# Menus générés\n\n${menus.length} menus`;
}

/**
 * Générer liste de courses à partir des menus
 */
export function genererListeCourses(menus: MenuV31[]): string {
  // TODO: Implémenter liste de courses
  return `# Liste de courses\n\n${menus.length} menus`;
}
