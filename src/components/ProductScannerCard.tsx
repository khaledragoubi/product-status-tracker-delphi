
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ProductScanner from './ProductScanner';

interface ProductScannerCardProps {
  onScan: (barcode: string) => Promise<void>;
}

const ProductScannerCard: React.FC<ProductScannerCardProps> = ({ onScan }) => {
  return (
    <Card className="border mb-4">
      <CardContent className="p-4">
        <h2 className="text-xl font-medium mb-2">Saisir manuellement ou Scanner le code barre ou SFC du produit</h2>
        <ProductScanner onScan={onScan} />
      </CardContent>
    </Card>
  );
};

export default ProductScannerCard;
