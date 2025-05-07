
export type TestStation = 
  | 'BLT' 
  | 'RF' 
  | 'VISION' 
  | 'UFT' 
  | 'RF_SLIDER';

export type ProductStatus = 'PASS' | 'FAIL' | 'IN_PROGRESS';

// Mapping numeric status to our application status
export const mapDbStatusToAppStatus = (status: number): ProductStatus => {
  // Assuming 0 is FAIL, 1 is PASS, other values are IN_PROGRESS
  switch(status) {
    case 1: return 'PASS';
    case 0: return 'FAIL';
    default: return 'IN_PROGRESS';
  }
};

export interface ProductTest {
  station: TestStation;
  status: ProductStatus;
  timestamp: string;
  details?: string;
}

// Structure de la table trace_view
export interface DbProduct {
  id: string;
  num: number;
  sfc: string;
  product_key?: string;
  adress_io?: string;
  code_2d?: string;
  num_poste_blt?: number;
  status_blt_sfc?: number;
  blt_date_heure?: string;
  nc_log_bl?: string;
  num_poste_rf?: number;
  status_rf_sfc?: number;
  rf_date_heure?: string;
  nc_log_rf?: string;
  status_vision_sfc?: number;
  vision_date_heure?: string;
  nc_log_vision?: string;
  num_poste_uft?: number;
  status_uft_sfc?: number;
  uft_date_heure?: string;
  nc_log_uft?: string;
  num_poste_rf_slider?: number;
  status_rf_slider_sfc?: number;
  rf_slider_date_heure?: string;
  nc_log_rf_slide?: string;
  status: number;
  position: number;
  num_porte_outil?: number;
  config_ligne?: string;
  ref_pcba_actia?: string;
  ref_pcba_somfy?: string;
  sw_produit?: string;
  hw_version?: string;
  calibration_data?: string;
  param_test?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  barcode: string;          // maps to code_2d
  serialNumber: string;     // maps to sfc
  model: string;           // maps to ref_pcba_somfy
  tests: ProductTest[];
  currentStatus: ProductStatus;
  failedStation?: TestStation;
  failureDate?: string;
}

// Fonction pour transformer les données de trace_view en notre modèle d'application
export const mapDbProductToAppProduct = (dbProduct: DbProduct): Product => {
  const tests: ProductTest[] = [];
  let failedStation: TestStation | undefined;
  let failureDate: string | undefined;
  
  // Process BLT test
  if (dbProduct.status_blt_sfc !== undefined && dbProduct.blt_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_blt_sfc);
    tests.push({
      station: 'BLT',
      status,
      timestamp: dbProduct.blt_date_heure,
      details: dbProduct.nc_log_bl
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'BLT';
      failureDate = dbProduct.blt_date_heure;
    }
  }
  
  // Process RF test
  if (dbProduct.status_rf_sfc !== undefined && dbProduct.rf_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_rf_sfc);
    tests.push({
      station: 'RF',
      status,
      timestamp: dbProduct.rf_date_heure,
      details: dbProduct.nc_log_rf
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'RF';
      failureDate = dbProduct.rf_date_heure;
    }
  }
  
  // Process VISION test
  if (dbProduct.status_vision_sfc !== undefined && dbProduct.vision_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_vision_sfc);
    tests.push({
      station: 'VISION',
      status,
      timestamp: dbProduct.vision_date_heure,
      details: dbProduct.nc_log_vision
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'VISION';
      failureDate = dbProduct.vision_date_heure;
    }
  }
  
  // Process UFT test
  if (dbProduct.status_uft_sfc !== undefined && dbProduct.uft_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_uft_sfc);
    tests.push({
      station: 'UFT',
      status,
      timestamp: dbProduct.uft_date_heure,
      details: dbProduct.nc_log_uft
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'UFT';
      failureDate = dbProduct.uft_date_heure;
    }
  }
  
  // Process RF SLIDER test
  if (dbProduct.status_rf_slider_sfc !== undefined && dbProduct.rf_slider_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_rf_slider_sfc);
    tests.push({
      station: 'RF_SLIDER',
      status,
      timestamp: dbProduct.rf_slider_date_heure,
      details: dbProduct.nc_log_rf_slide
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'RF_SLIDER';
      failureDate = dbProduct.rf_slider_date_heure;
    }
  }
  
  // Sort tests by timestamp (newer first)
  tests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Determine current status based on overall status or latest test
  let currentStatus = mapDbStatusToAppStatus(dbProduct.status);
  
  return {
    id: dbProduct.id || dbProduct.num?.toString() || '',
    barcode: dbProduct.code_2d || '',
    serialNumber: dbProduct.sfc || '',
    model: dbProduct.ref_pcba_somfy || dbProduct.ref_pcba_actia || '',
    tests,
    currentStatus,
    failedStation,
    failureDate
  };
};
