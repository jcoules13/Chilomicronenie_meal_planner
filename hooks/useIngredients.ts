"use client";

import { useState, useEffect } from "react";
import type { IngredientCiqual } from "@/types/ciqual";
import {
  ciqualDataExists,
  searchIngredientsByName,
  getIngredientsByGroupe,
  countCiqualIngredients,
  importSampleCiqualData,
} from "@/lib/db/ciqual-import";
import { initDB } from "@/lib/db/indexedDB";

export interface IngredientFilters {
  search?: string;
  groupe?: string;
  compatibilite?: "EXCELLENT" | "BON" | "MODERE" | "DECONSEILLE";
  indexGlycemique?: "BAS" | "MOYEN" | "ELEVE";
  lipides?: "TRES_BAS" | "BAS" | "MODERE" | "ELEVE";
}

export function useIngredients() {
  const [allIngredients, setAllIngredients] = useState<IngredientCiqual[]>([]);
  const [ingredients, setIngredients] = useState<IngredientCiqual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [filters, setFilters] = useState<IngredientFilters>({});

  // Charger tous les ingrédients au démarrage
  useEffect(() => {
    loadAllIngredients();
  }, []);

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [filters, allIngredients]);

  const loadAllIngredients = async () => {
    setIsLoading(true);
    try {
      const exists = await ciqualDataExists();
      setHasData(exists);

      if (exists) {
        const db = await initDB();
        const transaction = db.transaction("ingredients_ciqual", "readonly");
        const store = transaction.objectStore("ingredients_ciqual");

        const request = store.getAll();
        request.onsuccess = () => {
          const data = request.result || [];
          setAllIngredients(data);
          setIngredients(data);
        };
      }
    } catch (error) {
      console.error("Erreur chargement ingrédients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allIngredients];

    // Filtre par recherche
    if (filters.search && filters.search.trim()) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (ing) =>
          ing.nom_fr.toLowerCase().includes(query) ||
          ing.nom_en?.toLowerCase().includes(query) ||
          ing.groupe.toLowerCase().includes(query)
      );
    }

    // Filtre par groupe
    if (filters.groupe) {
      filtered = filtered.filter((ing) => ing.groupe === filters.groupe);
    }

    // Filtre par compatibilité
    if (filters.compatibilite) {
      filtered = filtered.filter((ing) => {
        const compat = getCompatibilite(ing);
        return compat === filters.compatibilite;
      });
    }

    // Filtre par Index Glycémique
    if (filters.indexGlycemique) {
      filtered = filtered.filter((ing) => {
        if (!ing.index_glycemique) return false;
        const ig = ing.index_glycemique;
        switch (filters.indexGlycemique) {
          case "BAS":
            return ig < 55;
          case "MOYEN":
            return ig >= 55 && ig < 70;
          case "ELEVE":
            return ig >= 70;
          default:
            return true;
        }
      });
    }

    // Filtre par Lipides
    if (filters.lipides) {
      filtered = filtered.filter((ing) => {
        const lipides = ing.nutrition_100g.lipides_g;
        switch (filters.lipides) {
          case "TRES_BAS":
            return lipides < 2;
          case "BAS":
            return lipides >= 2 && lipides < 5;
          case "MODERE":
            return lipides >= 5 && lipides < 10;
          case "ELEVE":
            return lipides >= 10;
          default:
            return true;
        }
      });
    }

    setIngredients(filtered);
  };

  const importSampleData = async () => {
    setIsLoading(true);
    try {
      const result = await importSampleCiqualData();
      if (result.success) {
        await loadAllIngredients();
        return { success: true, imported: result.imported };
      }
      return { success: false, errors: result.errors };
    } catch (error) {
      return { success: false, errors: [String(error)] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    allIngredients,
    ingredients,
    isLoading,
    hasData,
    filters,
    setFilters,
    loadAllIngredients,
    importSampleData,
  };
}

// Helpers

function getCompatibilite(
  ingredient: IngredientCiqual
): "EXCELLENT" | "BON" | "MODERE" | "DECONSEILLE" {
  if (!ingredient.compatible_chylo) return "DECONSEILLE";

  const lipides = ingredient.nutrition_100g.lipides_g;
  const ig = ingredient.index_glycemique || 0;

  // EXCELLENT: lipides < 2g ET (IG < 55 OU pas de glucides)
  if (lipides < 2 && (ig < 55 || ig === 0)) return "EXCELLENT";

  // BON: lipides < 5g ET IG < 70
  if (lipides < 5 && (ig < 70 || ig === 0)) return "BON";

  // MODERE: compatible mais pas optimal
  if (lipides < 10) return "MODERE";

  return "DECONSEILLE";
}

export function getCompatibiliteLabel(
  ingredient: IngredientCiqual
): {
  label: string;
  emoji: string;
  bgClass: string;
  textClass: string;
  icon: string;
} {
  const compat = getCompatibilite(ingredient);

  switch (compat) {
    case "EXCELLENT":
      return {
        label: "EXCELLENT",
        emoji: "🟢",
        bgClass: "bg-green-100 dark:bg-green-900",
        textClass: "text-green-800 dark:text-green-100",
        icon: "✅",
      };
    case "BON":
      return {
        label: "BON",
        emoji: "🔵",
        bgClass: "bg-blue-100 dark:bg-blue-900",
        textClass: "text-blue-800 dark:text-blue-100",
        icon: "👍",
      };
    case "MODERE":
      return {
        label: "MODÉRÉ",
        emoji: "🟡",
        bgClass: "bg-yellow-100 dark:bg-yellow-900",
        textClass: "text-yellow-800 dark:text-yellow-100",
        icon: "⚠️",
      };
    case "DECONSEILLE":
      return {
        label: "DÉCONSEILLÉ",
        emoji: "🔴",
        bgClass: "bg-red-100 dark:bg-red-900",
        textClass: "text-red-800 dark:text-red-100",
        icon: "❌",
      };
  }
}

export function getIndexGlycemiqueLabel(ig?: number): {
  label: string;
  color: string;
} {
  if (!ig || ig === 0)
    return { label: "N/A", color: "text-muted-foreground" };
  if (ig < 55) return { label: "BAS", color: "text-green-600" };
  if (ig < 70) return { label: "MOYEN", color: "text-yellow-600" };
  return { label: "ÉLEVÉ", color: "text-red-600" };
}
