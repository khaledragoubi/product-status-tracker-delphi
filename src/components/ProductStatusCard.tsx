
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product';

interface ProductStatusCardProps {
  product: Product | null;
}

const ProductStatusCard: React.FC<ProductStatusCardProps> = ({ product }) => {
  return (
    <Card className="border">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium mb-2">Résultat du dernier passage</h3>
          {product && (
            <div className={`text-4xl font-bold ${
              product.currentStatus === 'PASS' ? 'text-success' : 
              product.currentStatus === 'FAIL' ? 'text-destructive' : 
              'text-warning'
            }`}>
              {product.currentStatus === 'PASS' && (
                <span className="text-success">PASS</span>
              )}
              {product.currentStatus === 'FAIL' && (
                <span className="text-destructive">FAIL</span>
              )}
              {product.currentStatus === 'IN_PROGRESS' && (
                <span className="text-warning">EN COURS</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStatusCard;
