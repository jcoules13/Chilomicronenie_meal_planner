"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Archive,
  ArrowLeft,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PlanningHebdomadaire, ROTATIONS_PROTEINES } from "@/types/planning";
import { getAll, deleteById } from "@/lib/db/queries";
import Link from "next/link";
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

export default function ArchivesPlanningPage() {
  const [archives, setArchives] = useState<PlanningHebdomadaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedArchives, setExpandedArchives] = useState<Set<string>>(new Set());
  const [archiveToDelete, setArchiveToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    setIsLoading(true);
    try {
      const plannings = await getAll<PlanningHebdomadaire>("plannings_hebdomadaires");

      // Filtrer les archives et trier par date (plus récent en premier)
      const archived = plannings
        .filter((p) => p.est_archive)
        .sort((a, b) => {
          const dateA = new Date(a.date_archive || a.date_creation).getTime();
          const dateB = new Date(b.date_archive || b.date_creation).getTime();
          return dateB - dateA;
        });

      setArchives(archived);
    } catch (error) {
      console.error("Erreur chargement archives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!archiveToDelete) return;

    try {
      await deleteById("plannings_hebdomadaires", archiveToDelete);
      setArchives(archives.filter((a) => a.id !== archiveToDelete));
      alert("✅ Archive supprimée avec succès !");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("❌ Erreur lors de la suppression");
    } finally {
      setArchiveToDelete(null);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedArchives);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedArchives(newExpanded);
  };

  const getArchivesCeMois = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return archives.filter((archive) => {
      const archiveDate = new Date(archive.date_archive || archive.date_creation);
      return (
        archiveDate.getMonth() === currentMonth &&
        archiveDate.getFullYear() === currentYear
      );
    }).length;
  };

  if (isLoading) {
    return (
      <MainLayout title="Archives Plannings">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des archives...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Archives Plannings">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/planning-hebdomadaire">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au planning actuel
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Archives des plannings hebdomadaires
            </CardTitle>
            <CardDescription>
              Consultez l'historique de vos plannings passés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <div className="text-xs text-muted-foreground mb-1">Total archives</div>
                <div className="text-2xl font-bold">{archives.length}</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                <div className="text-xs text-muted-foreground mb-1">Archives ce mois</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {getArchivesCeMois()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des archives */}
        {archives.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Aucune archive disponible</p>
                <Link href="/menus/generer">
                  <Button>Créer un planning</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {archives.map((archive) => {
              const isExpanded = expandedArchives.has(archive.id);
              const dateDebut = new Date(archive.date_debut_semaine);
              const dateFin = new Date(archive.date_fin_semaine);
              const dateArchive = new Date(archive.date_archive || archive.date_creation);

              return (
                <Card key={archive.id}>
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleExpanded(archive.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {dateDebut.toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                            })}{" "}
                            au{" "}
                            {dateFin.toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Badge>
                          <Badge variant="secondary">
                            {archive.mode_creation === "AUTO"
                              ? "Automatique"
                              : archive.mode_creation === "PERSONNALISE"
                              ? "Personnalisé"
                              : "Frigo"}
                          </Badge>
                          {archive.rotation_type && (
                            <Badge className="text-xs">
                              {ROTATIONS_PROTEINES[archive.rotation_type].label}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Archivé le {dateArchive.toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {archive.stats.calories_totales_semaine} kcal total •{" "}
                          Lipides moy: {archive.stats.lipides_moyens_par_jour.toFixed(1)}g/jour
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setArchiveToDelete(archive.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Détails expandables */}
                  {isExpanded && (
                    <div className="p-4 bg-muted/30 border-t space-y-4">
                      {/* Stats détaillées */}
                      <div>
                        <h4 className="font-semibold mb-3">Statistiques</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-card rounded border">
                            <div className="text-xs text-muted-foreground">Calories</div>
                            <div className="text-lg font-bold">
                              {archive.stats.calories_totales_semaine} kcal
                            </div>
                          </div>
                          <div className="p-3 bg-card rounded border">
                            <div className="text-xs text-muted-foreground">Protéines</div>
                            <div className="text-lg font-bold text-green-600">
                              {archive.stats.proteines_totales_g}g
                            </div>
                          </div>
                          <div className="p-3 bg-card rounded border">
                            <div className="text-xs text-muted-foreground">Lipides</div>
                            <div className="text-lg font-bold text-red-600">
                              {archive.stats.lipides_totaux_g}g
                            </div>
                          </div>
                          <div className="p-3 bg-card rounded border">
                            <div className="text-xs text-muted-foreground">Glucides</div>
                            <div className="text-lg font-bold text-amber-600">
                              {archive.stats.glucides_totaux_g}g
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Liste des menus */}
                      <div>
                        <h4 className="font-semibold mb-3">Menus de la semaine</h4>
                        <div className="space-y-2">
                          {archive.jours.map((jour) => {
                            const menu = jour.menu_selectionne;
                            if (!menu) return null;

                            return (
                              <div
                                key={jour.numero_jour}
                                className="p-3 bg-card rounded border text-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">
                                        {jour.nom_jour}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {jour.proteine_imposee}
                                      </Badge>
                                    </div>
                                    <div className="font-medium">{menu.nom}</div>
                                  </div>
                                  <div className="text-xs text-right text-muted-foreground">
                                    {menu.calories_cibles} kcal
                                    <br />
                                    P:{menu.proteines_cibles_g}g L:{menu.lipides_cibles_g}g G:
                                    {menu.glucides_cibles_g}g
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Dialog suppression */}
        <AlertDialog
          open={archiveToDelete !== null}
          onOpenChange={() => setArchiveToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette archive ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L'archive sera définitivement supprimée.
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
