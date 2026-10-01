import { Filter, Eye, MousePointerClick, UserCheck, Info } from 'lucide-react';
import type { DashboardMetrics } from '../../types/dashboard';

interface ConversionFunnelProps {
  data: DashboardMetrics['funnel'];
}

export default function ConversionFunnel({ data }: ConversionFunnelProps) {
  // Cálculos de porcentajes del embudo
  const interactionRate = Math.round((data.interactions / data.views) * 100);
  const saveRate = Math.round((data.saves / data.views) * 100);

  return (
    <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] rounded-2xl p-4 sm:p-5 flex flex-col h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[var(--sif-text)]">Embudo de Conversión</h3>
          <Filter className="w-4 h-4 text-[var(--sif-muted)]" />
        </div>
        <p className="text-xs text-[var(--sif-muted)]">Rendimiento desde la visita hasta el contacto</p>
      </div>

      <div className="mt-6 flex-1 flex flex-col justify-center space-y-3">
        
        {/* Step 1: Vistas (100%) */}
        <div className="relative w-full rounded-xl border border-[var(--sif-border)] bg-[var(--sif-surface-subtle)] group">
          {/* Fondo simulando el ancho del embudo */}
          <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-gradient-to-r from-[var(--sif-gold)]/10 to-transparent transition-transform origin-left group-hover:scale-x-105" />
          
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--sif-surface)] border border-[var(--sif-gold)]/30 flex items-center justify-center text-[var(--sif-gold)] shadow-[0_0_10px_var(--sif-gold-glow)]">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
                  <p className="text-xs font-bold text-[var(--sif-text)]">1. Visitantes Únicos</p>
                  <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
                  <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
                    Cantidad de personas distintas que navegaron por tu perfil en este periodo.
                  </div>
                </div>
                <p className="text-[10px] text-[var(--sif-muted)]">Personas distintas que abrieron tu perfil</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-[var(--sif-text)]">{data.views.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-[var(--sif-muted)]">100%</p>
            </div>
          </div>
        </div>

        {/* Step 2: Interacciones */}
        <div className="relative w-full rounded-xl border border-[var(--sif-border)] bg-[var(--sif-surface-subtle)] group">
          <div 
            className="absolute top-0 left-0 h-full rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent transition-transform origin-left group-hover:scale-x-105"
            style={{ width: `${interactionRate}%` }} 
          />
          
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--sif-surface)] border border-blue-500/30 flex items-center justify-center text-blue-400">
                <MousePointerClick className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
                  <p className="text-xs font-bold text-[var(--sif-text)]">2. Interacciones</p>
                  <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
                  <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
                    Suma de todos los clics que tus visitantes hicieron en tus redes sociales o botones de contacto.
                  </div>
                </div>
                <p className="text-[10px] text-[var(--sif-muted)]">Clic en redes o links</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-[var(--sif-text)]">{data.interactions.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-blue-400">{interactionRate}%</p>
            </div>
          </div>
        </div>

        {/* Step 3: Contactos Guardados */}
        <div className="relative w-full rounded-xl border border-[var(--sif-border)] bg-[var(--sif-surface-subtle)] group">
          <div 
            className="absolute top-0 left-0 h-full rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent transition-transform origin-left group-hover:scale-x-105"
            style={{ width: `${saveRate}%` }} 
          />
          
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--sif-surface)] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
                  <p className="text-xs font-bold text-[var(--sif-text)]">3. Leads Capturados</p>
                  <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
                  <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
                    Visitantes que presionaron el botón principal para agregar tus datos a su agenda telefónica.
                  </div>
                </div>
                <p className="text-[10px] text-[var(--sif-muted)]">Guardaron tu contacto</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-[var(--sif-text)]">{data.saves.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-emerald-400">{saveRate}%</p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-[var(--sif-border)] flex flex-col gap-1 text-center">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--sif-muted)]">Efectividad del Perfil</span>
        <span className="text-xs font-medium text-[var(--sif-text)]">
          El <strong className="text-emerald-400">{saveRate}%</strong> de los visitantes únicos deciden guardar tu contacto (Captura de leads).
        </span>
      </div>
    </div>
  );
}