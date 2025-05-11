
import { supabase } from '@/integrations/supabase/client';

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
      // Essayer l'approche alternative
      const secondAttempt = await supabase
        .from('trace_view')
        .select('*', { count: 'exact' })
        .filter('code_2d', 'eq', identifier);
        
      if (secondAttempt.error || secondAttempt.count === null) {
        return 0;
      }
      
      return secondAttempt.count;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getProductPassageCount:', error);
    return 0;
  }
};
