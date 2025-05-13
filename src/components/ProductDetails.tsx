
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <Card className="border mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Référence produit Actia</label>
            <Input readOnly value={product?.configLine || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Référence produit Somfy</label>
            <Input readOnly value={product?.model || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pos produit</label>
            <Input readOnly value={product?.position?.toString() || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Num Po</label>
            <Input readOnly value={product?.portOutil?.toString() || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Num Ligne</label>
            <Input readOnly value={product?.serialNumber.slice(4, 8) || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nbre passage</label>
            <Input readOnly value={product?.passageCount?.toString() || '0'} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ID passage</label>
            <Input readOnly value={product?.id || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date de passage</label>
            <Input readOnly value={product?.tests[0]?.timestamp ? new Date(product.tests[0].timestamp).toLocaleDateString('fr-FR') : ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Takt time total</label>
            <Input readOnly value={product?.tests[0]?.timestamp ? '00:05:23' : ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code 2d produit</label>
            <Input readOnly value={product?.barcode || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CLE IO</label>
            <Input readOnly value={product?.addressIo || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SFC CIE</label>
            <Input readOnly value={product?.serialNumber || ''} className="bg-gray-50" />
          </div>
          {/* New fields for hw_version and sw_produit */}
          <div>
            <label className="block text-sm font-medium mb-1">Version matérielle</label>
            <Input readOnly value={product?.hwVersion || ''} className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Version logicielle</label>
            <Input readOnly value={product?.swProduct || ''} className="bg-gray-50" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
