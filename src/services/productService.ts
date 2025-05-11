
// Ce fichier sert de point d'entrée pour les différents services liés aux produits
// Il re-exporte toutes les fonctions des services spécifiques pour maintenir
// la compatibilité avec le code existant

export { 
  findProductByBarcode,
  findLatestProductByBarcodeOrSfc,
  getRecentProducts
} from './productSearch';

export {
  getProductPassageCount
} from './productCount';

export {
  clearAllLogs
} from './productAdmin';

export {
  exportProductsToCSV
} from './productExport';
