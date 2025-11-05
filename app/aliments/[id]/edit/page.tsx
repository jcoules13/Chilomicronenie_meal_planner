"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Aliment, CategorieAliment, CompatibilitePathologie, Saison } from "@/types/aliment";
import { getById, update } from "@/lib/db/queries";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const CATEGORIES: CategorieAliment[] = [
  "Légumes", "Protéines", "Féculents", "Fruits", "Aromates", "Condiments",
  "Produits laitiers", "Noix et graines", "Légumineuses",
  "Huiles et matières grasses", "Boissons", "Autres"
];

const COMPATIBILITES: CompatibilitePathologie[] = [
  "EXCELLENT", "BON", "MODERE", "DECONSEILLE"
];

const SAISONS: Saison[] = [
  "Printemps", "Été", "Automne", "Hiver", "Toute année"
];

export default function EditAlimentPage() {
  const params = useParams();
  const router = useRouter();
  const [aliment, setAliment] = useState<Aliment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadAliment = async () => {
      if (!params.id) return;

      try {
        const data = await getById<Aliment>("aliments", params.id as string);
        setAliment(data || null);
      } catch (error) {
        console.error("Erreur chargement aliment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAliment();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliment) return;

    setIsSaving(true);

    try {
      const updated = {
        ...aliment,
        date_modification: new Date(),
      };
      await update<Aliment>("aliments", updated);
      alert("Aliment modifié avec succès");
      router.push(`/aliments/${aliment.id}`);
    } catch (error) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Édition">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </MainLayout>
    );
  }

  if (!aliment) {
    return (
      <MainLayout title="Édition">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">Aliment introuvable</p>
            <Button asChild className="mt-4">
              <Link href="/aliments">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Link>
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Éditer : ${aliment.nom}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href={`/aliments/${aliment.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Annuler
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <Input
                  value={aliment.nom}
                  onChange={(e) => setAliment({ ...aliment, nom: e.target.value })}
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie *</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={aliment.categorie}
                  onChange={(e) => setAliment({ ...aliment, categorie: e.target.value as CategorieAliment })}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Compatibilité */}
              <div>
                <label className="block text-sm font-medium mb-2">Compatibilité Chylomicronémie *</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={aliment.compatible_chylomicronemie}
                  onChange={(e) => setAliment({ ...aliment, compatible_chylomicronemie: e.target.value as CompatibilitePathologie })}
                  required
                >
                  {COMPATIBILITES.map((comp) => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>

              {/* Index Glycémique */}
              <div>
                <label className="block text-sm font-medium mb-2">Index Glycémique (0-120) *</label>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  value={aliment.index_glycemique}
                  onChange={(e) => setAliment({ ...aliment, index_glycemique: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              {/* Valeurs Nutritionnelles */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Valeurs nutritionnelles (pour 100g)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Énergie (kcal) *</label>
                    <Input
                      type="number"
                      value={aliment.valeurs_nutritionnelles_100g.energie_kcal}
                      onChange={(e) => setAliment({
                        ...aliment,
                        valeurs_nutritionnelles_100g: {
                          ...aliment.valeurs_nutritionnelles_100g,
                          energie_kcal: parseFloat(e.target.value) || 0
                        }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Protéines (g) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={aliment.valeurs_nutritionnelles_100g.proteines_g}
                      onChange={(e) => setAliment({
                        ...aliment,
                        valeurs_nutritionnelles_100g: {
                          ...aliment.valeurs_nutritionnelles_100g,
                          proteines_g: parseFloat(e.target.value) || 0
                        }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Glucides (g) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={aliment.valeurs_nutritionnelles_100g.glucides_g}
                      onChange={(e) => setAliment({
                        ...aliment,
                        valeurs_nutritionnelles_100g: {
                          ...aliment.valeurs_nutritionnelles_100g,
                          glucides_g: parseFloat(e.target.value) || 0
                        }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Lipides (g) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={aliment.valeurs_nutritionnelles_100g.lipides_g}
                      onChange={(e) => setAliment({
                        ...aliment,
                        valeurs_nutritionnelles_100g: {
                          ...aliment.valeurs_nutritionnelles_100g,
                          lipides_g: parseFloat(e.target.value) || 0
                        }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fibres (g) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={aliment.valeurs_nutritionnelles_100g.fibres_g}
                      onChange={(e) => setAliment({
                        ...aliment,
                        valeurs_nutritionnelles_100g: {
                          ...aliment.valeurs_nutritionnelles_100g,
                          fibres_g: parseFloat(e.target.value) || 0
                        }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Eau (g)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={aliment.valeurs_nutritionnelles_100g.eau_g || ""}
                      onChange={(e) => setAliment({
                        ...aliment,
                        valeurs_nutritionnelles_100g: {
                          ...aliment.valeurs_nutritionnelles_100g,
                          eau_g: e.target.value ? parseFloat(e.target.value) : undefined
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={aliment.notes || ""}
                  onChange={(e) => setAliment({ ...aliment, notes: e.target.value })}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/aliments/${aliment.id}`}>Annuler</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
