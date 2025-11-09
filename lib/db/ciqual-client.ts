/**
 * Fonctions côté client pour gérer les ingrédients CIQUAL dans IndexedDB
 */

import { initDB } from "./indexedDB";
import type { IngredientCiqual } from "@/types/ciqual";
import { v4 as uuidv4 } from "uuid";

/**
 * Ajoute un ingrédient CIQUAL dans IndexedDB (côté client uniquement)
 */
export async function addIngredientToIndexedDB(
  ingredient: Omit<IngredientCiqual, "id" | "date_import">
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const db = await initDB();

    // Vérifier si l'aliment existe déjà (par code CIQUAL)
    const transaction = db.transaction("ingredients_ciqual", "readonly");
    const store = transaction.objectStore("ingredients_ciqual");
    const index = store.index("code_ciqual");

    const existingRequest = index.get(ingredient.code_ciqual);

    const existing = await new Promise<IngredientCiqual | undefined>((resolve) => {
      existingRequest.onsuccess = () => resolve(existingRequest.result);
      existingRequest.onerror = () => resolve(undefined);
    });

    if (existing) {
      return { success: false, error: "Cet aliment existe déjà dans votre base" };
    }

    // Ajouter l'aliment
    const newIngredient: IngredientCiqual = {
      ...ingredient,
      id: uuidv4(),
      date_import: new Date().toISOString(),
    };

    const writeTransaction = db.transaction("ingredients_ciqual", "readwrite");
    const writeStore = writeTransaction.objectStore("ingredients_ciqual");

    await new Promise<void>((resolve, reject) => {
      const request = writeStore.add(newIngredient);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur ajout ingrédient:", error);
    return { success: false, error: String(error) };
  }
}
