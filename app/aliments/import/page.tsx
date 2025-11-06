"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseMultipleAliments } from "@/lib/parsers/markdown-parser";
import { create, findByName, upsert } from "@/lib/db/queries";
import { Aliment } from "@/types/aliment";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Download, RefreshCw, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImportResult {
  success: Aliment[];
  failed: Array<{ filename: string; errors: string[] }>;
  warnings: Array<{ filename: string; warnings: string[] }>;
}

type DuplicateAction = "replace" | "ignore" | "duplicate";

interface ProcessedAliment {
  aliment: Aliment;
  isNew: boolean;
  existingId?: string;
  action: DuplicateAction;
}

export default function ImportPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [processedAliments, setProcessedAliments] = useState<ProcessedAliment[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.endsWith(".md")
    );

    if (files.length === 0) {
      alert("Aucun fichier .md détecté");
      return;
    }

    await processFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const mdFiles = Array.from(files).filter((f) => f.name.endsWith(".md"));
    if (mdFiles.length === 0) {
      alert("Aucun fichier .md sélectionné");
      return;
    }

    await processFiles(mdFiles);
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setImportResult(null);
    setProcessedAliments([]);

    try {
      const result = await parseMultipleAliments(files);
      setImportResult(result);

      // Détection des doublons pour les aliments parsés avec succès
      const processed: ProcessedAliment[] = [];
      for (const aliment of result.success) {
        const existing = await findByName<Aliment>("aliments", aliment.nom);
        processed.push({
          aliment,
          isNew: !existing,
          existingId: existing?.id,
          action: existing ? "replace" : "duplicate", // Par défaut : remplacer si doublon
        });
      }
      setProcessedAliments(processed);
    } catch (error) {
      console.error("Erreur lors du parsing :", error);
      alert("Erreur lors du traitement des fichiers");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (processedAliments.length === 0) return;

    setIsImporting(true);

    try {
      let imported = 0;
      let replaced = 0;
      let ignored = 0;

      // Traiter chaque aliment selon l'action choisie
      for (const processed of processedAliments) {
        if (processed.action === "ignore") {
          ignored++;
          continue;
        }

        if (processed.action === "replace" && processed.existingId) {
          // Remplacer : on utilise upsert qui va mettre à jour
          await upsert<Aliment>("aliments", processed.aliment);
          replaced++;
        } else if (processed.action === "duplicate" || processed.isNew) {
          // Dupliquer ou nouveau : on crée un nouvel enregistrement
          await create<Aliment>("aliments", processed.aliment);
          imported++;
        }
      }

      // Message de résumé
      const messages: string[] = [];
      if (imported > 0) messages.push(`${imported} nouveau(x)`);
      if (replaced > 0) messages.push(`${replaced} remplacé(s)`);
      if (ignored > 0) messages.push(`${ignored} ignoré(s)`);

      alert(`✅ Import terminé : ${messages.join(", ")}`);

      // Rediriger vers la liste des aliments
      router.push("/aliments");
    } catch (error) {
      console.error("Erreur lors de l'import :", error);
      alert("Erreur lors de la sauvegarde dans la base de données");
    } finally {
      setIsImporting(false);
    }
  };

  // Fonction pour changer l'action d'un aliment
  const updateAction = (index: number, action: DuplicateAction) => {
    const updated = [...processedAliments];
    updated[index].action = action;
    setProcessedAliments(updated);
  };

  // Fonction pour appliquer une action à tous les doublons
  const applyActionToAllDuplicates = (action: DuplicateAction) => {
    const updated = processedAliments.map((p) => ({
      ...p,
      action: p.isNew ? p.action : action, // Modifie seulement les doublons
    }));
    setProcessedAliments(updated);
  };

  return (
    <MainLayout title="Import Aliments">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importer des fiches aliments
            </CardTitle>
            <CardDescription>
              Importez vos fiches aliments au format Markdown (.md)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                📁 <strong>Format accepté :</strong> Fichiers Markdown (.md) avec frontmatter YAML
              </p>
              <p>
                📝 <strong>Templates disponibles :</strong>
              </p>
              <div className="flex gap-2 ml-4">
                <Button asChild variant="outline" size="sm">
                  <a
                    href="/TEMPLATE_ALIMENT_COMPLET.md"
                    download
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Template COMPLET
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href="/TEMPLATE_ALIMENT_MINIMAL.md"
                    download
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Template MINIMAL
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Le parser est <strong>flexible</strong> et accepte les anciens formats incomplets. Les champs manquants seront remplis avec des valeurs par défaut.
              </p>
            </div>

            {/* Zone Drag & Drop */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Glissez-déposez vos fichiers .md ici
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                multiple
                accept=".md"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <Button asChild>
                <label htmlFor="file-input" className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Sélectionner des fichiers
                </label>
              </Button>
            </div>

            {isProcessing && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Traitement en cours...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats */}
        {importResult && !isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats du parsing</CardTitle>
              <CardDescription>
                {processedAliments.filter((p) => p.isNew).length} nouveau(x),{" "}
                {processedAliments.filter((p) => !p.isNew).length} doublon(s) détecté(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nouveaux aliments */}
              {processedAliments.filter((p) => p.isNew).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-600">
                      {processedAliments.filter((p) => p.isNew).length} nouvel(le)(s) aliment(s)
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {processedAliments
                      .filter((p) => p.isNew)
                      .map((processed, idx) => (
                        <div
                          key={idx}
                          className="p-2 border rounded text-sm bg-green-50 dark:bg-green-950/20"
                        >
                          <p className="font-medium">{processed.aliment.nom}</p>
                          <p className="text-xs text-muted-foreground">
                            {processed.aliment.categorie}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Doublons détectés */}
              {processedAliments.filter((p) => !p.isNew).length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-600">
                        {processedAliments.filter((p) => !p.isNew).length} doublon(s) détecté(s)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Action pour tous les doublons :
                      </span>
                      <Select
                        onValueChange={(value) =>
                          applyActionToAllDuplicates(value as DuplicateAction)
                        }
                      >
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="replace">Remplacer</SelectItem>
                          <SelectItem value="ignore">Ignorer</SelectItem>
                          <SelectItem value="duplicate">Dupliquer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {processedAliments
                      .map((p, idx) => ({ ...p, originalIndex: idx }))
                      .filter((p) => !p.isNew)
                      .map((processed) => (
                        <div
                          key={processed.originalIndex}
                          className="p-3 border border-orange-300 dark:border-orange-700 rounded bg-orange-50 dark:bg-orange-950/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {processed.aliment.nom}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {processed.aliment.categorie} • Déjà existant dans la base
                              </p>
                            </div>
                            <Select
                              value={processed.action}
                              onValueChange={(value) =>
                                updateAction(processed.originalIndex, value as DuplicateAction)
                              }
                            >
                              <SelectTrigger className="w-36 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="replace">
                                  <div className="flex items-center gap-2">
                                    <RefreshCw className="h-3 w-3" />
                                    <span>Remplacer</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="ignore">
                                  <div className="flex items-center gap-2">
                                    <XCircle className="h-3 w-3" />
                                    <span>Ignorer</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="duplicate">
                                  <div className="flex items-center gap-2">
                                    <Copy className="h-3 w-3" />
                                    <span>Dupliquer</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {importResult.warnings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-600">
                      {importResult.warnings.length} avertissement(s)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {importResult.warnings.map((warn, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-yellow-300 dark:border-yellow-700 rounded bg-yellow-50 dark:bg-yellow-950/20"
                      >
                        <p className="font-medium text-sm mb-1">
                          {warn.filename}
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                          {warn.warnings.map((w, i) => (
                            <li key={i}>• {w}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Échecs */}
              {importResult.failed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-600">
                      {importResult.failed.length} fichier(s) en erreur
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {importResult.failed.map((fail, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-red-300 dark:border-red-700 rounded bg-red-50 dark:bg-red-950/20"
                      >
                        <p className="font-medium text-sm mb-1">
                          {fail.filename}
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                          {fail.errors.map((e, i) => (
                            <li key={i}>• {e}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton import */}
              {processedAliments.length > 0 && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleImport}
                    disabled={isImporting}
                    className="flex-1"
                  >
                    {isImporting ? (
                      "Import en cours..."
                    ) : (
                      <>
                        Importer {processedAliments.filter((p) => p.action !== "ignore").length}{" "}
                        aliment(s)
                        {processedAliments.filter((p) => p.action === "ignore").length > 0 &&
                          ` (${processedAliments.filter((p) => p.action === "ignore").length} ignoré(s))`}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportResult(null);
                      setProcessedAliments([]);
                    }}
                    disabled={isImporting}
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
