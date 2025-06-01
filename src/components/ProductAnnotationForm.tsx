
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { useAuth } from '@/hooks/useAuth';

interface ProductAnnotationFormProps {
  product: Product;
  onAnnotationAdded?: () => void;
}

const ProductAnnotationForm: React.FC<ProductAnnotationFormProps> = ({ 
  product, 
  onAnnotationAdded 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topographicReference: '',
    defectType: '',
    defectNature: '',
    additionalNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter une annotation');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('product_annotations')
        .insert({
          product_key: product.serialNumber,
          created_by: user.id,
          topographic_reference: formData.topographicReference,
          defect_type: formData.defectType,
          defect_nature: formData.defectNature,
          additional_notes: formData.additionalNotes || null
        });

      if (error) throw error;

      toast.success('Annotation ajoutée avec succès');
      
      // Reset form
      setFormData({
        topographicReference: '',
        defectType: '',
        defectNature: '',
        additionalNotes: ''
      });

      onAnnotationAdded?.();
    } catch (error: any) {
      console.error('Error adding annotation:', error);
      toast.error('Erreur lors de l\'ajout de l\'annotation');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-lg">Ajouter une annotation de diagnostic</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topographicReference" className="text-sm font-medium">
                Repère topographique *
              </Label>
              <Input
                id="topographicReference"
                value={formData.topographicReference}
                onChange={(e) => handleInputChange('topographicReference', e.target.value)}
                placeholder="Ex: Zone A, Composant C1"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="defectType" className="text-sm font-medium">
                Type de défaut *
              </Label>
              <Input
                id="defectType"
                value={formData.defectType}
                onChange={(e) => handleInputChange('defectType', e.target.value)}
                placeholder="Ex: Soudure, Assemblage"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="defectNature" className="text-sm font-medium">
              Nature du défaut *
            </Label>
            <Input
              id="defectNature"
              value={formData.defectNature}
              onChange={(e) => handleInputChange('defectNature', e.target.value)}
              placeholder="Ex: Court-circuit, Composant manquant"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="additionalNotes" className="text-sm font-medium">
              Notes supplémentaires
            </Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Informations complémentaires..."
              disabled={loading}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Ajout en cours...' : 'Ajouter l\'annotation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductAnnotationForm;
