import React from 'react';

const WA_NUMBER = '593999692453';

const signatureWaText = encodeURIComponent(
  '¡Hola! Estoy interesado en adquirir una *SiF Signature*. Quisiera conocer la disponibilidad de modelos y coordinar el envío.'
);

const businessWaText = encodeURIComponent(
  '¡Hola! Me gustaría cotizar *SiF Business* para mi empresa. Buscamos tarjetas con nuestro logotipo oficial, colores corporativos y panel centralizado para nuestros ejecutivos.'
);

export const EditionsSection: React.FC = () => {
  return (
    <section
      id="modelos"
      aria-label="Precios y modelos de SIF Cards"
      className="relative w-full py-14 sm:py-20 lg:py-24 px-4 sm:px-6 dark:bg-[#09090b] bg-[#fafafa] dark:text-[#EBF1F9] text-slate-800 overflow-hidden transition-colors duration-300"
    >
      {/* Luz ambiental sutil y rejilla técnica de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[320px] bg-gradient-to-b from-[#ddb225]/[0.035] via-white/[0.015] to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Encabezado Editorial */}
        <header className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 border dark:border-white/10 border-slate-200 dark:bg-white/[0.03] bg-white backdrop-blur-md px-3 py-1 rounded-full mb-3.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ddb225] animate-pulse" />
            <span className="dark:text-slate-400 text-slate-600 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest font-medium">
              ✦ ADQUISICIÓN Y TIRAJES
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] dark:text-[#EBF1F9] text-slate-900 leading-tight">
            Elige la pieza adecuada para tu visión<span className="text-[#ddb225]">.</span>
          </h2>

          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 max-w-md mx-auto mt-2.5 leading-relaxed">
            Tarjetas individuales de acabado premium o soluciones corporativas a medida para elevar tu firma.
          </p>
        </header>

        {/* Bento Grid de 2 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-4xl mx-auto">
          {/* ── TIER 01: SIF SIGNATURE (Individual / Creadores / Profesionales) ── */}
          <div className="w-full max-w-[380px] md:max-w-none mx-auto dark:bg-[#121215] bg-white border dark:border-white/[0.08] border-slate-200/90 dark:hover:border-white/20 hover:border-slate-300 rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between transition-all duration-300 relative group shadow-sm hover:shadow-md">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="dark:text-slate-400 text-slate-500 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase font-medium">
                  EDICIÓN DE FIRMA
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 rounded border dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.02] bg-slate-100">
                  Uso Personal
                </span>
              </div>

              {/* Nombre y Precio */}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="dark:text-[#EBF1F9] text-slate-900 text-xl sm:text-2xl font-semibold tracking-tight">
                  SIF Signature
                </h3>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold dark:text-white text-slate-900 tracking-tight">$10</span>
                    <span className="text-[10px] font-mono dark:text-slate-500 text-slate-600 font-medium">USD</span>
                  </div>
                  <span className="block text-[8.5px] font-mono dark:text-slate-600 text-slate-600 -mt-0.5 tracking-tight font-medium">
                    *renovación anual
                  </span>
                </div>
              </div>

              <p className="dark:text-slate-400 text-slate-700 text-xs sm:text-[13px] leading-relaxed mt-2">
                Diseñada para empresarios, consultores independientes, ejecutivos y creadores que buscan sobresalir y causar una distinción instantánea.
              </p>

              {/* Acabados disponibles */}
              <div className="mt-4 pt-3.5 border-t dark:border-white/[0.06] border-slate-200/80">
                <span className="block text-[9px] sm:text-[10px] font-mono dark:text-slate-500 text-slate-700 tracking-wider uppercase mb-2 font-medium">
                  Acabados físicos disponibles:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 dark:bg-[#09090b] bg-slate-900 border dark:border-white/10 border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#ddb225] shadow-[0_0_6px_rgba(221,178,37,0.5)]" />
                    <span>Gold Foil</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 dark:bg-[#09090b] bg-slate-900 border dark:border-white/10 border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-slate-300 shadow-[0_0_6px_rgba(203,213,225,0.4)]" />
                    <span>Silver Foil</span>
                  </div>
                </div>
              </div>

              {/* Lista de características */}
              <div className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                {[
                  'Tarjeta física mate con logo SIF en foil reflectivo',
                  'Chip NFC integrado + QR dinámico de alta definición',
                  'Perfil digital interactivo con edición remota ilimitada',
                  'Descarga directa de vCard a la agenda en un solo tap',
                  'Panel de control y dashboard con métricas de taps, guardados y clics',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] dark:text-slate-300 text-slate-800 font-medium leading-normal">
                    <svg className="w-3.5 h-3.5 dark:text-slate-400 text-slate-700 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Inferior */}
            <div className="mt-8 pt-5 border-t dark:border-white/[0.06] border-slate-200/80">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${signatureWaText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full dark:bg-[#EBF1F9] dark:text-[#09090b] dark:hover:bg-white bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 py-3 px-5 text-xs sm:text-sm font-semibold rounded-full shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Adquirir SIF Signature</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <div className="text-center mt-2.5">
                <span className="text-[10px] font-mono dark:text-slate-500 text-slate-600 font-medium">
                  Envío express y configuración en 60 seg
                </span>
              </div>
            </div>
          </div>

          {/* ── TIER 02: SIF BUSINESS (Empresas y Corporativo) ── */}
          <div className="w-full max-w-[380px] md:max-w-none mx-auto dark:bg-[#121215] bg-white border dark:border-white/[0.08] border-[#ddb225]/50 dark:hover:border-[#ddb225]/60 hover:border-[#ddb225] rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between transition-all duration-300 relative group dark:shadow-[0_15px_45px_rgba(0,0,0,0.7)] shadow-sm hover:shadow-md">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ddb225]/40 to-transparent" />
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#ddb225]/[0.05] blur-2xl pointer-events-none rounded-full" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[#ddb225] font-mono text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#ddb225]" />
                  EMPRESAS Y EQUIPOS
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-[#ddb225] border border-[#ddb225]/30 bg-[#ddb225]/[0.08] px-2 py-0.5 rounded uppercase font-semibold">
                  A Medida
                </span>
              </div>

              <h3 className="dark:text-[#EBF1F9] text-slate-900 text-xl sm:text-2xl font-semibold tracking-tight">
                SIF Business
              </h3>

              <p className="dark:text-slate-400 text-slate-700 text-xs sm:text-[13px] leading-relaxed mt-2">
                La solución para empresas que buscan elevar su estándar de networking y causar la mejor impresión con sus clientes proyectando su propia marca.
              </p>

              {/* Resalte de personalización */}
              <div className="mt-4 pt-3.5 border-t dark:border-white/[0.06] border-slate-200/80">
                <span className="block text-[9px] sm:text-[10px] font-mono dark:text-slate-500 text-slate-700 tracking-wider uppercase mb-2 font-medium">
                  Personalización total de firma:
                </span>
                <div className="inline-flex items-center gap-2 dark:bg-[#09090b] bg-slate-900 border border-[#ddb225]/40 px-3 py-1 rounded-full text-[11px] font-medium text-white shadow-xs">
                  <span className="text-[#ddb225] text-xs">✦</span>
                  <span>vCard con Logotipo y Colores de tu Marca</span>
                </div>
              </div>

              {/* Lista de características SIF Business */}
              <div className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                {[
                  'Diseño personalizado de tarjeta con el branding oficial de tu firma',
                  'Chip NFC integrado + QR dinámico enlazado a perfiles corporativos',
                  'vCard corporativa con identidad y paleta de colores de tu empresa',
                  'Panel de control centralizado para administrar tarjetas, perfiles e información',
                  'Dashboard general con estadísticas consolidadas del equipo comercial',
                  'Cotización flexible adaptada a la escala de tus ejecutivos',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] dark:text-slate-300 text-slate-800 font-medium leading-normal">
                    <svg className="w-3.5 h-3.5 text-[#ddb225] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Inferior */}
            <div className="mt-8 pt-5 border-t dark:border-white/[0.06] border-slate-200/80">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${businessWaText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full dark:bg-white/[0.03] bg-slate-900 border border-[#ddb225]/50 hover:border-[#ddb225] dark:text-slate-100 text-white hover:text-white transition-all duration-200 py-3 px-5 text-xs sm:text-sm font-semibold rounded-full hover:bg-slate-800 dark:hover:bg-[#ddb225]/[0.08] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
              >
                <span>¡Cotízalo ya!</span>
                <span className="text-[#ddb225] text-sm">→</span>
              </a>
              <div className="text-center mt-2.5">
                <span className="text-[10px] font-mono dark:text-slate-500 text-slate-600 font-medium">
                  Muestras físicas y render digital previo disponibles
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Garantías técnicas al pie en 3 columnas horizontales */}
        <footer className="max-w-2xl mx-auto px-2 text-center border-t dark:border-white/[0.06] border-slate-200/80 pt-6 mt-12 sm:mt-16">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider dark:text-slate-400 text-slate-700 font-medium">
            {/* Ítem 1 */}
            <div className="flex flex-col items-center justify-center gap-1 border-r dark:border-white/[0.06] border-slate-200/80 pr-1 sm:pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mb-0.5" />
              <span className="leading-tight dark:text-slate-300 text-slate-900">Activación lista</span>
              <span className="dark:text-slate-500 text-slate-600 leading-tight">en 60 segundos</span>
            </div>

            {/* Ítem 2 */}
            <div className="flex flex-col items-center justify-center gap-1 border-r dark:border-white/[0.06] border-slate-200/80 px-1 sm:px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mb-0.5" />
              <span className="leading-tight dark:text-slate-300 text-slate-900">Garantía chip</span>
              <span className="dark:text-slate-500 text-slate-600 leading-tight">de por vida</span>
            </div>

            {/* Ítem 3 */}
            <div className="flex flex-col items-center justify-center gap-1 pl-1 sm:pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ddb225] mb-0.5" />
              <span className="leading-tight dark:text-slate-300 text-slate-900">Envío seguro</span>
              <span className="dark:text-slate-500 text-slate-600 leading-tight">a todo el país</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default EditionsSection;