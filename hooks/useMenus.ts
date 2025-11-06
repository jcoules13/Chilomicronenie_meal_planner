"use client";

import { useState, useEffect, useCallback } from "react";
import { MenuV31, TypeProteine, FrequenceMenu } from "@/types/menu";
import { getAll, create, deleteById } from "@/lib/db/queries";

export interface MenuFilters {
  type_proteine?: TypeProteine;
  frequence?: FrequenceMenu;
  lipides_max?: number; // Filtrer par budget lipides max
  pct_mct_min?: number; // % MCT minimum
  search?: string;
}

export function useMenus() {
  const [menus, setMenus] = useState<MenuV31[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<MenuV31[]>([]);
  const [filters, setFilters] = useState<MenuFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  // Charger tous les menus depuis IndexedDB
  const loadMenus = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAll<MenuV31>("menus");
      setMenus(data);
      setFilteredMenus(data);
    } catch (error) {
      console.error("Erreur lors du chargement des menus:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les menus depuis l'API (fichiers markdown) et les stocker dans IndexedDB
  const loadFromMarkdown = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/menus");
      const data = await response.json();

      if (data.success && data.menus) {
        // Stocker chaque menu dans IndexedDB
        for (const menu of data.menus) {
          try {
            await create<MenuV31>("menus", menu);
          } catch (error) {
            // Ignorer les erreurs de duplication (menu déjà existant)
            console.warn(`Menu ${menu.nom} déjà existant, ignoré`);
          }
        }

        // Recharger depuis IndexedDB
        await loadMenus();
      }
    } catch (error) {
      console.error("Erreur lors du chargement depuis Markdown:", error);
    } finally {
      setIsLoading(false);
    }
  }, [loadMenus]);

  // Charger au montage du composant
  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...menus];

    // Filtre par type de protéine
    if (filters.type_proteine) {
      filtered = filtered.filter((m) => m.type_proteine === filters.type_proteine);
    }

    // Filtre par fréquence
    if (filters.frequence) {
      filtered = filtered.filter((m) => m.frequence === filters.frequence);
    }

    // Filtre par budget lipides max
    if (filters.lipides_max !== undefined) {
      filtered = filtered.filter(
        (m) => m.budget_lipides_journee.total_g <= filters.lipides_max!
      );
    }

    // Filtre par % MCT minimum
    if (filters.pct_mct_min !== undefined) {
      filtered = filtered.filter(
        (m) => m.budget_lipides_journee.pct_mct >= filters.pct_mct_min!
      );
    }

    // Filtre par recherche textuelle
    if (filters.search && filters.search.trim().length > 0) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nom.toLowerCase().includes(searchLower) ||
          m.type_proteine.toLowerCase().includes(searchLower)
      );
    }

    setFilteredMenus(filtered);
  }, [menus, filters]);

  // Supprimer un menu
  const deleteMenu = useCallback(
    async (id: string) => {
      try {
        await deleteById("menus", id);
        await loadMenus(); // Recharger la liste
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        throw error;
      }
    },
    [loadMenus]
  );

  return {
    menus: filteredMenus,
    allMenus: menus,
    isLoading,
    filters,
    setFilters,
    deleteMenu,
    reload: loadMenus,
    loadFromMarkdown,
  };
}
