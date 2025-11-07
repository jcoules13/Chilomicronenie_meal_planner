"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  TrendingUp,
  Flame,
  Apple,
  Droplet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MenuV31 } from "@/types/menu";
import { getById, deleteById } from "@/lib/db/queries";
import Link from "next/link";
import {
  getProteineInfo,
  getFrequenceInfo,
  getBudgetLipidesQuality,
} from "@/lib/utils/menu-helpers";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params.id as string;

  const [menu, setMenu] = useState<MenuV31 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["repas1", "repas2", "budget"]));

  useEffect(() => {
    loadMenu();
  }, [menuId]);

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const menuData = await getById<MenuV31>("menus", menuId);
      setMenu(menuData || null);
    } catch (error) {
      console.error("Erreur chargement menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteById("menus", menuId);
      alert("✅ Menu supprimé avec succès !");
      router.push("/menus");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("❌ Erreur lors de la suppression");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (isLoading) {
    return (
      <MainLayout title="Détails du menu">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </MainLayout>
    );
  }

  if (!menu) {
    return (
      <MainLayout title="Menu introuvable">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-4">Menu introuvable</p>
              <Link href="/menus">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux menus
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  const proteineInfo = getProteineInfo(menu.type_proteine);
  const frequenceInfo = getFrequenceInfo(menu.frequence);
  const budgetQuality = getBudgetLipidesQuality(menu.budget_lipides_journee);

  return (
    <MainLayout title={menu.nom}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <Link href="/menus">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux menus
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>

        {/* Titre et badges */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-3">{menu.nom}</CardTitle>
                <CardDescription className="text-lg flex items-center gap-2">
                  <span className={cn("text-2xl", proteineInfo.color)}>
                    {proteineInfo.icon}
                  </span>
                  {proteineInfo.label}
                </CardDescription>
              </div>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              <Badge
                className={cn("text-sm", frequenceInfo.bgClass, frequenceInfo.color)}
              >
                {frequenceInfo.label}
              </Badge>
              <Badge
                className={cn("text-sm", budgetQuality.bgClass, budgetQuality.color)}
              >
                {budgetQuality.icon} {budgetQuality.label}
              </Badge>
              {menu.saisons.map((saison) => (
                <Badge key={saison} variant="outline" className="text-sm">
                  {saison}
                </Badge>
              ))}
              {menu.tags?.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Objectifs nutritionnels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Objectifs nutritionnels de la journée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Calories</span>
                </div>
                <div className="text-2xl font-bold">{menu.calories_cibles}</div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Protéines</span>
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {menu.proteines_cibles_g}
                </div>
                <div className="text-xs text-muted-foreground">g</div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="h-4 w-4 text-red-600" />
                  <span className="text-xs text-muted-foreground">Lipides</span>
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {menu.lipides_cibles_g}
                </div>
                <div className="text-xs text-muted-foreground">g</div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Glucides</span>
                </div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {menu.glucides_cibles_g}
                </div>
                <div className="text-xs text-muted-foreground">g</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Index Glycémique Moyen</span>
                <span className="font-bold text-lg">{menu.ig_moyen}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* REPAS 1 */}
        <Card>
          <div
            className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => toggleSection("repas1")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">
                  🍽️ {menu.repas_1.nom} - {menu.repas_1.heure}
                </CardTitle>
                <CardDescription className="mt-2">
                  {menu.repas_1.calories_cibles} kcal • P: {menu.repas_1.proteines_cibles_g}g • L:{" "}
                  <span className="text-red-600 font-bold">
                    {menu.repas_1.lipides_cibles_g}g
                  </span>{" "}
                  • G: {menu.repas_1.glucides_cibles_g}g
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                {expandedSections.has("repas1") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {expandedSections.has("repas1") && (
            <CardContent className="border-t space-y-4">
              {menu.repas_1.composants.map((composant, idx) => (
                <div key={idx} className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center justify-between">
                    <span>{composant.nom}</span>
                    {composant.calories && (
                      <Badge variant="outline" className="text-xs">
                        {composant.calories} kcal
                      </Badge>
                    )}
                  </h4>
                  {composant.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {composant.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    {composant.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">• {ing.nom}</span>
                        <span className="font-medium">
                          {ing.quantite} {ing.unite}
                        </span>
                      </div>
                    ))}
                  </div>
                  {composant.variantes_saison && composant.variantes_saison.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-300/30">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-2">
                        Variantes saisonnières :
                      </p>
                      {composant.variantes_saison.map((variante, v) => (
                        <div key={v} className="text-xs text-muted-foreground ml-2 mb-2">
                          • <strong>{variante.saison}</strong> :{" "}
                          {variante.ingredients.map(ing => `${ing.nom} (${ing.quantite}${ing.unite})`).join(", ")}
                          {variante.notes && <div className="ml-4 italic">{variante.notes}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* REPAS 2 */}
        <Card>
          <div
            className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => toggleSection("repas2")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">
                  🥣 {menu.repas_2.nom} - {menu.repas_2.heure}
                </CardTitle>
                <CardDescription className="mt-2">
                  {menu.repas_2.calories_cibles} kcal • P: {menu.repas_2.proteines_cibles_g}g • L:{" "}
                  <span className="text-red-600 font-bold">
                    {menu.repas_2.lipides_cibles_g}g
                  </span>{" "}
                  • G: {menu.repas_2.glucides_cibles_g}g
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                {expandedSections.has("repas2") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {expandedSections.has("repas2") && (
            <CardContent className="border-t space-y-4">
              {menu.repas_2.composants.map((composant, idx) => (
                <div key={idx} className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center justify-between">
                    <span>{composant.nom}</span>
                    {composant.calories && (
                      <Badge variant="outline" className="text-xs">
                        {composant.calories} kcal
                      </Badge>
                    )}
                  </h4>
                  {composant.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {composant.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    {composant.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">• {ing.nom}</span>
                        <span className="font-medium">
                          {ing.quantite} {ing.unite}
                        </span>
                      </div>
                    ))}
                  </div>
                  {composant.variantes_saison && composant.variantes_saison.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-300/30">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                        Variantes saisonnières :
                      </p>
                      {composant.variantes_saison.map((variante, v) => (
                        <div key={v} className="text-xs text-muted-foreground ml-2 mb-2">
                          • <strong>{variante.saison}</strong> :{" "}
                          {variante.ingredients.map(ing => `${ing.nom} (${ing.quantite}${ing.unite})`).join(", ")}
                          {variante.notes && <div className="ml-4 italic">{variante.notes}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Budget Lipides */}
        <Card>
          <div
            className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => toggleSection("budget")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Budget Lipides de la Journée
                </CardTitle>
                <CardDescription className="mt-2">
                  Total : {menu.budget_lipides_journee.total_g.toFixed(1)}g • MCT Coco :{" "}
                  {menu.budget_lipides_journee.mct_coco_g.toFixed(1)}g (
                  {menu.budget_lipides_journee.pct_mct}%)
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                {expandedSections.has("budget") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {expandedSections.has("budget") && (
            <CardContent className="border-t">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">MCT Huile de Coco ⭐</span>
                  <span className="font-bold text-green-600">
                    {menu.budget_lipides_journee.mct_coco_g.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Huile d'Olive</span>
                  <span className="font-medium">
                    {menu.budget_lipides_journee.huile_olive_g.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Huile de Sésame</span>
                  <span className="font-medium">
                    {menu.budget_lipides_journee.huile_sesame_g.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lipides naturels (protéines)</span>
                  <span className="font-medium">
                    {menu.budget_lipides_journee.naturels_proteines_g.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Autres sources</span>
                  <span className="font-medium">
                    {menu.budget_lipides_journee.autres_g.toFixed(1)}g
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">TOTAL</span>
                    <span className="text-xl font-bold">
                      {menu.budget_lipides_journee.total_g.toFixed(1)}g
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Formation chylomicrons
                    </span>
                    <span
                      className={cn(
                        "font-bold text-lg",
                        menu.budget_lipides_journee.pct_formation_chylomicrons > 70
                          ? "text-red-600"
                          : "text-gray-600"
                      )}
                    >
                      {menu.budget_lipides_journee.pct_formation_chylomicrons}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Points critiques */}
        {menu.points_critiques && menu.points_critiques.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10">
            <CardHeader>
              <CardTitle className="text-lg text-amber-900 dark:text-amber-100">
                ⚠️ Points critiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {menu.points_critiques.map((point, idx) => (
                  <li key={idx} className="text-sm text-amber-800 dark:text-amber-200">
                    • {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Éviter absolument */}
        {menu.eviter_absolument && menu.eviter_absolument.length > 0 && (
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/10">
            <CardHeader>
              <CardTitle className="text-lg text-red-900 dark:text-red-100">
                🚫 À éviter absolument
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {menu.eviter_absolument.map((item, idx) => (
                  <li key={idx} className="text-sm text-red-800 dark:text-red-200">
                    • {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Métadonnées */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Métadonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>Créé le :</span>
              <span>{new Date(menu.date_creation).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex justify-between">
              <span>Modifié le :</span>
              <span>{new Date(menu.date_modification).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex justify-between">
              <span>Version :</span>
              <span>{menu.version}</span>
            </div>
            {menu.source && (
              <div className="flex justify-between">
                <span>Source :</span>
                <span>{menu.source}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog suppression */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce menu ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le menu "{menu.nom}" sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
