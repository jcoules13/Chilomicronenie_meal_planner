"use client";

import { use } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EXAMPLE_RECIPES } from "@/data/recipes-examples";
import { Recipe } from "@/types/recipe";
import { calculerPourcentageMCT, validerRecette } from "@/types/recipe";
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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecetteDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const recipe = EXAMPLE_RECIPES.find((r) => r.id === id);

  if (!recipe) {
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

  const validation = validerRecette(recipe);
  const pctMCT = calculerPourcentageMCT(recipe);

  return (
    <MainLayout title={recipe.titre}>
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
        <h1 className="text-4xl font-bold mb-4">{recipe.titre}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-blue-100 text-blue-800">
            {recipe.repas_cible === "REPAS_1" ? "Repas 1 (11h)" : recipe.repas_cible === "REPAS_2" ? "Repas 2 (17h)" : "Tous repas"}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {recipe.difficulte}
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            {recipe.type.replace(/_/g, " ")}
          </Badge>
          {recipe.saison.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {/* Validation */}
      {!validation.valide && validation.erreurs.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validation.erreurs.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {validation.avertissements.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Remarques</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validation.avertissements.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos rapides */}
          <Card className="p-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <Clock className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <div className="text-2xl font-bold">{recipe.temps_total_min}</div>
                <div className="text-xs text-gray-600">minutes</div>
              </div>
              <div>
                <ChefHat className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <div className="text-2xl font-bold">{recipe.etapes.length}</div>
                <div className="text-xs text-gray-600">étapes</div>
              </div>
              <div>
                <Users className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <div className="text-2xl font-bold">{recipe.portions}</div>
                <div className="text-xs text-gray-600">portion{recipe.portions > 1 ? "s" : ""}</div>
              </div>
              <div>
                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{recipe.nutrition.calories}</div>
                <div className="text-xs text-gray-600">kcal</div>
              </div>
            </div>
          </Card>

          {/* Ingrédients */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ingrédients</h2>
            <div className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium">{ing.nom}</span>
                      <span className="text-gray-600 ml-2">
                        {ing.quantite} {ing.unite}
                      </span>
                    </div>
                    {ing.notes && (
                      <div className="text-sm text-gray-500 italic mt-1">
                        {ing.notes}
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs mt-1">
                      {ing.categorie}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Étapes de préparation */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Préparation</h2>
            <div className="space-y-6">
              {recipe.etapes.map((etape) => (
                <div key={etape.numero} className="flex">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    {etape.numero}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{etape.titre}</h3>
                    <p className="text-gray-700 mb-3">{etape.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      {etape.duree_min && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {etape.duree_min} min
                        </div>
                      )}
                      {etape.temperature && (
                        <div className="flex items-center">
                          <Flame className="w-4 h-4 mr-1" />
                          {etape.temperature}
                        </div>
                      )}
                    </div>
                    {etape.materiel && etape.materiel.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">Matériel: </span>
                        <span className="text-sm text-gray-600">
                          {etape.materiel.join(", ")}
                        </span>
                      </div>
                    )}
                    {etape.conseils && etape.conseils.length > 0 && (
                      <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2">
                        <p className="text-sm text-yellow-800">
                          💡 {etape.conseils.join(". ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Conseils */}
          {recipe.conseils && recipe.conseils.length > 0 && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Conseils du chef
              </h2>
              <ul className="space-y-2">
                {recipe.conseils.map((conseil, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-900">{conseil}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Variantes */}
          {recipe.variantes && recipe.variantes.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Variantes</h2>
              <div className="space-y-4">
                {recipe.variantes.map((variante, i) => (
                  <div key={i} className="border-l-4 border-purple-400 pl-4">
                    <h3 className="font-semibold text-purple-900 mb-1">
                      {variante.nom}
                    </h3>
                    <p className="text-gray-700 mb-1">{variante.modifications}</p>
                    {variante.notes && (
                      <p className="text-sm text-gray-600 italic">{variante.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Valeurs nutritionnelles */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Valeurs nutritionnelles</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm font-bold">{recipe.nutrition.calories} kcal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (recipe.nutrition.calories / 1200) * 100)}%` }}
                  />
                </div>
              </div>

              <hr className="my-2" />

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Protéines</span>
                  <span className="text-sm font-bold">{recipe.nutrition.proteines_g}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (recipe.nutrition.proteines_g / 60) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Lipides</span>
                  <span className="text-sm font-bold">{recipe.nutrition.lipides_g}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (recipe.nutrition.lipides_g / 12) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Glucides</span>
                  <span className="text-sm font-bold">{recipe.nutrition.glucides_g}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (recipe.nutrition.glucides_g / 80) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Fibres</span>
                  <span className="text-sm font-bold">{recipe.nutrition.fibres_g}g</span>
                </div>
              </div>

              {recipe.nutrition.ig_moyen && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">IG moyen</span>
                    <span className="text-sm font-bold">{recipe.nutrition.ig_moyen}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Détail des lipides */}
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <h2 className="text-xl font-bold mb-4">Détail des lipides</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>MCT/Coco</span>
                <span className="font-bold text-green-700">
                  {recipe.nutrition.lipides_detail.mct_coco_g}g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Huile d'olive</span>
                <span className="font-medium">
                  {recipe.nutrition.lipides_detail.huile_olive_g}g
                </span>
              </div>
              {recipe.nutrition.lipides_detail.huile_sesame_g && recipe.nutrition.lipides_detail.huile_sesame_g > 0 && (
                <div className="flex justify-between">
                  <span>Huile de sésame</span>
                  <span className="font-medium">
                    {recipe.nutrition.lipides_detail.huile_sesame_g}g
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Naturels (protéines)</span>
                <span className="font-medium">
                  {recipe.nutrition.lipides_detail.naturels_proteines_g}g
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{recipe.nutrition.lipides_g}g</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>% MCT</span>
                <span className="font-bold">{pctMCT.toFixed(1)}%</span>
              </div>
            </div>
          </Card>

          {/* Matériel requis */}
          {recipe.materiel_requis && recipe.materiel_requis.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Matériel requis</h2>
              <ul className="space-y-2">
                {recipe.materiel_requis.map((mat, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">{mat}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Stockage */}
          {recipe.stockage && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Conservation</h2>
              <div className="space-y-3 text-sm">
                {recipe.stockage.refrigerateur_jours && (
                  <div className="flex justify-between">
                    <span>Réfrigérateur</span>
                    <span className="font-medium">
                      {recipe.stockage.refrigerateur_jours} jours
                    </span>
                  </div>
                )}
                {recipe.stockage.congelateur_mois && (
                  <div className="flex justify-between">
                    <span>Congélateur</span>
                    <span className="font-medium">
                      {recipe.stockage.congelateur_mois} mois
                    </span>
                  </div>
                )}
                {recipe.stockage.instructions && (
                  <p className="text-gray-700 mt-3 pt-3 border-t">
                    {recipe.stockage.instructions}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
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
