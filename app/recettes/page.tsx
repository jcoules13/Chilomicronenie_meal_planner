"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RecipeFilters as RecipeFiltersComponent } from "@/components/recettes/RecipeFilters";
import { ALL_RECIPE_TEMPLATES } from "@/data/recipe-templates";
import { RecipeTemplate, RecipeFilters } from "@/types/recipe";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";
import {
  Clock,
  ChefHat,
  Search,
  Heart,
  AlertCircle,
  TrendingUp,
  Droplet,
  Wheat,
} from "lucide-react";

export default function RecettesPage() {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<RecipeFilters>({});

  // Charger le profil utilisateur
  const { profile } = useProfile();

  // Calculer le budget lipides par repas
  const budgetLipidesParRepas = useMemo(() => {
    if (!profile?.valeurs_calculees?.macros_quotidiens?.lipides_g) {
      return null;
    }
    // Calculer selon la répartition des repas
    if (profile.repas.length >= 2) {
      // Prendre le plus petit pourcentage (cas le plus strict)
      const pourcentages = profile.repas.map(r => r.pourcentage_calories / 100);
      return profile.valeurs_calculees.macros_quotidiens.lipides_g * Math.min(...pourcentages);
    }
    // Par défaut, diviser par 2
    return profile.valeurs_calculees.macros_quotidiens.lipides_g / 2;
  }, [profile]);

  // Filtrer les templates selon les critères
  const filteredTemplates = useMemo(() => {
    let templates = ALL_RECIPE_TEMPLATES;

    // Filtres de base
    if (filters.type) {
      templates = templates.filter(t => t.type === filters.type);
    }
    if (filters.repas_cible) {
      templates = templates.filter(t => t.repas_cible === filters.repas_cible);
    }
    if (filters.difficulte) {
      templates = templates.filter(t => t.difficulte === filters.difficulte);
    }
    if (filters.saison) {
      templates = templates.filter(t => t.saison.includes(filters.saison!));
    }
    if (filters.temps_max_min) {
      templates = templates.filter(t => t.temps_total_min <= filters.temps_max_min!);
    }

    // Recherche texte
    if (searchText) {
      const texte = searchText.toLowerCase();
      templates = templates.filter(t => {
        const dans_titre = t.titre.toLowerCase().includes(texte);
        const dans_ingredients = t.ingredients_template.some(ing =>
          ing.nom.toLowerCase().includes(texte)
        );
        return dans_titre || dans_ingredients;
      });
    }

    return templates;
  }, [searchText, filters]);

  const total = filteredTemplates.length;

  return (
    <MainLayout title="Recettes">
      <div className="flex gap-6">
        {/* Sidebar Filtres */}
        <aside className="w-64 flex-shrink-0 space-y-4">
          <RecipeFiltersComponent
            filters={filters}
            onChange={setFilters}
            totalCount={ALL_RECIPE_TEMPLATES.length}
            filteredCount={total}
          />
        </aside>

        {/* Contenu Principal */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold">Recettes</h1>
              <p className="text-gray-600 mt-2">
                {total} recette{total > 1 ? "s" : ""} adaptée{total > 1 ? "s" : ""} à la chilomicronémie
              </p>
              {budgetLipidesParRepas && (
                <p className="text-sm text-blue-600 mt-1">
                  Budget actuel: {budgetLipidesParRepas.toFixed(1)}g de lipides par repas
                </p>
              )}
            </div>

            {/* Carte besoins utilisateur */}
            {profile?.valeurs_calculees && (
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Vos besoins quotidiens
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-bold">{profile.valeurs_calculees.besoins_energetiques_kcal} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-blue-600" />
                      <span className="text-gray-600">Protéines</span>
                    </div>
                    <span className="font-bold text-blue-600">{profile.valeurs_calculees.macros_quotidiens.proteines_g}g</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-yellow-600" />
                      <span className="text-gray-600">Lipides</span>
                    </div>
                    <span className="font-bold text-yellow-600">{profile.valeurs_calculees.macros_quotidiens.lipides_g}g</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Wheat className="w-3 h-3 text-green-600" />
                      <span className="text-gray-600">Glucides</span>
                    </div>
                    <span className="font-bold text-green-600">{profile.valeurs_calculees.macros_quotidiens.glucides_g}g</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Alerte si pas de profil */}
          {!budgetLipidesParRepas && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Profil non configuré</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Configurez votre profil avec votre taux de triglycérides pour voir les recettes adaptées à votre budget lipides.
                  </p>
                  <Link href="/profil">
                    <Button variant="outline" size="sm" className="mt-3">
                      Configurer mon profil
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher une recette, un ingrédient..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste des recettes templates */}
          {filteredTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <ChefHat className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune recette trouvée</h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <RecipeTemplateCard
                  key={template.id}
                  template={template}
                  budgetLipidesParRepas={budgetLipidesParRepas}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// Composant carte de recette template
function RecipeTemplateCard({
  template,
  budgetLipidesParRepas,
}: {
  template: RecipeTemplate;
  budgetLipidesParRepas: number | null;
}) {
  const difficulteColors = {
    facile: "bg-green-100 text-green-800",
    moyen: "bg-yellow-100 text-yellow-800",
    difficile: "bg-red-100 text-red-800",
  };

  const repasColors = {
    REPAS_1: "bg-blue-100 text-blue-800",
    REPAS_2: "bg-purple-100 text-purple-800",
    LES_DEUX: "bg-gray-100 text-gray-800",
  };

  return (
    <Link href={`/recettes/${template.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="p-6 flex-1">
          {/* En-tête */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">
              {template.titre}
            </h3>
            {template.favoris && (
              <Heart className="w-5 h-5 text-red-500 fill-current ml-2 flex-shrink-0" />
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={difficulteColors[template.difficulte]}>
              {template.difficulte}
            </Badge>
            <Badge className={repasColors[template.repas_cible]}>
              {template.repas_cible === "REPAS_1" ? "11h" : template.repas_cible === "REPAS_2" ? "17h" : "Tous"}
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              Adaptable
            </Badge>
          </div>

          {/* Infos rapides */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-500" />
              <span>{template.temps_total_min}min</span>
            </div>
            <div className="flex items-center">
              <ChefHat className="w-4 h-4 mr-1 text-blue-500" />
              <span>Sur mesure</span>
            </div>
          </div>

          {/* Aperçu ingrédients */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Ingrédients principaux :</p>
            <div className="text-xs text-gray-600 space-y-1">
              {template.ingredients_template
                .filter(ing => ing.role === "proteine_principale" || ing.role === "feculent")
                .slice(0, 3)
                .map((ing, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    <span>{ing.nom}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Info adaptation */}
          {budgetLipidesParRepas && (
            <div className="p-2 bg-blue-50 rounded text-xs">
              <p className="font-medium text-blue-900 mb-1">🎯 Recette adaptée pour vous</p>
              <p className="text-blue-700">
                Les quantités seront calculées selon votre profil ({budgetLipidesParRepas.toFixed(1)}g lipides max)
              </p>
            </div>
          )}

          {!budgetLipidesParRepas && (
            <div className="p-2 bg-gray-50 rounded text-xs">
              <p className="text-gray-700">
                Configurez votre profil pour voir les quantités adaptées
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1">
            {template.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag.replace(/_/g, " ")}
              </Badge>
            ))}
            {template.tags && template.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{template.ingredients_template.length} ingrédients</span>
            <span>{template.etapes.length} étapes</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
