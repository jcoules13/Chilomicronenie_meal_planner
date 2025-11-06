"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import {
  User,
  Activity,
  Heart,
  Utensils,
  Save,
  RotateCcw,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { CATEGORIES_IMC, PRESETS_REPARTITION, ZONES_TG } from "@/types/profile";
import type { Sexe, NiveauActivite, ObjectifSante, PresetRepartition } from "@/types/profile";

export default function ProfilPage() {
  const {
    profile,
    isLoading,
    updateProfile,
    updateNombreRepas,
    updatePresetRepartition,
    updateRepas,
    resetProfile,
  } = useProfile();

  if (isLoading || !profile) {
    return (
      <MainLayout title="Profil Utilisateur">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </MainLayout>
    );
  }

  const valeurs = profile.valeurs_calculees;
  const categorieIMC = valeurs
    ? CATEGORIES_IMC[valeurs.categorie_imc]
    : null;

  return (
    <MainLayout title="Profil Utilisateur">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Actions */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Dernière modification :{" "}
            {profile.date_modification.toLocaleDateString("fr-FR")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetProfile}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prénom
                </label>
                <Input
                  value={profile.prenom || ""}
                  onChange={(e) =>
                    updateProfile({ prenom: e.target.value })
                  }
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input
                  value={profile.nom || ""}
                  onChange={(e) => updateProfile({ nom: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date de naissance
                </label>
                <Input
                  type="date"
                  value={
                    profile.date_naissance
                      ? profile.date_naissance.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateProfile({
                      date_naissance: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sexe *
                </label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profile.sexe}
                  onChange={(e) =>
                    updateProfile({ sexe: e.target.value as Sexe })
                  }
                >
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Données physiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Données physiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Poids (kg) *
                </label>
                <Input
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={profile.poids_kg}
                  onChange={(e) =>
                    updateProfile({
                      poids_kg: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Taille (cm) *
                </label>
                <Input
                  type="number"
                  min="100"
                  max="250"
                  value={profile.taille_cm}
                  onChange={(e) =>
                    updateProfile({
                      taille_cm: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  IMC calculé
                </label>
                <div className="h-10 flex items-center">
                  {valeurs && categorieIMC && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {valeurs.imc}
                      </span>
                      <Badge
                        variant={
                          valeurs.categorie_imc === "NORMAL"
                            ? "success"
                            : valeurs.categorie_imc === "MAIGREUR"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {categorieIMC.label}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Niveau d'activité *
                </label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profile.niveau_activite}
                  onChange={(e) =>
                    updateProfile({
                      niveau_activite: e.target.value as NiveauActivite,
                    })
                  }
                >
                  <option value="SEDENTAIRE">
                    Sédentaire (peu ou pas d'exercice)
                  </option>
                  <option value="LEGER">
                    Léger (exercice 1-3 jours/semaine)
                  </option>
                  <option value="MODERE">
                    Modéré (exercice 3-5 jours/semaine)
                  </option>
                  <option value="ACTIF">
                    Actif (exercice intense 6-7 jours/semaine)
                  </option>
                  <option value="TRES_ACTIF">
                    Très actif (exercice très intense, travail physique)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Objectif *
                </label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profile.objectif}
                  onChange={(e) =>
                    updateProfile({
                      objectif: e.target.value as ObjectifSante,
                    })
                  }
                >
                  <option value="MAINTIEN">Maintien du poids</option>
                  <option value="PERTE_POIDS">Perte de poids</option>
                  <option value="PRISE_MASSE">Prise de masse</option>
                </select>
              </div>
            </div>

            {/* BMR Manuel (optionnel) */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  BMR mesuré (optionnel)
                </label>
                <Input
                  type="number"
                  min="800"
                  max="4000"
                  placeholder="Ex: 2000"
                  value={profile.bmr_manuel_kcal || ""}
                  onChange={(e) =>
                    updateProfile({
                      bmr_manuel_kcal: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-40"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Si votre montre/balance indique un BMR précis (ex: 2000 kcal), entrez-le ici. Sinon, laissez vide pour utiliser le calcul automatique (Mifflin-St Jeor).
                  {valeurs && valeurs.bmr_source === "CALCULE" && (
                    <span className="block mt-1 font-medium">
                      → BMR calculé actuellement : {valeurs.bmr_kcal} kcal
                    </span>
                  )}
                  {valeurs && valeurs.bmr_source === "MANUEL" && (
                    <span className="block mt-1 font-medium text-blue-600">
                      ✓ Utilisation de votre BMR mesuré : {valeurs.bmr_kcal} kcal
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contraintes santé */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Contraintes de santé
            </CardTitle>
            <CardDescription>
              Ces informations adaptent les recommandations nutritionnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={profile.contraintes_sante.chylomicronemie}
                  onChange={(e) =>
                    updateProfile({
                      contraintes_sante: {
                        ...profile.contraintes_sante,
                        chylomicronemie: e.target.checked,
                      },
                    })
                  }
                />
                <span className="font-medium">
                  Chylomicronémie (régime très faible en lipides)
                </span>
              </label>

              {profile.contraintes_sante.chylomicronemie && (
                <div className="ml-7 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ℹ️ La limite quotidienne de lipides est calculée automatiquement selon votre niveau de TG. Renseignez vos TG dans la section ci-dessous.
                  </p>
                </div>
              )}

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={profile.contraintes_sante.diabete}
                  onChange={(e) =>
                    updateProfile({
                      contraintes_sante: {
                        ...profile.contraintes_sante,
                        diabete: e.target.checked,
                      },
                    })
                  }
                />
                <span className="font-medium">Diabète</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={profile.contraintes_sante.hypertension}
                  onChange={(e) =>
                    updateProfile({
                      contraintes_sante: {
                        ...profile.contraintes_sante,
                        hypertension: e.target.checked,
                      },
                    })
                  }
                />
                <span className="font-medium">Hypertension</span>
              </label>

              {profile.contraintes_sante.hypertension && (
                <div className="ml-7">
                  <label className="block text-sm font-medium mb-2">
                    Limite quotidienne de sodium (mg/jour)
                  </label>
                  <Input
                    type="number"
                    min="1000"
                    max="3000"
                    step="100"
                    value={
                      profile.contraintes_sante.limite_sodium_mg_jour || 2000
                    }
                    onChange={(e) =>
                      updateProfile({
                        contraintes_sante: {
                          ...profile.contraintes_sante,
                          limite_sodium_mg_jour:
                            parseInt(e.target.value) || 2000,
                        },
                      })
                    }
                    className="w-32"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Autre pathologie
                </label>
                <Input
                  value={profile.contraintes_sante.autre_pathologie || ""}
                  onChange={(e) =>
                    updateProfile({
                      contraintes_sante: {
                        ...profile.contraintes_sante,
                        autre_pathologie: e.target.value,
                      },
                    })
                  }
                  placeholder="Précisez si nécessaire"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suivi des triglycérides (si chylomicronémie) */}
        {profile.contraintes_sante.chylomicronemie && (
          <Card className={valeurs?.zone_tg ? ZONES_TG[valeurs.zone_tg].border_color : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Suivi des triglycérides (TG)
              </CardTitle>
              <CardDescription>
                Le niveau de TG détermine automatiquement votre limite quotidienne de lipides
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Niveau actuel de TG (g/L) *
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={profile.niveau_tg_g_l || ""}
                    onChange={(e) =>
                      updateProfile({
                        niveau_tg_g_l: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="Ex: 14.0"
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    Valeur normale : &lt; 1.5 g/L
                  </span>
                </div>
              </div>

              {/* Affichage de la zone et alerte */}
              {valeurs?.zone_tg && (
                <div className={`p-4 rounded-lg border ${ZONES_TG[valeurs.zone_tg].bg_color} ${ZONES_TG[valeurs.zone_tg].border_color}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-semibold ${ZONES_TG[valeurs.zone_tg].color}`}>
                          {ZONES_TG[valeurs.zone_tg].label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {ZONES_TG[valeurs.zone_tg].description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-lg font-bold">
                        {profile.niveau_tg_g_l} g/L
                      </Badge>
                    </div>

                    <div className="p-3 bg-background/50 rounded border">
                      <p className={`text-sm font-medium ${ZONES_TG[valeurs.zone_tg].color}`}>
                        {ZONES_TG[valeurs.zone_tg].alerte}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        → Limite lipidique adaptée : <span className="font-bold text-foreground">{valeurs.limite_lipides_adaptative_g}g/jour</span>
                      </p>
                    </div>

                    {/* Objectif si en zone critique ou haute */}
                    {(valeurs.zone_tg === "CRITIQUE" || valeurs.zone_tg === "HAUTE") && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          🎯 Objectif : Descendre sous 5 g/L pour sortir de la zone de danger pancréatite
                        </p>
                        {profile.niveau_tg_g_l && profile.niveau_tg_g_l > 5 && (
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Encore {(profile.niveau_tg_g_l - 5).toFixed(1)} g/L à perdre
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Information MCT */}
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  💡 Huile MCT C8/C10 : Sûre pour chylomicronémie
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Les triglycérides à chaîne moyenne (MCT C8 et C10) ne forment pas de chylomicrons et peuvent être utilisés pour ajouter des calories sans augmenter les TG. Utiliser uniquement sous supervision médicale.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Valeurs calculées */}
        {valeurs && (
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Valeurs calculées automatiquement
              </CardTitle>
              <CardDescription>
                Ces valeurs sont recalculées en temps réel selon votre profil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Besoins énergétiques
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        BMR ({valeurs.bmr_source === "MANUEL" ? "mesuré" : "calculé"})
                      </span>
                      <span className={`font-medium ${valeurs.bmr_source === "MANUEL" ? "text-blue-600" : ""}`}>
                        {valeurs.bmr_kcal} kcal
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Besoins quotidiens
                      </span>
                      <span className="font-medium">
                        {valeurs.besoins_energetiques_kcal} kcal
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Macronutriments quotidiens
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protéines</span>
                      <span className="font-medium">
                        {valeurs.macros_quotidiens.proteines_g}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lipides</span>
                      <span className="font-medium text-red-600">
                        {valeurs.macros_quotidiens.lipides_g}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Glucides</span>
                      <span className="font-medium">
                        {valeurs.macros_quotidiens.glucides_g}g
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Zones cardiaques
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">FC Max</span>
                      <span className="font-medium">{valeurs.fc_max} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Zone 2 Brûle graisse (60-70%)
                      </span>
                      <span className="font-medium text-green-600">
                        {valeurs.zone_cardio_brule_graisse.min}-
                        {valeurs.zone_cardio_brule_graisse.max} bpm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Zone 3 Aérobie (70-80%)
                      </span>
                      <span className="font-medium text-blue-600">
                        {valeurs.zone_cardio_aerobie.min}-
                        {valeurs.zone_cardio_aerobie.max} bpm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Zone 4 Anaérobie (80-90%)
                      </span>
                      <span className="font-medium text-orange-600">
                        {valeurs.zone_cardio_anaerobie.min}-
                        {valeurs.zone_cardio_anaerobie.max} bpm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Zone 5 Maximum (90-100%)
                      </span>
                      <span className="font-medium text-red-600">
                        {valeurs.zone_cardio_maximum.min}-
                        {valeurs.zone_cardio_maximum.max} bpm
                      </span>
                    </div>
                  </div>
                </div>

                {profile.contraintes_sante.chylomicronemie && (
                  <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {valeurs.zone_tg ? (
                        <>
                          🔄 Régime chylomicronémie : Limite lipidique <strong>adaptative</strong> selon vos TG ({valeurs.zone_tg === "CRITIQUE" ? "zone critique" : valeurs.zone_tg === "HAUTE" ? "zone haute" : valeurs.zone_tg === "MODEREE" ? "zone modérée" : valeurs.zone_tg === "LIMITE" ? "limite" : "normale"}) = {valeurs.macros_quotidiens.lipides_g}g par jour
                        </>
                      ) : (
                        <>
                          ℹ️ Régime chylomicronémie activé : Renseignez votre niveau de TG pour obtenir une limite lipidique adaptée
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuration des repas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Configuration des repas
            </CardTitle>
            <CardDescription>
              Définissez le nombre de repas et la répartition calorique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de repas par jour *
                </label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profile.nombre_repas}
                  onChange={(e) =>
                    updateNombreRepas(parseInt(e.target.value))
                  }
                >
                  <option value="1">1 repas</option>
                  <option value="2">2 repas</option>
                  <option value="3">3 repas</option>
                  <option value="4">4 repas</option>
                  <option value="5">5 repas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Répartition calorique *
                </label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profile.preset_repartition}
                  onChange={(e) =>
                    updatePresetRepartition(
                      e.target.value as PresetRepartition
                    )
                  }
                >
                  {Object.entries(PRESETS_REPARTITION).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    PRESETS_REPARTITION[profile.preset_repartition]
                      .description
                  }
                </p>
              </div>
            </div>

            {/* Liste des repas */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Détail des repas</h3>
              {profile.repas.map((repas, idx) => (
                <div
                  key={repas.id}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <Input
                      value={repas.nom}
                      onChange={(e) =>
                        updateRepas(repas.id, { nom: e.target.value })
                      }
                      className="font-medium"
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="time"
                      value={repas.horaire}
                      onChange={(e) =>
                        updateRepas(repas.id, { horaire: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-24">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={repas.pourcentage_calories}
                        onChange={(e) =>
                          updateRepas(repas.id, {
                            pourcentage_calories:
                              parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={profile.preset_repartition !== "CUSTOM"}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  {valeurs && (
                    <div className="text-sm text-muted-foreground w-24 text-right">
                      {Math.round(
                        (valeurs.besoins_energetiques_kcal *
                          repas.pourcentage_calories) /
                          100
                      )}{" "}
                      kcal
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Avertissement si total != 100% */}
            {profile.repas.reduce(
              (sum, r) => sum + r.pourcentage_calories,
              0
            ) !== 100 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  ⚠️ La somme des pourcentages doit être égale à 100% (actuellement{" "}
                  {profile.repas.reduce(
                    (sum, r) => sum + r.pourcentage_calories,
                    0
                  )}
                  %)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Note informative */}
        <Card className="border-primary/50">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              💡 Toutes vos modifications sont automatiquement sauvegardées dans
              votre navigateur. Les valeurs nutritionnelles sont recalculées en
              temps réel selon votre profil et vos contraintes de santé.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
