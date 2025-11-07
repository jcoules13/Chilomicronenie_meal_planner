"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArchiveListeCourses } from "@/types/courses";
import { getAll, deleteById } from "@/lib/db/queries";
import { Archive, ArrowLeft, Trash2, Calendar, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function ArchivesCoursesPage() {
  const [archives, setArchives] = useState<ArchiveListeCourses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedArchiveId, setExpandedArchiveId] = useState<string | null>(null);

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    setIsLoading(true);
    try {
      const data = await getAll<ArchiveListeCourses>("archives_courses");
      // Trier par date la plus récente d'abord
      const sorted = data.sort(
        (a, b) => new Date(b.date_archive).getTime() - new Date(a.date_archive).getTime()
      );
      setArchives(sorted);
    } catch (error) {
      console.error("Erreur chargement archives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArchive = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette archive ?")) {
      return;
    }

    try {
      await deleteById("archives_courses", id);
      await loadArchives();
      alert("✅ Archive supprimée");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const toggleExpandArchive = (id: string) => {
    setExpandedArchiveId(expandedArchiveId === id ? null : id);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Stats globales
  const totalArchives = archives.length;
  const archivesCeMois = archives.filter((a) => {
    const archiveMonth = new Date(a.date_archive).getMonth();
    const currentMonth = new Date().getMonth();
    return archiveMonth === currentMonth;
  }).length;

  // Regrouper les ingrédients par catégorie pour l'affichage
  const groupByCategory = (ingredients: any[]) => {
    const grouped = new Map<string, any[]>();
    ingredients.forEach((ing) => {
      if (!grouped.has(ing.categorie)) {
        grouped.set(ing.categorie, []);
      }
      grouped.get(ing.categorie)!.push(ing);
    });
    return grouped;
  };

  const ordreCategories = [
    "Protéines",
    "Légumes",
    "Féculents",
    "Légumineuses",
    "Entrées/Salades",
    "Soupes",
    "Desserts",
    "Autres",
  ];

  return (
    <MainLayout title="Archives Listes de Courses">
      <div className="space-y-6">
        {/* Header avec retour */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux courses
            </Link>
          </Button>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total archives</p>
              <p className="text-2xl font-bold">{totalArchives}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Ce mois-ci</p>
              <p className="text-2xl font-bold">{archivesCeMois}</p>
            </div>
          </div>
        </div>

        {/* Liste des archives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Historique des listes de courses
            </CardTitle>
            <CardDescription>
              Retrouvez toutes vos listes de courses passées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : archives.length === 0 ? (
              <div className="text-center py-12">
                <Archive className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">Aucune archive</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vos listes de courses archivées apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {archives.map((archive) => {
                  const isExpanded = expandedArchiveId === archive.id;
                  const parCategorie = groupByCategory(archive.ingredients);

                  return (
                    <Card key={archive.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <CardTitle className="text-lg">
                                {formatDate(archive.date_archive)}
                              </CardTitle>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline">
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                {archive.nombre_menus} menu{archive.nombre_menus > 1 ? "s" : ""}
                              </Badge>
                              <Badge variant="outline">
                                {archive.total_items} items
                              </Badge>
                              <Badge
                                variant={archive.progression === 100 ? "default" : "secondary"}
                              >
                                {archive.progression}% complétée
                              </Badge>
                              <Badge variant="outline">
                                {archive.items_coches}/{archive.total_items} cochés
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => toggleExpandArchive(archive.id)}
                              variant="ghost"
                              size="sm"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                  Masquer
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                  Détails
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleDeleteArchive(archive.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {/* Barre de progression */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  Progression: {archive.items_coches}/{archive.total_items}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {archive.progression}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all"
                                  style={{ width: `${archive.progression}%` }}
                                />
                              </div>
                            </div>

                            {/* Liste des ingrédients */}
                            <div className="space-y-4 mt-6">
                              {ordreCategories.map((categorie) => {
                                if (!parCategorie.has(categorie)) return null;

                                const items = parCategorie.get(categorie)!;
                                items.sort((a, b) => a.nom.localeCompare(b.nom));

                                const emoji =
                                  categorie === "Protéines" ? "🍖" :
                                  categorie === "Légumes" ? "🥬" :
                                  categorie === "Féculents" ? "🌾" :
                                  categorie === "Légumineuses" ? "🫘" :
                                  categorie === "Entrées/Salades" ? "🥗" :
                                  categorie === "Soupes" ? "🍲" :
                                  categorie === "Desserts" ? "🍨" : "📦";

                                return (
                                  <div key={categorie} className="border rounded-lg p-3">
                                    <h4 className="font-semibold mb-2 text-sm">
                                      {emoji} {categorie}
                                    </h4>
                                    <div className="space-y-1">
                                      {items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className={`flex items-center gap-2 text-sm ${
                                            item.checked ? "line-through text-muted-foreground" : ""
                                          }`}
                                        >
                                          <span className={item.checked ? "text-green-600" : "text-gray-400"}>
                                            {item.checked ? "✓" : "○"}
                                          </span>
                                          <span className="flex-1">
                                            <span className="font-medium">{item.nom}</span>
                                            <span className="text-muted-foreground ml-2">
                                              {Math.ceil(item.quantite_totale)}
                                              {item.unite}
                                            </span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
