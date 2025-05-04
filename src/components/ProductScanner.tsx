
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Search } from 'lucide-react';

interface ProductScannerProps {
  onScan: (barcode: string) => void;
}

const ProductScanner: React.FC<ProductScannerProps> = ({ onScan }) => {
  const [barcode, setBarcode] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) {
      toast.error('Veuillez saisir un code barre valide');
      return;
    }
    
    onScan(barcode.trim());
    setBarcode('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full space-x-2">
      <Input
        type="text"
        placeholder="Scanner ou saisir le code barre"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        className="text-base py-5 flex-1"
        autoFocus
      />
      <Button type="submit" className="text-base py-5">
        Valider
      </Button>
    </form>
  );
};

export default ProductScanner;
