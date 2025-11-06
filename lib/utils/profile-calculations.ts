import {
  UserProfile,
  ValeursCalculees,
  Sexe,
  NiveauActivite,
  ObjectifSante,
  ZoneTG,
  COEFFICIENTS_ACTIVITE,
  CATEGORIES_IMC,
  ZONES_TG,
} from "@/types/profile";

/**
 * Calcule l'IMC (Indice de Masse Corporelle)
 * IMC = poids (kg) / taille (m)²
 */
export function calculerIMC(poids_kg: number, taille_cm: number): number {
  const taille_m = taille_cm / 100;
  return parseFloat((poids_kg / (taille_m * taille_m)).toFixed(1));
}

/**
 * Détermine la catégorie d'IMC
 */
export function getCategorieIMC(
  imc: number
): "MAIGREUR" | "NORMAL" | "SURPOIDS" | "OBESITE" {
  if (imc < 18.5) return "MAIGREUR";
  if (imc < 25) return "NORMAL";
  if (imc < 30) return "SURPOIDS";
  return "OBESITE";
}

/**
 * Calcule le métabolisme de base (MB) selon la formule de Mifflin-St Jeor
 *
 * Homme : MB = (10 × poids en kg) + (6,25 × taille en cm) - (5 × âge en années) + 5
 * Femme : MB = (10 × poids en kg) + (6,25 × taille en cm) - (5 × âge en années) - 161
 */
export function calculerMetabolismeBase(
  sexe: Sexe,
  poids_kg: number,
  taille_cm: number,
  age: number
): number {
  const base = 10 * poids_kg + 6.25 * taille_cm - 5 * age;

  if (sexe === "HOMME") {
    return Math.round(base + 5);
  } else {
    return Math.round(base - 161);
  }
}

/**
 * Calcule les besoins énergétiques totaux
 * BET = MB × Coefficient d'activité + Ajustement selon objectif
 *
 * Ajustements :
 * - PERTE_POIDS : -400 kcal (déficit modéré et sain)
 * - MAINTIEN : 0 kcal (besoins de base)
 * - PRISE_MASSE : +300 kcal (surplus modéré)
 */
export function calculerBesoinsEnergetiques(
  metabolisme_base: number,
  niveau_activite: NiveauActivite,
  objectif: ObjectifSante
): number {
  const coefficient = COEFFICIENTS_ACTIVITE[niveau_activite];
  const besoins_base = metabolisme_base * coefficient;

  // Ajustement selon l'objectif
  let ajustement = 0;
  switch (objectif) {
    case "PERTE_POIDS":
      ajustement = -400; // Déficit calorique modéré pour perte de poids saine (~0.5kg/semaine)
      break;
    case "MAINTIEN":
      ajustement = 0; // Pas d'ajustement
      break;
    case "PRISE_MASSE":
      ajustement = +300; // Surplus calorique modéré pour prise de masse progressive
      break;
  }

  return Math.round(besoins_base + ajustement);
}

/**
 * Calcule la fréquence cardiaque maximale (FC Max)
 * Formule de Tanaka : FC Max = 208 - (0,7 × âge)
 */
export function calculerFCMax(age: number): number {
  return Math.round(208 - 0.7 * age);
}

/**
 * Calcule les zones cardiaques
 * Zone 2: Brûle graisse (60-70% FC Max)
 * Zone 3: Aérobie (70-80% FC Max)
 * Zone 4: Anaérobie (80-90% FC Max)
 * Zone 5: Maximum (90-100% FC Max)
 */
export function calculerZonesCardiaques(fc_max: number) {
  return {
    zone_cardio_brule_graisse: {
      min: Math.round(fc_max * 0.6),
      max: Math.round(fc_max * 0.7),
    },
    zone_cardio_aerobie: {
      min: Math.round(fc_max * 0.7),
      max: Math.round(fc_max * 0.8),
    },
    zone_cardio_anaerobie: {
      min: Math.round(fc_max * 0.8),
      max: Math.round(fc_max * 0.9),
    },
    zone_cardio_maximum: {
      min: Math.round(fc_max * 0.9),
      max: Math.round(fc_max * 1.0),
    },
  };
}

/**
 * Détermine la zone de triglycérides selon le niveau (en g/L)
 * et retourne la limite lipidique adaptée
 */
export function determinerZoneTG(niveau_tg_g_l: number): {
  zone: ZoneTG;
  limite_lipides_g: number;
} {
  if (niveau_tg_g_l >= ZONES_TG.CRITIQUE.min) {
    return {
      zone: "CRITIQUE",
      limite_lipides_g: ZONES_TG.CRITIQUE.limite_lipides_g,
    };
  } else if (niveau_tg_g_l >= ZONES_TG.HAUTE.min) {
    return {
      zone: "HAUTE",
      limite_lipides_g: ZONES_TG.HAUTE.limite_lipides_g,
    };
  } else if (niveau_tg_g_l >= ZONES_TG.MODEREE.min) {
    return {
      zone: "MODEREE",
      limite_lipides_g: ZONES_TG.MODEREE.limite_lipides_g,
    };
  } else if (niveau_tg_g_l >= ZONES_TG.LIMITE.min) {
    return {
      zone: "LIMITE",
      limite_lipides_g: ZONES_TG.LIMITE.limite_lipides_g,
    };
  } else {
    return {
      zone: "NORMALE",
      limite_lipides_g: ZONES_TG.NORMALE.limite_lipides_g,
    };
  }
}

