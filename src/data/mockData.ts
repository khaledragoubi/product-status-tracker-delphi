
import { Product, TestStation, ProductStatus } from '../types/product';

// Helper function to create dates in the past few hours
const getRecentDate = (hoursAgo: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

export const mockProducts: Product[] = [
  {
    id: '1',
    barcode: 'PDT001',
    serialNumber: 'SN00123456',
    model: 'XC-200',
    currentStatus: 'PASS',
    tests: [
      { station: 'BLT', status: 'PASS', timestamp: getRecentDate(5) },
      { station: 'RF', status: 'PASS', timestamp: getRecentDate(4.5) },
      { station: 'VISION_1', status: 'PASS', timestamp: getRecentDate(4) },
      { station: 'VISION_2', status: 'PASS', timestamp: getRecentDate(3.5) },
      { station: 'VISION_3', status: 'PASS', timestamp: getRecentDate(3) },
      { station: 'UFT', status: 'PASS', timestamp: getRecentDate(2.5) },
      { station: 'BUTTON', status: 'PASS', timestamp: getRecentDate(2) },
      { station: 'LASER', status: 'PASS', timestamp: getRecentDate(1.5) },
    ]
  },
  {
    id: '2',
    barcode: 'PDT002',
    serialNumber: 'SN00123457',
    model: 'XC-200',
    currentStatus: 'FAIL',
    failedStation: 'RF',
    failureDate: getRecentDate(3),
    tests: [
      { station: 'BLT', status: 'PASS', timestamp: getRecentDate(4) },
      { station: 'RF', status: 'FAIL', timestamp: getRecentDate(3), details: 'Signal strength below threshold' },
    ]
  },
  {
    id: '3',
    barcode: 'PDT003',
    serialNumber: 'SN00123458',
    model: 'XC-300',
    currentStatus: 'FAIL',
    failedStation: 'VISION_2',
    failureDate: getRecentDate(2),
    tests: [
      { station: 'BLT', status: 'PASS', timestamp: getRecentDate(5) },
      { station: 'RF', status: 'PASS', timestamp: getRecentDate(4.5) },
      { station: 'VISION_1', status: 'PASS', timestamp: getRecentDate(4) },
      { station: 'VISION_2', status: 'FAIL', timestamp: getRecentDate(2), details: 'Component misalignment detected' },
    ]
  },
  {
    id: '4',
    barcode: 'PDT004',
    serialNumber: 'SN00123459',
    model: 'XC-300',
    currentStatus: 'PASS',
    tests: [
      { station: 'BLT', status: 'PASS', timestamp: getRecentDate(6) },
      { station: 'RF', status: 'PASS', timestamp: getRecentDate(5.5) },
      { station: 'VISION_1', status: 'PASS', timestamp: getRecentDate(5) },
      { station: 'VISION_2', status: 'PASS', timestamp: getRecentDate(4.5) },
      { station: 'VISION_3', status: 'PASS', timestamp: getRecentDate(4) },
      { station: 'UFT', status: 'PASS', timestamp: getRecentDate(3.5) },
      { station: 'BUTTON', status: 'PASS', timestamp: getRecentDate(3) },
      { station: 'LASER', status: 'PASS', timestamp: getRecentDate(2.5) },
    ]
  },
  {
    id: '5',
    barcode: 'PDT005',
    serialNumber: 'SN00123460',
    model: 'XC-400',
    currentStatus: 'FAIL',
    failedStation: 'BUTTON',
    failureDate: getRecentDate(1),
    tests: [
      { station: 'BLT', status: 'PASS', timestamp: getRecentDate(4) },
      { station: 'RF', status: 'PASS', timestamp: getRecentDate(3.5) },
      { station: 'VISION_1', status: 'PASS', timestamp: getRecentDate(3) },
      { station: 'VISION_2', status: 'PASS', timestamp: getRecentDate(2.5) },
      { station: 'VISION_3', status: 'PASS', timestamp: getRecentDate(2) },
      { station: 'UFT', status: 'PASS', timestamp: getRecentDate(1.5) },
      { station: 'BUTTON', status: 'FAIL', timestamp: getRecentDate(1), details: 'Button 2 actuation force out of spec' },
    ]
  },
];

// Function to find a product by barcode
export const findProductByBarcode = (barcode: string): Product | undefined => {
  return mockProducts.find(product => product.barcode.toLowerCase() === barcode.toLowerCase());
};
