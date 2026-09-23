import { Apple, Smartphone, Clock, ShieldCheck } from 'lucide-react';
import type { DashboardMetrics } from '../../types/dashboard';

interface DeviceStatsProps {
  devices: DashboardMetrics['devices'];
  peakHour: string;
}

export default function DeviceStats({ devices, peakHour }: DeviceStatsProps) {
  return (
    <div className="backdrop-blur-md bg-[var(--sif-surface)] border border-[var(--sif-border)] rounded-2xl p-4 sm:p-5 flex flex-col h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[var(--sif-text)]">Plataformas & Hábitos</h3>
          <span className="text-[11px] font-medium text-[var(--sif-muted)]">Sistemas Operativos</span>
        </div>
        <p className="text-xs text-[var(--sif-muted)]">Detección por sensor NFC del dispositivo</p>
      </div>

      <div className="mt-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Barra de progreso iOS vs Android */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[var(--sif-text)]">
              <Apple className="w-4 h-4" /> Apple iOS ({devices.ios.percentage}%)
            </span>
            <span className="flex items-center gap-1.5 text-[var(--sif-muted)]">
              Android ({devices.android.percentage}%) <Smartphone className="w-4 h-4 text-emerald-400" />
            </span>
          </div>
          
          <div className="w-full h-3.5 bg-[var(--sif-surface-subtle)] rounded-full overflow-hidden flex border border-[var(--sif-border)] p-0.5">
            <div 
              className="h-full bg-[var(--sif-silver)] rounded-l-full shadow-sm transition-all duration-500" 
              style={{ width: `${devices.ios.percentage}%` }} 
            />
            <div 
              className="h-full bg-emerald-500 rounded-r-full shadow-sm transition-all duration-500" 
              style={{ width: `${devices.android.percentage}%` }} 
            />
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-[var(--sif-muted)] px-1">
            <span>{(devices.ios.count / 1000).toFixed(1)}k dispositivos activos</span>
            <span>{(devices.android.count / 1000).toFixed(1)}k dispositivos</span>
          </div>
        </div>

        {/* Tarjeta de Hora Pico */}
        <div className="p-3.5 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--sif-surface)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-gold)] flex-shrink-0 shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[var(--sif-text)]">Hora Pico de Interacción</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--sif-gold)] text-black leading-none">TOP</span>
            </div>
            <div className="text-sm font-extrabold text-[var(--sif-gold)] mt-1">
              {peakHour} hrs
            </div>
            <p className="text-[10px] text-[var(--sif-muted)] mt-1 leading-snug">
              Coincide con eventos corporativos, after-work meetings y networking.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}