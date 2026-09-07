import { supabase } from '../lib/supabase';
import type { Batch, Card } from '../types/database';

export interface CreateBatchDTO {
  name: string;
  card_type: string;
  quantity: number;
  notes?: string;
  url_prefix?: string;
  org_id?: string;
}

export interface BatchSummary extends Batch {
  cards_count?: number;
  active_count?: number;
  inactive_count?: number;
}

export const batchService = {
  /**
   * Llama a la función RPC transaccional para crear el lote y generar sus tarjetas
   */
  async createBatch(dto: CreateBatchDTO) {
    const { data, error } = await supabase.rpc('create_batch_with_cards', {
      p_name: dto.name,
      p_card_type: dto.card_type,
      p_quantity: dto.quantity,
      p_notes: dto.notes || null,
      p_url_prefix: dto.url_prefix ? dto.url_prefix.trim() : null,
      p_org_id: dto.org_id || null,
    });

    if (error) {
      throw new Error(`Error al generar lote: ${error.message}`);
    }

    return data as { success: boolean; batch_id: string; quantity: number; prefix: string | null };
  },

  /**
   * Obtiene todos los lotes con sus contadores de tarjetas
   */
  async getAllBatches(): Promise<BatchSummary[]> {
    // Usamos cards!cards_batch_id_fkey si hay ambigüedad de FK, o cards(status) estándar
    const { data: batches, error } = await supabase
      .from('batches')
      .select('*, cards(status)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al consultar lotes:', error);
      throw new Error(`Error al consultar lotes: ${error.message}`);
    }

    if (!batches || batches.length === 0) {
      return [];
    }

    return batches.map((b: any) => {
      const cardsList = Array.isArray(b.cards) ? b.cards : [];
      const total = cardsList.length;
      const active = cardsList.filter((c: any) => c.status === 'active').length;
      const inactive = cardsList.filter((c: any) => c.status === 'inactive').length;

      return {
        ...b,
        cards_count: total > 0 ? total : (b.total_quantity || 0),
        active_count: active,
        inactive_count: inactive,
      };
    });
  },

  /**
   * Obtiene las tarjetas de un lote específico
   */
  async getCardsByBatchId(batchId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*, profiles(slug), batch:batches(name, card_type)')
      .eq('batch_id', batchId)
      .order('serial_number', { ascending: true });

    if (error) {
      console.error('Error al cargar tarjetas:', error);
      throw new Error(`Error al cargar tarjetas del lote: ${error.message}`);
    }

    return (data || []) as Card[];
  },

  /**
   * Obtiene el inventario global de todas las tarjetas
   */
  async getAllCards(): Promise<Card[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*, profiles(slug), batch:batches(name, card_type)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar inventario general:', error);
      throw new Error(`Error al cargar inventario general: ${error.message}`);
    }

    return (data || []) as Card[];
  }
};