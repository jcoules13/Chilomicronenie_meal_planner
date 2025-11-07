"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, ChefHat, ArrowRight } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

export default function GestionMenusPage() {
  const { profile, isLoading: profileLoading } = useProfile();

  if (profileLoading) {
    return (
      <MainLayout title="Gestion des Menus">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout title="Gestion des Menus">
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
    <MainLayout title="Gestion des Menus">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Informations profil */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de votre profil</CardTitle>
            <CardDescription>
              Vos besoins nutritionnels quotidiens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-muted-foreground mb-1">Calories/jour</div>
                <div className="text-2xl font-bold">
                  {profile.valeurs_calculees?.besoins_energetiques_kcal || 2100}
                  <span className="text-sm font-normal ml-1">kcal</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xs text-muted-foreground mb-1">Protéines</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {profile.valeurs_calculees?.macros_quotidiens.proteines_g || 170}
                  <span className="text-sm font-normal ml-1">g</span>
                </div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-xs text-muted-foreground mb-1">Lipides max</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {profile.valeurs_calculees?.macros_quotidiens.lipides_g || 15}
                  <span className="text-sm font-normal ml-1">g</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="text-xs text-muted-foreground mb-1">Glucides</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {profile.valeurs_calculees?.macros_quotidiens.glucides_g || 280}
                  <span className="text-sm font-normal ml-1">g</span>
                </div>
              </div>
            </div>
            {profile.contraintes_sante.chylomicronemie && (
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                ℹ️ <strong>Régime chylomicronémie actif</strong> : Les menus générés respecteront automatiquement les contraintes lipidiques strictes et l'index glycémique bas.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Section choix du mode */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Gérer une semaine de menus</h2>
          <p className="text-muted-foreground mb-6">
            Choisissez comment vous souhaitez créer vos menus hebdomadaires
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode 1 : Génération automatique */}
            <Link href="/menus/generer/auto">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4 mx-auto">
                    <Wand2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-center">Génération Automatique</CardTitle>
                  <CardDescription className="text-center">
                    Laissez l'IA créer votre semaine complète en un clic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>7 jours de menus générés automatiquement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Rotation automatique des protéines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Respect strict de vos contraintes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Rapide et simple</span>
                    </li>
                  </ul>
                  <Button className="w-full" size="lg">
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Mode 2 : Création personnalisée */}
            <Link href="/menus/generer/personnalise">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4 mx-auto">
                    <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-center">Création Personnalisée</CardTitle>
                  <CardDescription className="text-center">
                    Choisissez vos menus jour par jour avec rotation de protéines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>4 rotations de protéines au choix</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Sélection manuelle des menus</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Portions calculées automatiquement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Contrôle total sur vos choix</span>
                    </li>
                  </ul>
                  <Button className="w-full" size="lg">
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Mode 3 : Reste du frigo */}
            <Link href="/menus/generer/frigo">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary relative">
                <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs font-semibold px-2 py-1 rounded">
                  Bientôt
                </div>
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4 mx-auto">
                    <ChefHat className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-center">Menu Reste du Frigo</CardTitle>
                  <CardDescription className="text-center">
                    Créez des menus à partir de ce que vous avez déjà
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Saisie des ingrédients disponibles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Suggestions de menus réalisables</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Liste de courses complémentaire</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Réduction du gaspillage</span>
                    </li>
                  </ul>
                  <Button className="w-full" size="lg">
                    Découvrir
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Note informative */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              💡 <strong>Astuce :</strong> Après avoir créé vos menus, retrouvez-les dans <Link href="/planning-hebdomadaire" className="underline font-semibold">Planning Hebdomadaire</Link> pour générer automatiquement votre liste de courses.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
