"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IngredientCard } from "@/components/ingredients/IngredientCard";
import { IngredientFilters } from "@/components/ingredients/IngredientFilters";
import { AddIngredientModal } from "@/components/ingredients/AddIngredientModal";
import { useIngredients } from "@/hooks/useIngredients";
import { Upload, Search, RefreshCw, Trash2, Plus, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AlimentsPage() {
  const {
    ingredients,
    allIngredients,
    isLoading,
    hasData,
    filters,
    setFilters,
    loadAllIngredients,
    importSampleData,
    clearDatabase,
  } = useIngredients();

  const [searchQuery, setSearchQuery] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    message: string;
    type: "info" | "success" | "error";
  } | null>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ ...filters, search: value });
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus({
      message: "Import en cours...",
      type: "info",
    });

    try {
      const result = await importSampleData();

      if (result.success) {
        setImportStatus({
          message: `✅ Import réussi: ${result.imported} ingrédients importés`,
          type: "success",
        });
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus({
          message: `❌ Erreurs lors de l'import`,
          type: "error",
        });
      }
    } catch (error) {
      setImportStatus({
        message: `❌ Erreur: ${error}`,
        type: "error",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer tous les ingrédients CIQUAL ?")) {
      return;
    }

    setIsImporting(true);
    setImportStatus({
      message: "Suppression en cours...",
      type: "info",
    });

    try {
      const result = await clearDatabase();

      if (result.success) {
        setImportStatus({
          message: `✅ Base vidée: ${result.deleted} ingrédients supprimés`,
          type: "success",
        });
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus({
          message: `❌ Erreur lors de la suppression`,
          type: "error",
        });
      }
    } catch (error) {
      setImportStatus({
        message: `❌ Erreur: ${error}`,
        type: "error",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <MainLayout title="Aliments CIQUAL">
      <div className="flex gap-6">
        {/* Sidebar Filtres */}
        <aside className="w-64 flex-shrink-0 space-y-4">
          <IngredientFilters
            filters={filters}
            onChange={setFilters}
            totalCount={allIngredients.length}
            filteredCount={ingredients.length}
          />
        </aside>

        {/* Contenu Principal */}
        <div className="flex-1 space-y-6">
          {/* Import Status */}
          {importStatus && (
            <Alert
              variant={
                importStatus.type === "error" ? "destructive" : "default"
              }
            >
              <AlertDescription>{importStatus.message}</AlertDescription>
            </Alert>
          )}

          {/* Header avec actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un ingrédient..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2">
              {!hasData && (
                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  variant="default"
                >
                  <Upload
                    className={`h-4 w-4 mr-2 ${
                      isImporting ? "animate-spin" : ""
                    }`}
                  />
                  Importer 300 aliments
                </Button>
              )}
              {hasData && (
                <>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    variant="default"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un aliment
                  </Button>
                  <Button
                    onClick={loadAllIngredients}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    Actualiser
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Maintenance</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleClear}
                        className="text-destructive focus:text-destructive"
                        disabled={isImporting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Vider la base
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          {/* Grid des ingrédients */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : ingredients.length === 0 ? (
            <div className="text-center py-12">
              {allIngredients.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-lg font-medium">
                    Aucun ingrédient dans la base CIQUAL
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Importez les données d'exemple (~93 ingrédients) pour
                    commencer
                  </p>
                  <Button onClick={handleImport} disabled={isImporting}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer les données
                  </Button>
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
              {ingredients.map((ingredient) => (
                <IngredientCard key={ingredient.id} ingredient={ingredient} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajout d'aliment */}
      <AddIngredientModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onIngredientAdded={() => {
          loadAllIngredients();
          setImportStatus({
            message: "✅ Ingrédient ajouté avec succès",
            type: "success",
          });
          setTimeout(() => setImportStatus(null), 3000);
        }}
      />
    </MainLayout>
  );
}
