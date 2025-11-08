import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('table_ciqual/Table_Ciqual_2020.xls');
const worksheet = workbook.Sheets['compo'];
const data = XLSX.utils.sheet_to_json(worksheet);

// Sous-groupes uniques
const sousGroupes = new Set<string>();
data.forEach((row: any) => {
  if (row.alim_ssgrp_nom_fr && row.alim_ssgrp_nom_fr !== '-') {
    sousGroupes.add(row.alim_ssgrp_nom_fr);
  }
});

console.log(`Sous-groupes CIQUAL (${sousGroupes.size}):\n`);
Array.from(sousGroupes).sort().forEach(g => console.log(`  - ${g}`));
