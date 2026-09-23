import { Filter, Eye, MousePointerClick, UserCheck } from 'lucide-react';
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
        <div className="relative w-full rounded-xl border border-[var(--sif-border)] bg-[var(--sif-surface-subtle)] overflow-hidden group">
          {/* Fondo simulando el ancho del embudo */}
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[var(--sif-gold)]/10 to-transparent transition-transform origin-left group-hover:scale-x-105" />
          
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--sif-surface)] border border-[var(--sif-gold)]/30 flex items-center justify-center text-[var(--sif-gold)] shadow-[0_0_10px_var(--sif-gold-glow)]">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--sif-text)]">1. Vistas Totales</p>
                <p className="text-[10px] text-[var(--sif-muted)]">Abrieron el perfil web</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-[var(--sif-text)]">{data.views.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-[var(--sif-muted)]">100%</p>
            </div>
          </div>
        </div>

        {/* Step 2: Interacciones */}
        <div className="relative w-full rounded-xl border border-[var(--sif-border)] bg-[var(--sif-surface-subtle)] overflow-hidden group">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500/10 to-transparent transition-transform origin-left group-hover:scale-x-105"
            style={{ width: `${interactionRate}%` }} 
          />
          
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--sif-surface)] border border-blue-500/30 flex items-center justify-center text-blue-400">
                <MousePointerClick className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--sif-text)]">2. Interacciones</p>
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
        <div className="relative w-full rounded-xl border border-[var(--sif-border)] bg-[var(--sif-surface-subtle)] overflow-hidden group">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500/10 to-transparent transition-transform origin-left group-hover:scale-x-105"
            style={{ width: `${saveRate}%` }} 
          />
          
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--sif-surface)] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--sif-text)]">3. Leads Capturados</p>
                <p className="text-[10px] text-[var(--sif-muted)]">Descargaron la vCard</p>
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
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--sif-muted)]">Costo de Oportunidad</span>
        <span className="text-xs font-medium text-[var(--sif-text)]">
          De cada 100 visitas, capturas <strong className="text-emerald-400">{saveRate} contactos</strong> reales.
        </span>
      </div>
    </div>
  );
}