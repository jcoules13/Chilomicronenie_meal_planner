"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Flame,
  Apple,
  Droplet,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Clock,
  Snowflake,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calculator,
  Info,
  ShoppingCart,
  Leaf,
  Thermometer,
  Timer,
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
  const [userBMR, setUserBMR] = useState<number>(1910);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadMenu();
    // Charger BMR utilisateur depuis le profil si disponible
    loadUserBMR();
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

  const loadUserBMR = async () => {
    try {
      // TODO: Récupérer le BMR depuis le profil utilisateur
      // Pour l'instant, utiliser la valeur par défaut
      const storedBMR = localStorage.getItem("userBMR");
      if (storedBMR) {
        setUserBMR(parseFloat(storedBMR));
      }
    } catch (error) {
      console.error("Erreur chargement BMR:", error);
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

  const calculateAdaptedCalories = () => {
    if (!menu) return 0;
    const ratio = userBMR / menu.bmr_reference;
    return Math.round(menu.calories_cibles * ratio);
  };

  const calculateAdaptedPortion = (baseQuantity: number) => {
    const ratio = userBMR / (menu?.bmr_reference || 1910);
    return Math.round(baseQuantity * ratio);
  };

  if (isLoading) {
    return (
      <MainLayout title="Chargement...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du menu...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!menu) {
    return (
      <MainLayout title="Menu introuvable">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Menu introuvable</h1>
          <p className="text-muted-foreground mb-6">
            Le menu demandé n'existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <Link href="/menus">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux menus
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const proteineInfo = getProteineInfo(menu.type_proteine);
  const frequenceInfo = getFrequenceInfo(menu.frequence);
  const budgetQuality = getBudgetLipidesQuality(menu.budget_lipides_journee);

  return (
    <MainLayout title={menu.nom}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/menus">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux menus
              </Link>
            </Button>

            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 text-5xl">{proteineInfo.icon}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{menu.nom}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">
                    {proteineInfo.label}
                  </Badge>
                  <Badge variant="outline" className={frequenceInfo.color}>
                    {frequenceInfo.icon} {frequenceInfo.label}
                  </Badge>
                  <Badge variant="outline">
                    IG moyen: {menu.ig_moyen}
                  </Badge>
                  {menu.saisons.map((saison) => (
                    <Badge key={saison} variant="outline">
                      {saison}
                    </Badge>
                  ))}
                </div>

                {menu.frequence_recommandee && (
                  <Alert className="mb-3">
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Fréquence recommandée :</strong> {menu.frequence_recommandee}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs principale */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="recipe">Recette détaillée</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="practical">Infos pratiques</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Widget BMR Adaptatif */}
            {menu.adaptatif_bmr && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Adapter les portions à votre BMR
                  </CardTitle>
                  <CardDescription>
                    Ce menu est adaptatif. Ajustez les portions selon votre métabolisme.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="userBMR">Votre BMR actuel (kcal/jour)</Label>
                      <Input
                        id="userBMR"
                        type="number"
                        value={userBMR}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setUserBMR(value);
                          localStorage.setItem("userBMR", value.toString());
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="p-4 bg-white rounded-lg border w-full">
                        <div className="text-sm text-muted-foreground mb-1">
                          Ratio d'ajustement
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {(userBMR / menu.bmr_reference).toFixed(2)}×
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Calories de référence :</span>
                      <span className="font-mono">{menu.calories_cibles} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Vos calories adaptées :</span>
                      <span className="font-mono text-lg font-bold text-primary">
                        {calculateAdaptedCalories()} kcal
                      </span>
                    </div>
                  </div>

                  {menu.formule_adaptation_bmr && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Formule d'adaptation</AlertTitle>
                      <AlertDescription className="mt-2">
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {menu.formule_adaptation_bmr}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Avantages nutritionnels */}
            {menu.avantages_nutritionnels && menu.avantages_nutritionnels.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Avantages nutritionnels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {menu.avantages_nutritionnels.map((avantage, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex-shrink-0 text-2xl">{avantage.icon || "✓"}</div>
                        <div>
                          <div className="font-semibold text-green-900">{avantage.titre}</div>
                          <div className="text-sm text-green-700">{avantage.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Récapitulatif nutritionnel */}
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif nutritionnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Calories</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {menu.adaptatif_bmr ? calculateAdaptedCalories() : menu.calories_cibles}
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      {menu.adaptatif_bmr && `(réf: ${menu.calories_cibles})`}
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Apple className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">Protéines</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {menu.proteines_cibles_g}g
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Lipides</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {menu.lipides_cibles_g}g
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      MCT: {menu.budget_lipides_journee.pct_mct}%
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-amber-900">Glucides</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">
                      {menu.glucides_cibles_g}g
                    </div>
                    <div className="text-xs text-amber-600 mt-1">
                      IG: {menu.ig_moyen}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Points critiques */}
            {(menu.points_critiques || menu.eviter_absolument) && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="h-5 w-5" />
                    Points critiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {menu.points_critiques && menu.points_critiques.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        À respecter
                      </h4>
                      <ul className="space-y-1">
                        {menu.points_critiques.map((point, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {menu.eviter_absolument && menu.eviter_absolument.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        À éviter absolument
                      </h4>
                      <ul className="space-y-1">
                        {menu.eviter_absolument.map((point, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <span className="text-red-600">✗</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Recette détaillée */}
          <TabsContent value="recipe" className="space-y-6">
            {/* REPAS 1 */}
            <RepasDetailCard
              repas={menu.repas_1}
              userBMR={userBMR}
              bmrReference={menu.bmr_reference}
              adaptatif={menu.adaptatif_bmr}
            />

            {/* REPAS 2 */}
            <RepasDetailCard
              repas={menu.repas_2}
              userBMR={userBMR}
              bmrReference={menu.bmr_reference}
              adaptatif={menu.adaptatif_bmr}
            />
          </TabsContent>

          {/* Onglet Nutrition */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget lipides détaillé</CardTitle>
                <CardDescription>
                  Répartition des lipides pour la gestion de la chylomicronémie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Total lipides</div>
                      <div className="text-2xl font-bold">
                        {menu.budget_lipides_journee.total_g}g
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700 mb-1">MCT Coco (sûr)</div>
                      <div className="text-2xl font-bold text-green-700">
                        {menu.budget_lipides_journee.mct_coco_g}g
                      </div>
                      <div className="text-xs text-green-600">
                        {menu.budget_lipides_journee.pct_mct}% du total
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Huile d'olive</span>
                      <span className="font-mono">{menu.budget_lipides_journee.huile_olive_g}g</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Huile de sésame</span>
                      <span className="font-mono">{menu.budget_lipides_journee.huile_sesame_g}g</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Lipides naturels (protéines)</span>
                      <span className="font-mono">{menu.budget_lipides_journee.naturels_proteines_g}g</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Autres sources</span>
                      <span className="font-mono">{menu.budget_lipides_journee.autres_g}g</span>
                    </div>
                  </div>

                  <Alert className={budgetQuality.status === "excellent" ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"}>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Qualité du budget lipides :</strong>{" "}
                      {budgetQuality.label}
                      <br />
                      <span className="text-xs">
                        Formation chylomicrons: {menu.budget_lipides_journee.pct_formation_chylomicrons}%
                        (cible: {"<"}70%)
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Critères d'achat généraux */}
            {menu.criteres_achat_generaux && menu.criteres_achat_generaux.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Critères d'achat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {menu.criteres_achat_generaux.map((critere, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg",
                          critere.type === "OBLIGATOIRE" && "bg-green-50 border border-green-200",
                          critere.type === "RECOMMANDE" && "bg-blue-50 border border-blue-200",
                          critere.type === "EVITER" && "bg-red-50 border border-red-200"
                        )}
                      >
                        <span className="text-xl flex-shrink-0">{critere.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {critere.type === "OBLIGATOIRE" && "Obligatoire"}
                            {critere.type === "RECOMMANDE" && "Recommandé"}
                            {critere.type === "EVITER" && "À éviter"}
                          </div>
                          <div className="text-sm">{critere.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Infos pratiques */}
          <TabsContent value="practical" className="space-y-6">
            {/* Conservation générale */}
            {menu.conservation_generale && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5" />
                    Conservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {menu.conservation_generale.frais_jours && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-700 mb-1">Au frigo</div>
                        <div className="text-2xl font-bold text-blue-700">
                          {menu.conservation_generale.frais_jours} jours
                        </div>
                        {menu.conservation_generale.frais_temperature && (
                          <div className="text-xs text-blue-600 mt-1">
                            {menu.conservation_generale.frais_temperature}
                          </div>
                        )}
                      </div>
                    )}

                    {menu.conservation_generale.congelation_mois && (
                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="text-sm text-indigo-700 mb-1">Au congélateur</div>
                        <div className="text-2xl font-bold text-indigo-700">
                          {menu.conservation_generale.congelation_mois} mois
                        </div>
                      </div>
                    )}
                  </div>

                  {menu.conservation_generale.decongélation && (
                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Décongélation :</strong> {menu.conservation_generale.decongélation}
                      </AlertDescription>
                    </Alert>
                  )}

                  {menu.conservation_generale.securite && menu.conservation_generale.securite.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Sécurité alimentaire :</h4>
                      <ul className="space-y-1">
                        {menu.conservation_generale.securite.map((note, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notes de sécurité */}
            {menu.notes_securite && menu.notes_securite.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <AlertTriangle className="h-5 w-5" />
                    Notes de sécurité alimentaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {menu.notes_securite.map((note, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <span className="text-red-600 flex-shrink-0">⚠</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Préparation à l'avance */}
            {menu.preparation_avance && menu.preparation_avance.length > 0 && (
              <Collapsible>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Préparer à l'avance (dimanche soir)
                      </CardTitle>
                      <ChevronDown className="h-5 w-5" />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <ul className="space-y-3">
                        {menu.preparation_avance.map((conseil, index) => (
                          <li key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{conseil}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Variantes express */}
            {menu.variantes_express && menu.variantes_express.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Variantes express
                  </CardTitle>
                  <CardDescription>
                    Alternatives rapides si vous manquez de temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {menu.variantes_express.map((variante, index) => (
                      <li key={index} className="flex gap-2 text-sm p-2 bg-muted rounded">
                        <span className="text-primary">⚡</span>
                        <span>{variante}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce menu ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

// Composant pour afficher un repas avec tous ses détails
function RepasDetailCard({
  repas,
  userBMR,
  bmrReference,
  adaptatif,
}: {
  repas: any;
  userBMR: number;
  bmrReference: number;
  adaptatif: boolean;
}) {
  const calculateAdaptedQuantity = (quantity: number) => {
    if (!adaptatif) return quantity;
    const ratio = userBMR / bmrReference;
    return Math.round(quantity * ratio);
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{repas.nom}</CardTitle>
            <CardDescription className="text-base mt-1">
              {repas.heure} • {repas.calories_cibles} kcal
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Protéines</div>
            <div className="text-xl font-bold text-red-600">{repas.proteines_cibles_g}g</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {repas.composants.map((composant: any, idx: number) => (
          <ComposantDetail
            key={idx}
            composant={composant}
            calculateAdaptedQuantity={calculateAdaptedQuantity}
            adaptatif={adaptatif}
          />
        ))}
      </CardContent>
    </Card>
  );
}

// Composant pour afficher un composant de repas
function ComposantDetail({
  composant,
  calculateAdaptedQuantity,
  adaptatif,
}: {
  composant: any;
  calculateAdaptedQuantity: (q: number) => number;
  adaptatif: boolean;
}) {
  const [selectedSeason, setSelectedSeason] = useState<string>("base");

  const hasVariantes = composant.variantes_saison && composant.variantes_saison.length > 0;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* En-tête du composant */}
      <div className="bg-muted p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-bold text-lg flex items-center gap-2">
              {composant.nom}
              {composant.calories && (
                <Badge variant="secondary" className="ml-2">
                  {composant.calories} kcal
                </Badge>
              )}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">{composant.description}</p>
          </div>
          {composant.proteines_g && (
            <Badge variant="outline" className="ml-2">
              {composant.proteines_g}g protéines
            </Badge>
          )}
        </div>
      </div>

      {/* Sélecteur de saisons si variantes */}
      {hasVariantes && (
        <div className="p-3 bg-slate-50 border-b flex gap-2">
          <Button
            size="sm"
            variant={selectedSeason === "base" ? "default" : "outline"}
            onClick={() => setSelectedSeason("base")}
          >
            Base
          </Button>
          {composant.variantes_saison.map((variante: any) => (
            <Button
              key={variante.saison}
              size="sm"
              variant={selectedSeason === variante.saison ? "default" : "outline"}
              onClick={() => setSelectedSeason(variante.saison)}
            >
              {variante.saison === "Automne" && "🍂"}
              {variante.saison === "Hiver" && "❄️"}
              {variante.saison === "Printemps" && "🌸"}
              {variante.saison === "Été" && "☀️"}
              {" "}{variante.saison}
            </Button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Afficher ingrédients de base ou de la variante sélectionnée */}
        {selectedSeason === "base" ? (
          <>
            {/* Ingrédients */}
            <div>
              <h5 className="font-semibold mb-2 text-sm text-muted-foreground">Ingrédients</h5>
              <ul className="space-y-1.5">
                {composant.ingredients.map((ing: any, i: number) => (
                  <li key={i} className="flex justify-between text-sm py-1 px-2 bg-muted/50 rounded">
                    <span className="font-medium">{ing.nom}</span>
                    <span className="font-mono">
                      {adaptatif ? calculateAdaptedQuantity(ing.quantite) : ing.quantite}
                      {ing.unite}
                      {ing.notes && (
                        <span className="text-xs text-muted-foreground ml-2">({ing.notes})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions de cuisson détaillées */}
            {composant.cuisson_detaillee && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-amber-700" />
                  <span className="text-amber-900">Instructions de cuisson</span>
                </h5>

                <div className="space-y-3">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-amber-900">Méthode:</span>
                      <Badge variant="outline">{composant.cuisson_detaillee.methode}</Badge>
                    </div>
                    {composant.cuisson_detaillee.temperature_celsius && (
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-amber-600" />
                        <span>{composant.cuisson_detaillee.temperature_celsius}°C</span>
                      </div>
                    )}
                    {composant.cuisson_detaillee.duree_minutes && (
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-amber-600" />
                        <span>{composant.cuisson_detaillee.duree_minutes} min</span>
                      </div>
                    )}
                  </div>

                  {composant.cuisson_detaillee.etapes && composant.cuisson_detaillee.etapes.length > 0 && (
                    <ol className="space-y-2 list-decimal list-inside">
                      {composant.cuisson_detaillee.etapes.map((etape: string, i: number) => (
                        <li key={i} className="text-sm text-amber-900">{etape}</li>
                      ))}
                    </ol>
                  )}

                  {composant.cuisson_detaillee.notes_importantes && composant.cuisson_detaillee.notes_importantes.length > 0 && (
                    <div className="pt-2 border-t border-amber-200">
                      <div className="font-medium text-sm text-amber-900 mb-1">⚠️ Important :</div>
                      <ul className="space-y-1">
                        {composant.cuisson_detaillee.notes_importantes.map((note: string, i: number) => (
                          <li key={i} className="text-xs text-amber-800 flex gap-2">
                            <span>•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Afficher la variante sélectionnée
          <>
            {(() => {
              const variante = composant.variantes_saison.find((v: any) => v.saison === selectedSeason);
              if (!variante) return null;

              return (
                <>
                  {variante.description && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{variante.description}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <h5 className="font-semibold mb-2 text-sm text-muted-foreground">Ingrédients</h5>
                    <ul className="space-y-1.5">
                      {variante.ingredients.map((ing: any, i: number) => (
                        <li key={i} className="flex justify-between text-sm py-1 px-2 bg-muted/50 rounded">
                          <span className="font-medium">{ing.nom}</span>
                          <span className="font-mono">
                            {adaptatif ? calculateAdaptedQuantity(ing.quantite) : ing.quantite}
                            {ing.unite}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {variante.cuisson_detaillee && (
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-amber-700" />
                        <span className="text-amber-900">Cuisson pour cette variante</span>
                      </h5>

                      <div className="space-y-3">
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-amber-900">Méthode:</span>
                            <Badge variant="outline">{variante.cuisson_detaillee.methode}</Badge>
                          </div>
                          {variante.cuisson_detaillee.temperature_celsius && (
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-amber-600" />
                              <span>{variante.cuisson_detaillee.temperature_celsius}°C</span>
                            </div>
                          )}
                          {variante.cuisson_detaillee.duree_minutes && (
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4 text-amber-600" />
                              <span>{variante.cuisson_detaillee.duree_minutes} min</span>
                            </div>
                          )}
                        </div>

                        {variante.cuisson_detaillee.etapes && variante.cuisson_detaillee.etapes.length > 0 && (
                          <ol className="space-y-2 list-decimal list-inside">
                            {variante.cuisson_detaillee.etapes.map((etape: string, i: number) => (
                              <li key={i} className="text-sm text-amber-900">{etape}</li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  )}

                  {variante.notes && (
                    <div className="text-sm text-muted-foreground italic">
                      Note: {variante.notes}
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}

        {/* Conservation */}
        {composant.conservation && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-semibold mb-2 text-sm flex items-center gap-2 text-blue-900">
              <Snowflake className="h-4 w-4" />
              Conservation
            </h5>
            <div className="text-sm text-blue-800 space-y-1">
              {composant.conservation.frais_jours && (
                <div>Frigo: {composant.conservation.frais_jours} jours</div>
              )}
              {composant.conservation.congelation_mois && (
                <div>Congélateur: {composant.conservation.congelation_mois} mois</div>
              )}
              {composant.conservation.decongélation && (
                <div className="text-xs mt-1">
                  Décongélation: {composant.conservation.decongélation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Critères d'achat */}
        {composant.criteres_achat && composant.criteres_achat.length > 0 && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <h5 className="font-semibold mb-2 text-sm flex items-center gap-2 text-green-900">
              <ShoppingCart className="h-4 w-4" />
              Critères d'achat
            </h5>
            <ul className="space-y-1">
              {composant.criteres_achat.map((critere: any, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="flex-shrink-0">{critere.icon}</span>
                  <span className={
                    critere.type === "EVITER" ? "text-red-700" :
                    critere.type === "OBLIGATOIRE" ? "text-green-700" :
                    "text-blue-700"
                  }>
                    {critere.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes importantes */}
        {composant.notes_importantes && composant.notes_importantes.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>À noter</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1">
                {composant.notes_importantes.map((note: string, i: number) => (
                  <li key={i} className="text-sm">• {note}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
