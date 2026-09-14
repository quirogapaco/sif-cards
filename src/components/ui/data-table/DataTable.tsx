import { useState, useMemo, type ReactNode } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Inbox,
} from 'lucide-react';

export interface ColumnDef<TData> {
  id?: string;
  accessorKey?: keyof TData | string;
  accessorFn?: (row: TData) => unknown;
  header: ReactNode | ((props: { column?: unknown }) => ReactNode);
  cell?: (props: {
    row: { original: TData };
    getValue: () => unknown;
  }) => ReactNode;
  enableSorting?: boolean;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchPlaceholder?: string;
  filterComponent?: ReactNode;
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = 'Buscar...',
  filterComponent,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Helper para obtener el valor de una celda según accessorKey o accessorFn
  const getCellValue = (item: TData, col: ColumnDef<TData>): unknown => {
    if (col.accessorFn) return col.accessorFn(item);
    if (col.accessorKey) return (item as Record<string, unknown>)[col.accessorKey as string];
    return null;
  };

  // Identificador único de columna
  const getColId = (col: ColumnDef<TData>, idx: number): string => {
    return col.id || (col.accessorKey as string) || `col_${idx}`;
  };

  // 1. Filtrado global reactivo
  const filteredData = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const query = globalFilter.toLowerCase().trim();

    return data.filter((item) => {
      return columns.some((col) => {
        const val = getCellValue(item, col);
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, columns, globalFilter]);

  // 2. Ordenamiento reactivo
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;

    const targetCol = columns.find((col, idx) => getColId(col, idx) === sortKey);
    if (!targetCol) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = getCellValue(a, targetCol);
      const valB = getCellValue(b, targetCol);

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      const cmp = strA.localeCompare(strB);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir, columns]);

  // 3. Paginación
  const totalRows = sortedData.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(currentPage, pageCount - 1);

  const paginatedData = useMemo(() => {
    const start = safePage * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize]);

  // Toggle de orden
  const handleSortToggle = (colId: string) => {
    if (sortKey !== colId) {
      setSortKey(colId);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
    setCurrentPage(0);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Barra superior: Buscador + Filtro opcional ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Buscador global */}
        <div className="relative max-w-xs w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sif-muted" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setCurrentPage(0);
            }}
            placeholder={searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle py-2 pl-9 pr-4 text-xs text-sif-text placeholder:text-sif-muted focus:border-sif-gold/50 focus:bg-sif-surface-subtle focus:outline-none focus:ring-1 focus:ring-sif-gold/30 transition-colors"
          />
        </div>

        {/* Slot de filtro personalizado */}
        {filterComponent && <div className="shrink-0">{filterComponent}</div>}
      </div>

      {/* ── Tabla ── */}
      <div className="overflow-x-auto rounded-2xl border border-sif-border">
        <table className="w-full min-w-max text-xs">
          <thead>
            <tr className="border-b border-sif-border bg-sif-surface-subtle">
              {columns.map((col, idx) => {
                const colId = getColId(col, idx);
                const canSort = col.enableSorting !== false;
                const isSorted = sortKey === colId;

                return (
                  <th
                    key={colId}
                    onClick={canSort ? () => handleSortToggle(colId) : undefined}
                    className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-sif-muted transition-colors ${
                      canSort ? 'cursor-pointer select-none hover:text-sif-text' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {typeof col.header === 'function' ? col.header({ column: col }) : col.header}
                      {canSort && (
                        <span className="shrink-0 text-sif-border">
                          {isSorted && sortDir === 'asc' ? (
                            <ChevronUp className="h-3 w-3 text-sif-gold" />
                          ) : isSorted && sortDir === 'desc' ? (
                            <ChevronDown className="h-3 w-3 text-sif-gold" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-sif-border bg-sif-surface">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="transition-colors hover:bg-sif-surface-subtle/50"
                >
                  {columns.map((col, colIdx) => {
                    const colId = getColId(col, colIdx);
                    const val = getCellValue(item, col);

                    return (
                      <td key={colId} className="px-4 py-3 text-sif-text">
                        {col.cell
                          ? col.cell({
                              row: { original: item },
                              getValue: () => val,
                            })
                          : (val as ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              /* Estado vacío */
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-sif-muted">
                    <Inbox className="h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">Sin resultados</p>
                    <p className="text-xs opacity-70">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginador ── */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Info de filas */}
        <p className="text-[11px] text-sif-muted">
          {totalRows === 0
            ? 'Sin registros'
            : `Mostrando ${safePage * pageSize + 1}–${Math.min((safePage + 1) * pageSize, totalRows)} de ${totalRows} registros`}
        </p>

        {/* Navegación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={safePage <= 0}
            aria-label="Página anterior"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-sif-border bg-sif-surface text-sif-muted transition-all hover:border-sif-gold/40 hover:text-sif-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <span className="min-w-[80px] text-center text-[11px] font-semibold text-sif-text">
            Pág. {safePage + 1} / {pageCount}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            aria-label="Página siguiente"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-sif-border bg-sif-surface text-sif-muted transition-all hover:border-sif-gold/40 hover:text-sif-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
