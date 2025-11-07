"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { TypeRotation, ROTATIONS_PROTEINES, JourPlanning, PlanningHebdomadaire } from "@/types/planning";
import { MenuV31 } from "@/types/menu";
import { useProfile } from "@/hooks/useProfile";
import { getAll, create } from "@/lib/db/queries";
import { nanoid } from "nanoid";
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

type Etape = "ROTATION" | "DATE" | "SELECTION_MENUS" | "VALIDATION";

const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function CreerMenuPersonnalisePage() {
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useProfile();

  // État du workflow
  const [etape, setEtape] = useState<Etape>("ROTATION");
  const [rotationChoisie, setRotationChoisie] = useState<TypeRotation | null>(null);
  const [dateDebut, setDateDebut] = useState<string>("");
  const [jourActuel, setJourActuel] = useState<number>(1); // 1-7
  const [menusSelectionnes, setMenusSelectionnes] = useState<Map<number, MenuV31>>(new Map());

  // Données
  const [menusDisponibles, setMenusDisponibles] = useState<MenuV31[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  // Initialiser la date au lundi de la semaine en cours
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajuster pour lundi
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    setDateDebut(monday.toISOString().split("T")[0]);
  }, []);

  // Charger tous les menus disponibles
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const menus = await getAll<MenuV31>("menus");
        setMenusDisponibles(menus);
      } catch (error) {
        console.error("Erreur chargement menus:", error);
      }
    };
    loadMenus();
  }, []);

  const handleSelectRotation = (type: TypeRotation) => {
    setRotationChoisie(type);
  };

  const handleContinuerRotation = () => {
    if (rotationChoisie) {
      setEtape("DATE");
    }
  };

  const handleContinuerDate = () => {
    if (dateDebut) {
      setEtape("SELECTION_MENUS");
    }
  };

  const getProteineJour = (numeroJour: number): string => {
    if (!rotationChoisie) return "";
    const rotation = ROTATIONS_PROTEINES[rotationChoisie];
    return rotation.sequence[numeroJour - 1];
  };

  const getDateJour = (numeroJour: number): Date => {
    const date = new Date(dateDebut);
    date.setDate(date.getDate() + (numeroJour - 1));
    return date;
  };

  const getMenusFiltres = (): MenuV31[] => {
    const proteineRequise = getProteineJour(jourActuel);
    return menusDisponibles.filter((menu) => {
      // Normaliser les comparaisons
      const menuProteine = menu.type_proteine?.toLowerCase().trim();
      const proteineRequiseLower = proteineRequise.toLowerCase().trim();

      return (
        menuProteine === proteineRequiseLower ||
        menuProteine?.includes(proteineRequiseLower) ||
        proteineRequiseLower.includes(menuProteine || "")
      );
    });
  };

  const handleSelectMenu = (menu: MenuV31) => {
    const newMap = new Map(menusSelectionnes);
    newMap.set(jourActuel, menu);
    setMenusSelectionnes(newMap);

    // Passer au jour suivant automatiquement
    if (jourActuel < 7) {
      setJourActuel(jourActuel + 1);
    } else {
      // Dernier jour complété, passer à validation
      setEtape("VALIDATION");
    }
  };

  const handleJourPrecedent = () => {
    if (jourActuel > 1) {
      setJourActuel(jourActuel - 1);
    }
  };

  const handleJourSuivant = () => {
    if (jourActuel < 7 && menusSelectionnes.has(jourActuel)) {
      setJourActuel(jourActuel + 1);
    }
  };

  const handleAnnuler = () => {
    setShowCancelDialog(true);
  };

  const confirmAnnuler = () => {
    router.push("/menus/generer");
  };

  const calculerStats = () => {
    let calories_totales = 0;
    let proteines_totales = 0;
    let lipides_totaux = 0;
    let glucides_totaux = 0;

    menusSelectionnes.forEach((menu) => {
      calories_totales += menu.calories_cibles || 0;
      proteines_totales += menu.proteines_cibles_g || 0;
      lipides_totaux += menu.lipides_cibles_g || 0;
      glucides_totaux += menu.glucides_cibles_g || 0;
    });

    return {
      calories_totales_semaine: calories_totales,
      proteines_totales_g: proteines_totales,
      lipides_totaux_g: lipides_totaux,
      glucides_totaux_g: glucides_totaux,
      lipides_moyens_par_jour: lipides_totaux / 7,
    };
  };

  const handleValider = async () => {
    if (!rotationChoisie || menusSelectionnes.size !== 7) return;

    setIsLoading(true);
    try {
      // Créer les jours du planning
      const jours: JourPlanning[] = [];
      for (let i = 1; i <= 7; i++) {
        jours.push({
          numero_jour: i,
          nom_jour: JOURS_SEMAINE[i - 1],
          date: getDateJour(i),
          proteine_imposee: getProteineJour(i),
          menu_selectionne: menusSelectionnes.get(i) || null,
        });
      }

      // Créer le planning
      const dateDebutObj = new Date(dateDebut);
      const dateFinObj = new Date(dateDebut);
      dateFinObj.setDate(dateFinObj.getDate() + 6);

      const planning: PlanningHebdomadaire = {
        id: nanoid(),
        date_creation: new Date(),
        date_debut_semaine: dateDebutObj,
        date_fin_semaine: dateFinObj,
        mode_creation: "PERSONNALISE",
        rotation_type: rotationChoisie,
        jours,
        stats: calculerStats(),
        est_valide: true,
        est_archive: false,
      };

      // Sauvegarder
      await create<PlanningHebdomadaire>("plannings_hebdomadaires", planning);

      alert("✅ Planning hebdomadaire créé avec succès !");
      router.push("/planning-hebdomadaire");
    } catch (error) {
      console.error("Erreur sauvegarde planning:", error);
      alert("❌ Erreur lors de la sauvegarde du planning");
    } finally {
      setIsLoading(false);
      setShowValidationDialog(false);
    }
  };

  if (profileLoading) {
    return (
      <MainLayout title="Création Personnalisée">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout title="Création Personnalisée">
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
    <MainLayout title="Création Personnalisée">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Bouton retour */}
        <Link href="/menus/generer">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à Gestion des Menus
          </Button>
        </Link>

        {/* Indicateur d'étape */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {[
                { key: "ROTATION", label: "Rotation" },
                { key: "DATE", label: "Date" },
                { key: "SELECTION_MENUS", label: "Sélection" },
                { key: "VALIDATION", label: "Validation" },
              ].map((step, idx) => (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      etape === step.key
                        ? "bg-primary border-primary text-primary-foreground"
                        : etape === "VALIDATION" && idx < 3
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-muted border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {etape === "VALIDATION" && idx < 3 ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium">{step.label}</span>
                  {idx < 3 && <div className="w-12 h-0.5 bg-border mx-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Étape 1 : Choix de la rotation */}
        {etape === "ROTATION" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Choisissez votre rotation de protéines
              </CardTitle>
              <CardDescription>
                Sélectionnez la rotation qui vous convient pour organiser vos repas de la semaine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(ROTATIONS_PROTEINES).map(([key, rotation]) => (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all ${
                      rotationChoisie === key
                        ? "border-2 border-primary shadow-lg"
                        : "border hover:border-primary/50"
                    }`}
                    onClick={() => handleSelectRotation(key as TypeRotation)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {rotation.label}
                        {rotationChoisie === key && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription>{rotation.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Séquence hebdomadaire :
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {rotation.sequence.map((proteine, idx) => (
                            <Badge key={idx} variant="outline">
                              J{idx + 1}: {proteine}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleAnnuler}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  onClick={handleContinuerRotation}
                  disabled={!rotationChoisie}
                  size="lg"
                >
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2 : Choix de la date */}
        {etape === "DATE" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Choisissez la date de début
              </CardTitle>
              <CardDescription>
                Sélectionnez le lundi de la semaine pour laquelle vous créez ce planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md">
                <Label htmlFor="date-debut" className="mb-2 block">
                  Date de début (Lundi)
                </Label>
                <Input
                  id="date-debut"
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="text-lg"
                />
                {dateDebut && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium mb-2">
                      Aperçu de la semaine :
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {JOURS_SEMAINE.map((jour, idx) => {
                        const date = new Date(dateDebut);
                        date.setDate(date.getDate() + idx);
                        return (
                          <div key={idx} className="text-center">
                            <div className="font-medium">{jour}</div>
                            <div className="text-xs text-muted-foreground">
                              {date.toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-between">
                <Button
                  variant="outline"
                  onClick={() => setEtape("ROTATION")}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleAnnuler}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    onClick={handleContinuerDate}
                    disabled={!dateDebut}
                    size="lg"
                  >
                    Continuer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 3 : Sélection des menus jour par jour */}
        {etape === "SELECTION_MENUS" && (
          <>
            {/* Barre de progression */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {JOURS_SEMAINE[jourActuel - 1]} {getDateJour(jourActuel).toLocaleDateString("fr-FR")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Protéine du jour : <Badge>{getProteineJour(jourActuel)}</Badge>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {menusSelectionnes.size} / 7
                    </div>
                    <p className="text-xs text-muted-foreground">jours complétés</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(menusSelectionnes.size / 7) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Liste des menus disponibles */}
            <Card>
              <CardHeader>
                <CardTitle>Sélectionnez un menu</CardTitle>
                <CardDescription>
                  Choisissez parmi {getMenusFiltres().length} menu(s) disponible(s) avec{" "}
                  {getProteineJour(jourActuel)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getMenusFiltres().length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Aucun menu disponible avec "{getProteineJour(jourActuel)}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Générez d'abord des menus ou importez-les depuis des fichiers
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getMenusFiltres().map((menu) => (
                      <Card
                        key={menu.id}
                        className="cursor-pointer hover:border-primary transition-all"
                        onClick={() => handleSelectMenu(menu)}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">{menu.nom}</CardTitle>
                          <CardDescription>
                            {menu.type_proteine} • {menu.saisons?.join(", ")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Calories:</span>
                              <span className="font-medium">
                                {menu.calories_cibles} kcal
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Macros:</span>
                              <span>
                                P: {menu.proteines_cibles_g}g | L:{" "}
                                <span className="text-red-600 font-bold">
                                  {menu.lipides_cibles_g}g
                                </span>{" "}
                                | G: {menu.glucides_cibles_g}g
                              </span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            Sélectionner ce menu
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handleJourPrecedent}
                    disabled={jourActuel === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Jour précédent
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleAnnuler}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    {menusSelectionnes.size === 7 && (
                      <Button onClick={() => setEtape("VALIDATION")} size="lg">
                        Voir le récapitulatif
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Étape 4 : Validation */}
        {etape === "VALIDATION" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de votre planning</CardTitle>
                <CardDescription>
                  Vérifiez votre sélection avant de valider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Résumé de la semaine */}
                <div className="space-y-3">
                  {Array.from({ length: 7 }, (_, i) => i + 1).map((jour) => {
                    const menu = menusSelectionnes.get(jour);
                    const date = getDateJour(jour);
                    return (
                      <div
                        key={jour}
                        className="p-4 border rounded-lg bg-card flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant="outline">
                              {JOURS_SEMAINE[jour - 1]}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {date.toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <div className="font-medium">{menu?.nom}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {menu?.calories_cibles} kcal • P: {menu?.proteines_cibles_g}g • L:{" "}
                            {menu?.lipides_cibles_g}g • G: {menu?.glucides_cibles_g}g
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats hebdomadaires */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-3">Statistiques hebdomadaires</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Calories totales</div>
                      <div className="text-lg font-bold">
                        {calculerStats().calories_totales_semaine} kcal
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Protéines</div>
                      <div className="text-lg font-bold text-green-600">
                        {calculerStats().proteines_totales_g}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Lipides (moy/jour)</div>
                      <div className="text-lg font-bold text-red-600">
                        {calculerStats().lipides_moyens_par_jour.toFixed(1)}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Glucides</div>
                      <div className="text-lg font-bold text-amber-600">
                        {calculerStats().glucides_totaux_g}g
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setEtape("SELECTION_MENUS")}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleAnnuler}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      onClick={() => setShowValidationDialog(true)}
                      size="lg"
                      disabled={isLoading}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Valider le planning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Dialog confirmation annulation */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Annuler la création ?</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir annuler ? Toutes vos sélections seront perdues.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Non, continuer</AlertDialogCancel>
              <AlertDialogAction onClick={confirmAnnuler}>
                Oui, annuler
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog validation finale */}
        <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Valider ce planning hebdomadaire ?</AlertDialogTitle>
              <AlertDialogDescription>
                Votre planning sera sauvegardé et accessible dans "Planning Hebdomadaire".
                Vous pourrez le modifier ultérieurement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Non, revenir en arrière</AlertDialogCancel>
              <AlertDialogAction onClick={handleValider} disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : "Oui, valider"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
