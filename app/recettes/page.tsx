"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXAMPLE_RECIPES } from "@/data/recipes-examples";
import { Recipe, RecipeFilters, TypeRecette, RepasCible, DifficulteRecette } from "@/types/recipe";
import { Saison } from "@/types/aliment";
import { searchRecipes } from "@/lib/recipe-generator";
import Link from "next/link";
import {
  Clock,
  ChefHat,
  Flame,
  Search,
  Filter,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";

export default function RecettesPage() {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Rechercher les recettes
  const searchResult = useMemo(() => {
    return searchRecipes(EXAMPLE_RECIPES, {
      ...filters,
      recherche_texte: searchText || undefined,
    });
  }, [searchText, filters]);

  const { recipes, total } = searchResult;

  return (
    <MainLayout title="Recettes">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recettes</h1>
          <p className="text-gray-600 mt-2">
            {total} recette{total > 1 ? "s" : ""} adaptée{total > 1 ? "s" : ""} à la chilomicronémie
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Rechercher une recette, un ingrédient..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type de recette</label>
              <Select
                value={filters.type || "tous"}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value === "tous" ? undefined : (value as TypeRecette) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="plat_principal">Plat principal</SelectItem>
                  <SelectItem value="entree">Entrée</SelectItem>
                  <SelectItem value="soupe">Soupe</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Repas</label>
              <Select
                value={filters.repas_cible || "tous"}
                onValueChange={(value) =>
                  setFilters({ ...filters, repas_cible: value === "tous" ? undefined : (value as RepasCible) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="REPAS_1">Repas 1 (11h)</SelectItem>
                  <SelectItem value="REPAS_2">Repas 2 (17h)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Difficulté</label>
              <Select
                value={filters.difficulte || "tous"}
                onValueChange={(value) =>
                  setFilters({ ...filters, difficulte: value === "tous" ? undefined : (value as DifficulteRecette) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes</SelectItem>
                  <SelectItem value="facile">Facile</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Saison</label>
              <Select
                value={filters.saison || "tous"}
                onValueChange={(value) =>
                  setFilters({ ...filters, saison: value === "tous" ? undefined : (value as Saison) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes</SelectItem>
                  <SelectItem value="printemps">Printemps</SelectItem>
                  <SelectItem value="ete">Été</SelectItem>
                  <SelectItem value="automne">Automne</SelectItem>
                  <SelectItem value="hiver">Hiver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setFilters({});
                setSearchText("");
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </Card>
      )}

      {/* Liste des recettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Aucun résultat */}
      {recipes.length === 0 && (
        <Card className="p-12 text-center">
          <ChefHat className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune recette trouvée</h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche ou vos filtres.
          </p>
        </Card>
      )}
    </div>
    </MainLayout>
  );
}

// Composant carte de recette
function RecipeCard({ recipe }: { recipe: Recipe }) {
  const difficulteColors = {
    facile: "bg-green-100 text-green-800",
    moyen: "bg-yellow-100 text-yellow-800",
    difficile: "bg-red-100 text-red-800",
  };

  const repasColors = {
    REPAS_1: "bg-blue-100 text-blue-800",
    REPAS_2: "bg-purple-100 text-purple-800",
    LES_DEUX: "bg-gray-100 text-gray-800",
  };

  return (
    <Link href={`/recettes/${recipe.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="p-6 flex-1">
          {/* En-tête */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">
              {recipe.titre}
            </h3>
            {recipe.favoris && (
              <Heart className="w-5 h-5 text-red-500 fill-current ml-2 flex-shrink-0" />
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={difficulteColors[recipe.difficulte]}>
              {recipe.difficulte}
            </Badge>
            <Badge className={repasColors[recipe.repas_cible]}>
              {recipe.repas_cible === "REPAS_1" ? "11h" : recipe.repas_cible === "REPAS_2" ? "17h" : "Tous"}
            </Badge>
          </div>

          {/* Infos rapides */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-500" />
              <span>{recipe.temps_total_min}min</span>
            </div>
            <div className="flex items-center">
              <Flame className="w-4 h-4 mr-1 text-orange-500" />
              <span>{recipe.nutrition.calories} kcal</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span>{recipe.nutrition.proteines_g}g P</span>
            </div>
          </div>

          {/* Valeurs nutritionnelles */}
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Lipides:</span>
              <span className="font-medium">{recipe.nutrition.lipides_g}g</span>
            </div>
            <div className="flex justify-between">
              <span>Glucides:</span>
              <span className="font-medium">{recipe.nutrition.glucides_g}g</span>
            </div>
            <div className="flex justify-between">
              <span>Fibres:</span>
              <span className="font-medium">{recipe.nutrition.fibres_g}g</span>
            </div>
            {recipe.nutrition.ig_moyen && (
              <div className="flex justify-between">
                <span>IG moyen:</span>
                <span className="font-medium">{recipe.nutrition.ig_moyen}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1">
            {recipe.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag.replace(/_/g, " ")}
              </Badge>
            ))}
            {recipe.tags && recipe.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{recipe.ingredients.length} ingrédients</span>
            <span>{recipe.etapes.length} étapes</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
