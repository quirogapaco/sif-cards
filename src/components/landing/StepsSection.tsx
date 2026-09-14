import React from 'react';

export const StepsSection: React.FC = () => {
  return (
    <section
      id="activacion"
      aria-label="Proceso de activación de SIF Card"
      className="relative w-full py-12 sm:py-18 lg:py-22 px-6 sm:px-8 bg-[#09090b] text-[#EBF1F9] overflow-hidden"
    >
      {/* Luz ambiental difusa */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(221,178,37,0.035),transparent_65%)]" />

      {/* ── ENCABEZADO DE SECCIÓN ── */}
      <header className="max-w-2xl mx-auto text-center flex flex-col items-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3 backdrop-blur-sm shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ddb225] animate-pulse" />
          <span>ACTIVACIÓN INSTANTÁNEA</span>
        </div>

        <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight mb-2">
          <span className="block">Actívala en tan solo 3 pasos.</span>
          <span className="block font-serif italic font-normal text-slate-200">
            Lista para impresionar en menos de 60 segundos.
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
          Sin descargar aplicaciones. Acerca tu tarjeta física y comienza a conectar de inmediato.
        </p>
      </header>

      {/* ── GRID DE PASOS COMPACTOS CON MARGEN LATERAL EN MÓVIL ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-[340px] sm:max-w-[400px] md:max-w-5xl mx-auto">
        {/* PASO 01 */}
        <article className="w-full bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-3 uppercase tracking-wider">
              <span>STEP / 01</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            {/* Mockup visual Paso 1 */}
            <div className="w-full h-32 sm:h-36 bg-black/50 border border-white/5 rounded-xl flex flex-col items-center justify-center p-3 mb-4 relative overflow-hidden">
              <div className="w-28 h-16 bg-[#18181b] border border-white/10 rounded-lg p-2 flex flex-col justify-between shadow-lg">
                <span className="text-[8px] font-bold text-[#ddb225] font-serif">SIF Card</span>
                <span className="text-[6px] font-mono text-slate-500 self-end">MATE</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300">
                <span className="w-1 h-1 rounded-full bg-[#ddb225] animate-ping" />
                <span>SIF detectado · Abrir</span>
              </div>
            </div>

            <h3 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-1.5">
              Escanea tu tarjeta nueva
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Solo acércala a tu teléfono. El sistema reconocerá automáticamente que la tarjeta es nueva y abrirá el portal al instante.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>LECTURA INSTANTÁNEA</span>
            <span className="text-slate-400">&lt; 0.3s</span>
          </div>
        </article>

        {/* PASO 02 */}
        <article className="w-full bg-[#121215] border border-[#ddb225]/30 hover:border-[#ddb225]/50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(221,178,37,0.03)] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#ddb225] mb-3 uppercase tracking-wider">
              <span>STEP / 02</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ddb225]" />
            </div>

            {/* Mockup visual Paso 2 */}
            <div className="w-full h-32 sm:h-36 bg-black/50 border border-white/5 rounded-xl flex flex-col justify-center p-3 mb-4 space-y-1.5">
              <div className="flex justify-between items-center bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded text-[9px] font-mono">
                <span className="text-slate-500">Nombre</span>
                <span className="text-slate-200">Carlos Rossi</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded text-[9px] font-mono">
                <span className="text-slate-500">Cargo</span>
                <span className="text-slate-200">Director</span>
              </div>
              <div className="w-full py-1 bg-white text-black text-[9px] font-semibold text-center rounded mt-0.5 shadow-sm">
                Guardar →
              </div>
            </div>

            <h3 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-1.5">
              Personaliza tu identidad
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Añade tu nombre, empresa, canales directos y enlaces clave. Deja tu perfil impecable para causar impacto desde el primer encuentro.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>EDICIÓN EN VIVO</span>
            <span className="text-[#ddb225]">EN TIEMPO REAL</span>
          </div>
        </article>

        {/* PASO 03 */}
        <article className="w-full bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-3 uppercase tracking-wider">
              <span>STEP / 03</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            {/* Mockup visual Paso 3 */}
            <div className="w-full h-32 sm:h-36 bg-black/50 border border-white/5 rounded-xl flex flex-col items-center justify-center p-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ddb225]/30 bg-[#ddb225]/10 text-[10px] font-mono text-[#ddb225]">
                <span>✓ Tarjeta vinculada · Lista</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[9px] font-mono text-slate-400">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span>Sync OK · #SIF-ACTIVE</span>
              </div>
            </div>

            <h3 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-1.5">
              Conecta y destaca
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              ¡Todo listo! Acerca tu tarjeta a cualquier smartphone y deslumbra con una experiencia de networking moderna y sin fricción.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500">
            <span>ESTADO DE TARJETA</span>
            <span className="text-emerald-400">ACTIVA Y LISTA</span>
          </div>
        </article>
      </div>

      {/* Barra de cierre sutil */}
      <footer className="mt-10 sm:mt-14 max-w-2xl mx-auto border-t border-white/[0.05] pt-4 text-center">
        <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center justify-center gap-2.5">
          <span>Flujo continuo de 3 pasos</span>
          <span className="text-white/10">•</span>
          <span>Sin aplicaciones</span>
          <span className="text-white/10">•</span>
          <span>iOS & Android</span>
        </p>
      </footer>
    </section>
  );
};

export default StepsSection;