
import React from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductHistoryProps {
  scanHistory: Product[];
  onSelectProduct: (product: Product) => void;
}

const ProductHistory: React.FC<ProductHistoryProps> = ({ scanHistory, onSelectProduct }) => {
  if (scanHistory.length === 0) {
    return null;
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Historique des scans récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {scanHistory.map((product) => {
            // Get the timestamp of the latest test
            const latestTest = [...product.tests].sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )[0];

            return (
              <div 
                key={product.id}
                className="flex justify-between items-center p-3 rounded-md bg-secondary/40 hover:bg-secondary cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{product.barcode}</span>
                  <span className="text-sm text-muted-foreground">{product.model}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">{latestTest && formatTime(latestTest.timestamp)}</span>
                  <Badge className={`${
                    product.currentStatus === 'PASS' ? 'bg-success hover:bg-success/80' : 
                    product.currentStatus === 'FAIL' ? 'bg-destructive hover:bg-destructive/80' : 
                    'bg-warning hover:bg-warning/80'
                  }`}>
                    {product.currentStatus}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductHistory;
