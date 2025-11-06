"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wand2, Calendar, Save, Download, ShoppingCart, RefreshCw } from "lucide-react";
import { Saison } from "@/types/aliment";
import { genererSemaineMenus, exporterMenusMarkdown, genererListeCourses } from "@/lib/utils/menu-generator";
import { useProfile } from "@/hooks/useProfile";
import { MenuV31 } from "@/types/menu";
import { Checkbox } from "@/components/ui/checkbox";
import { create } from "@/lib/db/queries";

export default function GenererMenusPage() {
  const { profile, isLoading: profileLoading } = useProfile();
  const [dateDebut, setDateDebut] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [saisonsSelectionnees, setSaisonsSelectionnees] = useState<Saison[]>([
    "Automne",
    "Hiver",
  ]);
  const [menusGeneres, setMenusGeneres] = useState<MenuV31[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saisons: Saison[] = ["Printemps", "Été", "Automne", "Hiver", "Toute année"];

  const toggleSaison = (saison: Saison) => {
    setSaisonsSelectionnees((prev) =>
      prev.includes(saison)
        ? prev.filter((s) => s !== saison)
        : [...prev, saison]
    );
  };

  const handleGenerer = async () => {
    if (!profile) {
      setError("Veuillez d'abord configurer votre profil utilisateur");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const menus = await genererSemaineMenus({
        profile,
        dateDebut: new Date(dateDebut),
        saisons: saisonsSelectionnees.length > 0 ? saisonsSelectionnees : saisons,
      });

      setMenusGeneres(menus);
    } catch (err) {
      console.error("Erreur génération:", err);
      setError(
        err instanceof Error ? err.message : "Erreur lors de la génération"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSauvegarder = async () => {
    try {
      for (const menu of menusGeneres) {
        await create<MenuV31>("menus", menu);
      }
      alert(`✅ ${menusGeneres.length} menus sauvegardés avec succès dans la base !`);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      alert("❌ Erreur lors de la sauvegarde des menus");
    }
  };

  const handleExportMarkdown = () => {
    try {
      const markdown = exporterMenusMarkdown(menusGeneres);

      // Créer un blob et télécharger
      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Menus_Semaine_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("✅ Export Markdown téléchargé !");
    } catch (error) {
      console.error("Erreur export:", error);
      alert("❌ Erreur lors de l'export Markdown");
    }
  };

  const handleGenererListeCourses = () => {
    try {
      const listeCourses = genererListeCourses(menusGeneres);

      // Créer un blob et télécharger
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
      console.error("Erreur génération liste:", error);
      alert("❌ Erreur lors de la génération de la liste de courses");
    }
  };

  if (profileLoading) {
    return (
      <MainLayout title="Générer Menus">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout title="Générer Menus">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Profil manquant</CardTitle>
            <CardDescription>
              Vous devez d'abord configurer votre profil utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/profil">Configurer mon profil</a>
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Générateur de Menus">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Générer une semaine de menus
            </CardTitle>
            <CardDescription>
              Génération automatique basée sur votre profil et les aliments disponibles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Infos profil */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-sm mb-2">Contraintes de votre profil</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Calories/jour :</span>
                  <br />
                  <span className="font-bold">
                    {profile.valeurs_calculees?.besoins_energetiques_kcal || 2100} kcal
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Protéines :</span>
                  <br />
                  <span className="font-bold">
                    {profile.valeurs_calculees?.macros_quotidiens.proteines_g || 170}g
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Lipides max :</span>
                  <br />
                  <span className="font-bold text-red-600">
                    {profile.valeurs_calculees?.macros_quotidiens.lipides_g || 15}g
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Glucides :</span>
                  <br />
                  <span className="font-bold">
                    {profile.valeurs_calculees?.macros_quotidiens.glucides_g || 280}g
                  </span>
                </div>
              </div>
              {profile.contraintes_sante.chylomicronemie && (
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                  ℹ️ Régime chylomicronémie : Aliments filtrés (lipides &lt; 5g/100g), IG bas prioritaire
                </p>
              )}
            </div>

            {/* Options de génération */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date-debut" className="mb-2 block">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Date de début
                </Label>
                <Input
                  id="date-debut"
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-2 block">Saisons préférées</Label>
                <div className="flex flex-wrap gap-2">
                  {saisons.map((saison) => (
                    <Badge
                      key={saison}
                      variant={
                        saisonsSelectionnees.includes(saison)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleSaison(saison)}
                    >
                      {saison}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sélectionnez une ou plusieurs saisons (vide = toutes)
                </p>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Bouton génération */}
            <Button
              onClick={handleGenerer}
              disabled={isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Générer 7 jours de menus
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Résultats */}
        {menusGeneres.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Menus générés ({menusGeneres.length})</CardTitle>
              <CardDescription>
                Prévisualisation de votre semaine de menus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleSauvegarder} variant="default">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder dans la base
                </Button>
                <Button onClick={handleExportMarkdown} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Markdown
                </Button>
                <Button onClick={handleGenererListeCourses} variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Liste de courses
                </Button>
              </div>

              {/* Liste des menus */}
              <div className="space-y-4">
                {menusGeneres.map((menu, idx) => (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{menu.nom}</h3>
                        <p className="text-sm text-muted-foreground">
                          {menu.type_proteine} • {menu.saisons.join(", ")}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">
                          {menu.calories_cibles} kcal
                        </div>
                        <div className="text-xs text-muted-foreground">
                          P: {menu.proteines_cibles_g}g | L:{" "}
                          <span className="text-red-600 font-bold">
                            {menu.lipides_cibles_g}g
                          </span>{" "}
                          | G: {menu.glucides_cibles_g}g
                        </div>
                      </div>
                    </div>

                    {/* Aperçu repas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
                        <div className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                          {menu.repas_1.nom} ({menu.repas_1.heure})
                        </div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {menu.repas_1.composants.map((comp, i) => (
                            <li key={i}>• {comp.nom}: {comp.description}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                        <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          {menu.repas_2.nom} ({menu.repas_2.heure})
                        </div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {menu.repas_2.composants.map((comp, i) => (
                            <li key={i}>• {comp.nom}: {comp.description}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
