import { useState, useMemo } from 'react';
import { DataTable, type ColumnDef } from '../ui/data-table/DataTable';
import { Copy, CheckCheck, Link2, ShieldOff } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Card, CardStatus } from '../../types/database';
import { getCardFullUrl } from '../../utils/cardUtils';

interface CardsTableProps {
  cards: Card[];
}

type CardStatusFilter = 'all' | CardStatus;

const STATUS_FILTER_OPTIONS: { value: CardStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'unclaimed', label: 'Vírgenes' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inactivas' },
];

const STATUS_BADGE_MAP: Record<CardStatus, 'unclaimed' | 'active' | 'inactive'> = {
  unclaimed: 'unclaimed',
  active: 'active',
  inactive: 'inactive',
};

const STATUS_LABEL: Record<CardStatus, string> = {
  unclaimed: 'Virgen',
  active: 'Activa',
  inactive: 'Inactiva',
};

/** Hook para copiar al portapapeles con feedback visual */
function useCopy() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };
  return { copiedId, copy };
}

export function CardsTable({ cards }: CardsTableProps) {
  const [statusFilter, setStatusFilter] = useState<CardStatusFilter>('all');
  const { copiedId, copy } = useCopy();

  /* Filtro de estado aplicado antes de pasarle a DataTable */
  const filteredCards = useMemo(
    () => (statusFilter === 'all' ? cards : cards.filter((c) => c.status === statusFilter)),
    [cards, statusFilter]
  );

  /* Dropdown de filtro de estado */
  const filterComponent = (
    <select
      id="card-status-filter"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value as CardStatusFilter)}
      className="rounded-xl border border-sif-border bg-sif-surface-subtle py-2 pl-3 pr-8 text-xs text-sif-text focus:border-sif-gold/50 focus:outline-none focus:ring-1 focus:ring-sif-gold/30 transition-colors cursor-pointer"
    >
      {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  );

  const columns = useMemo<ColumnDef<Card, unknown>[]>(
    () => [
      {
        accessorKey: 'serial_number',
        header: 'Serie',
        cell: ({ getValue }) => (
          <span className="font-mono text-[11px] font-bold tracking-wider text-sif-text">
            {(getValue() as string) ?? '—'}
          </span>
        ),
      },
      {
        id: 'relative_path',
        header: 'Ruta NFC',
        cell: ({ row }) => {
          const card = row.original;
          const fullUrl = getCardFullUrl(card.relative_path, card.token);
          const display = card.relative_path ?? `/t/${card.token}`;
          const copyKey = `path-${card.id}`;
          const copied = copiedId === copyKey;
          return (
            <div className="flex items-center gap-2">
              <span className="max-w-[160px] truncate font-mono text-[10px] text-sif-muted">
                {display}
              </span>
              <button
                id={`copy-path-${card.id}`}
                onClick={() => copy(fullUrl, copyKey)}
                title={copied ? '¡Copiado!' : 'Copiar URL completa'}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-sif-muted transition-colors hover:text-sif-gold"
              >
                {copied
                  ? <CheckCheck className="h-3 w-3 text-sif-gold" />
                  : <Copy className="h-3 w-3" />
                }
              </button>
            </div>
          );
        },
      },
      {
        id: 'batch_name',
        header: 'Lote',
        accessorFn: (row) => row.batch?.name ?? '—',
        cell: ({ getValue }) => (
          <span className="text-sif-muted">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const status = getValue() as CardStatus;
          return (
            <Badge variant={STATUS_BADGE_MAP[status]}>
              {STATUS_LABEL[status]}
            </Badge>
          );
        },
      },
      {
        id: 'profile',
        header: 'Titular / Perfil',
        accessorFn: (row) => row.profile?.slug ?? null,
        cell: ({ getValue }) => {
          const slug = getValue() as string | null;
          return slug ? (
            <span className="font-mono text-[11px] font-semibold text-sif-text">
              @{slug}
            </span>
          ) : (
            <span className="text-sif-muted italic">Sin asignar</span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => {
          const card = row.original;
          const fullUrl = getCardFullUrl(card.relative_path, card.token);
          const copyKey = `link-${card.id}`;
          const copied = copiedId === copyKey;
          return (
            <div className="flex items-center gap-1.5">
              {/* Copiar enlace de activación */}
              <button
                id={`copy-link-${card.id}`}
                onClick={() => copy(fullUrl, copyKey)}
                title={copied ? '¡Enlace copiado!' : 'Copiar enlace de activación'}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-sif-border bg-sif-surface-subtle text-sif-muted transition-all hover:border-sif-gold/40 hover:text-sif-gold"
              >
                {copied
                  ? <CheckCheck className="h-3 w-3 text-sif-gold" />
                  : <Link2 className="h-3 w-3" />
                }
              </button>

              {/* Bloquear/desactivar */}
              {card.status === 'active' && (
                <button
                  id={`block-card-${card.id}`}
                  title="Bloquear / Desactivar tarjeta"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-sif-border bg-sif-surface-subtle text-sif-muted transition-all hover:border-red-500/30 hover:text-red-400"
                >
                  <ShieldOff className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [copiedId, copy]
  );

  return (
    <DataTable
      columns={columns}
      data={filteredCards}
      searchPlaceholder="Buscar por serie, ruta, titular..."
      filterComponent={filterComponent}
    />
  );
}
