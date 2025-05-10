
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
 * Recherche le produit le plus récent par code-barres ou SFC dans la table trace_view
 */
export const findLatestProductByBarcodeOrSfc = async (searchValue: string): Promise<Product | null> => {
  try {
    // Essaie de rechercher par code_2d d'abord
    let query = supabase
      .from('trace_view')
      .select('*')
      .or(`code_2d.eq.${searchValue},sfc.eq.${searchValue}`)
      .order('num', { ascending: false })
      .limit(1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching latest product:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Compter le nombre total de passages pour ce produit
    const passageCount = await getProductPassageCount(data[0].code_2d || data[0].sfc);

    // Mapper le produit de la base de données vers notre modèle d'application
    return mapDbProductToAppProduct(data[0] as DbProduct, passageCount);
  } catch (error) {
    console.error('Error in findLatestProductByBarcodeOrSfc:', error);
    return null;
  }
};

/**
 * Compte le nombre total de passages pour un produit donné
 */
export const getProductPassageCount = async (identifier: string | null): Promise<number> => {
  if (!identifier) return 0;
  
  try {
    // Recherche tous les enregistrements pour ce code_2d ou sfc
    const { data, error, count } = await supabase
      .from('trace_view')
      .select('*', { count: 'exact' })
      .or(`code_2d.eq.${identifier},sfc.eq.${identifier}`);

    if (error) {
      console.error('Error counting product passages:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getProductPassageCount:', error);
    return 0;
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
      .order('num', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent products:', error);
      return [];
    }

    // Mapper chaque produit de la base de données vers notre modèle d'application
    const products = [];
    
    for (const product of data) {
      const passageCount = await getProductPassageCount(product.code_2d || product.sfc);
      products.push(mapDbProductToAppProduct(product as DbProduct, passageCount));
    }
    
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
