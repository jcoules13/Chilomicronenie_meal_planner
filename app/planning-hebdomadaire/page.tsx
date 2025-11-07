"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  Plus,
  Edit,
  ShoppingCart,
  Archive,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PlanningHebdomadaire, ROTATIONS_PROTEINES } from "@/types/planning";
import { getAll, update, create } from "@/lib/db/queries";
import { MenuV31 } from "@/types/menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function PlanningHebdomadairePage() {
  const router = useRouter();
  const [planningActuel, setPlanningActuel] = useState<PlanningHebdomadaire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadPlanningActuel();
  }, []);

  const loadPlanningActuel = async () => {
    setIsLoading(true);
    try {
      const plannings = await getAll<PlanningHebdomadaire>("plannings_hebdomadaires");

      // Trouver le planning de la semaine en cours (non archivé)
      const today = new Date();
      const actif = plannings.find((p) => {
        if (p.est_archive) return false;
        const debut = new Date(p.date_debut_semaine);
        const fin = new Date(p.date_fin_semaine);
        return today >= debut && today <= fin;
      });

      setPlanningActuel(actif || null);
    } catch (error) {
      console.error("Erreur chargement planning:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiver = async () => {
    if (!planningActuel) return;

    try {
      const updatedPlanning: PlanningHebdomadaire = {
        ...planningActuel,
        est_archive: true,
        date_archive: new Date(),
      };

      await update("plannings_hebdomadaires", updatedPlanning);
      alert("✅ Planning archivé avec succès !");
      setPlanningActuel(null);
    } catch (error) {
      console.error("Erreur archivage:", error);
      alert("❌ Erreur lors de l'archivage");
    } finally {
      setShowArchiveDialog(false);
    }
  };

  const handleModifier = () => {
    if (!planningActuel) return;

    if (planningActuel.mode_creation === "PERSONNALISE") {
      // Avertissement pour mode personnalisé
      setShowModifyDialog(true);
    } else {
      // Pour AUTO, rediriger directement
      router.push("/menus/generer/auto");
    }
  };

  const confirmModifier = () => {
    // Pour mode PERSONNALISÉ, on ne peut pas changer la rotation
    // On redirige vers la page de sélection des menus
    router.push("/menus/generer/personnalise");
  };

  const handleGenererCourses = async () => {
    if (!planningActuel) return;

    try {
      // Récupérer tous les menus du planning
      const menusIds = planningActuel.jours
        .map((jour) => jour.menu_selectionne)
        .filter((menu) => menu !== null) as MenuV31[];

      if (menusIds.length === 0) {
        alert("❌ Aucun menu dans le planning");
        return;
      }

      // Sauvegarder les menus dans IndexedDB pour générer la liste de courses
      for (const menu of menusIds) {
        // Vérifier si le menu existe déjà
        const existingMenus = await getAll<MenuV31>("menus");
        const exists = existingMenus.some((m) => m.id === menu.id);
        if (!exists) {
          await create<MenuV31>("menus", menu);
        }
      }

      alert("✅ Menus ajoutés à la base de données !");
      router.push("/courses");
    } catch (error) {
      console.error("Erreur génération courses:", error);
      alert("❌ Erreur lors de la génération de la liste de courses");
    }
  };

  const toggleDayExpanded = (numeroJour: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(numeroJour)) {
      newExpanded.delete(numeroJour);
    } else {
      newExpanded.add(numeroJour);
    }
    setExpandedDays(newExpanded);
  };

  if (isLoading) {
    return (
      <MainLayout title="Planning Hebdomadaire">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement du planning...</p>
        </div>
      </MainLayout>
    );
  }

  // Aucun planning actif
  if (!planningActuel) {
    return (
      <MainLayout title="Planning Hebdomadaire">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4 mx-auto">
                <CalendarCheck className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Aucun planning actif</CardTitle>
              <CardDescription>
                Créez votre premier planning hebdomadaire pour organiser vos repas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground mb-6">
                Commencez par créer un planning pour la semaine en cours ou une semaine future.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/menus/generer">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un planning
                  </Button>
                </Link>
                <Link href="/planning-hebdomadaire/archives">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Archive className="h-4 w-4 mr-2" />
                    Voir les archives
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Affichage du planning actif
  const dateDebut = new Date(planningActuel.date_debut_semaine);
  const dateFin = new Date(planningActuel.date_fin_semaine);

  return (
    <MainLayout title="Planning Hebdomadaire">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CalendarCheck className="h-6 w-6" />
                  Planning de la semaine
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Du {dateDebut.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" })} au{" "}
                  {dateFin.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-base py-1">
                  {planningActuel.mode_creation === "AUTO"
                    ? "Automatique"
                    : planningActuel.mode_creation === "PERSONNALISE"
                    ? "Personnalisé"
                    : "Frigo"}
                </Badge>
                {planningActuel.rotation_type && (
                  <Badge className="text-base py-1">
                    {ROTATIONS_PROTEINES[planningActuel.rotation_type].label}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleModifier} variant="default">
                <Edit className="h-4 w-4 mr-2" />
                Modifier le planning
              </Button>
              <Button onClick={handleGenererCourses} variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Générer liste de courses
              </Button>
              <Button onClick={() => setShowArchiveDialog(true)} variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archiver ce planning
              </Button>
              <Link href="/planning-hebdomadaire/archives">
                <Button variant="ghost">
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir les archives
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats hebdomadaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Statistiques hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <div className="text-xs text-muted-foreground mb-1">Calories totales</div>
                <div className="text-2xl font-bold">
                  {planningActuel.stats.calories_totales_semaine}
                  <span className="text-sm font-normal ml-1">kcal</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                <div className="text-xs text-muted-foreground mb-1">Protéines totales</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {planningActuel.stats.proteines_totales_g}
                  <span className="text-sm font-normal ml-1">g</span>
                </div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                <div className="text-xs text-muted-foreground mb-1">Lipides moyens/jour</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {planningActuel.stats.lipides_moyens_par_jour.toFixed(1)}
                  <span className="text-sm font-normal ml-1">g</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200">
                <div className="text-xs text-muted-foreground mb-1">Glucides totaux</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {planningActuel.stats.glucides_totaux_g}
                  <span className="text-sm font-normal ml-1">g</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des 7 jours */}
        <Card>
          <CardHeader>
            <CardTitle>Menus de la semaine</CardTitle>
            <CardDescription>Vue détaillée de vos 7 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planningActuel.jours.map((jour) => {
                const menu = jour.menu_selectionne;
                const isExpanded = expandedDays.has(jour.numero_jour);
                if (!menu) return null;

                return (
                  <div key={jour.numero_jour} className="border rounded-lg overflow-hidden">
                    <div
                      className="p-4 bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleDayExpanded(jour.numero_jour)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-sm">
                              {jour.nom_jour}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(jour.date).toLocaleDateString("fr-FR")}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {jour.proteine_imposee}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-lg">{menu.nom}</h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            {menu.calories_cibles} kcal • P: {menu.proteines_cibles_g}g • L:{" "}
                            <span className="text-red-600 font-bold">{menu.lipides_cibles_g}g</span> • G:{" "}
                            {menu.glucides_cibles_g}g
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Détails expandables */}
                    {isExpanded && (
                      <div className="p-4 bg-muted/30 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Repas 1 */}
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200">
                            <div className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                              {menu.repas_1.nom} ({menu.repas_1.heure})
                              <span className="ml-2 text-xs font-normal">
                                {menu.repas_1.calories_cibles} kcal
                              </span>
                            </div>
                            {menu.repas_1.composants.map((comp, i) => (
                              <div key={i} className="mb-2">
                                <div className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                                  {comp.nom} ({comp.calories || 0} kcal)
                                </div>
                                <ul className="text-xs space-y-0.5 text-muted-foreground pl-3">
                                  {comp.ingredients.map((ing, j) => (
                                    <li key={j}>
                                      - {ing.nom}:{" "}
                                      <span className="font-medium">
                                        {ing.quantite}
                                        {ing.unite}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Repas 2 */}
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200">
                            <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                              {menu.repas_2.nom} ({menu.repas_2.heure})
                              <span className="ml-2 text-xs font-normal">
                                {menu.repas_2.calories_cibles} kcal
                              </span>
                            </div>
                            {menu.repas_2.composants.map((comp, i) => (
                              <div key={i} className="mb-2">
                                <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                                  {comp.nom} ({comp.calories || 0} kcal)
                                </div>
                                <ul className="text-xs space-y-0.5 text-muted-foreground pl-3">
                                  {comp.ingredients.map((ing, j) => (
                                    <li key={j}>
                                      - {ing.nom}:{" "}
                                      <span className="font-medium">
                                        {ing.quantite}
                                        {ing.unite}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dialog archivage */}
        <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiver ce planning ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le planning sera déplacé dans les archives et ne sera plus visible comme planning actif.
                Vous pourrez le consulter à tout moment dans "Archives".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchiver}>Archiver</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog modification mode personnalisé */}
        <AlertDialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Modifier un planning personnalisé</AlertDialogTitle>
              <AlertDialogDescription>
                ⚠️ Vous ne pouvez pas changer la rotation de protéines d'un planning existant.
                Voulez-vous modifier les menus choisis en conservant la même rotation ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Non, annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmModifier}>
                Oui, modifier les menus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
