
import { supabase } from '@/integrations/supabase/client';
import { Product, TestStation, ProductStatus, mapDbStatusToAppStatus } from '@/types/product';
import { DbProduct } from '@/types/product';

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
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Condition pour supprimer tous les enregistrements

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
