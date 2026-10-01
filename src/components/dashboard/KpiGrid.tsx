import { Eye, Radio, UserCheck, Target, TrendingUp, Share2, Info } from 'lucide-react';
import type { DashboardMetrics } from '../../types/dashboard';

// Recibe la parte de "overview" de nuestro mock data
export default function KpiGrid({ data }: { data: DashboardMetrics['overview'] }) {
  return (
    // CAMBIO CLAVE MÓVIL: grid-cols-2 en lugar de grid-cols-1, gap-3
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      
      {/* Tarjeta 1: Vistas */}
      <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] hover:border-[var(--sif-gold)]/40 rounded-2xl p-3 sm:p-5 transition-all duration-300 group flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-gold)] group-hover:scale-105 transition-transform">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.viewsGrowth}%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[var(--sif-muted)] line-clamp-1">Vistas Web</span>
            <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
              Total de veces que tu perfil fue abierto, incluyendo recargas de la página.
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-[var(--sif-text)] mt-0.5 sm:mt-1 tracking-tight">
            {data.totalViews.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Taps NFC */}
      <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] hover:border-[var(--sif-gold)]/40 rounded-2xl p-3 sm:p-5 transition-all duration-300 group flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-gold)] group-hover:scale-105 transition-transform">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.tapsGrowth}%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[var(--sif-muted)] line-clamp-1">Taps NFC</span>
            <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
              Cantidad de veces que tu tarjeta física fue escaneada.
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-[var(--sif-text)] mt-0.5 sm:mt-1 tracking-tight">
            {data.totalTaps.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tarjeta 3: Contactos Guardados */}
      <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] hover:border-[var(--sif-gold)]/40 rounded-2xl p-3 sm:p-5 transition-all duration-300 group flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-silver)] group-hover:scale-105 transition-transform">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.contactsGrowth}%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[var(--sif-muted)] line-clamp-1">Contactos Guardados</span>
            <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
              Total de personas que presionaron guardar contacto.
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-[var(--sif-text)] mt-0.5 sm:mt-1 tracking-tight">
            {data.contactsSaved.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tarjeta 4: Compartidos */}
      <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] hover:border-[var(--sif-gold)]/40 rounded-2xl p-3 sm:p-5 transition-all duration-300 group flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-gold)] group-hover:scale-105 transition-transform">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.sharesGrowth}%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[var(--sif-muted)] line-clamp-1">Compartidos</span>
            <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
              Veces que tu perfil fue compartido copiando el enlace o enviándolo.
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-[var(--sif-text)] mt-0.5 sm:mt-1 tracking-tight">
            {data.totalShares.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tarjeta 5: Tasa de Interacción */}
      <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] hover:border-[var(--sif-gold)]/40 rounded-2xl p-3 sm:p-5 transition-all duration-300 group flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-gold)] group-hover:scale-105 transition-transform">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.ctrGrowth}%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 group/tooltip relative w-fit outline-none" tabIndex={0}>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[var(--sif-muted)] line-clamp-1">Tasa de Interacción</span>
            <Info size={14} className="text-[var(--sif-muted)] cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus/tooltip:visible group-focus/tooltip:opacity-100 transition-all z-50 w-48 p-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none">
              Porcentaje de visitantes únicos que hicieron clic en algún enlace o botón.
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-[var(--sif-text)] mt-0.5 sm:mt-1 tracking-tight">
            {data.ctr}%
          </div>
        </div>
      </div>
      
    </section>
  );
}