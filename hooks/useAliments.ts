"use client";

import { useState, useEffect, useCallback } from "react";
import { Aliment, CategorieAliment, CompatibilitePathologie } from "@/types/aliment";
import { getAll, deleteById } from "@/lib/db/queries";

export interface AlimentFilters {
  categorie?: CategorieAliment;
  compatibilite?: CompatibilitePathologie;
  indexGlycemique?: "BAS" | "MOYEN" | "ELEVE";
  lipides?: "TRES_BAS" | "BAS" | "MODERE" | "ELEVE";
  search?: string;
}

export function useAliments() {
  const [aliments, setAliments] = useState<Aliment[]>([]);
  const [filteredAliments, setFilteredAliments] = useState<Aliment[]>([]);
  const [filters, setFilters] = useState<AlimentFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  // Charger tous les aliments depuis IndexedDB
  const loadAliments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAll<Aliment>("aliments");
      setAliments(data);
      setFilteredAliments(data);
    } catch (error) {
      console.error("Erreur lors du chargement des aliments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger au montage du composant
  useEffect(() => {
    loadAliments();
  }, [loadAliments]);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...aliments];

    // Filtre par catégorie
    if (filters.categorie) {
      filtered = filtered.filter((a) => a.categorie === filters.categorie);
    }

    // Filtre par compatibilité
    if (filters.compatibilite) {
      filtered = filtered.filter(
        (a) => a.compatible_chylomicronemie === filters.compatibilite
      );
    }

    // Filtre par index glycémique
    if (filters.indexGlycemique) {
      filtered = filtered.filter((a) => {
        if (filters.indexGlycemique === "BAS") return a.index_glycemique < 55;
        if (filters.indexGlycemique === "MOYEN")
          return a.index_glycemique >= 55 && a.index_glycemique < 70;
        if (filters.indexGlycemique === "ELEVE") return a.index_glycemique >= 70;
        return true;
      });
    }

    // Filtre par lipides
    if (filters.lipides) {
      filtered = filtered.filter((a) => {
        const lip = a.valeurs_nutritionnelles_100g.lipides_g;
        if (filters.lipides === "TRES_BAS") return lip < 2;
        if (filters.lipides === "BAS") return lip >= 2 && lip < 5;
        if (filters.lipides === "MODERE") return lip >= 5 && lip < 10;
        if (filters.lipides === "ELEVE") return lip >= 10;
        return true;
      });
    }

    // Filtre par recherche textuelle
    if (filters.search && filters.search.trim().length > 0) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.nom.toLowerCase().includes(searchLower) ||
          a.categorie.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAliments(filtered);
  }, [aliments, filters]);

  // Supprimer un aliment
  const deleteAliment = useCallback(
    async (id: string) => {
      try {
        await deleteById("aliments", id);
        await loadAliments(); // Recharger la liste
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        throw error;
      }
    },
    [loadAliments]
  );

  return {
    aliments: filteredAliments,
    allAliments: aliments,
    isLoading,
    filters,
    setFilters,
    deleteAliment,
    reload: loadAliments,
  };
}
