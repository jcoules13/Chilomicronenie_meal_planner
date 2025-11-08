"use client";

import type { IngredientCiqual } from "@/types/ciqual";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCompatibiliteLabel, getIndexGlycemiqueLabel } from "@/hooks/useIngredients";
import { cn } from "@/lib/utils";
import { Eye, Info } from "lucide-react";

interface IngredientCardProps {
  ingredient: IngredientCiqual;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const compatBadge = getCompatibiliteLabel(ingredient);
  const igInfo = getIndexGlycemiqueLabel(ingredient.index_glycemique);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{ingredient.nom_fr}</CardTitle>
            <CardDescription className="mt-1">
              {ingredient.groupe}
              {ingredient.sous_groupe && ` • ${ingredient.sous_groupe}`}
            </CardDescription>
          </div>
          <div className={cn("text-2xl", compatBadge.emoji)}>
            {compatBadge.emoji}
          </div>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <Badge
            className={cn(
              "text-xs",
              compatBadge.bgClass,
              compatBadge.textClass
            )}
          >
            {compatBadge.icon} {compatBadge.label}
          </Badge>

          {ingredient.saisons.map((saison) => (
            <Badge key={saison} variant="outline" className="text-xs">
              {saison}
            </Badge>
          ))}

          {ingredient.allergenes.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              ⚠️ Allergènes
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Macros - Pour 100g */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Énergie</span>
            <span className="font-medium">
              {ingredient.nutrition_100g.energie_kcal} kcal
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Protéines</span>
            <span className="font-medium">
              {ingredient.nutrition_100g.proteines_g}g
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Lipides</span>
            <span
              className={cn(
                "font-medium",
                ingredient.nutrition_100g.lipides_g < 2
                  ? "text-green-600"
                  : ingredient.nutrition_100g.lipides_g < 5
                  ? "text-blue-600"
                  : ingredient.nutrition_100g.lipides_g < 10
                  ? "text-yellow-600"
                  : "text-red-600"
              )}
            >
              {ingredient.nutrition_100g.lipides_g}g
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Glucides</span>
            <span className="font-medium">
              {ingredient.nutrition_100g.glucides_g}g
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fibres</span>
            <span className="font-medium">
              {ingredient.nutrition_100g.fibres_g}g
            </span>
          </div>
        </div>

        {/* Index Glycémique */}
        {ingredient.index_glycemique && ingredient.index_glycemique > 0 && (
          <div className="flex justify-between text-sm mb-4 p-2 rounded bg-muted/50">
            <span className="text-muted-foreground">Index Glycémique</span>
            <span className={cn("font-semibold", igInfo.color)}>
              {ingredient.index_glycemique} - {igInfo.label}
            </span>
          </div>
        )}

        {/* Code CIQUAL */}
        <div className="flex justify-between text-xs text-muted-foreground mb-4 pb-3 border-b">
          <span>Code CIQUAL</span>
          <span className="font-mono">{ingredient.code_ciqual}</span>
        </div>

        {/* Notes */}
        {ingredient.notes && (
          <div className="text-xs text-muted-foreground italic mb-4 p-2 bg-muted/30 rounded">
            {ingredient.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Détails
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Info className="h-4 w-4 mr-1" />
            Recettes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
