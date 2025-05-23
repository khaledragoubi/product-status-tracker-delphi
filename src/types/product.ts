export type TestStation = 
  | 'BLT' 
  | 'RF' 
  | 'VISION' 
  | 'UFT' 
  | 'RF_SLIDER';

export type ProductStatus = 'PASS' | 'FAIL' | 'IN_PROGRESS';

// Mapping numeric status to our application status
export const mapDbStatusToAppStatus = (status: number | null): ProductStatus => {
  // Assuming 0 is FAIL, 1 is PASS, other values are IN_PROGRESS
  switch(status) {
    case 1: return 'PASS';
    case 0: return 'FAIL';
    default: return 'IN_PROGRESS';
  }
};

// Définition de l'ordre de priorité des stations de test pour le tri
export const TEST_STATION_PRIORITY: Record<TestStation, number> = {
  'BLT': 1,
  'RF': 2,
  'VISION': 3,
  'UFT': 4,
  'RF_SLIDER': 5
};

export interface ProductTest {
  station: TestStation;
  status: ProductStatus;
  timestamp: string;
  details?: string;
}

// Structure de la table trace_view comme définie par l'utilisateur
export interface DbProduct {
  num: number | null;
  sfc: string | null;
  product_key: string | null;
  adress_io: string | null;
  code_2d: string | null;
  num_poste_blt: number | null;
  status_blt_sfc: number | null;
  blt_date_heure: string | null;
  nc_log_bl: string | null;
  num_poste_rf: number | null;
  status_rf_sfc: number | null;
  rf_date_heure: string | null;
  nc_log_rf: string | null;
  status_vision_sfc: number | null;
  vision_date_heure: string | null;
  nc_log_vision: string | null;
  num_poste_uft: number | null;
  status_uft_sfc: number | null;
  uft_date_heure: string | null;
  nc_log_uft: string | null;
  num_poste_rf_slider: number | null;
  status_rf_slider_sfc: number | null;
  rf_slider_date_heure: string | null;
  nc_log_rf_slide: string | null;
  status: number | null;
  position: number | null;
  num_porte_outil: number | null;
  config_ligne: string | null;
  ref_pcba_actia: string | null;
  ref_pcba_somfy: string | null;
  sw_produit: string | null;
  hw_version: string | null;
  calibration_data: string | null;
  param_test: string | null;
}

export interface Product {
  id: string;
  barcode: string;          // maps to code_2d
  serialNumber: string;     // maps to sfc
  model: string;            // maps to ref_pcba_somfy
  tests: ProductTest[];
  currentStatus: ProductStatus;
  failedStation?: TestStation;
  failureDate?: string;
  // Added fields based on new mapping
  configLine?: string;      // maps to config_ligne
  portOutil?: number;       // maps to num_porte_outil
  position?: number;        // maps to position
  addressIo?: string;       // maps to adress_io
  passageCount: number;     // Number of entries for this product
  hwVersion?: string;       // maps to hw_version - added field
  swProduct?: string;       // maps to sw_produit - added field
}

// Fonction pour transformer les données de trace_view en notre modèle d'application
export const mapDbProductToAppProduct = (dbProduct: DbProduct, passageCount = 0): Product => {
  const tests: ProductTest[] = [];
  let failedStation: TestStation | undefined;
  let failureDate: string | undefined;
  
  // Process BLT test
  if (dbProduct.status_blt_sfc !== null && dbProduct.blt_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_blt_sfc);
    tests.push({
      station: 'BLT',
      status,
      timestamp: dbProduct.blt_date_heure,
      details: dbProduct.nc_log_bl || undefined
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'BLT';
      failureDate = dbProduct.blt_date_heure;
    }
  }
  
  // Process RF test
  if (dbProduct.status_rf_sfc !== null && dbProduct.rf_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_rf_sfc);
    tests.push({
      station: 'RF',
      status,
      timestamp: dbProduct.rf_date_heure,
      details: dbProduct.nc_log_rf || undefined
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'RF';
      failureDate = dbProduct.rf_date_heure;
    }
  }
  
  // Process VISION test
  if (dbProduct.status_vision_sfc !== null && dbProduct.vision_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_vision_sfc);
    tests.push({
      station: 'VISION',
      status,
      timestamp: dbProduct.vision_date_heure,
      details: dbProduct.nc_log_vision || undefined
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'VISION';
      failureDate = dbProduct.vision_date_heure;
    }
  }
  
  // Process UFT test
  if (dbProduct.status_uft_sfc !== null && dbProduct.uft_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_uft_sfc);
    tests.push({
      station: 'UFT',
      status,
      timestamp: dbProduct.uft_date_heure,
      details: dbProduct.nc_log_uft || undefined
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'UFT';
      failureDate = dbProduct.uft_date_heure;
    }
  }
  
  // Process RF SLIDER test
  if (dbProduct.status_rf_slider_sfc !== null && dbProduct.rf_slider_date_heure) {
    const status = mapDbStatusToAppStatus(dbProduct.status_rf_slider_sfc);
    tests.push({
      station: 'RF_SLIDER',
      status,
      timestamp: dbProduct.rf_slider_date_heure,
      details: dbProduct.nc_log_rf_slide || undefined
    });
    
    if (status === 'FAIL' && !failedStation) {
      failedStation = 'RF_SLIDER';
      failureDate = dbProduct.rf_slider_date_heure;
    }
  }
  
  // Détermination du statut global du produit
  const currentStatus = mapDbStatusToAppStatus(dbProduct.status);
  
  // Trier les tests selon la priorité si le produit est en échec,
  // sinon trier par date (du plus récent au plus ancien)
  if (currentStatus === 'FAIL') {
    tests.sort((a, b) => TEST_STATION_PRIORITY[a.station] - TEST_STATION_PRIORITY[b.station]);
  } else {
    tests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Generate a unique ID using num, position or a random string as fallback
  const id = dbProduct.num?.toString() || dbProduct.position?.toString() || Math.random().toString(36).substring(7);
  
  return {
    id,
    barcode: dbProduct.code_2d || '',
    serialNumber: dbProduct.sfc || '',
    model: dbProduct.ref_pcba_actia || '',
    configLine: dbProduct.config_ligne || '',
    portOutil: dbProduct.num_porte_outil || undefined,
    position: dbProduct.position || undefined,
    addressIo: dbProduct.adress_io || '',
    hwVersion: dbProduct.hw_version || '',      // Added hw_version field
    swProduct: dbProduct.sw_produit || '',      // Added sw_produit field
    tests,
    currentStatus,
    failedStation,
    failureDate,
    passageCount: passageCount || tests.length || 0 // Use provided count or fall back to tests length
  };
};
