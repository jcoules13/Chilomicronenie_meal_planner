"use client";

import { use, useMemo, useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALL_RECIPE_TEMPLATES } from "@/data/recipe-templates";
import { Recipe } from "@/types/recipe";
import { adapterRecetteAuProfil } from "@/lib/recipe-adaptation";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";
import {
  Clock,
  ChefHat,
  Flame,
  Users,
  Heart,
  Share2,
  Printer,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Info,
  Lightbulb,
  TrendingUp,
  Droplet,
  Wheat,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecetteDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const template = ALL_RECIPE_TEMPLATES.find((r) => r.id === id);

  // Charger le profil utilisateur
  const { profile } = useProfile();

  // État pour la recette adaptée
  const [recetteAdaptee, setRecetteAdaptee] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculer la recette adaptée quand le profil est disponible
  useEffect(() => {
    if (!template || !profile) {
      return;
    }

    const adapter = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const adapted = await adapterRecetteAuProfil(template, profile);
        setRecetteAdaptee(adapted);
      } catch (err) {
        console.error("Erreur adaptation recette:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    adapter();
  }, [template, profile]);

  if (!template) {
    return (
      <MainLayout title="Recette introuvable">
      <div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Recette introuvable</AlertTitle>
          <AlertDescription>
            La recette que vous recherchez n'existe pas.
          </AlertDescription>
        </Alert>
        <Link href="/recettes">
          <Button className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux recettes
          </Button>
        </Link>
      </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={template.titre}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/recettes">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Titre et infos principales */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{template.titre}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-blue-100 text-blue-800">
            {template.repas_cible === "REPAS_1" ? "Repas 1 (11h)" : template.repas_cible === "REPAS_2" ? "Repas 2 (17h)" : "Tous repas"}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {template.difficulte}
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            {template.type.replace(/_/g, " ")}
          </Badge>
          {template.saison.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
          {recetteAdaptee && (
            <Badge className="bg-orange-100 text-orange-800 font-medium">
              Adaptée pour vous
            </Badge>
          )}
        </div>
      </div>

      {/* Alerte si pas de profil */}
      {!profile && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-900">Profil non configuré</AlertTitle>
          <AlertDescription className="text-yellow-800">
            Configurez votre profil pour voir les quantités adaptées à vos besoins.
            <Link href="/profil">
              <Button variant="outline" size="sm" className="mt-2">
                Configurer mon profil
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Calcul en cours</AlertTitle>
          <AlertDescription>
            Adaptation de la recette à votre profil...
          </AlertDescription>
        </Alert>
      )}

      {/* Erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos rapides */}
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps total</p>
                  <p className="text-lg font-semibold">{template.temps_total_min} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ChefHat className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Difficulté</p>
                  <p className="text-lg font-semibold capitalize">{template.difficulte}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Portions</p>
                  <p className="text-lg font-semibold">1 (sur mesure)</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Ingrédients */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-blue-600" />
              Ingrédients {recetteAdaptee && "(calculés pour vous)"}
            </h2>

            {!recetteAdaptee && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Les quantités seront calculées selon votre profil
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {recetteAdaptee ? (
                // Ingrédients avec quantités calculées
                recetteAdaptee.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="font-medium">{ingredient.nom}</span>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {ingredient.quantite}g
                    </span>
                  </div>
                ))
              ) : (
                // Template sans quantités
                template.ingredients_template.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="font-medium text-gray-600">{ingredient.nom}</span>
                      {ingredient.role && (
                        <Badge variant="outline" className="text-xs">
                          {ingredient.role.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-400 text-sm italic">
                      Quantité à calculer
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Étapes de préparation */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Préparation</h2>
            <div className="space-y-6">
              {template.etapes.map((etape) => (
                <div key={etape.numero} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {etape.numero}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{etape.titre}</h3>
                    <p className="text-gray-700 mb-2">{etape.description}</p>
                    {etape.duree_min && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {etape.duree_min} min
                      </p>
                    )}
                    {etape.conseils && etape.conseils.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-xs text-yellow-800 flex items-start gap-1">
                          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{etape.conseils.join(" • ")}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Conseils */}
          {template.conseils && template.conseils.length > 0 && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Conseils
              </h2>
              <ul className="space-y-2">
                {template.conseils.map((conseil, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{conseil}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Colonne latérale - Nutrition */}
        <div className="space-y-6">
          {/* Valeurs nutritionnelles */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Valeurs nutritionnelles</h2>
            {recetteAdaptee ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-3xl font-bold text-gray-900">
                    {recetteAdaptee.nutrition.calories}
                  </p>
                  <p className="text-sm text-gray-600">kcal</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-700">Protéines</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {recetteAdaptee.nutrition.proteines_g}g
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-gray-700">Lipides</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">
                        {recetteAdaptee.nutrition.lipides_g}g
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-700">Glucides</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {recetteAdaptee.nutrition.glucides_g}g
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700">Fibres</span>
                      <span className="text-lg font-bold text-purple-600">
                        {recetteAdaptee.nutrition.fibres_g}g
                      </span>
                    </div>
                  </div>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Parfaitement adapté</strong> à votre profil et vos besoins nutritionnels
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Les valeurs nutritionnelles seront calculées selon votre profil
                </AlertDescription>
              </Alert>
            )}
          </Card>

          {/* Conservation */}
          {template.stockage && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-3">Conservation</h2>
              <div className="space-y-2 text-sm">
                {template.stockage.refrigerateur_jours && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Réfrigérateur:</span>
                    <span>{template.stockage.refrigerateur_jours} jours</span>
                  </p>
                )}
                {template.stockage.congelateur_mois && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Congélateur:</span>
                    <span>{template.stockage.congelateur_mois} mois</span>
                  </p>
                )}
                {template.stockage.instructions && (
                  <p className="text-gray-600 text-xs mt-2">
                    {template.stockage.instructions}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
