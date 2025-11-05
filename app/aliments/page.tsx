"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlimentCard } from "@/components/aliments/AlimentCard";
import { AlimentFilters } from "@/components/aliments/AlimentFilters";
import { useAliments } from "@/hooks/useAliments";
import { Upload, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function AlimentsPage() {
  const { aliments, allAliments, isLoading, filters, setFilters, deleteAliment } =
    useAliments();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ ...filters, search: value });
  };

  const handleDeleteAliment = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet aliment ?")) return;

    try {
      await deleteAliment(id);
      alert("Aliment supprimé avec succès");
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <MainLayout title="Aliments">
      <div className="flex gap-6">
        {/* Sidebar Filtres */}
        <aside className="w-64 flex-shrink-0 space-y-4">
          <AlimentFilters
            filters={filters}
            onChange={setFilters}
            totalCount={allAliments.length}
            filteredCount={aliments.length}
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
                placeholder="Rechercher un aliment..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/aliments/import">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/aliments/nouveau">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau
                </Link>
              </Button>
            </div>
          </div>

          {/* Grid des aliments */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : aliments.length === 0 ? (
            <div className="text-center py-12">
              {allAliments.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-lg font-medium">Aucun aliment dans la base</p>
                  <p className="text-sm text-muted-foreground">
                    Commencez par importer vos fiches Markdown ou créez un nouvel aliment
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link href="/aliments/import">
                        <Upload className="h-4 w-4 mr-2" />
                        Importer des fiches
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/aliments/nouveau">
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un aliment
                      </Link>
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
              {aliments.map((aliment) => (
                <AlimentCard
                  key={aliment.id}
                  aliment={aliment}
                  onDelete={handleDeleteAliment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
