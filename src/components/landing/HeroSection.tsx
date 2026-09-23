import React, { useState } from 'react';
import { SpinningCard3D } from './SpinningCard3D';

import goldFront from '../../assets/cards/Gold_Dark_cards.png';
import goldBack from '../../assets/cards/Gold_Dark_back_cards.png';
import silverFront from '../../assets/cards/Silver_Dark_cards.png';
import silverBack from '../../assets/cards/Silver_Dark_back_cards.png';

interface HeroSectionProps {
  edition: 'gold' | 'silver';
  onEditionChange: (edition: 'gold' | 'silver') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  edition,
  onEditionChange,
}) => {
  const [isFading, setIsFading] = useState(false);

  const handleSelectEdition = (type: 'gold' | 'silver') => {
    if (type === edition) return;
    setIsFading(true);
    setTimeout(() => {
      onEditionChange(type);
      setIsFading(false);
    }, 150);
  };

  const cardData = {
    gold: {
      front: goldFront,
      back: goldBack,
      altFront: 'SIF Card Frontal Gold Edition',
      altBack: 'SIF Card Reverso Gold Edition',
    },
    silver: {
      front: silverFront,
      back: silverBack,
      altFront: 'SIF Card Frontal Silver Edition',
      altBack: 'SIF Card Reverso Silver Edition',
    },
  }[edition];

  return (
    <section className="relative z-0 min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center pt-32 sm:pt-36 lg:pt-32 pb-20 lg:pb-24 overflow-hidden" id="hero">
      {/* ── 1. Haz de Luz Volumétrico Estilo Resend ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute -top-32 right-[-5%] sm:right-[12%] w-[600px] sm:w-[850px] h-[950px] -rotate-[32deg] blur-[75px] transition-all duration-700"
          style={{
            background:
              edition === 'gold'
                ? 'linear-gradient(180deg, rgba(221,178,37,0.32) 0%, rgba(255,255,255,0.14) 20%, rgba(221,178,37,0.05) 50%, transparent 80%)'
                : 'linear-gradient(180deg, rgba(226,232,240,0.35) 0%, rgba(255,255,255,0.16) 20%, rgba(148,163,184,0.06) 50%, transparent 80%)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute top-[22%] right-[5%] sm:right-[15%] w-[420px] sm:w-[500px] h-[420px] sm:h-[500px] rounded-full transition-all duration-700"
          style={{
            background:
              edition === 'gold'
                ? 'radial-gradient(circle, rgba(221,178,37,0.22) 0%, rgba(221,178,37,0.05) 45%, transparent 70%)'
                : 'radial-gradient(circle, rgba(226,232,240,0.22) 0%, rgba(148,163,184,0.05) 45%, transparent 70%)',
            filter: 'blur(95px)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t dark:from-[#09090b] from-[#fafafa] to-transparent" />
      </div>

      {/* ── 2. Contenedor Principal Espacioso ── */}
      <div className="max-w-6xl mx-auto w-full px-6 sm:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

        {/* Columna Izquierda: Tipografía Editorial Resend */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10 max-w-xl lg:max-w-none mx-auto">

          {/* Pill Kicker minimalista */}
          <div className="relative inline-flex p-[1px] rounded-full overflow-hidden mb-6 sm:mb-8 shadow-sm">
            <span className="absolute inset-0 rounded-full border dark:border-white/10 border-slate-200" />
            <div className="absolute inset-[-150%] single-sparkle-beam bg-[conic-gradient(from_0deg,transparent_0deg,transparent_340deg,rgba(255,255,255,0.9)_352deg,#ddb225_357deg,transparent_360deg)] opacity-80 pointer-events-none" />
            <div className="relative px-3.5 py-1 rounded-full dark:bg-[#09090b]/90 bg-white/90 backdrop-blur-md flex items-center gap-2">
              <span className="text-[10px] dark:text-slate-400 text-slate-600 font-mono tracking-wider">
                ✦ La nueva era del Networking
              </span>
            </div>
          </div>

          {/* Titular: Tipografía Newsreader serif elegante con tamaño calibrado */}
          <h1 className="font-serif font-normal dark:text-white text-slate-900 text-[38px] sm:text-[46px] lg:text-[54px] tracking-[-0.025em] leading-[1.08] mb-6">
            Tu primera impresión{' '}
            <span className="italic block mt-1 dark:text-slate-200 text-slate-700">
              A tan solo un Tap.
            </span>
          </h1>

          {/* Subtítulo espaciado y sintetizado (estilo Resend) */}
          <p className="dark:text-slate-400 text-slate-600 text-xs sm:text-[13px] lg:text-[14px] font-normal leading-relaxed max-w-md lg:max-w-lg mb-8 tracking-normal">
            Eleva tu presencia profesional transfiriendo tu perfil corporativo, redes, experticia, experiencia y canales de comunicación directo a la agenda de cualquier smartphone. Sin necesidad de tarjetas de cartón impresas.
          </p>

          {/* Acción principal única: Redirige a las tarjetas (#modelos) */}
          <div className="flex flex-row items-center justify-center lg:justify-start w-full max-w-xs sm:max-w-md">
            <a
              href="#modelos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full dark:bg-white dark:text-black bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-200 shadow-md hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Adquirir Tarjeta</span>
              <span className="text-xs">→</span>
            </a>
          </div>

          {/* Especificaciones discretas con mayor separación */}
          <div className="mt-12 sm:mt-14 pt-6 border-t dark:border-white/[0.07] border-slate-200 grid grid-cols-3 gap-6 text-left w-full max-w-xs sm:max-w-sm">
            <div>
              <div className="text-[9px] font-mono dark:text-slate-500 text-slate-600 uppercase tracking-widest mb-1">Hardware</div>
              <div className="text-xs font-semibold dark:text-slate-200 text-slate-900">NFC + QR</div>
            </div>
            <div>
              <div className="text-[9px] font-mono dark:text-slate-500 text-slate-600 uppercase tracking-widest mb-1">Compatibilidad</div>
              <div className="text-xs font-semibold dark:text-slate-200 text-slate-900">iOS & Android</div>
            </div>
            <div>
              <div className="text-[9px] font-mono dark:text-slate-500 text-slate-600 uppercase tracking-widest mb-1">Configuración</div>
              <div className="text-xs font-semibold dark:text-slate-200 text-slate-900">En 60 Segundos</div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta 3D equilibrada */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] mx-auto mt-6 lg:mt-0">
          <div className="w-full">
            <SpinningCard3D
              frontImage={cardData.front}
              backImage={cardData.back}
              altFront={cardData.altFront}
              altBack={cardData.altBack}
              isFading={isFading}
            />
          </div>

          {/* Switcher compacto */}
          <div
            aria-label="Seleccionar acabado de tarjeta"
            className="mt-8 flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-[#121215]/80 backdrop-blur-md shadow-xl z-10"
            role="tablist"
          >
            <button
              onClick={() => handleSelectEdition('gold')}
              aria-selected={edition === 'gold'}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wide transition-all duration-300 ${edition === 'gold'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              role="tab"
            >
              <span className="w-2 h-2 rounded-full bg-[#ddb225] ring-2 ring-[#ddb225]/40" />
              <span>Gold Foil</span>
            </button>

            <button
              onClick={() => handleSelectEdition('silver')}
              aria-selected={edition === 'silver'}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wide transition-all duration-300 ${edition === 'silver'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              role="tab"
            >
              <span className="w-2 h-2 rounded-full bg-slate-400 ring-2 ring-slate-400/40" />
              <span>Silver Foil</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;