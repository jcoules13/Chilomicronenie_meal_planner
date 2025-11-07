"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MenuV31 } from "@/types/menu";
import { IngredientCourse, ArchiveListeCourses } from "@/types/courses";
import { getAll, create, deleteById } from "@/lib/db/queries";
import { genererListeCourses } from "@/lib/utils/menu-generator";
import { Download, RefreshCw, Trash2, Calendar, Archive, Sparkles } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";

export default function CoursesPage() {
  const [menus, setMenus] = useState<MenuV31[]>([]);
  const [ingredients, setIngredients] = useState<Map<string, IngredientCourse>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [hasShownDialogForCurrentList, setHasShownDialogForCurrentList] = useState(false);

  // Charger les menus et générer la liste
  useEffect(() => {
    loadMenusAndGenerateList();
  }, []);

  // Détecter quand tous les items sont cochés
  useEffect(() => {
    const totalItems = ingredients.size;
    const checkedItems = Array.from(ingredients.values()).filter((i) => i.checked).length;

    if (totalItems > 0 && checkedItems === totalItems && !hasShownDialogForCurrentList) {
      setShowCompletionDialog(true);
      setHasShownDialogForCurrentList(true);
    }
  }, [ingredients, hasShownDialogForCurrentList]);

  const loadMenusAndGenerateList = async () => {
    setIsLoading(true);
    setHasShownDialogForCurrentList(false);

    try {
      const menusFromDb = await getAll<MenuV31>("menus");
      setMenus(menusFromDb);

      // Générer la liste de courses
      const ingredientsMap = new Map<string, IngredientCourse>();

      menusFromDb.forEach((menu) => {
        // REPAS 1
        menu.repas_1.composants.forEach((composant) => {
          const categorie =
            composant.nom.includes("PROTÉINE") ? "Protéines" :
            composant.nom.includes("LÉGUMES") ? "Légumes" :
            composant.nom.includes("FÉCULENTS") ? "Féculents" :
            composant.nom.includes("ENTRÉE") || composant.nom.includes("Salade") ? "Entrées/Salades" :
            composant.nom.includes("DESSERT") ? "Desserts" : "Autres";

          composant.ingredients.forEach((ingredient) => {
            const key = ingredient.nom.toLowerCase();

            let quantite_g = ingredient.quantite;
            if (ingredient.unite === "ml") {
              quantite_g = ingredient.quantite;
            } else if (ingredient.unite !== "g") {
              quantite_g = ingredient.quantite * 100;
            }

            if (ingredientsMap.has(key)) {
              const existing = ingredientsMap.get(key)!;
              existing.quantite_totale += quantite_g;
            } else {
              ingredientsMap.set(key, {
                nom: ingredient.nom,
                quantite_totale: quantite_g,
                unite: "g",
                categorie,
                checked: false,
              });
            }
          });
        });

        // REPAS 2
        menu.repas_2.composants.forEach((composant) => {
          const categorie =
            composant.nom.includes("PROTÉINE") ? "Protéines" :
            composant.nom.includes("LÉGUMES") ? "Légumes" :
            composant.nom.includes("LÉGUMINEUSES") ? "Légumineuses" :
            composant.nom.includes("ENTRÉE") || composant.nom.includes("Soupe") ? "Soupes" : "Autres";

          composant.ingredients.forEach((ingredient) => {
            const key = ingredient.nom.toLowerCase();

            let quantite_g = ingredient.quantite;
            if (ingredient.unite === "ml") {
              quantite_g = ingredient.quantite;
            } else if (ingredient.unite !== "g") {
              quantite_g = ingredient.quantite * 100;
            }

            if (ingredientsMap.has(key)) {
              const existing = ingredientsMap.get(key)!;
              existing.quantite_totale += quantite_g;
            } else {
              ingredientsMap.set(key, {
                nom: ingredient.nom,
                quantite_totale: quantite_g,
                unite: "g",
                categorie,
                checked: false,
              });
            }
          });
        });
      });

      // Charger l'état des checkboxes depuis localStorage
      const saved = localStorage.getItem("liste_courses_checked");
      if (saved) {
        const checkedItems: string[] = JSON.parse(saved);
        checkedItems.forEach((key) => {
          if (ingredientsMap.has(key)) {
            ingredientsMap.get(key)!.checked = true;
          }
        });
      }

      setIngredients(ingredientsMap);
    } catch (error) {
      console.error("Erreur chargement menus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIngredient = (key: string) => {
    const newMap = new Map(ingredients);
    const ingredient = newMap.get(key);
    if (ingredient) {
      ingredient.checked = !ingredient.checked;
      setIngredients(newMap);

      // Sauvegarder dans localStorage
      const checkedItems = Array.from(newMap.entries())
        .filter(([_, ing]) => ing.checked)
        .map(([key]) => key);
      localStorage.setItem("liste_courses_checked", JSON.stringify(checkedItems));
    }
  };

  const clearChecked = () => {
    const newMap = new Map(ingredients);
    newMap.forEach((ing) => {
      ing.checked = false;
    });
    setIngredients(newMap);
    localStorage.removeItem("liste_courses_checked");
    setHasShownDialogForCurrentList(false);
  };

  const archiveCurrentList = async () => {
    try {
      const totalItems = ingredients.size;
      const checkedItems = Array.from(ingredients.values()).filter((i) => i.checked).length;
      const progression = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

      const archive: ArchiveListeCourses = {
        id: nanoid(),
        date_creation: new Date(),
        date_archive: new Date(),
        nombre_menus: menus.length,
        ingredients: Array.from(ingredients.values()),
        total_items: totalItems,
        items_coches: checkedItems,
        progression,
      };

      await create<ArchiveListeCourses>("archives_courses", archive);
      console.log("✅ Liste archivée avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur archivage:", error);
      alert("Erreur lors de l'archivage de la liste");
      return false;
    }
  };

  const handleNouvelleSemaine = async () => {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir démarrer une nouvelle semaine ?\n\nCette action va :\n• Supprimer TOUS les menus actuels\n• Effacer la liste de courses\n• Réinitialiser les checkboxes\n\nCette action est IRRÉVERSIBLE.")) {
      return;
    }

    try {
      // Supprimer tous les menus
      for (const menu of menus) {
        await deleteById("menus", menu.id);
      }

      // Effacer localStorage
      localStorage.removeItem("liste_courses_checked");

      // Réinitialiser l'état
      setMenus([]);
      setIngredients(new Map());
      setHasShownDialogForCurrentList(false);

      alert("✅ Nouvelle semaine démarrée !\n\nRendez-vous dans 'Générer des menus' pour créer votre prochaine semaine.");
    } catch (error) {
      console.error("Erreur nouvelle semaine:", error);
      alert("❌ Erreur lors de la réinitialisation");
    }
  };

  const handleCompletionDialogDelete = async () => {
    // Option "OUI" : Effacer la liste (supprimer tous les menus)
    try {
      // Supprimer tous les menus
      for (const menu of menus) {
        await deleteById("menus", menu.id);
      }

      // Effacer localStorage
      localStorage.removeItem("liste_courses_checked");

      // Réinitialiser l'état
      setMenus([]);
      setIngredients(new Map());
      setHasShownDialogForCurrentList(false);
      setShowCompletionDialog(false);

      alert("✅ Liste effacée avec succès !\n\nRendez-vous dans 'Générer des menus' pour créer votre prochaine semaine.");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("❌ Erreur lors de la suppression");
      setShowCompletionDialog(false);
    }
  };

  const handleCompletionDialogArchive = async () => {
    // Option "NON" : Archiver la liste puis supprimer tous les menus
    const success = await archiveCurrentList();

    if (success) {
      // Après archivage, supprimer tous les menus
      try {
        for (const menu of menus) {
          await deleteById("menus", menu.id);
        }

        // Effacer localStorage
        localStorage.removeItem("liste_courses_checked");

        // Réinitialiser l'état
        setMenus([]);
        setIngredients(new Map());
        setHasShownDialogForCurrentList(false);

        alert("✅ Liste archivée avec succès !\n\nVous pouvez la consulter dans 'Accès Archives'.");
      } catch (error) {
        console.error("Erreur suppression menus:", error);
        alert("❌ Liste archivée mais erreur lors de la suppression des menus");
      }
    }

    setShowCompletionDialog(false);
  };

  const handleExportMarkdown = () => {
    if (menus.length === 0) {
      alert("Aucun menu à exporter");
      return;
    }

    try {
      const listeCourses = genererListeCourses(menus);

      const blob = new Blob([listeCourses], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Liste_Courses_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("✅ Liste de courses téléchargée !");
    } catch (error) {
      console.error("Erreur export:", error);
      alert("❌ Erreur lors de l'export");
    }
  };

  // Regrouper par catégorie
  const parCategorie = new Map<string, IngredientCourse[]>();
  ingredients.forEach((ingredient) => {
    if (!parCategorie.has(ingredient.categorie)) {
      parCategorie.set(ingredient.categorie, []);
    }
    parCategorie.get(ingredient.categorie)!.push(ingredient);
  });

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

  const totalItems = ingredients.size;
  const checkedItems = Array.from(ingredients.values()).filter((i) => i.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <MainLayout title="Liste de Courses">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste de Courses</CardTitle>
                <CardDescription>
                  Générée à partir de {menus.length} menu{menus.length > 1 ? "s" : ""} sauvegardé
                  {menus.length > 1 ? "s" : ""}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/courses/archives">
                    <Archive className="h-4 w-4 mr-2" />
                    Accès Archives
                  </Link>
                </Button>
                <Button onClick={loadMenusAndGenerateList} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
                <Button onClick={handleExportMarkdown} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger MD
                </Button>
                <Button onClick={clearChecked} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Tout décocher
                </Button>
                <Button onClick={handleNouvelleSemaine} variant="destructive" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Nouvelle semaine
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : menus.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg font-medium">Aucun menu sauvegardé</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Générez des menus dans la section "Générer des menus" pour créer une liste de courses
                </p>
                <Button asChild className="mt-4">
                  <Link href="/menus/generer">
                    <Calendar className="h-4 w-4 mr-2" />
                    Générer des menus
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Barre de progression */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Progression: {checkedItems}/{totalItems} items
                    </span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Liste par catégorie */}
                <div className="space-y-6">
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
                      <div key={categorie} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">
                          {emoji} {categorie}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item) => {
                            const key = item.nom.toLowerCase();
                            return (
                              <div
                                key={key}
                                className={`flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors ${
                                  item.checked ? "opacity-50" : ""
                                }`}
                              >
                                <Checkbox
                                  checked={item.checked}
                                  onCheckedChange={() => toggleIngredient(key)}
                                  id={key}
                                />
                                <label
                                  htmlFor={key}
                                  className={`flex-1 cursor-pointer ${
                                    item.checked ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  <span className="font-medium">{item.nom}</span>
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    {Math.ceil(item.quantite_totale)}
                                    {item.unite}
                                  </span>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de complétion automatique */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎉 Vous avez fini vos courses !</AlertDialogTitle>
            <AlertDialogDescription>
              Félicitations, vous avez coché tous les items de votre liste.
              <br /><br />
              <strong>Voulez-vous effacer cette liste ?</strong>
              <br /><br />
              • <strong>OUI</strong> : La liste sera effacée définitivement
              <br />
              • <strong>NON</strong> : La liste sera archivée (vous pourrez la consulter plus tard)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCompletionDialogArchive}>
              NON (Archiver)
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCompletionDialogDelete}>
              OUI (Effacer)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
