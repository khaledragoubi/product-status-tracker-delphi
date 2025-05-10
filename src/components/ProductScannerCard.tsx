
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
        <h2 className="text-xl font-medium mb-2">Saisir ou scanner le code barre (code_2d) ou numéro SFC du produit</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Vous pouvez rechercher un produit par son code barre (code_2d) ou son numéro SFC
        </p>
        <ProductScanner onScan={onScan} />
      </CardContent>
    </Card>
  );
};

export default ProductScannerCard;
