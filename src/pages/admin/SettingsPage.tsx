import { Settings, Globe, Bell, Shield, Palette } from 'lucide-react';

const CONFIG_SECTIONS = [
  { icon: Globe, title: 'Dominio & DNS', desc: 'Configuración de dominios personalizados y certificados SSL.' },
  { icon: Bell, title: 'Notificaciones', desc: 'Plantillas de correo, webhooks y alertas del sistema.' },
  { icon: Shield, title: 'Seguridad & Accesos', desc: 'Roles, permisos, 2FA y logs de auditoría.' },
  { icon: Palette, title: 'Branding Global', desc: 'Logo, colores y tipografía por defecto para nuevas cuentas.' },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-xl font-bold text-sif-text">Configuración Global</h1>
        <p className="mt-0.5 text-sm text-sif-muted">
          Ajustes de la plataforma, dominios, integraciones y seguridad
        </p>
      </div>

      {/* Secciones de configuración */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONFIG_SECTIONS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-2xl border border-sif-border bg-sif-surface p-5 opacity-60"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sif-border"
              style={{ background: 'rgba(212,175,55,0.10)' }}
            >
              <Icon className="h-4 w-4" style={{ color: 'var(--sif-gold)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-sif-text">{title}</p>
              <p className="mt-0.5 text-[11px] text-sif-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Módulo en construcción */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface p-6">
        <div className="flex items-start gap-4">
          <Settings
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: 'var(--sif-gold)' }}
          />
          <div>
            <h2 className="text-sm font-semibold text-sif-text">
              Módulo en construcción
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-sif-muted">
              La configuración global de la plataforma permitirá gestionar integraciones
              de terceros, variables de entorno, políticas de privacidad y ajustes
              avanzados de infraestructura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
