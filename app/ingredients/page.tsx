"use client";

import { useEffect, useState } from "react";
import type { IngredientCiqual } from "@/types/ciqual";
import {
  importSampleCiqualData,
  ciqualDataExists,
  searchIngredientsByName,
  getIngredientsByGroupe,
  countCiqualIngredients,
} from "@/lib/db/ciqual-import";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function IngredientsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IngredientCiqual[]>([]);
  const [selectedGroupe, setSelectedGroupe] = useState<string>("");
  const [groupeResults, setGroupeResults] = useState<IngredientCiqual[]>([]);
  const [importStatus, setImportStatus] = useState<{
    message: string;
    type: "info" | "success" | "error";
  } | null>(null);

  // Groupes alimentaires disponibles
  const groupes = [
    "Féculents",
    "Viandes",
    "Poissons",
    "Légumes",
    "Légumineuses",
    "Fruits",
    "Produits laitiers",
  ];

  useEffect(() => {
    checkCiqualData();
  }, []);

  const checkCiqualData = async () => {
    setIsLoading(true);
    const exists = await ciqualDataExists();
    setHasData(exists);
    if (exists) {
      const count = await countCiqualIngredients();
      setTotalCount(count);
    }
    setIsLoading(false);
  };

  const handleImport = async () => {
    setIsLoading(true);
    setImportStatus({
      message: "Import en cours...",
      type: "info",
    });

    try {
      const result = await importSampleCiqualData();

      if (result.success) {
        setImportStatus({
          message: `✅ Import réussi: ${result.imported} ingrédients importés`,
          type: "success",
        });
        await checkCiqualData();
      } else {
        setImportStatus({
          message: `❌ Erreurs lors de l'import: ${result.errors.join(", ")}`,
          type: "error",
        });
      }
    } catch (error) {
      setImportStatus({
        message: `❌ Erreur: ${error}`,
        type: "error",
      });
    }

    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const results = await searchIngredientsByName(searchQuery);
    setSearchResults(results);
    setIsLoading(false);
  };

  const handleGroupeFilter = async (groupe: string) => {
    setSelectedGroupe(groupe);
    setIsLoading(true);
    const results = await getIngredientsByGroupe(groupe);
    setGroupeResults(results);
    setIsLoading(false);
  };

  const IngredientCard = ({ ingredient }: { ingredient: IngredientCiqual }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{ingredient.nom_fr}</CardTitle>
            <p className="text-sm text-gray-500">
              {ingredient.nom_en} • Code CIQUAL: {ingredient.code_ciqual}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={ingredient.compatible_chylo ? "default" : "secondary"}>
              {ingredient.compatible_chylo ? "✅ Compatible" : "⚠️ Attention"}
            </Badge>
            {ingredient.index_glycemique && (
              <Badge variant="outline">IG: {ingredient.index_glycemique}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold">Groupe</p>
            <p className="text-sm">{ingredient.groupe}</p>
            {ingredient.sous_groupe && (
              <p className="text-xs text-gray-500">{ingredient.sous_groupe}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">Saisons</p>
            <p className="text-xs">{ingredient.saisons.join(", ")}</p>
          </div>
          {ingredient.allergenes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-red-600">Allergènes</p>
              <p className="text-xs">{ingredient.allergenes.join(", ")}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold mb-2">
            Valeurs nutritionnelles (pour 100g)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div>
              <span className="font-medium">Énergie:</span>{" "}
              {ingredient.nutrition_100g.energie_kcal} kcal
            </div>
            <div>
              <span className="font-medium">Protéines:</span>{" "}
              {ingredient.nutrition_100g.proteines_g}g
            </div>
            <div>
              <span className="font-medium text-orange-600">Lipides:</span>{" "}
              {ingredient.nutrition_100g.lipides_g}g
            </div>
            <div>
              <span className="font-medium">Glucides:</span>{" "}
              {ingredient.nutrition_100g.glucides_g}g
            </div>
            <div>
              <span className="font-medium">Fibres:</span>{" "}
              {ingredient.nutrition_100g.fibres_g}g
            </div>
          </div>
        </div>

        {ingredient.notes && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600 italic">{ingredient.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading && !hasData) {
    return (
      <div className="container mx-auto p-6">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Base Ingrédients CIQUAL
        </h1>
        <p className="text-gray-600">
          Recherchez et explorez les ingrédients de la table CIQUAL
        </p>
      </div>

      {/* Import Section */}
      {!hasData && (
        <Alert className="mb-6">
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span>
                Aucune donnée CIQUAL trouvée. Importez les données d'exemple pour
                commencer.
              </span>
              <Button onClick={handleImport} disabled={isLoading}>
                {isLoading ? "Import en cours..." : "Importer les données"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm">
            📊 <strong>{totalCount} ingrédients</strong> importés dans la base
            CIQUAL
          </p>
        </div>
      )}

      {/* Import Status */}
      {importStatus && (
        <Alert
          className="mb-6"
          variant={importStatus.type === "error" ? "destructive" : "default"}
        >
          <AlertDescription>{importStatus.message}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter Interface */}
      {hasData && (
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">🔍 Recherche</TabsTrigger>
            <TabsTrigger value="groupe">📂 Par groupe</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4">
            <div className="flex gap-2 mb-6">
              <Input
                type="text"
                placeholder="Rechercher un ingrédient (ex: poulet, patate, lentille)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                Rechercher
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  {searchResults.length} résultat(s) trouvé(s)
                </p>
                {searchResults.map((ingredient) => (
                  <IngredientCard key={ingredient.id} ingredient={ingredient} />
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !isLoading && (
              <Alert>
                <AlertDescription>
                  Aucun résultat trouvé pour "{searchQuery}"
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="groupe" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {groupes.map((groupe) => (
                <Button
                  key={groupe}
                  variant={selectedGroupe === groupe ? "default" : "outline"}
                  onClick={() => handleGroupeFilter(groupe)}
                  disabled={isLoading}
                >
                  {groupe}
                </Button>
              ))}
            </div>

            {groupeResults.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  {groupeResults.length} ingrédient(s) dans "{selectedGroupe}"
                </p>
                {groupeResults.map((ingredient) => (
                  <IngredientCard key={ingredient.id} ingredient={ingredient} />
                ))}
              </div>
            )}

            {selectedGroupe && groupeResults.length === 0 && !isLoading && (
              <Alert>
                <AlertDescription>
                  Aucun ingrédient trouvé dans le groupe "{selectedGroupe}"
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
