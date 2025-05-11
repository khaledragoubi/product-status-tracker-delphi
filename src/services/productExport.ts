
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

/**
 * Exporte les produits spécifiés au format CSV 
 */
export const exportProductsToCSV = async (products: Product[]): Promise<string> => {
  try {
    if (!products || products.length === 0) {
      return 'Aucune donnée à exporter';
    }

    // Récupérer les données complètes des produits spécifiés
    const barcodes = products.map(p => p.barcode).filter(b => b);
    const { data, error } = await supabase
      .from('trace_view')
      .select('*')
      .in('code_2d', barcodes);

    if (error) {
      console.error('Error fetching products for export:', error);
      throw new Error('Erreur lors de la récupération des données pour l\'export');
    }

    if (!data || data.length === 0) {
      return 'Aucune donnée à exporter';
    }

    // Crée l'en-tête CSV avec toutes les colonnes
    const headers = Object.keys(data[0]).join(';');
    
    // Convertit les données en lignes CSV
    const csvRows = data.map(product => {
      return Object.values(product)
        .map(value => {
          // Formater les valeurs pour le CSV
          if (value === null || value === undefined) return '';
          // Échapper les guillemets et entourer la valeur de guillemets si elle contient des caractères spéciaux
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(';');
    });

    // Combine l'en-tête et les lignes
    const csvContent = [headers, ...csvRows].join('\n');
    
    return csvContent;
  } catch (error) {
    console.error('Error in exportProductsToCSV:', error);
    throw error;
  }
};
