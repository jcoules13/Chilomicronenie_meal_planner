"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IngredientFilters as Filters } from "@/hooks/useIngredients";
import { X } from "lucide-react";

interface IngredientFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

const GROUPES = [
  "Féculents",
  "Viandes",
  "Poissons",
  "Légumes",
  "Légumineuses",
  "Fruits",
  "Produits laitiers",
  "Noix et graines",
  "Huiles et matières grasses",
  "Aromates",
  "Condiments",
];

const COMPATIBILITES = [
  { key: "EXCELLENT", label: "EXCELLENT", emoji: "🟢" },
  { key: "BON", label: "BON", emoji: "🔵" },
  { key: "MODERE", label: "MODÉRÉ", emoji: "🟡" },
  { key: "DECONSEILLE", label: "DÉCONSEILLÉ", emoji: "🔴" },
] as const;

export function IngredientFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: IngredientFiltersProps) {
  const hasActiveFilters =
    filters.groupe ||
    filters.compatibilite ||
    filters.indexGlycemique ||
    filters.lipides;

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
              sur {totalCount} ingrédient(s)
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

      {/* Groupe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Groupe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {GROUPES.map((groupe) => (
            <button
              key={groupe}
              onClick={() =>
                onChange({
                  ...filters,
                  groupe: filters.groupe === groupe ? undefined : groupe,
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                filters.groupe === groupe
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {groupe}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Compatibilité Chylomicronémie */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Compatibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {COMPATIBILITES.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  compatibilite:
                    filters.compatibilite === key ? undefined : key,
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                filters.compatibilite === key
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

      {/* Index Glycémique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Index Glycémique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { key: "BAS", label: "Bas (<55)" },
            { key: "MOYEN", label: "Moyen (55-69)" },
            { key: "ELEVE", label: "Élevé (≥70)" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  indexGlycemique:
                    filters.indexGlycemique === key
                      ? undefined
                      : (key as "BAS" | "MOYEN" | "ELEVE"),
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                filters.indexGlycemique === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Lipides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Lipides (pour 100g)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { key: "TRES_BAS", label: "Très bas (<2g)" },
            { key: "BAS", label: "Bas (2-5g)" },
            { key: "MODERE", label: "Modéré (5-10g)" },
            { key: "ELEVE", label: "Élevé (≥10g)" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  lipides:
                    filters.lipides === key
                      ? undefined
                      : (key as "TRES_BAS" | "BAS" | "MODERE" | "ELEVE"),
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                filters.lipides === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
