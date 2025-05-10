
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Search } from 'lucide-react';

interface ProductScannerProps {
  onScan: (barcode: string) => Promise<void>;
}

const ProductScanner: React.FC<ProductScannerProps> = ({ onScan }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error('Veuillez saisir un code barre ou SFC valide');
      return;
    }
    
    setIsScanning(true);
    try {
      await onScan(inputValue.trim());
      setInputValue('');
    } catch (error) {
      console.error('Error scanning product:', error);
      toast.error('Erreur lors du scan du produit');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full space-x-2">
      <Input
        type="text"
        placeholder="Scanner ou saisir le code barre (code_2d) ou SFC"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="text-base py-5 flex-1"
        autoFocus
        disabled={isScanning}
      />
      <Button type="submit" className="text-base py-5" disabled={isScanning}>
        {isScanning ? 'Recherche...' : 'Valider'}
      </Button>
    </form>
  );
};

export default ProductScanner;
