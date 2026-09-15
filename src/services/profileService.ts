import { supabase } from '../lib/supabase';
import type { Profile, ProfileData } from '../types/database';
import type { ProfileFormData } from '../components/profile/ProfileForm/ProfileForm';
import { storageService } from './storageService';
import { activationService } from './activationService';

export const profileService = {
  /**
   * Obtiene todos los perfiles activos para un usuario.
   */
  async getUserProfiles(userId: string): Promise<{ profiles: Profile[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { profiles: (data as Profile[]) || [] };
    } catch (err: unknown) {
      return {
        profiles: [],
        error: err instanceof Error ? err.message : 'Error al obtener los perfiles del usuario.',
      };
    }
  },

  /**
   * Actualiza la información de un perfil existente.
   */
  async updateProfile(
    profileId: string,
    slug: string,
    themePalette: string,
    profileData: ProfileData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Validar disponibilidad del slug
      const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
      const { data: existingProfiles, error: slugError } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', formattedSlug)
        .neq('id', profileId);

      if (slugError) throw slugError;

      if (existingProfiles && existingProfiles.length > 0) {
        return {
          success: false,
          error: `El enlace personalizado "sif.link/p/${formattedSlug}" ya está en uso. Por favor elige otro.`,
        };
      }

      // 2. Limpiar datos nulos/vacíos usando el servicio de activación
      const cleanedData = activationService.cleanProfileData(profileData);

      // 3. Actualizar la tabla profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          slug: formattedSlug,
          theme_palette: themePalette,
          data: cleanedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error inesperado al actualizar el perfil.',
      };
    }
  },

  /**
   * Helper para mapear un objeto Profile desde la base de datos
   * hacia la estructura inicial que espera el ProfileForm.
   */
  mapProfileToFormData(profile: Profile): ProfileFormData {
    const d = profile.data;
    return {
      display_name: d.display_name || '',
      job_title: d.job_title || '',
      company: d.company || '',
      slug: profile.slug || '',
      avatar_url: d.avatar_url || '',
      banner_url: d.banner_url || '',
      theme_palette: profile.theme_palette || 'emerald-dark',
      direct_contacts: {
        whatsapp: d.direct_contacts?.whatsapp || '',
        email: d.direct_contacts?.email || '',
        phone: d.direct_contacts?.phone || '',
        location: d.direct_contacts?.location || '',
      },
      bio_description: d.bio_description || '',
      social_links: (d.social_links && d.social_links.length > 0)
        ? d.social_links
        : [
            { platform: 'linkedin', url: '' },
            { platform: 'instagram', url: '' },
          ],
      languages: (d.languages && d.languages.length > 0) ? d.languages : ['Español'],
      education: d.education || [],
      businesses: d.businesses || [],
    };
  },

  /**
   * Sube las imágenes de avatar y banner si están presentes en formData,
   * y retorna el objeto ProfileData final (sin los Files) y un array de 
   * rutas de archivo subidas (útil para rollback).
   */
  async processProfileImages(
    formData: ProfileFormData,
    identifierPrefix: string
  ): Promise<{
    finalProfileData: ProfileData & { slug: string; theme_palette: string };
    uploadedPaths: string[];
    error?: string;
  }> {
    let finalAvatarUrl = formData.avatar_url;
    let finalBannerUrl = formData.banner_url;
    const uploadedPaths: string[] = [];

    try {
      if (formData.avatar_file) {
        const avatarBucket = import.meta.env.VITE_SUPABASE_AVATARS_BUCKET;
        const ext = formData.avatar_file.name.split('.').pop() || 'jpg';
        const path = `avatar-${identifierPrefix}-${Date.now()}.${ext}`;
        const uploadedUrl = await storageService.uploadProfileImage(avatarBucket, path, formData.avatar_file);
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
          uploadedPaths.push(path);
        }
      }

      if (formData.banner_file) {
        const bannerBucket = import.meta.env.VITE_SUPABASE_BANNERS_BUCKET;
        const ext = formData.banner_file.name.split('.').pop() || 'jpg';
        const path = `banner-${identifierPrefix}-${Date.now()}.${ext}`;
        const uploadedUrl = await storageService.uploadProfileImage(bannerBucket, path, formData.banner_file);
        if (uploadedUrl) {
          finalBannerUrl = uploadedUrl;
          uploadedPaths.push(path);
        }
      }

      const finalProfileData = {
        ...formData,
        avatar_url: finalAvatarUrl,
        banner_url: finalBannerUrl,
      };
      
      // Eliminar referencias locales de archivos para guardar en la BD limpiamente
      delete finalProfileData.avatar_file;
      delete finalProfileData.banner_file;

      return { finalProfileData, uploadedPaths };
    } catch (err: unknown) {
      return {
        finalProfileData: formData as any,
        uploadedPaths,
        error: err instanceof Error ? err.message : 'Error al subir las imágenes.',
      };
    }
  },
};
