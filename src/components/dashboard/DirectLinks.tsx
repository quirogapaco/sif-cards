import { MessageCircle, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import type { DashboardMetrics } from '../../types/dashboard';

interface DirectLinksProps {
  data: DashboardMetrics['directLinks'];
}

export default function DirectLinks({ data }: DirectLinksProps) {
  // Función para mapear el tipo de enlace con su icono y colores
  const getLinkConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'whatsapp':
        return {
          icon: <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />,
          gradient: 'from-[#25D366] to-[#128C7E]',
        };
      case 'email':
      case 'correo':
        return {
          icon: <Mail className="w-3.5 h-3.5 text-sky-400" />,
          gradient: 'from-sky-400 to-blue-600',
        };
      case 'teléfono':
      case 'telefono':
      case 'phone':
        return {
          icon: <Phone className="w-3.5 h-3.5 text-[var(--sif-gold)]" />,
          gradient: 'from-[var(--sif-gold)] to-amber-600',
        };
      case 'ubicación':
      case 'mapa':
      case 'map':
        return {
          icon: <MapPin className="w-3.5 h-3.5 text-rose-400" />,
          gradient: 'from-rose-400 to-red-600',
        };
      default:
        return {
          icon: <LinkIcon className="w-3.5 h-3.5 text-[var(--sif-silver)]" />,
          gradient: 'from-[var(--sif-silver)] to-slate-500',
        };
    }
  };

  // Obtener el canal principal para el resumen inferior
  const topChannel = data.length > 0 ? [...data].sort((a, b) => b.clicks - a.clicks)[0] : null;

  return (
    <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] rounded-2xl p-4 sm:p-5 flex flex-col h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[var(--sif-text)]">Contacto Directo</h3>
          <span className="text-[11px] font-medium text-[var(--sif-muted)]">Mayor a menor</span>
        </div>
        <p className="text-xs text-[var(--sif-muted)]">Conversiones en canales de comunicación</p>
      </div>

      {/* Lista de Barras de Progreso */}
      <div className="mt-5 space-y-4 flex-1">
        {data.map((item, index) => {
          const config = getLinkConfig(item.type);
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[var(--sif-text)]">
                  {config.icon} {item.type}
                </span>
                <span className="font-bold text-[var(--sif-text)]">
                  {item.clicks.toLocaleString()}{' '}
                  <span className="font-normal text-[var(--sif-muted)] text-[10px]">
                    ({item.percentage}%)
                  </span>
                </span>
              </div>
              <div className="w-full h-2 bg-[var(--sif-surface-subtle)] rounded-full overflow-hidden border border-[var(--sif-border)]">
                <div
                  className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de canal preferido */}
      {topChannel && (
        <div className="mt-4 pt-3 border-t border-[var(--sif-border)] flex items-center justify-between text-xs text-[var(--sif-muted)]">
          <span>Canal preferido:</span>
          <span className="font-semibold text-[var(--sif-gold)] flex items-center gap-1">
            {getLinkConfig(topChannel.type).icon} {topChannel.type}
          </span>
        </div>
      )}
    </div>
  );
}