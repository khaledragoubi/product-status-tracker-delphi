
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductScanner from '@/components/ProductScanner';
import LoginForm from '@/components/LoginForm';
import { Product } from '@/types/product';
import { findProductByBarcode, getRecentProducts, clearAllLogs, exportProductsToCSV } from '@/services/productService';
import { useQuery } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Download } from 'lucide-react';

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
      // Rechercher le produit par code-barres dans la base de données
      const product = await findProductByBarcode(barcode);
      
      if (product) {
        setCurrentProduct(product);
        
        // Ajouter à l'historique de scan s'il n'y est pas déjà
        if (!scanHistory.some(p => p.id === product.id)) {
          setScanHistory(prev => [product, ...prev].slice(0, 5));
        }
        
        // Afficher une notification appropriée
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

  // Nouvelle fonction pour gérer l'exportation CSV
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
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/52a12bc6-eba5-4826-8c18-1d971f9e1b2d.png" 
                alt="Logo ACTIA" 
                className="h-10" 
              />
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
                <Input readOnly value={currentProduct?.tests[0]?.timestamp ? new Date(currentProduct.tests[0].timestamp).toLocaleDateString('fr-FR') : ''} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Takt time total</label>
                <Input readOnly value={currentProduct?.tests[0]?.timestamp ? '00:05:23' : ''} className="bg-gray-50" />
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
                  <Input readOnly value={currentProduct?.failureDate ? new Date(currentProduct.failureDate).toLocaleString('fr-FR') : ''} className="bg-gray-50" />
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
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={handleExportLogs}
                  disabled={isExporting}
                >
                  <Download className="size-4" />
                  {isExporting ? 'Exportation...' : 'Enregistrement des logs'}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-1" disabled={isClearing}>
                      <Trash2 className="size-4" />
                      {isClearing ? 'Suppression...' : 'Supprimer et vider les logs'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer tous les logs ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action va supprimer définitivement tous les logs et l'historique des produits. 
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllLogs} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">Chargement...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-destructive">Erreur de chargement des données</TableCell>
                  </TableRow>
                ) : scanHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">Aucun produit scanné</TableCell>
                  </TableRow>
                ) : scanHistory.map((product) => (
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-secondary py-3 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img 
              src="/lovable-uploads/52a12bc6-eba5-4826-8c18-1d971f9e1b2d.png" 
              alt="Logo ACTIA" 
              className="h-6" 
            />
            <span>SAV AMY IO Nc log - Système de Suivi des Produits © 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
