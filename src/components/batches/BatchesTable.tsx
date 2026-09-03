import { useState, useMemo, useCallback } from 'react';
import { DataTable, type ColumnDef } from '../ui/data-table/DataTable';
import { Badge } from '../ui/Badge';
import type { BatchSummary } from '../../services/batchService';
import { batchService } from '../../services/batchService';
import { exportBatchToCsv } from '../../utils/exportCsv';
import { Download, Filter } from 'lucide-react';

interface BatchesTableProps {
  batches: BatchSummary[];
  onFilterByBatch?: (batchId: string, batchName: string) => void;
}

/** Mapeo descriptivo de acabados físicos */
const CARD_TYPE_LABELS: Record<string, string> = {
  'matte-black-gold': 'Negro Mate · Foil Oro',
  'matte-black-silver': 'Negro Mate · Foil Plata',
  'matte-white-gold': 'Blanco Marfil · Foil Oro',
  'matte-white-silver': 'Blanco Marfil · Foil Plata',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function BatchesTable({ batches, onFilterByBatch }: BatchesTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadCsv = useCallback(async (batch: BatchSummary) => {
    try {
      setDownloadingId(batch.id);
      const cards = await batchService.getCardsByBatchId(batch.id);
      exportBatchToCsv(batch.name, batch.card_type, cards);
    } catch (err) {
      console.error('Error al exportar CSV:', err);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const columns = useMemo<ColumnDef<BatchSummary, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Referencia / Lote',
        cell: ({ row }) => {
          const batch = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-sif-text">{batch.name}</span>
              {batch.url_prefix && (
                <span className="text-[10px] font-mono text-sif-muted">
                  /{batch.url_prefix}/*
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'card_type',
        header: 'Acabado',
        cell: ({ getValue }) => {
          const type = getValue() as string;
          const label = CARD_TYPE_LABELS[type] ?? type;
          const isGold = type.includes('gold');
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                isGold
                  ? 'border-sif-gold/30 bg-sif-gold/8 text-sif-gold'
                  : 'border-sif-border bg-sif-surface-subtle text-sif-silver'
              }`}
            >
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: 'cards_count',
        header: 'Tarjetas',
        cell: ({ getValue }) => (
          <span className="font-bold tabular-nums text-sif-text">
            {(getValue() as number) ?? 0}
          </span>
        ),
      },
      {
        id: 'activation',
        header: 'Activación',
        cell: ({ row }) => {
          const { cards_count = 0, active_count = 0 } = row.original;
          const pct = cards_count > 0 ? Math.round((active_count / cards_count) * 100) : 0;
          return (
            <div className="flex min-w-[110px] flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-sif-muted">{active_count}/{cards_count}</span>
                <span className="font-semibold text-sif-gold">{pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-sif-surface-subtle">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: pct > 0
                      ? 'linear-gradient(90deg, var(--sif-gold), var(--sif-silver))'
                      : 'transparent',
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha',
        cell: ({ getValue }) => (
          <span className="text-sif-muted">{formatDate(getValue() as string)}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => {
          const batch = row.original;
          const isLoading = downloadingId === batch.id;
          return (
            <div className="flex items-center gap-1.5">
              {/* Descargar CSV */}
              <button
                id={`batch-download-${batch.id}`}
                onClick={() => handleDownloadCsv(batch)}
                disabled={isLoading}
                title="Descargar CSV para fabricante"
                className="flex h-7 items-center gap-1.5 rounded-lg border border-sif-border bg-sif-surface-subtle px-2.5 text-[10px] font-semibold text-sif-muted transition-all hover:border-sif-gold/40 hover:text-sif-gold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-3 w-3" />
                {isLoading ? 'Exportando...' : 'CSV'}
              </button>

              {/* Ver tarjetas de este lote */}
              {onFilterByBatch && (
                <button
                  id={`batch-filter-${batch.id}`}
                  onClick={() => onFilterByBatch(batch.id, batch.name)}
                  title="Ver tarjetas de este lote"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-sif-border bg-sif-surface-subtle text-sif-muted transition-all hover:border-sif-gold/40 hover:text-sif-text"
                >
                  <Filter className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [downloadingId, handleDownloadCsv, onFilterByBatch]
  );

  return (
    <DataTable
      columns={columns}
      data={batches}
      searchPlaceholder="Buscar lote..."
    />
  );
}
