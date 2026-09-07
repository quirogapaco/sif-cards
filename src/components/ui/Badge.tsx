import type { ReactNode } from 'react';

type BadgeVariant = 'inactive' | 'active' | 'blocked' | 'gold';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  inactive:
    'bg-sif-silver/10 text-sif-silver border border-sif-silver/20',
  active:
    'bg-green-500/10 text-green-400 border border-green-500/20',
  blocked:
    'bg-red-500/10 text-red-400 border border-red-500/20',
  gold:
    'bg-sif-gold/10 text-sif-gold border border-sif-gold/20',
};

export function Badge({ children, variant = 'inactive', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none tracking-wide ${variants[variant]} ${className}`}
      style={{
        boxShadow:
          variant === 'gold'
            ? '0 0 8px rgba(212,175,55,0.15)'
            : variant === 'blocked'
            ? '0 0 8px rgba(239,68,68,0.15)'
            : 'none',
      }}
    >
      {/* Indicador de estado */}
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          variant === 'active'
            ? 'bg-green-400'
            : variant === 'blocked'
            ? 'bg-red-400'
            : 'bg-sif-muted'
        }`}
      />
      {children}
    </span>
  );
}
