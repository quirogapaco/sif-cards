import type { DashboardMetrics } from '../../types/dashboard';
import KpiGrid from '../../components/dashboard/KpiGrid';
import TrafficChart from '../../components/dashboard/TrafficChart';
import SocialDistribution from '../../components/dashboard/SocialDistribution';
import DirectLinks from '../../components/dashboard/DirectLinks';
import DeviceStats from '../../components/dashboard/DeviceStats';
import ConversionFunnel from '../../components/dashboard/ConversionFunnel';
import TopBarFilters, { type DashboardFilters } from '../../components/dashboard/TopBarFilters';
import { useState, useCallback } from 'react';
const mockDashboardData: DashboardMetrics = {
  overview: {
    totalViews: 125430,
    viewsGrowth: 12.5,
    totalTaps: 45200,
    tapsGrowth: 8.2,
    contactsSaved: 8900,
    contactsGrowth: 15.3,
    ctr: 24.5,
    ctrGrowth: 2.1,
  },
  timeSeries: [
    { date: '2023-10-01', views: 1000, taps: 300 },
    { date: '2023-10-02', views: 1200, taps: 400 },
  ],
  socialDistribution: [
  { platform: 'Instagram', clicks: 5000, percentage: 40, color: '#E1306C' },
  { platform: 'WhatsApp', clicks: 4000, percentage: 32, color: '#25D366' },
  { platform: 'LinkedIn', clicks: 2500, percentage: 20, color: '#0077B5' },
  { platform: 'Web', clicks: 1000, percentage: 8, color: 'var(--sif-gold)' },
  ],
  directLinks: [
    { type: 'WhatsApp', clicks: 8420, percentage: 52 },
    { type: 'Email', clicks: 4150, percentage: 25 },
    { type: 'Teléfono', clicks: 2340, percentage: 14 },
    { type: 'Ubicación', clicks: 1490, percentage: 9 },
  ],
  devices: {
    ios: { percentage: 65, count: 81500 },
    android: { percentage: 35, count: 43930 },
  },
  funnel: {
    views: 125430,
    interactions: 68900,
    saves: 8900,
  },
  peakHour: '14:00',
};

export default function GlobalDashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters | null>(null);

  const handleFilterChange = useCallback((newFilters: DashboardFilters) => {
    setFilters((prev) => {
      // Evitar actualizaciones de estado redundantes que causan re-renders
      if (
        prev?.dateRange === newFilters.dateRange &&
        prev?.selectedUserId === newFilters.selectedUserId &&
        prev?.selectedProfileId === newFilters.selectedProfileId
      ) {
        return prev;
      }
      
      console.log('Filtros actualizados en GlobalDashboard:', newFilters);
      return newFilters;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--sif-bg)] text-[var(--sif-text)] relative overflow-hidden">
      {/* Brillos ambientales */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--sif-gold)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[var(--sif-silver)]/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Header de la marca */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--sif-text)] to-[var(--sif-muted)]">
              SIF Cards Analytics Pro
            </h1>
            <p className="text-sm text-[var(--sif-muted)] mt-1">Métricas globales y rendimiento en tiempo real</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Aquí podría ir info del perfil */}
            <div className="w-10 h-10 rounded-full bg-[var(--sif-surface)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-gold)] font-bold shadow-sm">
              SC
            </div>
          </div>
        </header>

        {/* Top Bar Filters (Comentado / Borde punteado) */}
        <TopBarFilters onFilterChange={handleFilterChange} />

        {/* Fila 1: KPI Grid */}
        <KpiGrid data={mockDashboardData.overview} />

        {/* Fila 2: Hero Chart */}
        <TrafficChart data={mockDashboardData.timeSeries} />

        {/* Fila 3: Grid inferior de 3 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <SocialDistribution data={mockDashboardData.socialDistribution} />
          <DirectLinks data={mockDashboardData.directLinks} />
          <ConversionFunnel data={mockDashboardData.funnel} />
        </div>

      </div>
    </div>
  );
}
