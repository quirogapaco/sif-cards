import React from 'react';

interface FeatureItem {
  id: string;
  index: string;
  title: string;
  description: string;
  tag: string;
  isAccent?: boolean;
  icon: React.ReactNode;
}

const features: FeatureItem[] = [
  {
    id: 'zero-requirements',
    index: '01',
    title: 'Cero fricción.',
    description: 'La otra persona no instala nada ni necesita una tarjeta propia; basta con aproximar su teléfono para recibir tus datos.',
    tag: 'Sin barreras técnicas',
    icon: (
      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'native-compatibility',
    index: '02',
    title: 'Compatibilidad nativa.',
    description: 'Lectura instantánea por chip NFC y respaldo con código QR dinámico nítido.',
    tag: 'iOS & Android',
    icon: (
      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
        <rect height="20" rx="3" width="14" x="5" y="2" />
        <path d="M12 18h.01" />
        <path d="M9 7a5 5 0 0 1 6 0" />
        <path d="M10.5 9.5a2.5 2.5 0 0 1 3 0" />
      </svg>
    ),
  },
  {
    id: 'zero-apps',
    index: '03',
    title: 'Cero apps requeridas.',
    description: 'Tu perfil abre en el navegador web y guarda tu vCard en la nube.',
    tag: 'Descarga de vCard',
    icon: (
      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'cloud-architecture',
    index: '04',
    title: 'Arquitectura en la nube.',
    description: 'Conectada a un ecosistema digital activo que mantiene tus canales y datos siempre al día.',
    tag: 'Disponibilidad continua',
    isAccent: true,
    icon: (
      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
  },
];

export const FeaturesBar: React.FC = () => {
  return (
    <section
      id="tecnologia"
      aria-labelledby="features-heading"
      className="relative w-full py-12 sm:py-18 lg:py-22 px-5 sm:px-6 dark:bg-[#09090b] bg-[#fafafa] border-t border-b dark:border-white/[0.04] border-slate-200/80 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_450px_at_50%_20%,rgba(221,178,37,0.03),transparent_70%)]" />

      {/* Encabezado */}
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center mb-8 sm:mb-12 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-white/10 border-slate-200 dark:bg-white/[0.03] bg-white text-[9px] sm:text-[10px] font-mono tracking-widest dark:text-slate-400 text-slate-600 uppercase mb-2.5 backdrop-blur-sm shadow-sm">
          <span className="text-[#ddb225]">✦</span>
          <span>TECNOLOGÍA SIN FRICCIÓN</span>
        </div>

        <h2
          id="features-heading"
          className="text-xl sm:text-3xl lg:text-4xl font-semibold dark:text-white text-slate-900 tracking-tight leading-tight mb-2"
        >
          <span className="block">Diseñada para impresionar.</span>
          <span className="block font-serif italic font-normal dark:text-slate-200 text-slate-700">
            Optimizada para conectar.
          </span>
        </h2>

        <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 max-w-md leading-relaxed">
          Todo lo necesario para proyectar autoridad profesional.
        </p>
      </div>

      {/* Grid de tarjetas (2 columnas en móvil, 4 en desktop) compactadas */}
      <div className="max-w-[460px] sm:max-w-5xl mx-auto w-full px-1 sm:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {features.map((item) => {
            const isGold = item.isAccent;
            return (
              <article
                key={item.id}
                className={`dark:bg-[#121215] bg-white rounded-xl p-3.5 sm:p-4 lg:p-5 flex flex-col justify-between transition-all duration-300 relative group border shadow-sm hover:shadow-md ${
                  isGold
                    ? 'dark:border-[#ddb225]/25 border-[#ddb225]/40 hover:border-[#ddb225]/70 dark:hover:border-[#ddb225]/45'
                    : 'dark:border-white/[0.08] border-slate-200/90 dark:hover:border-white/20 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <div
                      aria-hidden="true"
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors border ${
                        isGold
                          ? 'bg-[#ddb225]/10 border-[#ddb225]/25 text-[#ddb225]'
                          : 'dark:bg-white/[0.04] bg-slate-100 dark:border-white/[0.08] border-slate-200 dark:text-slate-300 text-slate-700 group-hover:text-[#ddb225]'
                      }`}
                    >
                      {item.icon}
                    </div>

                    <span
                      className={`font-mono text-[9px] sm:text-[10px] tracking-widest ${
                        isGold
                          ? 'text-[#ddb225]/80 group-hover:text-[#ddb225]'
                          : 'dark:text-slate-500 text-slate-600 group-hover:text-slate-900 font-medium'
                      }`}
                    >
                      {item.index}
                    </span>
                  </div>

                  <h3 className="dark:text-white text-slate-900 font-semibold text-xs sm:text-sm lg:text-base mb-1 tracking-tight line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="dark:text-slate-400 text-slate-700 text-[11px] sm:text-xs leading-snug font-normal line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`mt-auto pt-2.5 border-t flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono ${
                    isGold
                      ? 'border-[#ddb225]/15 text-[#ddb225]/85'
                      : 'dark:border-white/[0.05] border-slate-200 dark:text-slate-400 text-slate-700 font-medium'
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                      isGold ? 'bg-[#ddb225]' : 'bg-emerald-500/70'
                    }`}
                  />
                  <span className="truncate">{item.tag}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Línea inferior de especificaciones */}
      <div className="mt-8 sm:mt-12 max-w-2xl mx-auto dark:border-white/[0.05] border-slate-200/80 pt-4 text-center px-4">
        <p className="text-[9px] sm:text-[10px] font-mono tracking-widest dark:text-slate-500 text-slate-600 uppercase flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium">
          <span>Sincronización en tiempo real</span>
          <span className="dark:text-slate-700 text-slate-300">·</span>
          <span>Cifrado de datos</span>
          <span className="dark:text-slate-700 text-slate-300">·</span>
          <span>Actualización remota ilimitada</span>
        </p>
      </div>
    </section>
  );
};

export default FeaturesBar;