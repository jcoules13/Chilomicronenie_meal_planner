import { NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parseMenuV31Markdown } from "@/lib/parsers/menu-parser-v31";

/**
 * API route pour charger et parser les menus depuis le dossier menu/
 * GET /api/menus - Retourne tous les menus parsés
 */
export async function GET() {
  try {
    const menuDir = join(process.cwd(), "menu");

    // Lire tous les fichiers Menu_*.md
    const files = readdirSync(menuDir).filter(
      (f) => f.startsWith("Menu_") && f.endsWith(".md")
    );

    const menus = [];
    const errors = [];

    for (const file of files) {
      try {
        const content = readFileSync(join(menuDir, file), "utf-8");
        const result = parseMenuV31Markdown(content, file);

        if (result.success && result.menu) {
          menus.push(result.menu);
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
      menus,
      count: menus.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Erreur API /api/menus:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
