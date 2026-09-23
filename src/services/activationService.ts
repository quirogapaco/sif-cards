import { supabase } from '../lib/supabase';
import { userService } from './userService';
import type { Card, ProfileData } from '../types/database';

export interface ActivationParams {
  token: string;
  slug: string;
  themePalette: string;
  profileData: ProfileData;
}

export interface ActivationResult {
  success: boolean;
  profileId?: string;
  error?: string;
}

export const activationService = {
  /**
   * Verifica la validez de la tarjeta antes de iniciar el proceso.
   */
  async getCardStatus(token: string): Promise<{ card: Card | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*, profile:profiles(*)')
        .eq('token', token)
        .maybeSingle();

      if (error) throw error;
      return { card: data as Card | null };
    } catch (err: unknown) {
      return {
        card: null,
        error: err instanceof Error ? err.message : 'Error al consultar la tarjeta.',
      };
    }
  },

  /**
   * Verifica si un slug está disponible en la tabla profiles.
   */
  async isSlugAvailable(slug: string, currentProfileId?: string): Promise<boolean> {
    try {
      const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
      let query = supabase.from('profiles').select('id').eq('slug', formattedSlug);

      if (currentProfileId) {
        query = query.neq('id', currentProfileId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return !data || data.length === 0;
    } catch {
      return false;
    }
  },

  /**
   * Limpia el objeto ProfileData omitiendo propiedades vacías o arrays sin elementos.
   */
  cleanProfileData(data: ProfileData): ProfileData {
    const cleaned: ProfileData = {
      display_name: data.display_name?.trim() || '',
      job_title: data.job_title?.trim() || '',
      company: data.company?.trim() || '',
    };

    if (data.avatar_url?.trim()) cleaned.avatar_url = data.avatar_url.trim();
    if (data.banner_url?.trim()) cleaned.banner_url = data.banner_url.trim();
    if (data.bio_description?.trim()) cleaned.bio_description = data.bio_description.trim();

    // Contactos directos
    if (data.direct_contacts) {
      const contacts: NonNullable<ProfileData['direct_contacts']> = {};
      if (data.direct_contacts.whatsapp?.trim()) contacts.whatsapp = data.direct_contacts.whatsapp.trim();
      if (data.direct_contacts.email?.trim()) contacts.email = data.direct_contacts.email.trim();
      if (data.direct_contacts.phone?.trim()) contacts.phone = data.direct_contacts.phone.trim();
      if (data.direct_contacts.location?.trim()) contacts.location = data.direct_contacts.location.trim();

      if (Object.keys(contacts).length > 0) {
        cleaned.direct_contacts = contacts;
      }
    }

    // Redes sociales
    if (data.social_links && data.social_links.length > 0) {
      const validLinks = data.social_links.filter(
        (link) => link.platform?.trim() && link.url?.trim()
      );
      if (validLinks.length > 0) cleaned.social_links = validLinks;
    }

    // Idiomas
    if (data.languages && data.languages.length > 0) {
      const validLangs = data.languages.filter((l) => l?.trim());
      if (validLangs.length > 0) cleaned.languages = validLangs;
    }

    // Educación
    if (data.education && data.education.length > 0) {
      const validEdu = data.education.filter(
        (e) => e.title?.trim() && e.institution?.trim()
      );
      if (validEdu.length > 0) cleaned.education = validEdu;
    }

    // Emprendimientos / Negocios
    if (data.businesses && data.businesses.length > 0) {
      const validBiz = data.businesses.filter(
        (b) => b.name?.trim()
      );
      if (validBiz.length > 0) cleaned.businesses = validBiz.map(b => ({
        name: b.name.trim(),
        description: b.description?.trim() || '',
        url: b.url?.trim() || ''
      }));
    }

    return cleaned;
  },

  /**
   * Ejecuta la transacción de activación atómica de la tarjeta.
   */
  async activateCard({
    token,
    slug,
    themePalette,
    profileData,
  }: ActivationParams): Promise<ActivationResult> {
    try {
      // 1. Obtener usuario autenticado
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        return { success: false, error: 'Debes iniciar sesión para activar tu tarjeta.' };
      }
      const user = userData.user;

      // Asegurar registro del usuario
      await userService.ensureUserRecord(user.id);

      // 2. Verificar que la tarjeta existe y está inactiva
      const { card, error: cardError } = await this.getCardStatus(token);
      if (cardError || !card) {
        return { success: false, error: 'La tarjeta especificada no fue encontrada.' };
      }
      if (card.status === 'active') {
        return { success: false, error: 'Esta tarjeta ya ha sido activada previamente.' };
      }
      if (card.status === 'blocked') {
        return { success: false, error: 'Esta tarjeta se encuentra bloqueada o suspendida.' };
      }

      // 3. Verificar disponibilidad del slug
      const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
      const isAvailable = await this.isSlugAvailable(formattedSlug);
      if (!isAvailable) {
        return {
          success: false,
          error: `El enlace personalizado "sif.link/p/${formattedSlug}" ya está en uso. Por favor elige otro.`,
        };
      }

      // 4. Calcular timestamps
      const now = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(now.getFullYear() + 1);

      // 5. Paso A: Crear registro en profiles
      const cleanedData = this.cleanProfileData(profileData);
      const { data: profileRow, error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          slug: formattedSlug,
          template_type: 'standard_bcard',
          theme_palette: themePalette,
          subscription_status: 'active',
          expires_at: oneYearLater.toISOString(),
          data: cleanedData,
        })
        .select('id')
        .single();

      if (createProfileError || !profileRow) {
        throw new Error(
          createProfileError?.message || 'Error al guardar la información del perfil.'
        );
      }

      // 6. Paso B: Actualizar estado de la tarjeta en cards
      const { error: updateCardError } = await supabase
        .from('cards')
        .update({
          status: 'active',
          user_id: user.id,
          profile_id: profileRow.id,
        })
        .eq('token', token);

      if (updateCardError) {
        throw new Error(`Perfil creado pero falló la vinculación con la tarjeta: ${updateCardError.message}`);
      }

      return {
        success: true,
        profileId: profileRow.id,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error inesperado durante la activación.',
      };
    }
  },
};
