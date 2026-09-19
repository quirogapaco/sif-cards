import type { LucideIcon } from 'lucide-react';

type Accent = 'gold' | 'silver' | 'default';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  accent?: Accent;
  className?: string;
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

export function MetricCard({ title, value, icon: Icon, trend, accent = 'default', className = '' }: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <div className={`flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-sif-border bg-sif-surface p-3 sm:p-5 shadow-sm transition-all duration-200 hover:border-sif-gold/20 hover:shadow-md ${className}`}>
      {/* Ícono */}
      <div className={`flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${styles.icon}`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-sif-muted leading-tight truncate">{title}</p>
        <p className="text-lg sm:mt-0.5 sm:text-2xl font-bold tabular-nums text-sif-text leading-tight">{value}</p>
        {trend && (
          <span className={`mt-0.5 sm:mt-1 inline-block rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-semibold ${styles.badge} truncate max-w-full`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
