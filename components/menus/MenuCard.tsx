"use client";

import { MenuV31 } from "@/types/menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getProteineInfo,
  getFrequenceInfo,
  getBudgetLipidesQuality,
  formatBudgetLipides,
} from "@/lib/utils/menu-helpers";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface MenuCardProps {
  menu: MenuV31;
  onDelete?: (id: string) => void;
}

export function MenuCard({ menu, onDelete }: MenuCardProps) {
  const proteineInfo = getProteineInfo(menu.type_proteine);
  const frequenceInfo = getFrequenceInfo(menu.frequence);
  const budgetQuality = getBudgetLipidesQuality(menu.budget_lipides_journee);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{menu.nom}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span className={cn("text-base", proteineInfo.color)}>
                {proteineInfo.icon}
              </span>
              {proteineInfo.label}
            </CardDescription>
          </div>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <Badge
            className={cn("text-xs", frequenceInfo.bgClass, frequenceInfo.color)}
          >
            {frequenceInfo.label}
          </Badge>

          <Badge
            className={cn(
              "text-xs",
              budgetQuality.bgClass,
              budgetQuality.color
            )}
          >
            {budgetQuality.icon} {budgetQuality.label}
          </Badge>

          {menu.saisons.map((saison) => (
            <Badge key={saison} variant="outline" className="text-xs">
              {saison}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Budget Lipides */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Lipides totaux</span>
            <span className="font-medium">
              {menu.budget_lipides_journee.total_g.toFixed(1)}g
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">MCT coco ⭐</span>
            <span className="font-medium text-green-600">
              {menu.budget_lipides_journee.mct_coco_g.toFixed(1)}g (
              {menu.budget_lipides_journee.pct_mct}%)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Formation chylomicrons</span>
            <span
              className={cn(
                "font-medium",
                menu.budget_lipides_journee.pct_formation_chylomicrons > 70
                  ? "text-red-600"
                  : "text-gray-600"
              )}
            >
              {menu.budget_lipides_journee.pct_formation_chylomicrons}%
            </span>
          </div>
        </div>

        {/* Cibles nutritionnelles journée */}
        <div className="flex justify-between text-sm mb-4 p-2 rounded bg-muted/50">
          <span className="text-muted-foreground">Cibles journée</span>
          <span className="font-medium text-xs">
            {menu.calories_cibles} kcal | {menu.proteines_cibles_g}g prot
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/menus/${menu.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Link>
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(menu.id)}
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
