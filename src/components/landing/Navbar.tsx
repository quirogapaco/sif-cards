import React, { useState } from 'react';
import sifGold from '../../assets/sif_gold.png';
import sifSilver from '../../assets/sif_silver.png';

interface NavbarProps {
  edition: 'gold' | 'silver';
}

export const Navbar: React.FC<NavbarProps> = ({ edition }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentLogo = edition === 'gold' ? sifGold : sifSilver;

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#09090b]/85 backdrop-blur-md border-b border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Izquierda: Logotipo Ampliado + Separador + Tagline */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center group focus:outline-none">
            <img
              src={currentLogo}
              alt="SIF - Sharing is Fast"
              className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
          <span className="h-6 w-px bg-white/10 hidden sm:block" />
          <span className="text-slate-400 tracking-[0.2em] text-xs uppercase font-mono hidden sm:inline-block">
            SHARING IS FAST
          </span>
        </div>

        {/* Centro: Enlaces de navegación desktop */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-8 text-slate-300 text-sm font-medium tracking-wide"
        >
          <a
            href="#tecnologia"
            className="hover:text-white transition-colors duration-200"
          >
            Tecnología
          </a>
          <a
            href="#activacion"
            className="hover:text-white transition-colors duration-200"
          >
            Activación
          </a>
          <a
            href="#modelos"
            className="hover:text-white transition-colors duration-200"
          >
            Modelos
          </a>
        </nav>

        {/* Derecha: Botón de Compra Desktop + Toggle Hamburguesa Móvil */}
        <div className="flex items-center gap-3">
          <a
            href="#adquirir"
            className="hidden sm:inline-flex items-center justify-center bg-white/[0.06] border border-white/15 hover:border-white/30 text-white text-sm px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:bg-white/[0.1] active:scale-[0.98]"
          >
            Comprar
          </a>

          {/* Botón hamburguesa accesible para móvil */}
          <button
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Desplegable en Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#09090b]/95 backdrop-blur-2xl px-6 py-6 shadow-2xl transition-all">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-300">
            <a
              href="#tecnologia"
              onClick={closeMobileMenu}
              className="py-2 hover:text-white transition-colors border-b border-white/[0.04]"
            >
              Tecnología
            </a>
            <a
              href="#activacion"
              onClick={closeMobileMenu}
              className="py-2 hover:text-white transition-colors border-b border-white/[0.04]"
            >
              Activación
            </a>
            <a
              href="#modelos"
              onClick={closeMobileMenu}
              className="py-2 hover:text-white transition-colors border-b border-white/[0.04]"
            >
              Modelos
            </a>
            <a
              href="#adquirir"
              onClick={closeMobileMenu}
              className="mt-2 text-center w-full py-3 rounded-full bg-white text-black font-semibold text-sm transition-transform active:scale-[0.98]"
            >
              Comprar Tarjeta
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};