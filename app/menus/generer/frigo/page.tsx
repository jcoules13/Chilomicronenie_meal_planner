"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function MenuFrigoPage() {
  return (
    <MainLayout title="Menu Reste du Frigo">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Bouton retour */}
        <Link href="/menus/generer">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à Gestion des Menus
          </Button>
        </Link>

        {/* Card principale */}
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4 mx-auto">
              <ChefHat className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl">Fonctionnalité en cours de développement</CardTitle>
            <CardDescription className="text-lg">
              Le mode "Menu Reste du Frigo" arrivera prochainement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description du concept */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Concept
              </h3>
              <p className="text-muted-foreground mb-4">
                Cette fonctionnalité vous permettra de créer des menus équilibrés à partir des ingrédients
                que vous avez déjà dans votre frigo et vos placards.
              </p>
            </div>

            {/* Fonctionnalités prévues */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Fonctionnalités prévues :</h3>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-medium mb-2">📝 Inventaire personnalisé</h4>
                  <p className="text-sm text-muted-foreground">
                    Saisissez les ingrédients disponibles dans votre frigo avec leurs quantités
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-medium mb-2">🤖 Suggestions intelligentes</h4>
                  <p className="text-sm text-muted-foreground">
                    L'IA vous proposera des menus réalisables avec ce que vous avez
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-medium mb-2">🛒 Liste complémentaire</h4>
                  <p className="text-sm text-muted-foreground">
                    Achetez uniquement ce qu'il manque pour équilibrer vos repas
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-medium mb-2">♻️ Anti-gaspillage</h4>
                  <p className="text-sm text-muted-foreground">
                    Réduisez le gaspillage en utilisant les ingrédients avant leur péremption
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-medium mb-2">⚖️ Respect des contraintes</h4>
                  <p className="text-sm text-muted-foreground">
                    Tous les menus respecteront vos besoins nutritionnels et contraintes de santé
                  </p>
                </div>
              </div>
            </div>

            {/* Alternatives actuelles */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-lg mb-3">
                En attendant, explorez nos autres modes de création :
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/menus/generer/auto" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Génération Automatique
                  </Button>
                </Link>
                <Link href="/menus/generer/personnalise" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Création Personnalisée
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact / Suggestion */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                💡 Une suggestion pour cette fonctionnalité ?{" "}
                <a href="#" className="underline font-medium hover:text-primary">
                  Contactez-nous
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
