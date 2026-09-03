import type { ReactNode } from 'react';

type BadgeVariant = 'unclaimed' | 'active' | 'inactive' | 'gold';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  unclaimed:
    'bg-sif-surface-subtle border border-sif-border text-sif-muted',
  active:
    'bg-sif-gold/10 border border-sif-gold/30 text-sif-gold',
  inactive:
    'bg-red-500/8 border border-red-500/20 text-red-400',
  gold:
    'bg-sif-gold/15 border border-sif-gold/40 text-sif-gold font-bold',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none tracking-wide ${variantStyles[variant]}`}
    >
      {/* Indicador de estado */}
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          variant === 'active'
            ? 'bg-sif-gold'
            : variant === 'inactive'
            ? 'bg-red-400'
            : 'bg-sif-muted'
        }`}
      />
      {children}
    </span>
  );
}
