"use client";

import { Aliment } from "@/types/aliment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCompatibilityBadge, getCategorieIG, formatMacros } from "@/lib/utils/aliment-helpers";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface AlimentCardProps {
  aliment: Aliment;
  onDelete?: (id: string) => void;
}

export function AlimentCard({ aliment, onDelete }: AlimentCardProps) {
  const compatBadge = getCompatibilityBadge(aliment.compatible_chylomicronemie);
  const igInfo = getCategorieIG(aliment.index_glycemique);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{aliment.nom}</CardTitle>
            <CardDescription className="mt-1">{aliment.categorie}</CardDescription>
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

          {Array.isArray(aliment.saison) ? (
            aliment.saison.map((s) => (
              <Badge key={s} variant="outline" className="text-xs">
                {s}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-xs">
              {aliment.saison}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Macros */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Énergie</span>
            <span className="font-medium">
              {aliment.valeurs_nutritionnelles_100g.energie_kcal} kcal
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatMacros(
              aliment.valeurs_nutritionnelles_100g.proteines_g,
              aliment.valeurs_nutritionnelles_100g.lipides_g,
              aliment.valeurs_nutritionnelles_100g.glucides_g
            )}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fibres</span>
            <span className="font-medium">
              {aliment.valeurs_nutritionnelles_100g.fibres_g}g
            </span>
          </div>
        </div>

        {/* Index Glycémique */}
        <div className="flex justify-between text-sm mb-4 p-2 rounded bg-muted/50">
          <span className="text-muted-foreground">Index Glycémique</span>
          <span className={cn("font-semibold", igInfo.color)}>
            {aliment.index_glycemique} - {igInfo.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/aliments/${aliment.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/aliments/${aliment.id}/edit`}>
              <Pencil className="h-4 w-4 mr-1" />
              Éditer
            </Link>
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(aliment.id)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
