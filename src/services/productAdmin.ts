
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

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