/**
 * Calcule les macronutriments quotidiens recommandés
 *
 * Pour la chylomicronémie :
 * - Lipides : Limite STRICTE en grammes selon niveau TG (10-20g/jour max)
 * - Protéines : 15-20% des calories
 * - Glucides : Complète le reste des besoins énergétiques
 *
 * Conversion :
 * - 1g de lipides = 9 kcal
 * - 1g de protéines = 4 kcal
 * - 1g de glucides = 4 kcal
 */
export function calculerMacros(
  besoins_kcal: number,
  avec_chylomicronemie: boolean = false,
  limite_lipides_max_g?: number
): { proteines_g: number; lipides_g: number; glucides_g: number } {
  if (avec_chylomicronemie && limite_lipides_max_g !== undefined) {
    // IMPORTANT : Pour chylomicronémie, la limite en GRAMMES est prioritaire
    // Ne JAMAIS dépasser la limite, même si cela fait moins de 10% des calories
    const lipides_g = limite_lipides_max_g;
    const kcal_lipides = lipides_g * 9;

    // Protéines : 18% des calories totales
    const proteines_pct = 0.18;
    const proteines_g = Math.round((besoins_kcal * proteines_pct) / 4);
    const kcal_proteines = proteines_g * 4;

    // Glucides : Complète le reste des besoins
    const kcal_glucides = besoins_kcal - kcal_lipides - kcal_proteines;
    const glucides_g = Math.round(kcal_glucides / 4);

    return {
      lipides_g,
      proteines_g,
      glucides_g,
    };
  } else if (avec_chylomicronemie) {
    // Fallback si pas de limite spécifiée (utiliser 15g par défaut)
    return calculerMacros(besoins_kcal, true, 15);
  } else {
    // Régime équilibré standard
    const lipides_pct = 0.3; // 30%
    const proteines_pct = 0.2; // 20%
    const glucides_pct = 0.5; // 50%

    return {
      lipides_g: Math.round((besoins_kcal * lipides_pct) / 9),
      proteines_g: Math.round((besoins_kcal * proteines_pct) / 4),
      glucides_g: Math.round((besoins_kcal * glucides_pct) / 4),
    };
  }
}

/**
 * Calcule l'âge à partir de la date de naissance
 */
