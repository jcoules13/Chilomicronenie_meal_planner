"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuFilters as Filters } from "@/hooks/useMenus";
import { TypeProteine, FrequenceMenu } from "@/types/menu";
import { X } from "lucide-react";

interface MenuFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

const TYPES_PROTEINE: TypeProteine[] = [
  "Poulet",
  "Dinde",
  "Boeuf",
  "Porc",
  "Poisson Maigre",
  "Poisson Gras",
  "Végétarien",
  "Végétalien",
];

const FREQUENCES: FrequenceMenu[] = [
  "QUOTIDIEN",
  "HEBDOMADAIRE",
  "SEMAINE_4",
  "OCCASIONNEL",
  "SPECIAL",
];

const PROTEINE_ICONS: Record<TypeProteine, string> = {
  Poulet: "🐔",
  Dinde: "🦃",
  Boeuf: "🥩",
  Porc: "🐷",
  "Poisson Maigre": "🐟",
  "Poisson Gras": "🐠",
  Végétarien: "🥚",
  Végétalien: "🌱",
};

const FREQUENCE_LABELS: Record<FrequenceMenu, string> = {
  QUOTIDIEN: "Quotidien",
  HEBDOMADAIRE: "Hebdomadaire",
  SEMAINE_4: "Semaine 4",
  OCCASIONNEL: "Occasionnel",
  SPECIAL: "Spécial",
};

export function MenuFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: MenuFiltersProps) {
  const hasActiveFilters =
    filters.type_proteine ||
    filters.frequence ||
    filters.lipides_max !== undefined ||
    filters.pct_mct_min !== undefined;

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
              sur {totalCount} menu(s)
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

      {/* Type de protéine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Type de protéine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {TYPES_PROTEINE.map((type) => (
            <button
              key={type}
              onClick={() =>
                onChange({
                  ...filters,
                  type_proteine: filters.type_proteine === type ? undefined : type,
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                filters.type_proteine === type
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>{PROTEINE_ICONS[type]}</span>
              <span>{type}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Fréquence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fréquence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {FREQUENCES.map((freq) => (
            <button
              key={freq}
              onClick={() =>
                onChange({
                  ...filters,
                  frequence: filters.frequence === freq ? undefined : freq,
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                filters.frequence === freq
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {FREQUENCE_LABELS[freq]}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Budget lipides max */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Budget lipides max</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { key: 20, label: "≤20g (Standard)" },
            { key: 25, label: "≤25g" },
            { key: 30, label: "≤30g (Poisson gras)" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  lipides_max: filters.lipides_max === key ? undefined : key,
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                filters.lipides_max === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* % MCT minimum */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">% MCT minimum ⭐</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { key: 0, label: "Tous" },
            { key: 30, label: "≥30% (Recommandé)" },
            { key: 50, label: "≥50% (Optimal)" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                onChange({
                  ...filters,
                  pct_mct_min: filters.pct_mct_min === key ? undefined : key,
                })
              }
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                filters.pct_mct_min === key
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
