import {
  ConfigJeune,
  SemaineCycle,
  EtatJeune,
  HistoriqueJeune,
} from "@/types/profile";

/**
 * Protocole de réalimentation selon durée du jeûne
 *
 * Jour J+1 à J+7 (ou J+5 pour jeûne 3 jours)
 * Réintroduction PROGRESSIVE des lipides pour éviter choc métabolique
 */
export interface JourRealimentation {
  jour: number; // J+1, J+2, etc.
  calories_cibles: number; // kcal
  limite_lipides_g: number; // grammes max
  mct_autorise: boolean; // Huile MCT autorisée ?
  ajout_lipides_autorise: boolean; // Matières grasses ajoutées autorisées ?
  description: string;
  alerte?: string;
}

/**
 * Protocole de réalimentation pour jeûne de 4 jours (7 jours de reprise)
 */
const PROTOCOLE_REALIMENTATION_4J: JourRealimentation[] = [
  {
    jour: 1,
    calories_cibles: 800,
    limite_lipides_g: 10,
    mct_autorise: false,
    ajout_lipides_autorise: false,
    description: "Reprise très progressive",
    alerte:
      "⚠️ CRITIQUE : AUCUNE matière grasse ajoutée (même pas MCT). Lipides naturels uniquement.",
  },
  {
    jour: 2,
    calories_cibles: 1500,
    limite_lipides_g: 15,
    mct_autorise: false,
    ajout_lipides_autorise: false,
    description: "Augmentation calorique progressive",
    alerte:
      "⚠️ ATTENTION : Toujours AUCUNE matière grasse ajoutée. Lipides naturels seulement.",
  },
  {
    jour: 3,
    calories_cibles: 1800,
    limite_lipides_g: 20,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Réintroduction MCT (2 c. à café max)",
    alerte: "✓ Vous pouvez réintroduire l'huile MCT C8/C10 progressivement.",
  },
  {
    jour: 4,
    calories_cibles: 1950,
    limite_lipides_g: 20,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Stabilisation progressive",
  },
  {
    jour: 5,
    calories_cibles: 2000,
    limite_lipides_g: 22,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Retour progressif à la normale",
  },
  {
    jour: 6,
    calories_cibles: 2050,
    limite_lipides_g: 23,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Quasi normale",
  },
  {
    jour: 7,
    calories_cibles: 2100,
    limite_lipides_g: 25,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Fin de réalimentation - Contrôle TG à J+7",
    alerte:
      "🩺 CONTRÔLE : Vérifier les TG aujourd'hui pour valider la réussite du protocole.",
  },
];

/**
 * Protocole de réalimentation pour jeûne de 3 jours (5 jours de reprise)
 */
const PROTOCOLE_REALIMENTATION_3J: JourRealimentation[] = [
  {
    jour: 1,
    calories_cibles: 800,
    limite_lipides_g: 10,
    mct_autorise: false,
    ajout_lipides_autorise: false,
    description: "Reprise très progressive",
    alerte:
      "⚠️ CRITIQUE : AUCUNE matière grasse ajoutée (même pas MCT). Lipides naturels uniquement.",
  },
  {
    jour: 2,
    calories_cibles: 1500,
    limite_lipides_g: 15,
    mct_autorise: false,
    ajout_lipides_autorise: false,
    description: "Augmentation calorique progressive",
    alerte:
      "⚠️ ATTENTION : Toujours AUCUNE matière grasse ajoutée. Lipides naturels seulement.",
  },
  {
    jour: 3,
    calories_cibles: 1800,
    limite_lipides_g: 20,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Réintroduction MCT (2 c. à café max)",
    alerte: "✓ Vous pouvez réintroduire l'huile MCT C8/C10 progressivement.",
  },
  {
    jour: 4,
    calories_cibles: 2000,
    limite_lipides_g: 22,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Retour progressif à la normale",
  },
  {
    jour: 5,
    calories_cibles: 2100,
    limite_lipides_g: 25,
    mct_autorise: true,
    ajout_lipides_autorise: true,
    description: "Fin de réalimentation - Contrôle TG à J+5",
    alerte:
      "🩺 CONTRÔLE : Vérifier les TG aujourd'hui pour valider la réussite du protocole.",
  },
];

/**
 * Retourne le protocole de réalimentation selon la durée du jeûne
 */
