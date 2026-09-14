import { LayoutDashboard, TrendingUp, Users, CreditCard, Activity } from 'lucide-react';

const STATS = [
  { label: 'Tarjetas Activas', value: '—', icon: CreditCard, color: 'var(--sif-gold)' },
  { label: 'Usuarios Totales', value: '—', icon: Users, color: 'var(--sif-silver)' },
  { label: 'Ingresos del Mes', value: '—', icon: TrendingUp, color: 'var(--sif-gold)' },
  { label: 'Sesiones Hoy', value: '—', icon: Activity, color: 'var(--sif-silver)' },
];

export default function GlobalDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-xl font-bold text-sif-text">Dashboard Global</h1>
        <p className="mt-0.5 text-sm text-sif-muted">
          Métricas globales de la plataforma SiF en tiempo real
        </p>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-sif-border bg-sif-surface p-5"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sif-border"
              style={{ background: `${color}14` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-sif-text">{value}</p>
              <p className="text-[11px] text-sif-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Módulo en construcción */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface p-6">
        <div className="flex items-start gap-4">
          <LayoutDashboard
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: 'var(--sif-gold)' }}
          />
          <div>
            <h2 className="text-sm font-semibold text-sif-text">
              Módulo en construcción
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-sif-muted">
              Este módulo mostrará gráficos de actividad, conversiones, tarjetas
              escaneadas y métricas de retención de usuarios a nivel global de la
              plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
