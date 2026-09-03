import type { LucideIcon } from 'lucide-react';

type Accent = 'gold' | 'silver' | 'default';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  accent?: Accent;
}

const accentStyles: Record<Accent, { icon: string; badge: string }> = {
  gold: {
    icon: 'bg-sif-surface-subtle border border-sif-gold/30 text-sif-gold',
    badge: 'text-sif-gold bg-sif-gold/10 border border-sif-gold/20',
  },
  silver: {
    icon: 'bg-sif-surface-subtle border border-sif-border text-sif-silver',
    badge: 'text-sif-silver bg-sif-surface-subtle border border-sif-border',
  },
  default: {
    icon: 'bg-sif-surface-subtle border border-sif-border text-sif-muted',
    badge: 'text-sif-muted bg-sif-surface-subtle border border-sif-border',
  },
};

export function MetricCard({ title, value, icon: Icon, trend, accent = 'default' }: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-sif-border bg-sif-surface p-5 shadow-sm transition-all duration-200 hover:border-sif-gold/20 hover:shadow-md">
      {/* Ícono */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-sif-muted">{title}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums text-sif-text">{value}</p>
        {trend && (
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles.badge}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
