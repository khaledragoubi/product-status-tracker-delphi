
import { supabase } from '@/integrations/supabase/client';
import { Product, TestStation, ProductStatus, mapDbStatusToAppStatus, mapDbProductToAppProduct, DbProduct } from '@/types/product';

/**
 * Recherche un produit par code-barres dans la table trace_view
 */
export const findProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('trace_view')
      .select('*')
      .eq('code_2d', barcode)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Mapper le produit de la base de données vers notre modèle d'application
    return mapDbProductToAppProduct(data as DbProduct);
  } catch (error) {
    console.error('Error in findProductByBarcode:', error);
    return null;
  }
};

/**
 * Récupère les derniers produits (limité à un certain nombre)
 */
export const getRecentProducts = async (limit = 5): Promise<Product[]> => {
  try {
    // Requête pour obtenir les données les plus récentes depuis trace_view
    const { data, error } = await supabase
      .from('trace_view')
      .select('*')
      .order('blt_date_heure', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent products:', error);
      return [];
    }

    // Mapper chaque produit de la base de données vers notre modèle d'application
    const products = data.map((product) => mapDbProductToAppProduct(product as DbProduct));
    
    return products;
  } catch (error) {
    console.error('Error in getRecentProducts:', error);
    return [];
  }
};

/**
 * Supprime tous les logs de la table trace_view
 */
export const clearAllLogs = async (): Promise<boolean> => {
  try {
    // Supprimer tous les enregistrements de la table trace_view
    const { error } = await supabase
      .from('trace_view')
      .delete()
      .not('num', 'is', null); // Condition pour supprimer tous les enregistrements

    if (error) {
      console.error('Error clearing trace_view logs:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in clearAllLogs:', error);
    return false;
  }
};

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
