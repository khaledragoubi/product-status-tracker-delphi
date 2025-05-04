
export type TestStation = 
  | 'BLT' 
  | 'RF' 
  | 'VISION_1' 
  | 'VISION_2' 
  | 'VISION_3' 
  | 'UFT' 
  | 'BUTTON' 
  | 'LASER';

export type ProductStatus = 'PASS' | 'FAIL' | 'IN_PROGRESS';

export interface ProductTest {
  station: TestStation;
  status: ProductStatus;
  timestamp: string;
  details?: string;
}

export interface Product {
  id: string;
  barcode: string;
  serialNumber: string;
  model: string;
  tests: ProductTest[];
  currentStatus: ProductStatus;
  failedStation?: TestStation;
  failureDate?: string;
}
