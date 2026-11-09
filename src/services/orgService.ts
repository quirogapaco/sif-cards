import { supabase } from '../lib/supabase';
import type { Organization } from '../types/database';

export const orgService = {
  /**
   * Obtiene la lista de todas las organizaciones.
   */
  async getAllOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener organizaciones:', error.message);
      throw new Error(error.message);
    }
    return data || [];
  },

  /**
   * Crea una nueva organización.
   */
  async createOrganization(name: string, logoUrl: string | null = null, settings: Record<string, unknown> = {}): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert([
        {
          name,
          logo_url: logoUrl,
          settings,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al crear organización:', error.message);
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * Actualiza una organización existente.
   */
  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar organización:', error.message);
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * Obtiene métricas adicionales como el número de tarjetas activas/totales y dominios asociados.
   * Por ahora retorna datos simplificados o puede llamar a un RPC si se requiere más adelante.
   */
  async getOrganizationMetrics() {
    // Placeholder para lógicas más complejas de reportes
    return {};
  }
};
