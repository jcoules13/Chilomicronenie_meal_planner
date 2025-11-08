"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IngredientCiqual } from "@/types/ciqual";
import { getCompatibiliteLabel } from "@/hooks/useIngredients";

interface AddIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIngredientAdded: () => void;
}

export function AddIngredientModal({ open, onOpenChange, onIngredientAdded }: AddIngredientModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [results, setResults] = useState<Array<Omit<IngredientCiqual, "id" | "date_import">>>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setError("Veuillez saisir au moins 2 caractères");
      return;
    }

    setIsSearching(true);
    setError(null);
    setSuccess(null);
    setResults([]);

    try {
      const response = await fetch(`/api/ciqual/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Erreur lors de la recherche");
        return;
      }

      setResults(data.results);

      if (data.results.length === 0) {
        setError(`Aucun résultat pour "${searchQuery}"`);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddIngredient = async (ingredient: Omit<IngredientCiqual, "id" | "date_import">) => {
    setIsAdding(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/ciqual/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredient),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Erreur lors de l'ajout");
        return;
      }

      setSuccess(`✅ "${ingredient.nom_fr}" ajouté avec succès !`);

      // Notifier le parent
      onIngredientAdded();

      // Retirer l'ingrédient des résultats
      setResults((prev) => prev.filter((r) => r.code_ciqual !== ingredient.code_ciqual));

      // Fermer après 1.5 secondes
      setTimeout(() => {
        if (results.length <= 1) {
          onOpenChange(false);
          resetModal();
        }
      }, 1500);
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const resetModal = () => {
    setSearchQuery("");
    setResults([]);
    setError(null);
    setSuccess(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetModal();
    }}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un aliment CIQUAL</DialogTitle>
          <DialogDescription>
            Recherchez parmi les 3186 aliments de la base CIQUAL 2020 et ajoutez-les à votre collection.
          </DialogDescription>
        </DialogHeader>

        {/* Barre de recherche */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ex: poulet, saumon, tomate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Recherche...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Résultats */}
        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {results.length} résultat(s) trouvé(s)
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((ingredient) => {
                const compatLabel = getCompatibiliteLabel(ingredient as IngredientCiqual);

                return (
                  <Card key={ingredient.code_ciqual} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{ingredient.nom_fr}</CardTitle>
                          <CardDescription>
                            {ingredient.groupe}
                            {ingredient.sous_groupe && ` • ${ingredient.sous_groupe}`}
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddIngredient(ingredient)}
                          disabled={isAdding}
                        >
                          {isAdding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Ajouter
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge className={`text-xs ${compatLabel.bgClass} ${compatLabel.textClass}`}>
                          {compatLabel.icon} {compatLabel.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ingredient.nutrition_100g.lipides_g.toFixed(1)}g lipides
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ingredient.nutrition_100g.energie_kcal} kcal
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            resetModal();
          }}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
