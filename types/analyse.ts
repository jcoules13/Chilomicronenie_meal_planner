export interface Biomarqueurs {
  // Lipides
  triglycerides_mmol?: number;
  triglycerides_mg_dl?: number;
  hdl_g_l?: number;
  cholesterol_total_g_l?: number;

  // Diabète
  hba1c_pourcentage?: number;
  glycemie_jeun_g_l?: number;

  // Résistance insulinique
  homa?: number;
  insuline_mui_l?: number;
  peptide_c_ng_ml?: number;

  // Foie
  alat_ui_l?: number;
  asat_ui_l?: number;
  ggt_ui_l?: number;

  // Pancréas
  lipase_u_l?: number;

  // Rein
  clairance_ml_min?: number;

  // Autres
  psa_ng_ml?: number;
  vitamine_b12_pg_ml?: number;
}

export interface AnalyseSanguine {
  id: string;
  date: Date;
  biomarqueurs: Biomarqueurs;
  notes?: string;
}
