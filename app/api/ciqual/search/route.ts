import { NextRequest, NextResponse } from "next/server";
import { searchCiqualByName } from "@/lib/db/ciqual-search";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await searchCiqualByName(query, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur API search:", error);
    return NextResponse.json(
      { success: false, results: [], error: String(error) },
      { status: 500 }
    );
  }
}
