import { supabase } from '../lib/supabase';
import type { UserRole } from '../types/database';

export interface TeamMemberProfile {
  id: string;
  slug: string;
  display_name: string;
}

export interface TeamMember {
  id: string;
  role: UserRole;
  org_id?: string | null;
  profiles: TeamMemberProfile[];
}

export interface AdminUserListItem {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  org_id: string | null;
  created_at: string;
  profiles_count: number;
  cards_count: number;
}

export interface OrgAdminListItem {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  org_id: string | null;
  created_at: string;
}

export const userService = {
  /**
   * Llama a la RPC para obtener la lista de usuarios (solo superadmin).
   */
  async getAdminUsersList(): Promise<AdminUserListItem[]> {
    try {
      const { data, error } = await supabase.rpc('get_admin_users_list');
      
      if (error) {
        console.error('Error fetching admin users list:', error.message);
        throw new Error(error.message);
      }
      return data || [];
    } catch (err) {
      console.error('Exception fetching admin users list:', err);
      return [];
    }
  },

  /**
   * Llama a la RPC para obtener los administradores de una organización específica.
   */
  async getOrgAdminsList(orgId: string): Promise<OrgAdminListItem[]> {
    try {
      const { data, error } = await supabase.rpc('get_org_admins', { p_org_id: orgId });
      
      if (error) {
        console.error('Error fetching org admins:', error.message);
        throw new Error(error.message);
      }
      return data || [];
    } catch (err) {
      console.error('Exception fetching org admins:', err);
      return [];
    }
  },
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

  /**
   * Obtiene todos los colaboradores de una organización junto con sus perfiles asignados.
   * Utilizado en la vista de edición de perfiles para administradores corporativos (org_admin).
   */
  async getOrganizationTeam(orgId: string): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          role,
          org_id,
          profiles (
            id,
            slug,
            data
          )
        `)
        .eq('org_id', orgId);

      if (error) {
        console.error('Error al obtener el equipo de la organización:', error.message);
        throw new Error(error.message);
      }

      return (data || []).map((u: any) => ({
        id: u.id,
        role: u.role as UserRole,
        org_id: u.org_id,
        profiles: (u.profiles || []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          display_name:
            p.data?.display_name ||
            p.data?.name ||
            (p.slug ? `@${p.slug}` : 'Perfil sin título'),
        })),
      }));
    } catch (err) {
      console.error('Excepción al obtener el equipo de la organización:', err);
      return [];
    }
  },
};