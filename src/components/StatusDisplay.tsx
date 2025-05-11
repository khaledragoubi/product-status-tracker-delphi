
import React from 'react';
import { Product, TestStation } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface StatusDisplayProps {
  product: Product | null;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ product }) => {
  if (!product) {
    return (
      <Card className="w-full bg-secondary/50">
        <CardHeader className="text-center">
          <CardTitle>Aucun produit scanné</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Veuillez scanner un produit pour afficher son statut
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
  };

  const stationLabels: Record<TestStation, string> = {
    'BLT': 'Testeur BLT',
    'RF': 'Testeur RF',
    'VISION': 'Vision',
    'UFT': 'Testeur UFT',
    'RF_SLIDER': 'RF Slider'
  };

  return (
    <Card className={`w-full ${product.currentStatus === 'FAIL' ? 'border-destructive/60' : 'border-success/60'}`}>
      <CardHeader className={`${product.currentStatus === 'FAIL' ? 'bg-destructive/10' : 'bg-success/10'}`}>
        <div className="flex justify-between items-center">
          <CardTitle>Produit: {product.model}</CardTitle>
          <Badge className={`text-base px-3 py-1 ${
            product.currentStatus === 'PASS' ? 'bg-success text-success-foreground hover:bg-success/80' : 
            product.currentStatus === 'FAIL' ? 'bg-destructive hover:bg-destructive/80' : 
            'bg-warning hover:bg-warning/80'
          }`}>
            {product.currentStatus === 'PASS' && (
              <span className="text-success-foreground">PASS</span>
            )}
            {product.currentStatus === 'FAIL' && (
              <span className="text-destructive-foreground">FAIL</span>
            )}
            {product.currentStatus === 'IN_PROGRESS' && (
              <span>EN COURS</span>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Code Barre (code_2d)</p>
            <p className="font-medium">{product.barcode || "Non disponible"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Numéro SFC</p>
            <p className="font-medium">{product.serialNumber || "Non disponible"}</p>
          </div>
        </div>

        {product.currentStatus === 'FAIL' && product.failedStation && (
          <>
            <Separator className="my-4" />
            <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
              <h3 className="font-semibold text-destructive mb-2">ÉCHEC DÉTECTÉ</h3>
              <p>
                <span className="font-medium">Station:</span> {stationLabels[product.failedStation]}
              </p>
              <p>
                <span className="font-medium">Date d'échec:</span> {product.failureDate ? formatDate(product.failureDate) : 'N/A'}
              </p>
              {product.tests.find(test => test.station === product.failedStation)?.details && (
                <p>
                  <span className="font-medium">Détails:</span> {product.tests.find(test => test.station === product.failedStation)?.details}
                </p>
              )}
            </div>
          </>
        )}

        <Separator className="my-4" />
        <div>
          <h3 className="font-semibold mb-3">Historique des tests</h3>
          <p className="text-xs text-muted-foreground mb-2">
            {product.currentStatus === 'FAIL' 
              ? "Tests triés par priorité de station (BLT, RF, VISION, UFT, RF_SLIDER)" 
              : "Tests triés par date (plus récent d'abord)"}
          </p>
          <div className="space-y-3">
            {product.tests.map((test, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-md bg-secondary/50">
                <div>
                  <span className="font-medium">{stationLabels[test.station]}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{formatDate(test.timestamp)}</span>
                  <Badge className={`${
                    test.status === 'PASS' ? 'bg-success text-success-foreground hover:bg-success/80' : 
                    test.status === 'FAIL' ? 'bg-destructive hover:bg-destructive/80' : 
                    'bg-warning hover:bg-warning/80'
                  }`}>
                    {test.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDisplay;
