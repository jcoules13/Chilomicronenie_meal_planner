"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecipeFilters as Filters } from "@/types/recipe";
import { X } from "lucide-react";

interface RecipeFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

const TYPE_RECETTE = [
  { key: "plat_principal", label: "Plat principal", emoji: "🍽️" },
  { key: "entree", label: "Entrée", emoji: "🥗" },
  { key: "soupe", label: "Soupe", emoji: "🍲" },
  { key: "dessert", label: "Dessert", emoji: "🍰" },
];

const REPAS_CIBLE = [
  { key: "REPAS_1", label: "Repas 1 (11h)", emoji: "🌞" },
  { key: "REPAS_2", label: "Repas 2 (17h)", emoji: "🌙" },
  { key: "LES_DEUX", label: "Les deux", emoji: "⏰" },
];

const DIFFICULTE = [
  { key: "facile", label: "Facile", emoji: "🟢" },
  { key: "moyen", label: "Moyen", emoji: "🟡" },
  { key: "difficile", label: "Difficile", emoji: "🔴" },
];

const SAISONS = [
  { key: "printemps", label: "Printemps", emoji: "🌸" },
  { key: "ete", label: "Été", emoji: "☀️" },
  { key: "automne", label: "Automne", emoji: "🍂" },
  { key: "hiver", label: "Hiver", emoji: "❄️" },
];

const TEMPS_PREPARATION = [
  { key: 15, label: "≤15 min (Express)", emoji: "⚡" },
  { key: 30, label: "≤30 min (Rapide)", emoji: "🏃" },
  { key: 45, label: "≤45 min (Moyen)", emoji: "⏱️" },
  { key: 60, label: "≤60 min (Long)", emoji: "🕐" },
];

export function RecipeFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: RecipeFiltersProps) {
  const hasActiveFilters =
    filters.type ||
    filters.repas_cible ||
    filters.difficulte ||
    filters.saison ||
    filters.temps_max_min !== undefined;

  const resetFilters = () => {
    onChange({});
  };

  return (
    <div className="space-y-4">
      {/* Compteur */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{filteredCount}</div>
            <div className="text-sm text-muted-foreground">
              sur {totalCount} recette(s)
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="w-full mt-3"
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Type de recette */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Type de recette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {TYPE_RECETTE.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  type: filters.type === key ? undefined : (key as any),
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                filters.type === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Repas cible */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Repas cible</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {REPAS_CIBLE.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  repas_cible: filters.repas_cible === key ? undefined : (key as any),
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                filters.repas_cible === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Difficulté */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Difficulté</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {DIFFICULTE.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  difficulte: filters.difficulte === key ? undefined : (key as any),
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                filters.difficulte === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Saison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Saison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SAISONS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  saison: filters.saison === key ? undefined : (key as any),
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                filters.saison === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Temps de préparation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Temps de préparation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {TEMPS_PREPARATION.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  temps_max_min: filters.temps_max_min === key ? undefined : key,
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                filters.temps_max_min === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
