"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Aliment } from "@/types/aliment";
import { getById, deleteById } from "@/lib/db/queries";
import { getCompatibilityBadge, getCategorieIG, getCategorieLipides } from "@/lib/utils/aliment-helpers";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AlimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [aliment, setAliment] = useState<Aliment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDelete = async () => {
    if (!aliment) return;
    if (!confirm(`Supprimer "${aliment.nom}" ?`)) return;

    try {
      await deleteById("aliments", aliment.id);
      alert("Aliment supprimé");
      router.push("/aliments");
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Aliment">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </MainLayout>
    );
  }

  if (!aliment) {
    return (
      <MainLayout title="Aliment">
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

  const compatBadge = getCompatibilityBadge(aliment.compatible_chylomicronemie);
  const igInfo = getCategorieIG(aliment.index_glycemique);
  const lipInfo = getCategorieLipides(aliment.valeurs_nutritionnelles_100g.lipides_g);

  return (
    <MainLayout title={aliment.nom}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/aliments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/aliments/${aliment.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Éditer
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Carte principale */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{aliment.nom}</CardTitle>
                <CardDescription className="text-lg">{aliment.categorie}</CardDescription>
              </div>
              <div className="text-4xl">{compatBadge.emoji}</div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Badge className={cn("text-sm", compatBadge.bgClass, compatBadge.textClass)}>
                {compatBadge.icon} {compatBadge.label}
              </Badge>
              {Array.isArray(aliment.saison) ? (
                aliment.saison.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))
              ) : (
                <Badge variant="outline">{aliment.saison}</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Valeurs nutritionnelles */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Valeurs nutritionnelles (pour 100g)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded">
                  <p className="text-sm text-muted-foreground">Énergie</p>
                  <p className="text-2xl font-bold">{aliment.valeurs_nutritionnelles_100g.energie_kcal}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-sm text-muted-foreground">Protéines</p>
                  <p className="text-2xl font-bold">{aliment.valeurs_nutritionnelles_100g.proteines_g}</p>
                  <p className="text-xs text-muted-foreground">g</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-sm text-muted-foreground">Glucides</p>
                  <p className="text-2xl font-bold">{aliment.valeurs_nutritionnelles_100g.glucides_g}</p>
                  <p className="text-xs text-muted-foreground">g</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-sm text-muted-foreground">Lipides</p>
                  <p className={cn("text-2xl font-bold", lipInfo.color)}>
                    {aliment.valeurs_nutritionnelles_100g.lipides_g}
                  </p>
                  <p className="text-xs text-muted-foreground">g - {lipInfo.label}</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-sm text-muted-foreground">Fibres</p>
                  <p className="text-2xl font-bold">{aliment.valeurs_nutritionnelles_100g.fibres_g}</p>
                  <p className="text-xs text-muted-foreground">g</p>
                </div>
                {aliment.valeurs_nutritionnelles_100g.eau_g && (
                  <div className="p-3 border rounded">
                    <p className="text-sm text-muted-foreground">Eau</p>
                    <p className="text-2xl font-bold">{aliment.valeurs_nutritionnelles_100g.eau_g}</p>
                    <p className="text-xs text-muted-foreground">g</p>
                  </div>
                )}
              </div>
            </div>

            {/* Index Glycémique */}
            <div className="p-4 border rounded bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Index Glycémique</p>
                  <p className={cn("text-3xl font-bold", igInfo.color)}>
                    {aliment.index_glycemique}
                  </p>
                </div>
                <Badge variant="outline" className={cn("text-lg", igInfo.color)}>
                  {igInfo.label}
                </Badge>
              </div>
            </div>

            {/* Micronutriments */}
            {aliment.micronutriments && Object.keys(aliment.micronutriments).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Micronutriments</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {Object.entries(aliment.micronutriments).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 border rounded">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Utilisation */}
            {aliment.utilisation && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Utilisation</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aliment.utilisation}</p>
              </div>
            )}

            {/* Conservation */}
            {aliment.conservation && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Conservation</h3>
                <p className="text-sm text-muted-foreground">{aliment.conservation}</p>
              </div>
            )}

            {/* Notes */}
            {aliment.notes && (
              <div className="p-4 border-l-4 border-primary bg-muted/30">
                <h3 className="text-sm font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aliment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
