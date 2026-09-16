import { useState, useMemo } from 'react';
import { DataTable, type ColumnDef } from '../ui/data-table/DataTable';
import { Copy, CheckCheck, Link2, ShieldOff, ExternalLink, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import type { Card, CardStatus } from '../../types/database';
import { getCardFullUrl } from '../../utils/cardUtils';

interface CardsTableProps {
  cards: Card[];
}

type CardStatusFilter = 'all' | CardStatus;

const STATUS_FILTER_OPTIONS: { value: CardStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'inactive', label: 'Inactivas' },
  { value: 'active', label: 'Activas' },
  { value: 'blocked', label: 'Bloqueadas' },
];

const STATUS_BADGE_MAP: Record<CardStatus, 'inactive' | 'active' | 'blocked'> = {
  inactive: 'inactive',
  active: 'active',
  blocked: 'blocked',
};

const STATUS_LABEL: Record<CardStatus, string> = {
  inactive: 'Inactiva',
  active: 'Activa',
  blocked: 'Bloqueada',
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
  const navigate = useNavigate();

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

  const columns = useMemo<ColumnDef<Card>[]>(
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
        cell: ({ row, getValue }) => {
          const slug = getValue() as string | null;
          const card = row.original;
          const targetUrl = slug ? `/p/${slug}/${card.token}` : (card.relative_path ?? `/t/${card.token}`);
          return slug ? (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Abrir perfil de @${slug}`}
              className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-sif-text hover:text-sif-gold hover:underline transition-colors"
            >
              @{slug}
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
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
          const profileUrl = card.profile?.slug ? `/p/${card.profile.slug}/${card.token}` : (card.relative_path ?? `/t/${card.token}`);
          const copyKey = `link-${card.id}`;
          const copied = copiedId === copyKey;
          return (
            <div className="flex items-center gap-1.5">
              {/* Redirigirse al perfil / abrir enlace */}
              <a
                id={`view-profile-${card.id}`}
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={card.profile?.slug ? `Ver perfil (@${card.profile.slug})` : 'Abrir enlace de la tarjeta'}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-sif-border bg-sif-surface-subtle text-sif-muted transition-all hover:border-sif-gold/40 hover:text-sif-gold"
              >
                <ExternalLink className="h-3 w-3" />
              </a>

              {/* Editar Perfil */}
              {card.profile_id && (
                <button
                  id={`edit-profile-${card.id}`}
                  onClick={() => navigate('/admin/profile', { state: { batchId: card.batch_id, profileId: card.profile_id } })}
                  title="Editar perfil en administrador"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-sif-border bg-sif-surface-subtle text-sif-muted transition-all hover:border-sif-gold/40 hover:text-sif-gold"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}

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
