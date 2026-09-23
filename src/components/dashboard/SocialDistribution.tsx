import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardMetrics } from '../../types/dashboard';

interface SocialDistributionProps {
  data: DashboardMetrics['socialDistribution'];
}

export default function SocialDistribution({ data }: SocialDistributionProps) {
  const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { platform, clicks, percentage, color } = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-[#0e1320]/95 border border-[var(--sif-border)] rounded-xl p-2.5 shadow-2xl flex items-center gap-3 min-w-[140px]">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <div>
            <p className="text-xs font-bold text-[var(--sif-text)]">{platform}</p>
            <p className="text-[11px] text-[var(--sif-muted)]">
              {clicks.toLocaleString()} clics ({percentage}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] rounded-2xl p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[var(--sif-text)]">Clics en Redes</h3>
        <span className="text-[11px] font-medium text-[var(--sif-muted)]">
          Total: {(totalClicks / 1000).toFixed(1)}k
        </span>
      </div>
      <p className="text-xs text-[var(--sif-muted)] mb-2">
        Distribución de clics salientes
      </p>

      {/* Gráfico de Dona - Corregido */}
      {/* Quitamos flex-1 y le damos un min-h-[220px] para que nunca colapse en móvil */}
      <div className="relative min-h-[220px] w-full flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Pie
              data={data}
              cx="50%"     /* Obliga a centrar horizontalmente */
              cy="50%"     /* Obliga a centrar verticalmente */
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="clicks"
              nameKey="platform"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Texto Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--sif-muted)] font-medium">Top</span>
          <span className="text-lg font-extrabold text-[var(--sif-text)]">
            {data[0]?.platform || '-'}
          </span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[var(--sif-border)]">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-medium text-[var(--sif-text)] line-clamp-1">
                {item.platform}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[var(--sif-muted)]">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}