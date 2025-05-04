
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import ProductScanner from '@/components/ProductScanner';
import StatusDisplay from '@/components/StatusDisplay';
import ProductHistory from '@/components/ProductHistory';
import LoginForm from '@/components/LoginForm';
import { Product } from '@/types/product';
import { findProductByBarcode, mockProducts } from '@/data/mockData';

const Index = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [scanHistory, setScanHistory] = useState<Product[]>([]);
  const [user, setUser] = useState<string | null>(null);
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('delphiUser');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  
  const handleScan = (barcode: string) => {
    // Find the product by barcode
    const product = findProductByBarcode(barcode);
    
    if (product) {
      setCurrentProduct(product);
      
      // Add to scan history if not already present
      if (!scanHistory.some(p => p.id === product.id)) {
        setScanHistory(prev => [product, ...prev].slice(0, 5));
      }
      
      // Show appropriate notification
      if (product.currentStatus === 'PASS') {
        toast.success(`Produit ${product.barcode} : PASS`);
      } else if (product.currentStatus === 'FAIL') {
        toast.error(`Produit ${product.barcode} : FAIL`);
      } else {
        toast.warning(`Produit ${product.barcode} : En cours de test`);
      }
    } else {
      toast.error(`Aucun produit trouvé avec le code barre ${barcode}`);
    }
  };

  const selectProductFromHistory = (product: Product) => {
    setCurrentProduct(product);
  };
  
  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('delphiUser', username);
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('delphiUser');
    toast.info('Vous avez été déconnecté');
  };

  // If user is not logged in, show login form
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <header className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">SAV AMY IO Nc log</h1>
            <p className="text-sm opacity-90">Système de Suivi des Produits</p>
          </header>
          
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">SAV AMY IO Nc log</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary-foreground/20 px-3 py-1 rounded-md">
                <p className="text-sm">Technicien: {user}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm" className="text-primary-foreground bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/20">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4">
        <Card className="border mb-4">
          <CardContent className="p-4">
            <h2 className="text-xl font-medium mb-2">Saisir manuellement ou Scanner le code barre du produit</h2>
            <ProductScanner onScan={handleScan} />
          </CardContent>
        </Card>
        
        <Card className="border mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Référence produit Actia</label>
                <Input readOnly value={currentProduct?.barcode || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Référence produit Somfy</label>
                <Input readOnly value={currentProduct?.model || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pos produit</label>
                <Input readOnly value={currentProduct?.id || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Num Po</label>
                <Input readOnly value={currentProduct?.serialNumber.slice(0, 4) || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Num Ligne</label>
                <Input readOnly value={currentProduct?.serialNumber.slice(4, 8) || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nbre passage</label>
                <Input readOnly value={currentProduct?.tests.length.toString() || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ID passage</label>
                <Input readOnly value={currentProduct?.id || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de passage</label>
                <Input readOnly value={currentProduct ? new Date().toLocaleDateString('fr-FR') : ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Takt time total</label>
                <Input readOnly value="00:05:23" className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code 2d produit</label>
                <Input readOnly value={currentProduct?.barcode || ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CLE IO</label>
                <Input readOnly value="A349B7" className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SFC CIE</label>
                <Input readOnly value="D78F10" className="bg-gray-50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="border">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom de Poste</label>
                  <Input readOnly value={currentProduct?.failedStation || ''} className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Num de Poste</label>
                  <Input readOnly value={currentProduct?.failedStation ? '1' : ''} className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date Fail</label>
                  <Input readOnly value={currentProduct?.failureDate || ''} className="bg-gray-50" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Nc code défaut</label>
                <Input readOnly value={currentProduct?.tests.find(test => test.status === 'FAIL')?.details || ''} className="bg-gray-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium mb-2">Résultat du dernier passage</h3>
                {currentProduct && (
                  <div className={`text-4xl font-bold ${
                    currentProduct.currentStatus === 'PASS' ? 'text-success' : 
                    currentProduct.currentStatus === 'FAIL' ? 'text-destructive' : 
                    'text-warning'
                  }`}>
                    {currentProduct.currentStatus}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12v7H5v-7H3v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" fill="currentColor"/>
                  </svg>
                  Enregistrement des logs
                </Button>
                <Button variant="destructive" className="flex items-center gap-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                  </svg>
                  Supprimer et vider les logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border">
          <CardContent className="p-4">
            <div className="flex gap-2 mb-4">
              <Button variant="secondary">Historique Produit</Button>
              <Button variant="secondary">Liste des produits</Button>
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
                {scanHistory.map((product) => (
                  <TableRow key={product.id} onClick={() => selectProductFromHistory(product)} className="cursor-pointer">
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
                ))}
                {scanHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">Aucun produit scanné</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Anciens composants conservés pour références mais masqués */}
        <div className="hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StatusDisplay product={currentProduct} />
            </div>
            <div>
              <ProductHistory scanHistory={scanHistory} onSelectProduct={selectProductFromHistory} />
            </div>
          </div>
        </div>

        {/* Helper text for demo */}
        <div className="mt-8 p-4 bg-secondary/50 rounded-md border border-primary/20">
          <h3 className="font-medium mb-2">Codes pour la démo :</h3>
          <p className="text-sm text-muted-foreground mb-2">Utilisez ces codes pour tester différents statuts :</p>
          <ul className="space-y-1 text-sm list-disc list-inside">
            <li>PDT001 - Produit PASS</li>
            <li>PDT002 - Produit FAIL (Testeur RF)</li>
            <li>PDT003 - Produit FAIL (Vision 2)</li>
            <li>PDT005 - Produit FAIL (Testeur Bouton)</li>
          </ul>
        </div>
      </main>
      
      <footer className="bg-secondary py-3 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          SAV AMY IO Nc log - Système de Suivi des Produits © 2025
        </div>
      </footer>
    </div>
  );
};

export default Index;
