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
};
