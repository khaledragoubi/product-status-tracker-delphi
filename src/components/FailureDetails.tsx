
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';

interface FailureDetailsProps {
  product: Product | null;
}

const FailureDetails: React.FC<FailureDetailsProps> = ({ product }) => {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de Poste</label>
            <Input readOnly value={product?.failedStation || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Num de Poste</label>
            <Input readOnly value={product?.failedStation ? '1' : ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Fail</label>
            <Input readOnly value={product?.failureDate ? new Date(product.failureDate).toLocaleString('fr-FR') : ''} className="bg-gray-50" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Nc code défaut</label>
          <Input readOnly value={product?.tests.find(test => test.status === 'FAIL')?.details || ''} className="bg-gray-50" />
        </div>
      </CardContent>
    </Card>
  );
};

export default FailureDetails;
