import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DashboardMetrics } from '../../types/dashboard';

interface TrafficChartProps {
  data: DashboardMetrics['timeSeries'];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  // Tooltip personalizado para mantener el diseño oscuro y elegante
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-[#0e1320]/95 border border-[var(--sif-gold)]/40 rounded-xl p-3 shadow-2xl min-w-[160px]">
          <p className="text-[11px] font-semibold text-[var(--sif-muted)] border-b border-[var(--sif-border)] pb-1.5 mb-2">
            {label}
          </p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-[var(--sif-muted)]">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name === 'views' ? 'Vistas Web:' : 'Taps NFC:'}
                </span>
                <span className="font-bold text-[var(--sif-text)]">
                  {entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] rounded-2xl p-4 sm:p-6 shadow-xl relative w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--sif-text)]">
              Tráfico en el Tiempo
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] text-[var(--sif-muted)]">
              Tendencia
            </span>
          </div>
          <p className="text-xs text-[var(--sif-muted)] mt-1">
            Comparativa de interacción entre perfil web digital y toques físicos NFC
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--sif-gold)] shadow-[0_0_8px_var(--sif-gold)]" />
            <span className="text-[var(--sif-text)]">Vistas Web (Digital)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--sif-silver)]" />
            <span className="text-[var(--sif-muted)]">Taps Físicos (NFC)</span>
          </div>
        </div>
      </div>

      <div className="h-[220px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sif-gold)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--sif-gold)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTaps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sif-silver)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--sif-silver)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 4"
              vertical={false}
              stroke="var(--sif-border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--sif-muted)', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--sif-muted)', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="taps"
              stroke="var(--sif-silver)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTaps)"
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--sif-gold)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}