import { NextRequest, NextResponse } from "next/server";
import { addSingleCiqualIngredient } from "@/lib/db/ciqual-search";
import type { IngredientCiqual } from "@/types/ciqual";

export async function POST(request: NextRequest) {
  try {
    const ingredient: Omit<IngredientCiqual, "id" | "date_import"> = await request.json();

    if (!ingredient || !ingredient.code_ciqual || !ingredient.nom_fr) {
      return NextResponse.json(
        { success: false, error: "Données d'ingrédient invalides" },
        { status: 400 }
      );
    }

    const result = await addSingleCiqualIngredient(ingredient);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur API add:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
