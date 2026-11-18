import React, { useState } from 'react';
import { Wifi, QrCode, Smartphone, BookOpen, GraduationCap, Building2, ExternalLink } from 'lucide-react';
import { SpinningCard3D } from '../landing/SpinningCard3D';

import goldFront from '../../assets/cards/Gold_Dark_cards.png';
import goldBack from '../../assets/cards/Gold_Dark_back_cards.png';
import silverFront from '../../assets/cards/Silver_Dark_cards.png';
import silverBack from '../../assets/cards/Silver_Dark_back_cards.png';

interface PhysicalCardSectionProps {
  edition: 'gold' | 'silver';
  onEditionChange: (edition: 'gold' | 'silver') => void;
}

const CONNECTIVITY_PILLARS = [
  {
    id: 'nfc',
    icon: Wifi,
    title: 'Interacción NFC',
    badge: 'Al instante',
    description:
      'Acerca la tarjeta al teléfono inteligente de tu cliente para transmitir tu información de contacto instantáneamente.',
  },
  {
    id: 'qr',
    icon: QrCode,
    title: 'Escaneo QR',
    badge: '100% Compatible',
    description:
      'Para dispositivos sin NFC activo, el reverso de la tarjeta cuenta con un código QR enmarcado que dirige directamente a tu perfil web.',
  },
  {
    id: 'no-app',
    icon: Smartphone,
    title: 'Sin aplicaciones extra',
    badge: 'Cero fricción',
    description:
      'El intercambio de contactos es directo, a través de internet, eliminando el uso de papel tradicional. Tu cliente visualizará tu perfil instantáneamente.',
  },
];

export const PhysicalCardSection: React.FC<PhysicalCardSectionProps> = ({
  edition,
  onEditionChange,
}) => {
  const [activePillar, setActivePillar] = useState<string>('nfc');
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
    <section
      id="conectividad-fisica"
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b dark:border-white/[0.06] border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de Sección 1 */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-[#ddb225]/30 border-amber-500/30 bg-[#ddb225]/10 text-[#ddb225] font-mono text-[11px] uppercase tracking-widest mb-3 font-semibold">
            <span>Sección 01</span>
            <span>·</span>
            <span>Hardware &amp; Acceso</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white text-slate-900">
            1. La SIF Card: Conectividad Física
          </h2>
          <p className="mt-3 text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed">
            La SIF Card es tu punto de contacto principal, diseñada a tu medida. Puedes elegir entre un diseño minimalista o uno personalizado completamente.
          </p>
        </div>

        {/* Grid Principal: Tarjeta 3D Interactiva + 3 Pilares */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna Izquierda: Tarjeta 3D Interactiva reutilizada de Landing */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full max-w-[380px] lg:max-w-[440px] mx-auto">
            <div className="w-full">
              <SpinningCard3D
                frontImage={cardData.front}
                backImage={cardData.back}
                altFront={cardData.altFront}
                altBack={cardData.altBack}
                isFading={isFading}
              />
            </div>

            {/* Switcher Gold / Silver Foil */}
            <div
              aria-label="Seleccionar acabado de tarjeta"
              className="mt-8 flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-[#121215]/90 backdrop-blur-md shadow-xl z-10"
              role="tablist"
            >
              <button
                type="button"
                onClick={() => handleSelectEdition('gold')}
                aria-selected={edition === 'gold'}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wide transition-all duration-300 cursor-pointer ${
                  edition === 'gold'
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                role="tab"
              >
                <span className="w-2 h-2 rounded-full bg-[#ddb225] ring-2 ring-[#ddb225]/40" />
                <span>Gold Foil</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectEdition('silver')}
                aria-selected={edition === 'silver'}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wide transition-all duration-300 cursor-pointer ${
                  edition === 'silver'
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                role="tab"
              >
                <span className="w-2 h-2 rounded-full bg-slate-400 ring-2 ring-slate-400/40" />
                <span>Silver Foil</span>
              </button>
            </div>
            <p className="mt-3 text-[11px] font-mono dark:text-slate-500 text-slate-500 text-center">
              Anverso con chip NFC · Reverso con código QR enmarcado
            </p>
          </div>

          {/* Columna Derecha: Los 3 Pilares del Manual + Demostración de Bloques del Perfil */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {CONNECTIVITY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = activePillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillar(pillar.id)}
                  className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'dark:bg-[#121215] bg-white border-[#ddb225]/60 shadow-lg shadow-[#ddb225]/5 ring-1 ring-[#ddb225]/30'
                      : 'dark:bg-[#121215]/60 bg-white/70 dark:border-white/[0.08] border-slate-200 hover:border-[#ddb225]/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-[#ddb225] text-black border-[#ddb225]'
                          : 'dark:bg-white/[0.04] bg-slate-100 dark:border-white/10 border-slate-200 text-[#ddb225]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold dark:text-white text-slate-900">
                          {pillar.title}
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#ddb225]/30 bg-[#ddb225]/10 text-[#ddb225] font-semibold">
                          {pillar.badge}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs sm:text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Tarjetas de Módulos del Perfil (Pág. 2 del PDF: Idiomas, Educación, Negocios y Proyectos) */}
            <div className="mt-2 rounded-2xl border dark:border-white/[0.08] border-slate-200 dark:bg-[#121215] bg-white p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#ddb225] font-semibold">
                  ✦ Lo que tu cliente visualiza al instante sin apps
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Idiomas */}
                <div className="rounded-xl border dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.02] bg-slate-50 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold dark:text-white text-slate-900 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#ddb225]" />
                    <span>Perfil Profesional</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-2">
                    Idiomas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium dark:bg-white/10 bg-slate-200 dark:text-slate-200 text-slate-800">
                      Español
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium dark:bg-white/10 bg-slate-200 dark:text-slate-200 text-slate-800">
                      Inglés
                    </span>
                  </div>
                </div>

                {/* Educación */}
                <div className="rounded-xl border dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.02] bg-slate-50 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold dark:text-white text-slate-900 mb-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#ddb225]" />
                    <span>Educación</span>
                  </div>
                  <p className="text-xs font-semibold dark:text-slate-200 text-slate-800">
                    Negocios Digitales
                  </p>
                  <p className="text-[11px] dark:text-slate-400 text-slate-600">UDLA</p>
                  <p className="text-[10px] font-mono dark:text-slate-500 text-slate-500 mt-0.5">
                    2026 - 2030
                  </p>
                </div>

                {/* Negocios y Proyectos */}
                <div className="rounded-xl border dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.02] bg-slate-50 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold dark:text-white text-slate-900 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-[#ddb225]" />
                    <span>Negocios y Proyectos</span>
                  </div>
                  <p className="text-xs font-semibold dark:text-slate-200 text-slate-800">RIMAN</p>
                  <p className="text-[11px] dark:text-slate-400 text-slate-600 line-clamp-1">
                    Skin care coreano vegano de lujo
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#ddb225] mt-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Visitar enlace</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
