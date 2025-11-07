"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuCard } from "@/components/menus/MenuCard";
import { MenuFilters } from "@/components/menus/MenuFilters";
import { useMenus } from "@/hooks/useMenus";
import { Upload, Search, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function MenusPage() {
  const { menus, allMenus, isLoading, filters, setFilters, deleteMenu, loadFromMarkdown } =
    useMenus();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ ...filters, search: value });
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) return;

    try {
      await deleteMenu(id);
      alert("Menu supprimé avec succès");
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleLoadFromMarkdown = async () => {
    setIsLoadingMarkdown(true);
    try {
      await loadFromMarkdown();
      alert("Menus chargés avec succès !");
    } catch (error) {
      alert("Erreur lors du chargement des menus");
    } finally {
      setIsLoadingMarkdown(false);
    }
  };

  return (
    <MainLayout title="Menus">
      <div className="flex gap-6">
        {/* Sidebar Filtres */}
        <aside className="w-64 flex-shrink-0 space-y-4">
          <MenuFilters
            filters={filters}
            onChange={setFilters}
            totalCount={allMenus.length}
            filteredCount={menus.length}
          />
        </aside>

        {/* Contenu Principal */}
        <div className="flex-1 space-y-6">
          {/* Header avec actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un menu..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2">
              <Button
                onClick={handleLoadFromMarkdown}
                disabled={isLoadingMarkdown}
                variant="default"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingMarkdown ? 'animate-spin' : ''}`} />
                Charger depuis Markdown
              </Button>
              <Button asChild variant="outline">
                <Link href="/menus/import">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </Link>
              </Button>
            </div>
          </div>

          {/* Grid des menus */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-12">
              {allMenus.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-lg font-medium">Aucun menu dans la base</p>
                  <p className="text-sm text-muted-foreground">
                    Chargez les menus depuis les fichiers Markdown du dossier /menu
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={handleLoadFromMarkdown}
                      disabled={isLoadingMarkdown}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Charger les menus
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">Aucun résultat</p>
                  <p className="text-sm text-muted-foreground">
                    Essayez de modifier vos filtres
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  onDelete={handleDeleteMenu}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