export function calculerAge(date_naissance: Date): number {
  const aujourd_hui = new Date();
  let age = aujourd_hui.getFullYear() - date_naissance.getFullYear();
  const mois_diff = aujourd_hui.getMonth() - date_naissance.getMonth();

  if (
    mois_diff < 0 ||
    (mois_diff === 0 && aujourd_hui.getDate() < date_naissance.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Calcule toutes les valeurs dérivées du profil
 */
export function calculerValeursProfile(
  profile: UserProfile
): ValeursCalculees {
  // Calculer l'âge
  const age = profile.date_naissance
    ? calculerAge(profile.date_naissance)
    : 30; // Valeur par défaut si pas de date

  // IMC
  const imc = calculerIMC(profile.poids_kg, profile.taille_cm);
  const categorie_imc = getCategorieIMC(imc);

  // BMR (Métabolisme de base) : Manuel ou calculé
  let bmr_kcal: number;
  let bmr_source: "MANUEL" | "CALCULE";

  if (profile.bmr_manuel_kcal && profile.bmr_manuel_kcal > 0) {
    // Utiliser le BMR manuel fourni par l'utilisateur
    bmr_kcal = profile.bmr_manuel_kcal;
    bmr_source = "MANUEL";
  } else {
    // Calculer avec la formule de Mifflin-St Jeor
    bmr_kcal = calculerMetabolismeBase(
      profile.sexe,
      profile.poids_kg,
      profile.taille_cm,
      age
    );
    bmr_source = "CALCULE";
  }

  // Besoins énergétiques totaux
  const besoins_energetiques_kcal = calculerBesoinsEnergetiques(
    bmr_kcal,
    profile.niveau_activite,
    profile.objectif
  );

  // Zones cardiaques
  const fc_max = calculerFCMax(age);
  const zones = calculerZonesCardiaques(fc_max);

  // Zone TG et limite lipidique adaptative (si chylomicronémie)
  let zone_tg: ZoneTG | undefined;
  let limite_lipides_adaptative_g: number | undefined;

  if (
    profile.contraintes_sante.chylomicronemie &&
    profile.niveau_tg_g_l !== undefined
  ) {
    const zoneTG = determinerZoneTG(profile.niveau_tg_g_l);
    zone_tg = zoneTG.zone;
    limite_lipides_adaptative_g = zoneTG.limite_lipides_g;
  }

  // Macros avec limite lipidique adaptée selon TG
  const macros_quotidiens = calculerMacros(
    besoins_energetiques_kcal,
    profile.contraintes_sante.chylomicronemie,
    limite_lipides_adaptative_g
  );

  return {
    imc,
    categorie_imc,
    bmr_kcal,
    bmr_source,
    besoins_energetiques_kcal,
    fc_max,
    ...zones,
    zone_tg,
    limite_lipides_adaptative_g,
    macros_quotidiens,
  };
}

/**
 * Génère une configuration de repas par défaut selon le preset
 */
export function genererConfigRepas(
  nombre_repas: number,
  preset: "EQUILIBRE" | "MATIN_PLUS" | "MATIN_TRES_PLUS" | "SOIR_PLUS" | "SOIR_TRES_PLUS"
): { nom: string; horaire: string; pourcentage_calories: number; actif: boolean }[] {
  const repas_base = [
    { nom: "Petit-déjeuner", horaire: "08:00" },
    { nom: "Collation matin", horaire: "10:30" },
    { nom: "Déjeuner", horaire: "12:30" },
    { nom: "Collation après-midi", horaire: "16:00" },
    { nom: "Dîner", horaire: "19:30" },
  ];

  // Sélectionner les repas actifs selon le nombre
  const repas_actifs = [];

  if (nombre_repas === 1) {
    repas_actifs.push({ ...repas_base[2], pourcentage_calories: 100, actif: true });
  } else if (nombre_repas === 2) {
    // Déjeuner + Dîner
    const ratio = preset === "EQUILIBRE" ? [50, 50] :
                  preset === "MATIN_PLUS" ? [60, 40] :
                  preset === "MATIN_TRES_PLUS" ? [70, 30] :
                  preset === "SOIR_PLUS" ? [40, 60] :
                  [30, 70]; // SOIR_TRES_PLUS

    repas_actifs.push(
      { ...repas_base[2], pourcentage_calories: ratio[0], actif: true },
      { ...repas_base[4], pourcentage_calories: ratio[1], actif: true }
    );
  } else if (nombre_repas === 3) {
    // Petit-déj + Déjeuner + Dîner
    const ratio = preset === "EQUILIBRE" ? [30, 35, 35] :
                  preset === "MATIN_PLUS" ? [35, 35, 30] :
                  preset === "MATIN_TRES_PLUS" ? [40, 35, 25] :
                  preset === "SOIR_PLUS" ? [25, 35, 40] :
                  [20, 30, 50]; // SOIR_TRES_PLUS

    repas_actifs.push(
      { ...repas_base[0], pourcentage_calories: ratio[0], actif: true },
      { ...repas_base[2], pourcentage_calories: ratio[1], actif: true },
      { ...repas_base[4], pourcentage_calories: ratio[2], actif: true }
    );
  } else if (nombre_repas === 4) {
    // Petit-déj + Collation matin + Déjeuner + Dîner
    const ratio = preset === "EQUILIBRE" ? [25, 10, 30, 35] :
                  preset === "MATIN_PLUS" ? [30, 15, 30, 25] :
                  preset === "MATIN_TRES_PLUS" ? [35, 15, 30, 20] :
                  preset === "SOIR_PLUS" ? [20, 10, 30, 40] :
                  [15, 10, 25, 50]; // SOIR_TRES_PLUS

    repas_actifs.push(
      { ...repas_base[0], pourcentage_calories: ratio[0], actif: true },
      { ...repas_base[1], pourcentage_calories: ratio[1], actif: true },
      { ...repas_base[2], pourcentage_calories: ratio[2], actif: true },
      { ...repas_base[4], pourcentage_calories: ratio[3], actif: true }
    );
  } else {
    // 5 repas - tous actifs
    const ratio = preset === "EQUILIBRE" ? [20, 10, 30, 10, 30] :
                  preset === "MATIN_PLUS" ? [25, 15, 30, 10, 20] :
                  preset === "MATIN_TRES_PLUS" ? [30, 15, 30, 10, 15] :
                  preset === "SOIR_PLUS" ? [15, 10, 25, 10, 40] :
                  [15, 10, 20, 10, 45]; // SOIR_TRES_PLUS

    repas_actifs.push(
      { ...repas_base[0], pourcentage_calories: ratio[0], actif: true },
      { ...repas_base[1], pourcentage_calories: ratio[1], actif: true },
      { ...repas_base[2], pourcentage_calories: ratio[2], actif: true },
      { ...repas_base[3], pourcentage_calories: ratio[3], actif: true },
      { ...repas_base[4], pourcentage_calories: ratio[4], actif: true }
    );
  }

  return repas_actifs;
}
