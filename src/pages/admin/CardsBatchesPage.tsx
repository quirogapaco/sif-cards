import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layers, Package2, WifiOff, Wifi, Plus, RefreshCw } from 'lucide-react';
import { MetricCard } from '../../components/ui/MetricCard';
import { BatchesTable } from '../../components/batches/BatchesTable';
import { CardsTable } from '../../components/batches/CardsTable';
import { CreateBatchModal } from '../../components/batches/CreateBatchModal';
import { batchService, type BatchSummary } from '../../services/batchService';
import type { Card } from '../../types/database';

type ActiveTab = 'batches' | 'inventory';

const TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: 'batches', label: 'Lotes de Fabricación', icon: Package2 },
  { id: 'inventory', label: 'Inventario Individual', icon: Layers },
];

export default function CardsBatchesPage() {
  /* ── Estado de datos ── */
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  /* ── Estado UI ── */
  const [activeTab, setActiveTab] = useState<ActiveTab>('batches');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState<string | null>(null); // batchId para filtrar inventario

  /* ── Carga paralela de datos ── */
  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    else setIsRefreshing(true);
    setLoadError(null);

    try {
      const batchList = await batchService.getAllBatches();
      setBatches(batchList);

      /* Carga todas las tarjetas de todos los lotes en paralelo */
      const cardPromises = batchList.map((b) =>
        batchService.getCardsByBatchId(b.id).catch(() => [] as Card[])
      );
      const cardArrays = await Promise.all(cardPromises);
      setAllCards(cardArrays.flat());
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : 'Error al cargar datos.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── KPIs derivados ── */
  const kpis = useMemo(() => {
    const total = allCards.length;
    const unclaimed = allCards.filter((c) => c.status === 'unclaimed').length;
    const active = allCards.filter((c) => c.status === 'active').length;
    const inactive = allCards.filter((c) => c.status === 'inactive').length;
    return { total, unclaimed, active, inactive };
  }, [allCards]);

  /* ── Tarjetas filtradas por lote (para sub-tab de inventario) ── */
  const displayedCards = useMemo(
    () => (batchFilter ? allCards.filter((c) => c.batch_id === batchFilter) : allCards),
    [allCards, batchFilter]
  );

  const activeBatchName = batchFilter
    ? batches.find((b) => b.id === batchFilter)?.name ?? 'Lote'
    : null;

  /* ── Handlers ── */
  const handleFilterByBatch = useCallback((batchId: string) => {
    setBatchFilter(batchId);
    setActiveTab('inventory');
  }, []);

  const handleClearBatchFilter = useCallback(() => setBatchFilter(null), []);

  const handleCreateSuccess = useCallback(() => {
    loadData(false);
  }, [loadData]);

  /* ── Estado de carga inicial ── */
  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-12 text-center">
        <RefreshCw
          className="h-8 w-8 animate-spin"
          style={{ color: 'var(--sif-gold)' }}
        />
        <p className="text-sm font-semibold text-sif-text">Cargando inventario...</p>
        <p className="text-xs text-sif-muted">Consultando lotes y tarjetas NFC</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Encabezado de página ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-sif-text">Lotes &amp; Tarjetas NFC</h1>
          <p className="mt-0.5 text-sm text-sif-muted">
            Gestión de inventario físico, lotes de producción y números de serie
          </p>
        </div>

        {/* Acciones superiores */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Refresh */}
          <button
            id="refresh-batches"
            onClick={() => loadData(false)}
            disabled={isRefreshing}
            aria-label="Recargar datos"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-border bg-sif-surface text-sif-muted transition-all hover:border-sif-gold/30 hover:text-sif-text disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* CTA principal: Crear nuevo lote */}
          <button
            id="open-create-batch"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-sif-gold/40 px-4 py-2.5 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background:
                'linear-gradient(135deg, var(--sif-gold), color-mix(in srgb, var(--sif-gold) 65%, var(--sif-silver)))',
              color: '#000',
              boxShadow: '0 2px 12px rgba(212,175,55,0.25)',
            }}
          >
            <Plus className="h-4 w-4" />
            Crear Nuevo Lote
          </button>
        </div>
      </div>

      {/* ── Error de carga ── */}
      {loadError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/25 bg-red-500/8 px-5 py-4 text-sm text-red-400">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>{loadError}</span>
          <button
            onClick={() => loadData()}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Barra de KPIs ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          title="Total Fabricadas"
          value={kpis.total.toLocaleString('es-EC')}
          icon={Layers}
          trend={`${batches.length} lote${batches.length !== 1 ? 's' : ''}`}
          accent="default"
        />
        <MetricCard
          title="Vírgenes en Bodega"
          value={kpis.unclaimed.toLocaleString('es-EC')}
          icon={Package2}
          trend={kpis.total > 0 ? `${Math.round((kpis.unclaimed / kpis.total) * 100)}% del stock` : '—'}
          accent="silver"
        />
        <MetricCard
          title="Activas en la Calle"
          value={kpis.active.toLocaleString('es-EC')}
          icon={Wifi}
          trend={kpis.total > 0 ? `${Math.round((kpis.active / kpis.total) * 100)}% activadas` : '—'}
          accent="gold"
        />
        <MetricCard
          title="Inactivas / Bloqueadas"
          value={kpis.inactive.toLocaleString('es-EC')}
          icon={WifiOff}
          trend={kpis.inactive > 0 ? 'Requieren revisión' : 'Sin bloqueos'}
          accent="default"
        />
      </div>

      {/* ── Panel principal con sub-tabs ── */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface shadow-sm">
        {/* Cabecera del panel: pestañas */}
        <div className="flex items-center gap-0 border-b border-sif-border px-2 pt-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-sif-surface-subtle text-sif-text'
                    : 'text-sif-muted hover:text-sif-text'
                }`}
                style={
                  isActive
                    ? { boxShadow: 'inset 0 -2px 0 var(--sif-gold)' }
                    : {}
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {/* Contador de filas */}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    isActive
                      ? 'bg-sif-gold/15 text-sif-gold'
                      : 'bg-sif-surface-subtle text-sif-muted'
                  }`}
                >
                  {id === 'batches' ? batches.length : allCards.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="p-5">
          {activeTab === 'batches' && (
            <BatchesTable
              batches={batches}
              onFilterByBatch={handleFilterByBatch}
            />
          )}

          {activeTab === 'inventory' && (
            <div className="flex flex-col gap-4">
              {/* Banner de filtro activo por lote */}
              {activeBatchName && (
                <div className="flex items-center justify-between rounded-xl border border-sif-gold/25 bg-sif-gold/8 px-4 py-2.5 text-xs">
                  <span className="text-sif-text">
                    Filtrando por lote:{' '}
                    <strong style={{ color: 'var(--sif-gold)' }}>{activeBatchName}</strong>
                  </span>
                  <button
                    onClick={handleClearBatchFilter}
                    className="text-sif-muted underline hover:text-sif-text"
                  >
                    Ver todo el inventario
                  </button>
                </div>
              )}
              <CardsTable cards={displayedCards} />
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de creación de lote ── */}
      <CreateBatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