export function getProtocoleRealimentation(
  duree_jeune_jours: 3 | 4
): JourRealimentation[] {
  return duree_jeune_jours === 4
    ? PROTOCOLE_REALIMENTATION_4J
    : PROTOCOLE_REALIMENTATION_3J;
}

/**
 * Calcule le nombre de jours de réalimentation selon la durée du jeûne
 */
export function getNombreJoursRealimentation(duree_jeune_jours: 3 | 4): number {
  return duree_jeune_jours === 4 ? 7 : 5;
}

/**
 * Détermine l'état actuel du protocole de jeûne
 */
export function determinerEtatJeune(config: ConfigJeune): {
  etat: EtatJeune;
  jour_realimentation?: number;
  infos_jour?: JourRealimentation;
  jours_restants?: number;
} {
  if (!config.actif || !config.date_debut_jeune) {
    return { etat: "INACTIF" };
  }

  const maintenant = new Date();
  const debut_jeune = new Date(config.date_debut_jeune);

  // Calculer fin du jeûne
  const fin_jeune = new Date(debut_jeune);
  fin_jeune.setDate(fin_jeune.getDate() + config.duree_jours);

  // Calculer fin de réalimentation
  const nb_jours_realimentation = getNombreJoursRealimentation(
    config.duree_jours
  );
  const fin_realimentation = new Date(fin_jeune);
  fin_realimentation.setDate(
    fin_realimentation.getDate() + nb_jours_realimentation
  );

  // Vérifier si en jeûne
  if (maintenant < fin_jeune) {
    const jours_restants = Math.ceil(
      (fin_jeune.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      etat: "EN_JEUNE",
      jours_restants,
    };
  }

  // Vérifier si en réalimentation
  if (maintenant < fin_realimentation) {
    // Calculer jour de réalimentation (J+1, J+2, etc.)
    const jours_depuis_fin_jeune = Math.floor(
      (maintenant.getTime() - fin_jeune.getTime()) / (1000 * 60 * 60 * 24)
    );
    const jour_realimentation = jours_depuis_fin_jeune + 1;

    const protocole = getProtocoleRealimentation(config.duree_jours);
    const infos_jour = protocole[jour_realimentation - 1];

    const jours_restants =
      nb_jours_realimentation - jours_depuis_fin_jeune - 1;

    return {
      etat: "REALIMENTATION",
      jour_realimentation,
      infos_jour,
      jours_restants,
    };
  }

  // Cycle terminé
  return { etat: "INACTIF" };
}

/**
 * Calcule la limite lipidique à appliquer selon l'état du jeûne
 * Priorise la limite de réalimentation si plus stricte que la limite TG
 */
export function getLimiteLipidesJeune(
  config: ConfigJeune | undefined,
  limite_lipides_tg?: number
): number | undefined {
  if (!config || !config.actif) {
    return undefined;
  }

  const etat = determinerEtatJeune(config);

  // Pendant le jeûne : 0g
  if (etat.etat === "EN_JEUNE") {
    return 0;
  }

  // Pendant la réalimentation : suivre le protocole
  if (etat.etat === "REALIMENTATION" && etat.infos_jour) {
    const limite_realimentation = etat.infos_jour.limite_lipides_g;

    // Prendre le minimum entre limite réalimentation et limite TG
    if (limite_lipides_tg !== undefined) {
      return Math.min(limite_realimentation, limite_lipides_tg);
    }

    return limite_realimentation;
  }

  return undefined;
}

/**
 * Détermine le jour du cycle de 4 semaines (1-28)
 */
export function getJourCycle(date_debut_cycle: Date): number {
  const maintenant = new Date();
  const debut = new Date(date_debut_cycle);

  const jours_ecoules = Math.floor(
    (maintenant.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Cycle de 4 semaines = 28 jours
  const jour_cycle = (jours_ecoules % 28) + 1;

  return jour_cycle;
}

/**
 * Détermine la semaine actuelle du cycle (S1, S2, S3, S4)
 */
export function getSemaineCycle(date_debut_cycle: Date): SemaineCycle {
  const jour = getJourCycle(date_debut_cycle);

  if (jour <= 7) return "S1";
  if (jour <= 14) return "S2";
  if (jour <= 21) return "S3";
  return "S4";
}

/**
 * Vérifie si c'est le moment de commencer le jeûne
 * (premier jour de la semaine configurée)
 */
export function doitCommencerJeune(config: ConfigJeune): boolean {
  if (!config.actif || !config.date_debut_cycle) {
    return false;
  }

  const semaine_actuelle = getSemaineCycle(config.date_debut_cycle);
  const jour_cycle = getJourCycle(config.date_debut_cycle);

  // Vérifier si on est au premier jour de la semaine configurée
  const premier_jour_semaine =
    semaine_actuelle === "S1"
      ? 1
      : semaine_actuelle === "S2"
      ? 8
      : semaine_actuelle === "S3"
      ? 15
      : 22;

  return (
    semaine_actuelle === config.semaine_jeune &&
    jour_cycle === premier_jour_semaine &&
    !config.date_debut_jeune
  );
}

/**
 * Démarre un nouveau cycle de jeûne
 */
export function demarrerJeune(config: ConfigJeune): ConfigJeune {
  const maintenant = new Date();

  return {
    ...config,
    etat_actuel: "EN_JEUNE",
    date_debut_jeune: maintenant,
    date_fin_jeune: new Date(
      maintenant.getTime() + config.duree_jours * 24 * 60 * 60 * 1000
    ),
  };
}

/**
 * Termine le jeûne actuel et l'ajoute à l'historique
 */
export function terminerJeune(
  config: ConfigJeune,
  tg_avant?: number,
  tg_apres?: number,
  notes?: string
): ConfigJeune {
  if (!config.date_debut_jeune || !config.date_fin_jeune) {
    return config;
  }

  const nouvel_historique: HistoriqueJeune = {
    id: `jeune_${Date.now()}`,
    date_debut: config.date_debut_jeune,
    date_fin: config.date_fin_jeune,
    duree_jours: config.duree_jours,
    semaine_cycle: config.semaine_jeune,
    tg_avant_g_l: tg_avant,
    tg_apres_g_l: tg_apres,
    notes,
  };

  return {
    ...config,
    etat_actuel: "INACTIF",
    date_debut_jeune: undefined,
    date_fin_jeune: undefined,
    jour_realimentation: undefined,
    historique: [...(config.historique || []), nouvel_historique],
  };
}

/**
 * Retourne les restrictions sportives selon l'état du jeûne
 */
export function getRestrictionsSport(
  config: ConfigJeune | undefined,
  semaine_cycle?: SemaineCycle
): {
  interdit: boolean;
  deload: boolean;
  message?: string;
} {
  // S4 = Toujours déload (-40% volume et charges)
  if (semaine_cycle === "S4") {
    return {
      interdit: false,
      deload: true,
      message:
        "🔻 DELOAD : Réduire volume (-40%) et charges (-40%) pour récupération",
    };
  }

  if (!config || !config.actif) {
    return { interdit: false, deload: false };
  }

  const etat = determinerEtatJeune(config);

  // Pendant le jeûne : Sport INTERDIT
  if (etat.etat === "EN_JEUNE") {
    return {
      interdit: true,
      deload: false,
      message: "🚫 Sport INTERDIT pendant le jeûne (risque hypoglycémie sévère)",
    };
  }

  // Pendant réalimentation : Sport léger autorisé à partir de J+3
  if (etat.etat === "REALIMENTATION" && etat.jour_realimentation) {
    if (etat.jour_realimentation < 3) {
      return {
        interdit: true,
        deload: false,
        message:
          "🚫 Sport INTERDIT (réalimentation en cours, attendre J+3 minimum)",
      };
    } else {
      return {
        interdit: false,
        deload: true,
        message: "⚠️ Sport léger autorisé (cardio zone 2 max, pas de HIIT)",
      };
    }
  }

  return { interdit: false, deload: false };
}

/**
 * Retourne un résumé textuel de l'état du protocole
 */
export function getResumeProtocoleJeune(config: ConfigJeune | undefined): string {
  if (!config || !config.actif) {
    return "Protocole de jeûne inactif";
  }

  const etat = determinerEtatJeune(config);

  if (etat.etat === "EN_JEUNE") {
    return `Jeûne en cours (Jour ${config.duree_jours - (etat.jours_restants || 0) + 1}/${config.duree_jours})`;
  }

  if (etat.etat === "REALIMENTATION") {
    const nb_jours = getNombreJoursRealimentation(config.duree_jours);
    return `Réalimentation J+${etat.jour_realimentation}/${nb_jours}`;
  }

  return `Cycle normal (${config.semaine_jeune} configurée pour jeûne)`;
}
