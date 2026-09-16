import { supabase } from '../lib/supabase';
import type { UserRole } from '../types/database';

export const userService = {
  /**
   * Asegura que exista el registro del usuario en la tabla pública 'users'.
   * Si el usuario ya está registrado, no sobrescribe sus datos ni su rol.
   */
  async ensureUserRecord(userId: string, defaultRole: UserRole = 'user'): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .upsert(
          {
            id: userId,
            role: defaultRole,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );

      if (error) {
        console.error('Error al asegurar el registro en la tabla users:', error.message);
      }
    } catch (err) {
      console.error('Excepción al crear el registro en la tabla users:', err);
    }
  },

  /**
   * Obtiene el rol del usuario desde la tabla pública 'users'.
   */
  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error al obtener el rol del usuario:', error.message);
        return null;
      }
      return data?.role as UserRole;
    } catch (err) {
      console.error('Excepción al obtener el rol del usuario:', err);
      return null;
    }
  },

  /**
   * Obtiene el registro completo del usuario desde la tabla pública 'users'.
   */
  async getUserRecord(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error al obtener el usuario:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Excepción al obtener el usuario:', err);
      return null;
    }
  },
};
