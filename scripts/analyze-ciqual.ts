/**
 * Script d'analyse de la structure du fichier CIQUAL Excel
 *
 * Objectif : Comprendre la structure du fichier pour créer le parser
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const CIQUAL_FILE_PATH = path.join(process.cwd(), 'table_ciqual', 'Table_Ciqual_2020.xls');

async function analyzeCiqualFile() {
  console.log('📊 Analyse du fichier CIQUAL...\n');

  // Vérifier que le fichier existe
  if (!fs.existsSync(CIQUAL_FILE_PATH)) {
    console.error('❌ Fichier introuvable:', CIQUAL_FILE_PATH);
    process.exit(1);
  }

  console.log('✅ Fichier trouvé:', CIQUAL_FILE_PATH);
  const stats = fs.statSync(CIQUAL_FILE_PATH);
  console.log('📦 Taille:', (stats.size / 1024 / 1024).toFixed(2), 'Mo\n');

  // Lire le fichier Excel
  const workbook = XLSX.readFile(CIQUAL_FILE_PATH);

  console.log('📑 Feuilles disponibles:', workbook.SheetNames.join(', '), '\n');

  // Analyser chaque feuille
  for (const sheetName of workbook.SheetNames) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📄 Feuille: ${sheetName}`);
    console.log('='.repeat(80));

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      console.log('⚠️  Feuille vide');
      continue;
    }

    // Afficher les en-têtes (première ligne)
    const headers = jsonData[0] as string[];
    console.log(`\n📋 En-têtes (${headers.length} colonnes):`);
    headers.forEach((header, index) => {
      console.log(`  ${index + 1}. ${header}`);
    });

    // Afficher quelques statistiques
    console.log(`\n📊 Statistiques:`);
    console.log(`  - Nombre de lignes: ${jsonData.length}`);
    console.log(`  - Nombre d'entrées (hors en-tête): ${jsonData.length - 1}`);

    // Afficher les 3 premières lignes de données
    console.log(`\n🔍 Aperçu des 3 premières lignes de données:`);
    for (let i = 1; i <= Math.min(3, jsonData.length - 1); i++) {
      const row = jsonData[i] as any[];
      console.log(`\n  Ligne ${i}:`);
      headers.forEach((header, colIndex) => {
        const value = row[colIndex];
        if (value !== undefined && value !== null && value !== '') {
          console.log(`    ${header}: ${value}`);
        }
      });
    }
  }

  console.log('\n\n✅ Analyse terminée\n');
}

analyzeCiqualFile().catch(console.error);
