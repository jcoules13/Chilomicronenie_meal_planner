import { NextRequest, NextResponse } from "next/server";

// Cette route retourne juste les données validées
// L'ajout dans IndexedDB se fait côté client
export async function POST(request: NextRequest) {
  try {
    const ingredient = await request.json();

    if (!ingredient || !ingredient.code_ciqual || !ingredient.nom_fr) {
      return NextResponse.json(
        { success: false, error: "Données d'ingrédient invalides" },
        { status: 400 }
      );
    }

    // Retourner les données validées pour ajout côté client
    return NextResponse.json({
      success: true,
      ingredient
    });
  } catch (error) {
    console.error("Erreur API add:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
