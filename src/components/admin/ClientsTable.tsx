import { useMemo } from 'react';
import { DataTable, type ColumnDef } from '../ui/data-table/DataTable';
import type { AdminUserListItem } from '../../services/userService';
import { Badge } from '../ui/Badge';
import { User, CreditCard } from 'lucide-react';

interface ClientsTableProps {
  users: AdminUserListItem[];
  onViewDetails?: (user: AdminUserListItem) => void;
}

export function ClientsTable({ users, onViewDetails }: ClientsTableProps) {
  const columns = useMemo<ColumnDef<AdminUserListItem>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Usuario / Cuenta',
        cell: ({ row }) => {
          const { email, display_name, role } = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sif-text">{display_name || 'Sin nombre'}</span>
              <span className="text-xs text-sif-muted">{email}</span>
              <div className="flex items-center gap-1.5 mt-1">
                {role === 'superadmin' && (
                  <Badge variant="gold">Superadmin</Badge>
                )}
                {role === 'org_admin' && (
                  <Badge variant="default">Admin Org</Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Registro',
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
        accessorKey: 'profiles_count',
        header: 'Perfiles',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5 text-sif-text font-medium">
            <User className="h-3 w-3 text-sif-muted" />
            {(getValue() as number) || 0}
          </div>
        ),
      },
      {
        accessorKey: 'cards_count',
        header: 'Tarjetas NFC',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5 text-sif-text font-medium">
            <CreditCard className="h-3 w-3 text-sif-muted" />
            {(getValue() as number) || 0}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={() => onViewDetails?.(row.original)}
            className="text-xs font-semibold text-sif-gold hover:underline transition-all"
          >
            Ver detalles
          </button>
        ),
      },
    ],
    [onViewDetails]
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      searchPlaceholder="Buscar por email..."
    />
  );
}
