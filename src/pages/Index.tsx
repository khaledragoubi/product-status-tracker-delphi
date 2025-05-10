
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { getRecentProducts, clearAllLogs, exportProductsToCSV, findLatestProductByBarcodeOrSfc } from '@/services/productService';

import LoginForm from '@/components/LoginForm';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ProductScannerCard from '@/components/ProductScannerCard';
import ProductDetails from '@/components/ProductDetails';
import FailureDetails from '@/components/FailureDetails';
import ProductStatusCard from '@/components/ProductStatusCard';
import ActionButtons from '@/components/ActionButtons';
import ProductHistoryTable from '@/components/ProductHistoryTable';

const Index = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [scanHistory, setScanHistory] = useState<Product[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Récupérer les produits récents au chargement de la page
  const { data: recentProducts, isLoading, error, refetch } = useQuery({
    queryKey: ['recentProducts'],
    queryFn: () => getRecentProducts(5),
  });

  // Mettre à jour l'historique de scan au chargement des produits récents
  useEffect(() => {
    if (recentProducts && recentProducts.length > 0) {
      setScanHistory(recentProducts);
    }
  }, [recentProducts]);
  
  // Vérifier si l'utilisateur est déjà connecté depuis localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('delphiUser');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  
  const handleScan = async (barcode: string) => {
    setIsScanning(true);
    try {
      // Rechercher le produit par code-barres ou SFC dans la base de données
      const product = await findLatestProductByBarcodeOrSfc(barcode);
      
      if (product) {
        setCurrentProduct(product);
        
        // Ajouter à l'historique de scan s'il n'y est pas déjà
        if (!scanHistory.some(p => p.id === product.id)) {
          setScanHistory(prev => [product, ...prev].slice(0, 5));
        }
        
        // Afficher une notification appropriée
        if (product.currentStatus === 'PASS') {
          toast.success(`Produit ${barcode} : PASS`);
        } else if (product.currentStatus === 'FAIL') {
          toast.error(`Produit ${barcode} : FAIL`);
        } else {
          toast.warning(`Produit ${barcode} : En cours de test`);
        }
      } else {
        toast.error(`Aucun produit trouvé avec l'identifiant ${barcode}`);
      }
    } catch (error) {
      console.error('Error scanning product:', error);
      toast.error('Erreur lors du scan du produit');
    } finally {
      setIsScanning(false);
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

  const handleClearAllLogs = async () => {
    setIsClearing(true);
    try {
      const success = await clearAllLogs();
      
      if (success) {
        toast.success('Tous les logs ont été supprimés avec succès');
        setCurrentProduct(null);
        setScanHistory([]);
        refetch(); // Rafraîchir les données
      } else {
        toast.error('Erreur lors de la suppression des logs');
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast.error('Erreur lors de la suppression des logs');
    } finally {
      setIsClearing(false);
    }
  };

  // Fonction pour gérer l'exportation CSV
  const handleExportLogs = async () => {
    setIsExporting(true);
    try {
      if (scanHistory.length === 0) {
        toast.warning('Aucun produit à exporter dans l\'historique');
        return;
      }
      
      const csvContent = await exportProductsToCSV(scanHistory);
      
      // Créer un blob avec le contenu CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      link.setAttribute('href', url);
      link.setAttribute('download', `historique-produits-${date}.csv`);
      link.style.visibility = 'hidden';
      
      // Ajouter à la page, cliquer et supprimer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Historique des produits exporté avec succès');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Erreur lors de l\'exportation de l\'historique');
    } finally {
      setIsExporting(false);
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <header className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/52a12bc6-eba5-4826-8c18-1d971f9e1b2d.png" 
                alt="Logo ACTIA" 
                className="h-16" 
              />
            </div>
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
      <AppHeader user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-4">
        {/* Scanner Card */}
        <ProductScannerCard onScan={handleScan} />
        
        {/* Product Details */}
        <ProductDetails product={currentProduct} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Failure Details */}
          <FailureDetails product={currentProduct} />

          {/* Status and Action Buttons */}
          <div className="flex flex-col gap-4">
            <ProductStatusCard product={currentProduct} />
            <div className="flex justify-end">
              <ActionButtons 
                onExportLogs={handleExportLogs} 
                onClearAllLogs={handleClearAllLogs}
                isExporting={isExporting}
                isClearing={isClearing}
              />
            </div>
          </div>
        </div>

        {/* Product History Table */}
        <ProductHistoryTable 
          scanHistory={scanHistory} 
          isLoading={isLoading} 
          error={error}
          onSelectProduct={selectProductFromHistory}
        />
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Index;
