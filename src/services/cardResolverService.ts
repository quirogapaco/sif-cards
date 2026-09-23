import { supabase } from '../lib/supabase';
import type { Card, Profile } from '../types/database';

export interface CardResolveResult {
  card: Card | null;
  error?: string;
}

export interface ProfileResolveResult {
  profile: Profile | null;
  error?: string;
}

export const cardResolverService = {
  /**
   * Consulta una tarjeta por su token físico o código QR.
   * Si se proporciona un `prefix`, valida opcionalmente que el lote asociado (batches.url_prefix) coincida.
   */
  async getCardByToken(token: string, prefix?: string): Promise<CardResolveResult> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          batch:batches(*),
          profile:profiles(
            id,
            user_id,
            slug,
            template_type,
            theme_palette,
            data,
            created_at,
            updated_at,
            subscription_status,
            expires_at
          )
        `)
        .eq('token', token)
        .maybeSingle();

      if (error) {
        console.error('Error en Supabase al resolver tarjeta:', error);
        return { card: null, error: error.message };
      }

      if (!data) {
        return { card: null };
      }

      const card = data as Card;

      // Validación opcional de prefijo B2B si viene en la URL /:prefix/:token
      if (prefix && prefix.trim() !== '') {
        const expectedPrefix = prefix.trim().toLowerCase();
        const batchPrefix = card.batch?.url_prefix?.trim().toLowerCase();

        // Si el lote tiene prefijo configurado y no coincide con la URL, la tarjeta no aplica a este prefijo
        if (batchPrefix && batchPrefix !== expectedPrefix) {
          console.warn(
            `Prefijo no coincide: URL "${expectedPrefix}" vs Lote "${batchPrefix}"`
          );
          return { card: null, error: 'El prefijo corporativo de la URL no coincide con la tarjeta.' };
        }
      }

      return { card };
    } catch (err: any) {
      console.error('Excepción en cardResolverService.getCardByToken:', err);
      return { card: null, error: err?.message || 'Error de conexión.' };
    }
  },

  /**
   * Consulta segura a la tabla profiles buscando por slug y validando el token de la tarjeta
   */
  async getProfileSecure(slug: string, token: string): Promise<ProfileResolveResult> {
    try {
      const { data, error } = await supabase
        .rpc('get_profile_secure', { p_slug: slug, p_token: token })
        .maybeSingle();

      if (error) {
        console.error('Error en Supabase al resolver perfil seguro:', error);
        return { profile: null, error: error.message };
      }

      if (!data) {
        return { profile: null };
      }

      return { profile: data as Profile };
    } catch (err: any) {
      console.error('Excepción en cardResolverService.getProfileSecure:', err);
      return { profile: null, error: err?.message || 'Error de conexión.' };
    }
  },
};
