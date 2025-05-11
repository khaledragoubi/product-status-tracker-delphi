
import { supabase } from '@/integrations/supabase/client';
import { Product, DbProduct, mapDbProductToAppProduct } from '@/types/product';
import { getProductPassageCount } from './productCount';

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
    console.log('Searching for product with value:', searchValue);
    
    // Approche alternative utilisant des filtres séparés pour une meilleure compatibilité
    const { data, error } = await supabase
      .from('trace_view')
      .select('*')
      .or(`code_2d.eq.${searchValue},sfc.eq.${searchValue}`)
      .order('num', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching latest product:', error);
      return null;
    }

    if (!data || data.length === 0) {
      // Essayons une autre approche si la première ne fonctionne pas
      console.log('First attempt failed, trying alternative approach');
      const secondAttempt = await supabase
        .from('trace_view')
        .select('*')
        .filter('code_2d', 'eq', searchValue)
        .order('num', { ascending: false })
        .limit(1);
        
      if (secondAttempt.error) {
        console.error('Error in second attempt:', secondAttempt.error);
        return null;
      }
      
      if (!secondAttempt.data || secondAttempt.data.length === 0) {
        console.log('Second attempt failed, trying with SFC');
        // Essayons avec SFC
        const thirdAttempt = await supabase
          .from('trace_view')
          .select('*')
          .filter('sfc', 'eq', searchValue)
          .order('num', { ascending: false })
          .limit(1);
          
        if (thirdAttempt.error || !thirdAttempt.data || thirdAttempt.data.length === 0) {
          console.log('No product found with search value:', searchValue);
          return null;
        }
        
        console.log('Product found with SFC search:', thirdAttempt.data[0]);
        const passageCount = await getProductPassageCount(thirdAttempt.data[0].code_2d || thirdAttempt.data[0].sfc);
        return mapDbProductToAppProduct(thirdAttempt.data[0] as DbProduct, passageCount);
      }
      
      console.log('Product found with code_2d search:', secondAttempt.data[0]);
      const passageCount = await getProductPassageCount(secondAttempt.data[0].code_2d || secondAttempt.data[0].sfc);
      return mapDbProductToAppProduct(secondAttempt.data[0] as DbProduct, passageCount);
    }

    console.log('Product found on first attempt:', data[0]);

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
