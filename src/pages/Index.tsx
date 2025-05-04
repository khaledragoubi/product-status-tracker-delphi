
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
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
            <h1 className="text-2xl font-bold text-primary">Delphi</h1>
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Delphi</h1>
              <p className="text-sm opacity-90">Système de Suivi des Produits</p>
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
      
      <main className="container mx-auto px-4 py-6">
        <Card className="border-primary/30 mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Scanner un produit</h2>
            <ProductScanner onScan={handleScan} />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StatusDisplay product={currentProduct} />
          </div>
          <div>
            <ProductHistory scanHistory={scanHistory} onSelectProduct={selectProductFromHistory} />
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
          Delphi - Système de Suivi des Produits © 2025
        </div>
      </footer>
    </div>
  );
};

export default Index;
