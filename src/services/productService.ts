
import { supabase } from '@/integrations/supabase/client';
import { Product, TestStation, ProductStatus, mapDbStatusToAppStatus } from '@/types/product';

export interface SupabaseProduct {
  id: string;
  code_2d: string;
  sfc: string;
  ref_pcba_actia: string;
  ref_pcba_somfy: string;
  position: number;
  num_po: string;
  num_ligne: string;
  status: number;
  cle_io: string | null;
  failed_station: string | null;
  failed_station_number: number | null;
  failure_date: string | null;
  nc_code: string | null;
  nbre_passage: number | null;
}

export interface SupabaseTestPassage {
  id: string;
  product_id: string;
  test_date: string;
  station: string;
  station_number: number | null;
  status: number;
  nc_code: string | null;
  details: string | null;
  test_duration: string | null;
}

/**
 * Converts a Supabase product to our app's product model
 */
export const mapSupabaseProductToAppProduct = async (supaProduct: SupabaseProduct): Promise<Product> => {
  // Récupérer les tests associés au produit
  const { data: testPassages, error } = await supabase
    .from('test_passages')
    .select('*')
    .eq('product_id', supaProduct.id)
    .order('test_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching test passages:', error);
    throw new Error('Failed to fetch test passages');
  }

  // Mapper les passages de tests vers notre modèle d'application
  const tests = testPassages.map(test => {
    const station = test.station as TestStation;
    const status = mapDbStatusToAppStatus(test.status);
    
    return {
      station,
      status,
      timestamp: test.test_date,
      details: test.nc_code || test.details || undefined,
    };
  });

  // Trier les tests par horodatage (du plus récent au plus ancien)
  tests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Déterminer le statut actuel et la station qui a échoué
  let currentStatus = mapDbStatusToAppStatus(supaProduct.status);
  let failedStation: TestStation | undefined = undefined;
  let failureDate: string | undefined = undefined;

  if (supaProduct.failed_station) {
    failedStation = supaProduct.failed_station as TestStation;
    failureDate = supaProduct.failure_date || undefined;
  }

  return {
    id: supaProduct.id,
    barcode: supaProduct.code_2d || '',
    serialNumber: supaProduct.sfc || '',
    model: supaProduct.ref_pcba_somfy || supaProduct.ref_pcba_actia || '',
    tests,
    currentStatus,
    failedStation,
    failureDate
  };
};

/**
 * Recherche un produit par code-barres
 */
export const findProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('product_status_view')
      .select('*')
      .eq('code_2d', barcode)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return await mapSupabaseProductToAppProduct(data as SupabaseProduct);
  } catch (error) {
    console.error('Error in findProductByBarcode:', error);
    return null;
  }
};

/**
 * Récupère les derniers produits scannés (limité à un certain nombre)
 */
export const getRecentProducts = async (limit = 5): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_status_view')
      .select('*')
      .order('failure_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent products:', error);
      return [];
    }

    const products = await Promise.all(
      data.map(async (product) => await mapSupabaseProductToAppProduct(product as SupabaseProduct))
    );

    return products;
  } catch (error) {
    console.error('Error in getRecentProducts:', error);
    return [];
  }
};

/**
 * Supprime tous les passages de tests et produits
 */
export const clearAllLogs = async (): Promise<boolean> => {
  try {
    // Supprimer tous les passages de tests
    const { error: testPassagesError } = await supabase
      .from('test_passages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Condition pour supprimer tous les enregistrements

    if (testPassagesError) {
      console.error('Error clearing test passages:', testPassagesError);
      return false;
    }

    // Supprimer tous les produits
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Condition pour supprimer tous les enregistrements

    if (productsError) {
      console.error('Error clearing products:', productsError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in clearAllLogs:', error);
    return false;
  }
};
