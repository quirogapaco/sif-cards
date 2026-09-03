import { CalendarClock, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RenewalsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-xl font-bold text-sif-text">Finanzas & Renovaciones</h1>
        <p className="mt-0.5 text-sm text-sif-muted">
          Control de membresías anuales activas, vencidas y en proceso de renovación
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Membresías Activas', icon: CheckCircle2, value: '—' },
          { label: 'Por Vencer (30d)', icon: AlertCircle, value: '—' },
          { label: 'Ingresos Anuales', icon: DollarSign, value: '—' },
        ].map(({ label, icon: Icon, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-sif-border bg-sif-surface p-4"
          >
            <Icon className="h-5 w-5 shrink-0 text-sif-muted" />
            <div>
              <p className="text-lg font-bold text-sif-text">{value}</p>
              <p className="text-[11px] text-sif-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Módulo en construcción */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface p-6">
        <div className="flex items-start gap-4">
          <CalendarClock
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: 'var(--sif-gold)' }}
          />
          <div>
            <h2 className="text-sm font-semibold text-sif-text">
              Módulo en construcción
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-sif-muted">
              Aquí se controlará el ciclo de vida de membresías: fechas de vencimiento,
              alertas automáticas, historial de pagos, links de renovación y reportes
              financieros mensuales/anuales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
