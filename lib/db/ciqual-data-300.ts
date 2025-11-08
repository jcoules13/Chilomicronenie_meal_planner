/**
 * Base CIQUAL - 300 aliments sélectionnés
 *
 * Source: ANSES CIQUAL 2020
 * Génération: Script scripts/parse-ciqual.ts
 *
 * Répartition:
 * - Légumes: 50
 * - Fruits: 50
 * - Viandes: 40
 * - Poissons: 40
 * - Féculents: 30
 * - Légumineuses: 20
 * - Produits laitiers: 20
 * - Aromates: 20
 * - Noix et graines: 15
 * - Huiles et matières grasses: 10
 * - Œufs: 5
 *
 * Compatibilité chylomicronémie: 243/300 (81%)
 */

import type { IngredientCiqual } from "@/types/ciqual";
import ciqualDataJson from "./ciqual-data-300.json";

export const CIQUAL_DATA_300: Omit<IngredientCiqual, "id" | "date_import">[] = ciqualDataJson as any;
