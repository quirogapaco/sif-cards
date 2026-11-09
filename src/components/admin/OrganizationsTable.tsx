import { useMemo } from 'react';
import { DataTable, type ColumnDef } from '../ui/data-table/DataTable';
import type { Organization } from '../../types/database';
import { Building2, Settings } from 'lucide-react';

interface OrganizationsTableProps {
  organizations: Organization[];
  onViewDetails?: (org: Organization) => void;
}

export function OrganizationsTable({ organizations, onViewDetails }: OrganizationsTableProps) {
  const columns = useMemo<ColumnDef<Organization>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Organización',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.logo_url ? (
              <img
                src={row.original.logo_url}
                alt={row.original.name}
                className="h-8 w-8 rounded-lg object-cover border border-sif-border"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sif-surface-subtle border border-sif-border">
                <Building2 className="h-4 w-4 text-sif-muted" />
              </div>
            )}
            <span className="font-semibold text-sif-text">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha de Creación',
        cell: ({ getValue }) => {
          const dateStr = getValue() as string;
          return (
            <span className="text-sm text-sif-muted">
              {new Date(dateStr).toLocaleDateString('es-EC', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Gestión',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={() => onViewDetails?.(row.original)}
            className="flex items-center gap-2 rounded-lg border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-xs font-semibold text-sif-text transition-all hover:border-sif-gold/40 hover:text-sif-gold"
          >
            <Settings className="h-3.5 w-3.5" />
            Configurar
          </button>
        ),
      },
    ],
    [onViewDetails]
  );

  return (
    <DataTable
      columns={columns}
      data={organizations}
      searchPlaceholder="Buscar por nombre..."
    />
  );
}
