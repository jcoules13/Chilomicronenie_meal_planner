import {
  UserProfile,
  ValeursCalculees,
  Sexe,
  NiveauActivite,
  COEFFICIENTS_ACTIVITE,
  CATEGORIES_IMC,
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
 * BET = MB × Coefficient d'activité
 */
export function calculerBesoinsEnergetiques(
  metabolisme_base: number,
  niveau_activite: NiveauActivite
): number {
  const coefficient = COEFFICIENTS_ACTIVITE[niveau_activite];
  return Math.round(metabolisme_base * coefficient);
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
 */
export function calculerZonesCardiaques(fc_max: number) {
  return {
    zone_cardio_basse: {
      min: Math.round(fc_max * 0.6),
      max: Math.round(fc_max * 0.7),
    },
    zone_cardio_moderee: {
      min: Math.round(fc_max * 0.7),
      max: Math.round(fc_max * 0.8),
    },
    zone_cardio_intense: {
      min: Math.round(fc_max * 0.8),
      max: Math.round(fc_max * 0.9),
    },
  };
}

/**
 * Calcule les macronutriments quotidiens recommandés
 *
 * Pour la chylomicronémie :
 * - Lipides : 10-15% des calories (priorité absolue)
 * - Protéines : 15-20% des calories
 * - Glucides : 65-75% des calories
 *
 * Conversion :
 * - 1g de lipides = 9 kcal
 * - 1g de protéines = 4 kcal
 * - 1g de glucides = 4 kcal
 */
export function calculerMacros(
  besoins_kcal: number,
  avec_chylomicronemie: boolean = false
): { proteines_g: number; lipides_g: number; glucides_g: number } {
  if (avec_chylomicronemie) {
    // Régime strict très faible en lipides
    const lipides_pct = 0.12; // 12% (entre 10-15%)
    const proteines_pct = 0.18; // 18% (entre 15-20%)
    const glucides_pct = 0.7; // 70% (entre 65-75%)

    return {
      lipides_g: Math.round((besoins_kcal * lipides_pct) / 9),
      proteines_g: Math.round((besoins_kcal * proteines_pct) / 4),
      glucides_g: Math.round((besoins_kcal * glucides_pct) / 4),
    };
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

  // Besoins énergétiques
  const metabolisme_base = calculerMetabolismeBase(
    profile.sexe,
    profile.poids_kg,
    profile.taille_cm,
    age
  );
  const besoins_energetiques_kcal = calculerBesoinsEnergetiques(
    metabolisme_base,
    profile.niveau_activite
  );

  // Zones cardiaques
  const fc_max = calculerFCMax(age);
  const zones = calculerZonesCardiaques(fc_max);

  // Macros
  const macros_quotidiens = calculerMacros(
    besoins_energetiques_kcal,
    profile.contraintes_sante.chylomicronemie
  );

  return {
    imc,
    categorie_imc,
    besoins_energetiques_kcal,
    fc_max,
    ...zones,
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
