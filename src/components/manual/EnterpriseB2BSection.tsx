import React, { useState } from 'react';
import { Layers, Package2, Wifi, WifiOff, Search, Users, Edit3, CheckCircle2 } from 'lucide-react';

interface DemoBatch {
  id: string;
  name: string;
  prefix: string;
  finish: string;
  total: number;
  active: number;
  inactive: number;
  employees: Array<{ name: string; role: string; status: 'Activa' | 'En bodega'; slug: string }>;
}

const DEMO_BATCHES: DemoBatch[] = [
  {
    id: 'riman',
    name: 'Riman Sales Agents Batch',
    prefix: '/riman/*',
    finish: 'Negro Mate · Foil Oro',
    total: 5,
    active: 3,
    inactive: 2,
    employees: [
      { name: 'Esteban Quiroga', role: 'Senior Director', status: 'Activa', slug: '@tevsdj' },
      { name: 'Valeria Mendoza', role: 'Team Leader', status: 'Activa', slug: '@valeria-riman' },
      { name: 'Carlos Andrade', role: 'Beauty Planner', status: 'Activa', slug: '@carlos-riman' },
    ],
  },
  {
    id: 'sif-staff',
    name: 'sif-staff',
    prefix: '/sif-corporate/*',
    finish: 'Negro Mate · Foil Oro',
    total: 4,
    active: 2,
    inactive: 2,
    employees: [
      { name: 'Francisco Quiroga', role: 'Founder & CEO', status: 'Activa', slug: '@fquiroga' },
      { name: 'Sofía Castro', role: 'Head of Sales', status: 'Activa', slug: '@scastro' },
    ],
  },
  {
    id: 'seguros-suarez',
    name: 'Lote B2B - Seguros Suárez',
    prefix: '/segurossuarez/*',
    finish: 'Blanco Marfil · Foil Plata',
    total: 4,
    active: 1,
    inactive: 3,
    employees: [
      { name: 'Andrés Suárez', role: 'Gerente Comercial', status: 'Activa', slug: '@asuarez' },
    ],
  },
];

export const EnterpriseB2BSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('riman');

  const filteredBatches = DEMO_BATCHES.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.prefix.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBatch =
    DEMO_BATCHES.find((b) => b.id === selectedBatchId) || DEMO_BATCHES[0];

  return (
    <section
      id="vista-empresarial"
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b dark:border-white/[0.06] border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de Sección 4 */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-[#ddb225]/30 border-amber-500/30 bg-[#ddb225]/10 text-[#ddb225] font-mono text-[11px] uppercase tracking-widest mb-3 font-semibold">
            <span>Sección 04</span>
            <span>·</span>
            <span>Control Corporativo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white text-slate-900">
            4. Vista Empresarial (Dashboard B2B)
          </h2>
          <p className="mt-3 text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed">
            Para clientes corporativos, SIF actúa como una plataforma de control centralizada para estandarizar la imagen de los equipos y gestionar activos.
          </p>
        </div>

        {/* Los 2 Pilares B2B del Manual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border dark:border-white/[0.08] border-slate-200 dark:bg-[#121215] bg-white p-5 flex items-start gap-4 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-[#ddb225]/15 border border-[#ddb225]/30 text-[#ddb225] flex items-center justify-center shrink-0">
              <Package2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold dark:text-white text-slate-900">
                Control de inventario
              </h3>
              <p className="mt-1 text-xs sm:text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Monitorea el estado total de tus tarjetas NFC, separando las que están inactivas en bodega, las activas en la calle y aquellas que han sido bloqueadas.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border dark:border-white/[0.08] border-slate-200 dark:bg-[#121215] bg-white p-5 flex items-start gap-4 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-[#ddb225]/15 border border-[#ddb225]/30 text-[#ddb225] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold dark:text-white text-slate-900">
                Supervisión de empleados
              </h3>
              <p className="mt-1 text-xs sm:text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Mantén el orden corporativo visualizando el porcentaje de activación de las tarjetas asociadas a tu empresa y edita los perfiles de todos tus colaboradores.
              </p>
            </div>
          </div>
        </div>

        {/* Simulador Interactivo B2B (Idéntico a la captura de la Página 6 del PDF) */}
        <div className="rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-[#09090b] bg-slate-950 p-5 sm:p-8 shadow-2xl text-white">
          {/* 4 Tarjetas KPI de Inventario */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="rounded-2xl border border-white/10 bg-[#121215] p-4 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Total Fabricadas
                </p>
                <p className="text-2xl font-extrabold text-white">13</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-mono text-slate-300">
                  3 lotes
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121215] p-4 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                <Package2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Inactivas en Bodega
                </p>
                <p className="text-2xl font-extrabold text-white">7</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-mono text-slate-300">
                  54% del stock
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ddb225]/30 bg-[#121215] p-4 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-[#ddb225]/15 border border-[#ddb225]/30 flex items-center justify-center text-[#ddb225] shrink-0">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Activas en la Calle
                </p>
                <p className="text-2xl font-extrabold text-[#ddb225]">6</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#ddb225]/15 text-[10px] font-mono text-[#ddb225] font-semibold">
                  46% activadas
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121215] p-4 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Bloqueadas
                </p>
                <p className="text-2xl font-extrabold text-white">0</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-mono text-slate-400">
                  Sin bloqueos
                </span>
              </div>
            </div>
          </div>

          {/* Tabla Interactiva de Lotes + Detalle de Colaboradores del Lote */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Lista de Lotes de Fabricación */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#121215] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181c] border border-[#ddb225]/40 text-xs font-semibold text-white">
                  <Package2 className="w-4 h-4 text-[#ddb225]" />
                  <span>Lotes de Fabricación</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#ddb225] text-black text-[10px] font-bold">
                    {DEMO_BATCHES.length}
                  </span>
                </div>

                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar lote..."
                    className="w-full rounded-xl bg-[#18181c] border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#ddb225]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <span className="col-span-7">Referencia / Lote</span>
                  <span className="col-span-5 text-right">Activación</span>
                </div>

                {filteredBatches.map((batch) => {
                  const isSelected = batch.id === selectedBatch.id;
                  const pct = Math.round((batch.active / batch.total) * 100);
                  return (
                    <button
                      key={batch.id}
                      type="button"
                      onClick={() => setSelectedBatchId(batch.id)}
                      className={`w-full grid grid-cols-12 items-center px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#ddb225]/10 border-[#ddb225]/50'
                          : 'bg-[#18181c]/60 border-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div className="col-span-7 pr-2">
                        <p className="text-xs sm:text-sm font-bold text-white">{batch.name}</p>
                        <p className="text-[11px] font-mono text-emerald-400 mt-0.5">{batch.prefix}</p>
                      </div>
                      <div className="col-span-5 flex flex-col items-end gap-1">
                        <span className="text-xs font-mono font-semibold text-slate-200">
                          {batch.active}/{batch.total} ({pct}%)
                        </span>
                        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[#ddb225] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel de Supervisión de Empleados del Lote Seleccionado */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#121215] p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ddb225]">
                    Supervisión de Empleados
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{selectedBatch.name}</h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedBatch.finish}
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedBatch.employees.map((emp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#18181c] border border-white/[0.07] p-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-[#ddb225]/15 border border-[#ddb225]/30 flex items-center justify-center text-xs font-bold text-[#ddb225] shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{emp.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {emp.role} · <span className="font-mono text-[#ddb225]">{emp.slug}</span>
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-slate-200 shrink-0">
                      <Edit3 className="w-3 h-3 text-[#ddb225]" />
                      <span>Editar</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  El administrador puede editar cualquier perfil o reasignar tarjetas al instante.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
