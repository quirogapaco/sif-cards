import { Users, UserCheck, UserX, Shield } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-xl font-bold text-sif-text">Clientes & Cuentas</h1>
        <p className="mt-0.5 text-sm text-sif-muted">
          Gestión de usuarios particulares y cuentas corporativas
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Usuarios Activos', icon: UserCheck, value: '—' },
          { label: 'Usuarios Inactivos', icon: UserX, value: '—' },
          { label: 'Cuentas Pro', icon: Shield, value: '—' },
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
          <Users
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: 'var(--sif-gold)' }}
          />
          <div>
            <h2 className="text-sm font-semibold text-sif-text">
              Módulo en construcción
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-sif-muted">
              Aquí se administrarán cuentas individuales y corporativas, estados
              de membresía, historial de tarjetas asignadas, roles de usuario y
              opciones de soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
