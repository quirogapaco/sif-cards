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
   * Obtiene la lista simplificada de perfiles para un usuario específico (para el select).
   */
  async getUserProfileOptions(userId: string): Promise<{ id: string; display_name: string }[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name:data->>display_name')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any[]) || [];
    } catch (err: unknown) {
      console.error('Error al obtener opciones de perfil:', err);
      return [];
    }
  },

  /**
   * Obtiene la lista simplificada de perfiles vinculados a las tarjetas de un lote (org_admin).
   */
  async getBatchProfileOptions(batchId: string): Promise<{ id: string; display_name: string }[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          profiles!inner(
            id,
            display_name:data->>display_name
          )
        `)
        .eq('batch_id', batchId)
        .not('profile_id', 'is', null);

      if (error) throw error;
      
      // La respuesta viene anidada: [{ profiles: { id, display_name } }]
      return (data as any[]).map((row) => row.profiles).filter(Boolean);
    } catch (err: unknown) {
      console.error('Error al obtener opciones de perfil del lote:', err);
      return [];
    }
  },

  /**
   * Obtiene el perfil completo por su ID.
   */
  async getProfileById(profileId: string): Promise<{ profile: Profile | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      return { profile: data as Profile };
    } catch (err: unknown) {
      return {
        profile: null,
        error: err instanceof Error ? err.message : 'Error al obtener el perfil.',
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
        emails: d.direct_contacts?.emails?.length ? d.direct_contacts.emails : (d.direct_contacts?.email ? [d.direct_contacts.email] : ['']),
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
   * También elimina las imágenes previas si se proporcionan en oldData.
   */
  async processProfileImages(
    formData: ProfileFormData,
    identifierPrefix: string,
    oldData?: { avatar_url?: string; banner_url?: string }
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

          // Eliminar la imagen anterior si existe
          if (oldData?.avatar_url && oldData.avatar_url.includes(`/${avatarBucket}/`)) {
            try {
              const urlObj = new URL(oldData.avatar_url);
              const pathParts = urlObj.pathname.split(`/${avatarBucket}/`);
              if (pathParts.length > 1) {
                await storageService.removeImage(avatarBucket, pathParts[1]);
              }
            } catch (e) {
              console.error('Error al eliminar avatar antiguo:', e);
            }
          }
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

          // Eliminar la imagen anterior si existe
          if (oldData?.banner_url && oldData.banner_url.includes(`/${bannerBucket}/`)) {
            try {
              const urlObj = new URL(oldData.banner_url);
              const pathParts = urlObj.pathname.split(`/${bannerBucket}/`);
              if (pathParts.length > 1) {
                await storageService.removeImage(bannerBucket, pathParts[1]);
              }
            } catch (e) {
              console.error('Error al eliminar banner antiguo:', e);
            }
          }
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
