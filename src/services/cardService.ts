import { supabase } from '../lib/supabase';
import type { Card } from '../types/database';

export const cardService = {
  /**
   * Obtiene todas las tarjetas asignadas al usuario actual.
   * Resuelve joins para obtener la información básica del perfil y del lote.
   */
  async getUserCards(userId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*, profile:profiles(id, slug, template_type, theme_palette, data), batch:batches(url_prefix)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar las tarjetas del usuario:', error);
      throw new Error(`Error al cargar las tarjetas: ${error.message}`);
    }

    return (data || []) as Card[];
  },

  /**
   * Reasigna el perfil vinculado a una tarjeta.
   * Solo modifica `profile_id`, manteniendo inmutable el `relative_path` y `token`.
   */
  async reassignCardProfile(cardId: string, newProfileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('cards')
        .update({
          profile_id: newProfileId,
        })
        .eq('id', cardId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error inesperado al reasignar el perfil.',
      };
    }
  },
};
