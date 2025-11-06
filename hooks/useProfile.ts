"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  PresetRepartition,
  ConfigRepas,
} from "@/types/profile";
import {
  calculerValeursProfile,
  genererConfigRepas,
} from "@/lib/utils/profile-calculations";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "chilomicronenie_user_profile";

/**
 * Profil par défaut
 */
function getDefaultProfile(): UserProfile {
  return {
    id: uuidv4(),
    sexe: "HOMME",
    poids_kg: 70,
    taille_cm: 170,
    niveau_activite: "MODERE",
    objectif: "MAINTIEN",
    contraintes_sante: {
      chylomicronemie: true, // Par défaut car c'est l'app principale
      diabete: false,
      hypertension: false,
      limite_lipides_g_jour: 20, // Limite stricte pour chylomicronémie
    },
    nombre_repas: 3,
    preset_repartition: "EQUILIBRE",
    repas: genererConfigRepas(3, "EQUILIBRE").map((r, idx) => ({
      id: uuidv4(),
      ...r,
    })),
    date_creation: new Date(),
    date_modification: new Date(),
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le profil depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Convertir les dates string en objets Date
        if (parsed.date_creation) {
          parsed.date_creation = new Date(parsed.date_creation);
        }
        if (parsed.date_modification) {
          parsed.date_modification = new Date(parsed.date_modification);
        }
        if (parsed.date_naissance) {
          parsed.date_naissance = new Date(parsed.date_naissance);
        }

        // Recalculer les valeurs
        const withCalculations = {
          ...parsed,
          valeurs_calculees: calculerValeursProfile(parsed),
        };

        setProfile(withCalculations);
      } else {
        // Créer un profil par défaut
        const defaultProfile = getDefaultProfile();
        const withCalculations = {
          ...defaultProfile,
          valeurs_calculees: calculerValeursProfile(defaultProfile),
        };
        setProfile(withCalculations);
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      const defaultProfile = getDefaultProfile();
      setProfile({
        ...defaultProfile,
        valeurs_calculees: calculerValeursProfile(defaultProfile),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarder le profil dans localStorage à chaque modification
  const saveProfile = useCallback((updatedProfile: UserProfile) => {
    try {
      // Recalculer les valeurs
      const withCalculations = {
        ...updatedProfile,
        date_modification: new Date(),
        valeurs_calculees: calculerValeursProfile(updatedProfile),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(withCalculations));
      setProfile(withCalculations);
    } catch (error) {
      console.error("Erreur sauvegarde profil:", error);
      throw error;
    }
  }, []);

  // Mettre à jour le profil
  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!profile) return;

      const updated = {
        ...profile,
        ...updates,
      };

      saveProfile(updated);
    },
    [profile, saveProfile]
  );

  // Mettre à jour le nombre de repas et régénérer la configuration
  const updateNombreRepas = useCallback(
    (nombre: number) => {
      if (!profile) return;

      const nouveauxRepas = genererConfigRepas(
        nombre,
        profile.preset_repartition === "CUSTOM"
          ? "EQUILIBRE"
          : profile.preset_repartition
      ).map((r, idx) => ({
        id: uuidv4(),
        ...r,
      }));

      updateProfile({
        nombre_repas: nombre,
        repas: nouveauxRepas,
      });
    },
    [profile, updateProfile]
  );

  // Mettre à jour le preset de répartition
  const updatePresetRepartition = useCallback(
    (preset: PresetRepartition) => {
      if (!profile) return;

      if (preset === "CUSTOM") {
        // Mode personnalisé - garder les repas actuels
        updateProfile({ preset_repartition: preset });
      } else {
        // Régénérer les repas selon le preset
        const nouveauxRepas = genererConfigRepas(
          profile.nombre_repas,
          preset
        ).map((r, idx) => {
          // Garder les horaires personnalisés si ils existent
          const existingRepas = profile.repas[idx];
          return {
            id: existingRepas?.id || uuidv4(),
            ...r,
            horaire: existingRepas?.horaire || r.horaire,
          };
        });

        updateProfile({
          preset_repartition: preset,
          repas: nouveauxRepas,
        });
      }
    },
    [profile, updateProfile]
  );

  // Mettre à jour un repas spécifique
  const updateRepas = useCallback(
    (repasId: string, updates: Partial<ConfigRepas>) => {
      if (!profile) return;

      const nouveauxRepas = profile.repas.map((r) =>
        r.id === repasId ? { ...r, ...updates } : r
      );

      // Si on modifie les pourcentages manuellement, passer en mode CUSTOM
      if (updates.pourcentage_calories !== undefined) {
        updateProfile({
          repas: nouveauxRepas,
          preset_repartition: "CUSTOM",
        });
      } else {
        updateProfile({ repas: nouveauxRepas });
      }
    },
    [profile, updateProfile]
  );

  // Réinitialiser le profil
  const resetProfile = useCallback(() => {
    const defaultProfile = getDefaultProfile();
    saveProfile(defaultProfile);
  }, [saveProfile]);

  return {
    profile,
    isLoading,
    updateProfile,
    updateNombreRepas,
    updatePresetRepartition,
    updateRepas,
    saveProfile,
    resetProfile,
  };
}
