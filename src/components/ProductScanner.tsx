
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
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Scanner ou saisir le code barre"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="pr-10 text-lg py-6"
          autoFocus
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      </div>
      <Button type="submit" className="text-base py-6">
        Analyser
      </Button>
    </form>
  );
};

export default ProductScanner;
