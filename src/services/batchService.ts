// src/services/batchService.ts
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
  unclaimed_count?: number;
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
    const { data: batches, error } = await supabase
      .from('batches')
      .select('*, cards:cards(status)')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al consultar lotes: ${error.message}`);
    }

    return (batches || []).map((b: any) => {
      const cardsList = b.cards || [];
      const total = cardsList.length;
      const active = cardsList.filter((c: any) => c.status === 'active').length;
      const unclaimed = cardsList.filter((c: any) => c.status === 'unclaimed').length;

      return {
        ...b,
        cards_count: total,
        active_count: active,
        unclaimed_count: unclaimed,
      };
    });
  },

  /**
   * Obtiene las tarjetas de un lote específico (para vista de detalle o exportar CSV)
   */
  async getCardsByBatchId(batchId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*, profile:profiles(slug)')
      .eq('batch_id', batchId)
      .order('serial_number', { ascending: true });

    if (error) {
      throw new Error(`Error al cargar tarjetas del lote: ${error.message}`);
    }

    return data as Card[];
  },
};