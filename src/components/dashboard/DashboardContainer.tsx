import { useState, useCallback } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import TopBarFilters, { type DashboardFilters } from './TopBarFilters';
import KpiGrid from './KpiGrid';
import TrafficChart from './TrafficChart';
import SocialDistribution from './SocialDistribution';
import DirectLinks from './DirectLinks';
import ConversionFunnel from './ConversionFunnel';
import { Loader2 } from 'lucide-react';

interface DashboardContainerProps {
  targetUserId: string;
}

export default function DashboardContainer({ targetUserId }: DashboardContainerProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [days, setDays] = useState<number>(30);

  const { data, isLoading, error, refetch } = useDashboardData({ targetUserId, profileId: selectedProfileId, days });

  const handleFilterChange = useCallback((filters: DashboardFilters) => {
    setSelectedProfileId(filters.selectedProfileId === 'all' ? null : filters.selectedProfileId);
    switch (filters.dateRange) {
      case 'Hoy': setDays(1); break;
      case '7D': setDays(7); break;
      case '30D': setDays(30); break;
      case '1Y': setDays(365); break;
    }
  }, []);

  const handleExport = useCallback(() => {
    if (!data) return;
    
    const lines = ['Métrica,Valor'];
    lines.push(`Vistas Web,${data.kpis.web_views}`);
    lines.push(`Taps NFC,${data.kpis.nfc_taps}`);
    lines.push(`Contactos Guardados,${data.kpis.contacts_saved}`);
    lines.push(`Visitantes Únicos,${data.funnel.unique_visitors || 0}`);
    lines.push(`Interacciones,${data.funnel.interactions}`);
    lines.push(`Leads,${data.funnel.leads}`);
    
    data.social_clicks.forEach(s => lines.push(`Social - ${s.platform},${s.clicks}`));
    data.direct_contacts.forEach(d => lines.push(`Directo - ${d.channel},${d.clicks}`));

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `analytics_export_${days}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data, days]);

  const calculateGrowth = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - prev) / prev) * 100);
  };

  // Mapeo
  const uniqueVisitors = data?.funnel.unique_visitors || 0;
  const ctr = uniqueVisitors > 0 ? Math.round(((data?.funnel.interactions || 0) / uniqueVisitors) * 100) : 0;

  const overview = data ? {
    totalViews: data.kpis.web_views,
    viewsGrowth: calculateGrowth(data.kpis.web_views, data.kpis.prev_web_views),
    totalTaps: data.kpis.nfc_taps,
    tapsGrowth: calculateGrowth(data.kpis.nfc_taps, data.kpis.prev_nfc_taps),
    contactsSaved: data.kpis.contacts_saved,
    contactsGrowth: calculateGrowth(data.kpis.contacts_saved, data.kpis.prev_contacts_saved),
    totalShares: data.kpis.profiles_shared || 0,
    sharesGrowth: calculateGrowth(data.kpis.profiles_shared || 0, data.kpis.prev_profiles_shared || 0),
    ctr: ctr,
    ctrGrowth: 0,
  } : null;

  const totalSocialClicks = data ? data.social_clicks.reduce((acc, curr) => acc + curr.clicks, 0) : 0;
  const socialColors = ['#E1306C', '#25D366', '#0077B5', 'var(--sif-gold)'];
  const socialDistribution = data ? [...data.social_clicks]
    .sort((a, b) => b.clicks - a.clicks)
    .map((item, idx) => ({
      platform: item.platform,
      clicks: item.clicks,
      percentage: totalSocialClicks > 0 ? Math.round((item.clicks / totalSocialClicks) * 100) : 0,
      color: socialColors[idx % socialColors.length],
    })) : [];

  const totalDirectClicks = data ? data.direct_contacts.reduce((acc, curr) => acc + curr.clicks, 0) : 0;
  const directLinks = data ? [...data.direct_contacts]
    .sort((a, b) => b.clicks - a.clicks)
    .map(item => ({
      type: item.channel,
      clicks: item.clicks,
      percentage: totalDirectClicks > 0 ? Math.round((item.clicks / totalDirectClicks) * 100) : 0,
    })) : [];

  const funnel = data ? {
    views: uniqueVisitors,
    interactions: data.funnel.interactions,
    saves: data.funnel.leads,
  } : null;



  return (
    <>
      <TopBarFilters onFilterChange={handleFilterChange} onExport={handleExport} onRefresh={refetch} />
      
      {isLoading && (
        <div className="flex items-center justify-center h-64 bg-[var(--sif-surface)]/50 rounded-2xl border border-[var(--sif-border)] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--sif-gold)]" />
            <p className="text-sm font-medium text-[var(--sif-muted)] animate-pulse">
              Analizando métricas...
            </p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center justify-center h-64 bg-red-500/10 rounded-2xl border border-red-500/20 backdrop-blur-sm">
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}

      {!isLoading && !error && data && overview && funnel && (
        <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in">
          <KpiGrid data={overview} />
          <TrafficChart data={data.traffic} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <SocialDistribution data={socialDistribution} />
            <DirectLinks data={directLinks} />
            <ConversionFunnel data={funnel} />
          </div>
        </div>
      )}
    </>
  );
}
