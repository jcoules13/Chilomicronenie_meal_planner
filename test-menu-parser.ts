/**
 * Test du parser menus v3.1 avec fichiers réels
 */

import { readFileSync, readdirSync } from "fs";
import { parseMenuV31Markdown } from "./lib/parsers/menu-parser-v31";
import { validerBudgetLipides } from "./types/menu";

const menuDir = "./menu";
const menuFiles = readdirSync(menuDir).filter(f => f.startsWith("Menu_") && f.endsWith(".md"));

console.log(`📄 Test du parser menus v3.1 sur ${menuFiles.length} fichiers...\n`);

let totalSuccess = 0;
let totalWarnings = 0;
let totalErrors = 0;

menuFiles.forEach(file => {
  console.log(`\n--- ${file} ---`);
  const content = readFileSync(`${menuDir}/${file}`, "utf-8");
  const result = parseMenuV31Markdown(content, file);

  console.log(`✅ Success: ${result.success}`);
  console.log(`⚠️  Warnings: ${result.warnings.length}`);
  console.log(`❌ Errors: ${result.errors.length}`);

  if (result.success) totalSuccess++;
  totalWarnings += result.warnings.length;
  totalErrors += result.errors.length;

  if (result.warnings.length > 0) {
    result.warnings.forEach(w => console.log(`  ${w}`));
  }

  if (result.errors.length > 0) {
    result.errors.forEach(e => console.log(`  ${e}`));
  }

  if (result.menu) {
    console.log(`\n  📊 Menu: ${result.menu.nom}`);
    console.log(`  🍗 Protéine: ${result.menu.type_proteine}`);
    console.log(`  📅 Fréquence: ${result.menu.frequence}`);
    console.log(`  🌍 Saisons: ${result.menu.saisons.join(", ")}`);
    console.log(`  🍽️  REPAS 1: ${result.menu.repas_1.composants.length} composants`);
    console.log(`  🥣 REPAS 2: ${result.menu.repas_2.composants.length} composants`);

    // Budget lipides journée
    const budget = result.menu.budget_lipides_journee;
    console.log(`\n  💧 Budget lipides journée:`);
    console.log(`    - Total: ${budget.total_g.toFixed(1)}g`);
    console.log(`    - MCT coco: ${budget.mct_coco_g.toFixed(1)}g (${budget.pct_mct}%)`);
    console.log(`    - Huile olive: ${budget.huile_olive_g.toFixed(1)}g`);
    console.log(`    - Formation chylomicrons: ${budget.pct_formation_chylomicrons}%`);

    // Validation
    const validation = validerBudgetLipides(budget, result.menu.lipides_cibles_g);
    if (validation.valide) {
      console.log(`    ✅ Budget lipides valide`);
    } else {
      console.log(`    ⚠️  Warnings validation:`);
      validation.warnings.forEach(w => console.log(`      ${w}`));
    }

    // Afficher détail REPAS 1 entrée (salade)
    const entreeR1 = result.menu.repas_1.composants.find(c => c.nom.includes("ENTRÉE"));
    if (entreeR1) {
      console.log(`\n  🥗 REPAS 1 - Entrée:`);
      console.log(`    - Description: ${entreeR1.description}`);
      console.log(`    - Ingrédients: ${entreeR1.ingredients.length}`);
      if (entreeR1.lipides && entreeR1.lipides.length > 0) {
        console.log(`    - Lipides:`);
        entreeR1.lipides.forEach(lip => {
          console.log(`      * ${lip.type}: ${lip.quantite_g}g`);
        });
      }
    }

    // Afficher détail REPAS 2 entrée (soupe)
    const entreeR2 = result.menu.repas_2.composants.find(c => c.nom.includes("ENTRÉE") || c.nom.includes("SOUPE"));
    if (entreeR2) {
      console.log(`\n  🍲 REPAS 2 - Entrée (Soupe):`);
      console.log(`    - Description: ${entreeR2.description}`);
      console.log(`    - Ingrédients: ${entreeR2.ingredients.length}`);
    }
  }
});

console.log(`\n\n📊 RÉSUMÉ GLOBAL:`);
console.log(`  - Fichiers testés: ${menuFiles.length}`);
console.log(`  - Succès: ${totalSuccess}/${menuFiles.length}`);
console.log(`  - Total warnings: ${totalWarnings}`);
console.log(`  - Total errors: ${totalErrors}`);
