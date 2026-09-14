import React from 'react';
import { CrowdCanvas } from './CrowdCanvas';
import sifGold from '../../assets/sif_gold.png';

export const FooterCTA: React.FC = () => {
  return (
    <footer className="relative w-full bg-[#09090b] text-slate-300 border-t border-white/[0.06] overflow-x-hidden min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
      
      {/* ── 1. CROWD CANVAS: FONDO COMPLETO SIN CORTE ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <CrowdCanvas />
        {/* Fundido superior suave para integrar las cabezas con el fondo */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#09090b] via-[#09090b]/75 to-transparent pointer-events-none" />
        {/* Suavizado inferior en los pies */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#09090b] via-[#09090b]/85 to-transparent pointer-events-none" />
      </div>

      {/* ── 2. COLUMNAS DE INFORMACIÓN FLOTANDO POR ENCIMA (z-20) ── */}
      <div className="relative z-20 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Columna Principal: Marca + Titular Multitud + Botón + Créditos */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <a href="#" className="flex items-center gap-3 mb-4">
              <img
                src={sifGold}
                alt="SIF Cards Logo"
                className="h-7 w-auto object-contain"
              />
              <span className="text-white font-semibold text-sm tracking-tight">
                SIF Cards
              </span>
            </a>

            <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug mb-1">
              Destácate entre la multitud.
            </h3>
            <span className="font-serif italic font-normal text-slate-300 text-sm sm:text-base block mb-3">
              Una primera impresión inolvidable.
            </span>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6 font-normal">
              Tarjetas físicas inteligentes con chip NFC integrado y perfiles interactivos en la nube. Comparte tus accesos al instante sin aplicaciones adicionales.
            </p>

            <div className="flex items-center gap-3 mb-6 w-full sm:w-auto">
              <a
                href="#modelos"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-slate-200 transition-all duration-200 shadow-sm active:scale-95"
              >
                <span>Adquirir SIF Card</span>
                <span className="text-xs">→</span>
              </a>
            </div>

            <div className="space-y-1 text-[11px] font-mono text-slate-500">
              <p>© {new Date().getFullYear()} SIF Cards · All rights reserved.</p>
              <p className="flex items-center gap-1.5 text-slate-400 pt-1">
                <span>Built</span>
                <span>by</span>
                <span className="text-slate-200 font-medium">F. Quiroga</span>
              </p>
            </div>
          </div>

          {/* Columnas de Navegación */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-2 md:pt-0">
            {/* Columna Menú */}
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-3">
                Menú
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#hero" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#tecnologia" className="hover:text-white transition-colors">Tecnología</a></li>
                <li><a href="#activacion" className="hover:text-white transition-colors">Activación</a></li>
                <li><a href="#playground" className="hover:text-white transition-colors">Simulador</a></li>
                <li><a href="#modelos" className="hover:text-white transition-colors">Modelos &amp; Precios</a></li>
              </ul>
            </div>

            {/* Columna Soluciones (Solo 2 opciones con nombres actualizados) */}
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-3">
                Soluciones
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#modelos" className="hover:text-white transition-colors">SIF Signature</a></li>
                <li><a href="#modelos" className="hover:text-white transition-colors">SIF Business</a></li>
              </ul>
            </div>

            {/* Columna Contacto (WhatsApp, Instagram, Facebook) */}
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-3">
                Contacto
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a
                    href="https://wa.me/593999692453"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default FooterCTA;