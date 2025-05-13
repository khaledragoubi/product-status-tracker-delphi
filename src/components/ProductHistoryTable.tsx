
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from '@/types/product';

interface ProductHistoryTableProps {
  scanHistory: Product[];
  isLoading: boolean;
  error: unknown;
  onSelectProduct: (product: Product) => void;
  currentProduct: Product | null;
}

const ProductHistoryTable: React.FC<ProductHistoryTableProps> = ({ 
  scanHistory, 
  isLoading, 
  error, 
  onSelectProduct,
  currentProduct
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'list'>('history');

  // Filter product history based on the currentProduct
  const currentProductHistory = currentProduct 
    ? scanHistory.filter(product => 
        product.barcode === currentProduct.barcode || 
        product.serialNumber === currentProduct.serialNumber)
    : [];

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex gap-2 mb-4">
          <Button 
            variant={activeTab === 'history' ? "default" : "secondary"}
            onClick={() => setActiveTab('history')}
          >
            Historique Produit
          </Button>
          <Button 
            variant={activeTab === 'list' ? "default" : "secondary"}
            onClick={() => setActiveTab('list')}
          >
            Liste des produits
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Poste</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Chargement...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-destructive">Erreur de chargement des données</TableCell>
              </TableRow>
            ) : activeTab === 'history' ? (
              // Historique du produit actuel
              currentProductHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {currentProduct ? "Aucun historique pour ce produit" : "Aucun produit scanné"}
                  </TableCell>
                </TableRow>
              ) : (
                currentProductHistory.map((product) => (
                  <TableRow key={product.id} onClick={() => onSelectProduct(product)} className="cursor-pointer">
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.currentStatus === 'PASS' ? 'bg-success/20 text-success' :
                        product.currentStatus === 'FAIL' ? 'bg-destructive/20 text-destructive' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {product.currentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.tests[0]?.timestamp ? new Date(product.tests[0].timestamp).toLocaleString('fr-FR') : ''}
                    </TableCell>
                    <TableCell>{product.failedStation || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )
            ) : (
              // Liste de tous les produits 
              scanHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">Aucun produit scanné</TableCell>
                </TableRow>
              ) : (
                scanHistory.map((product) => (
                  <TableRow key={product.id} onClick={() => onSelectProduct(product)} className="cursor-pointer">
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.currentStatus === 'PASS' ? 'bg-success/20 text-success' :
                        product.currentStatus === 'FAIL' ? 'bg-destructive/20 text-destructive' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {product.currentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.tests[0]?.timestamp ? new Date(product.tests[0].timestamp).toLocaleString('fr-FR') : ''}
                    </TableCell>
                    <TableCell>{product.failedStation || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductHistoryTable;
