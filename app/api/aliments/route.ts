import { NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parseAlimentMarkdown } from "@/lib/parsers/markdown-parser";

/**
 * API route pour charger et parser les aliments depuis le dossier fiche_menu/
 * GET /api/aliments - Retourne tous les aliments parsés
 */
export async function GET() {
  try {
    const alimentDir = join(process.cwd(), "fiche_menu");

    // Lire tous les fichiers .md (sauf README)
    const files = readdirSync(alimentDir).filter(
      (f) => f.endsWith(".md") && !f.toLowerCase().includes("readme")
    );

    const aliments = [];
    const errors = [];

    for (const file of files) {
      try {
        const content = readFileSync(join(alimentDir, file), "utf-8");
        const result = parseAlimentMarkdown(content, file);

        if (result.success && result.aliment) {
          aliments.push(result.aliment);
        } else {
          errors.push({
            file,
            errors: result.errors,
            warnings: result.warnings,
          });
        }
      } catch (error) {
        errors.push({
          file,
          errors: [`Erreur lecture fichier: ${error instanceof Error ? error.message : String(error)}`],
          warnings: [],
        });
      }
    }

    return NextResponse.json({
      success: true,
      aliments,
      count: aliments.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Erreur API /api/aliments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
