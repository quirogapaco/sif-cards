import { supabase } from '../lib/supabase';

export const storageService = {
  /**
   * Sube una imagen al storage de Supabase y retorna la URL pública.
   */
  async uploadProfileImage(bucketName: string, path: string, file: File): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading image to ${bucketName}:`, error.message);
        return null;
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Unexpected error during image upload:', err);
      return null;
    }
  },
};
