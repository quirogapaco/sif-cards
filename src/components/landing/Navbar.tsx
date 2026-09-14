import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/AppThemeContext';
import sifGold from '../../assets/sif_gold.png';
import sifSilver from '../../assets/sif_silver.png';

interface NavbarProps {
  edition: 'gold' | 'silver';
}

export const Navbar: React.FC<NavbarProps> = ({ edition }) => {
  const { session, user, userRole, loading, openAuthModal, signOut } = useAuth();
  const { mode: themeMode, toggleAppTheme } = useAppTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLogo = edition === 'gold' ? sifGold : sifSilver;

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Cierre del dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegación por scroll suave
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    closeMobileMenu();
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    setIsUserDropdownOpen(false);
    await signOut();
  };

  // Etiqueta formateada para el rol del usuario
  const formatRoleTag = () => {
    switch (userRole) {
      case 'superadmin':
        return { label: 'Admin', bg: 'bg-[#ddb225]/15 text-[#ddb225] border-[#ddb225]/30' };
      case 'org_admin':
        return { label: 'Org', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      default:
        return { label: 'User', bg: 'dark:bg-white/10 bg-slate-200 dark:text-slate-300 text-slate-700 dark:border-white/15 border-slate-300' };
    }
  };

  const roleTag = formatRoleTag();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full dark:bg-[#09090b]/85 bg-white/85 backdrop-blur-md dark:border-white/[0.08] border-slate-200/80 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* ── Izquierda: Logotipo + Tagline ── */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center group focus:outline-none">
            <img
              src={currentLogo}
              alt="SIF - Sharing is Fast"
              className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
          <span className="h-6 w-px dark:bg-white/10 bg-slate-300 hidden sm:block" />
          <span className="dark:text-slate-400 text-slate-500 tracking-[0.2em] text-xs uppercase font-mono hidden sm:inline-block font-medium">
            SHARING IS FAST
          </span>
        </div>

        {/* ── Centro: Enlaces de navegación desktop con scroll suave ── */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-8 dark:text-slate-300 text-slate-600 text-sm font-medium tracking-wide"
        >
          <a
            href="#tecnologia"
            onClick={(e) => scrollToSection(e, '#tecnologia')}
            className="dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
          >
            Tecnología
          </a>
          <a
            href="#activacion"
            onClick={(e) => scrollToSection(e, '#activacion')}
            className="dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
          >
            Activación
          </a>
          <a
            href="#playground"
            onClick={(e) => scrollToSection(e, '#playground')}
            className="dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
          >
            Simulador
          </a>
          <a
            href="#modelos"
            onClick={(e) => scrollToSection(e, '#modelos')}
            className="dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
          >
            Modelos
          </a>
        </nav>

        {/* ── Derecha: Toggle Tema + Cápsula de Usuario / Login + Hamburguesa ── */}
        <div className="flex items-center gap-3">
          
          {/* Botón Toggle Modo Claro / Oscuro */}
          <button
            onClick={toggleAppTheme}
            aria-label={`Cambiar a modo ${themeMode === 'dark' ? 'claro' : 'oscuro'}`}
            title={`Cambiar a modo ${themeMode === 'dark' ? 'claro' : 'oscuro'}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border dark:border-white/15 border-slate-200/90 dark:bg-white/[0.06] bg-slate-100 dark:text-slate-300 text-slate-700 hover:text-amber-500 dark:hover:text-[#ddb225] transition-all duration-200 active:scale-95 shadow-sm"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* 1. Estado de Carga (Skeleton) */}
          {loading ? (
            <div className="h-9 w-32 rounded-full dark:bg-white/[0.06] bg-slate-200 animate-pulse border dark:border-white/10 border-slate-300" />
          ) : session && user ? (
            /* 2. Cápsula Ejecutiva del Usuario Autenticado */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 dark:bg-[#121215] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#1a1a1e] border dark:border-white/10 border-slate-200/90 hover:border-[#ddb225]/40 py-1.5 pl-2 pr-3 rounded-full transition-all duration-200 shadow-sm group focus:outline-none"
              >
                {/* Avatar (Foto de Google/Supabase o Iniciales) */}
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'Usuario'}
                    className="w-7 h-7 rounded-full object-cover border border-[#ddb225]/50 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ddb225]/40 to-slate-400/20 border border-[#ddb225]/40 flex items-center justify-center text-[10px] font-bold dark:text-white text-slate-800 uppercase shrink-0">
                    {user.user_metadata?.full_name
                      ? user.user_metadata.full_name.charAt(0)
                      : user.email?.charAt(0) || 'U'}
                  </div>
                )}

                {/* Nombre truncado + Tag de Rol */}
                <div className="hidden sm:flex items-center gap-2 max-w-[150px]">
                  <span className="truncate text-xs font-semibold dark:text-white text-slate-900">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${roleTag.bg}`}>
                    {roleTag.label}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200" />
              </button>

              {/* Menú Desplegable (Dropdown) */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 dark:bg-[#121215] bg-white border dark:border-white/10 border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-sif-fade-in backdrop-blur-xl">
                  {/* Encabezado del Dropdown */}
                  <div className="px-4 py-2.5 border-b dark:border-white/[0.06] border-slate-100">
                    <p className="text-xs font-semibold dark:text-white text-slate-900 truncate">
                      {user.user_metadata?.full_name || 'Usuario SIF'}
                    </p>
                    <p className="text-[11px] dark:text-slate-400 text-slate-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {/* Opciones */}
                  <div className="py-1">
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-white/[0.05] hover:bg-slate-100 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#ddb225]" />
                      <span>Ir al Panel de Control</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 3. Botón de Iniciar Sesión (Sin Sesión) */
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ddb225] to-[#f3cf55] hover:from-[#c59e1f] hover:to-[#e2bd42] text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md shadow-[#ddb225]/15 transition-all duration-200 active:scale-[0.97]"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar sesión</span>
            </button>
          )}

          {/* Botón Hamburguesa Móvil */}
          <button
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-xl dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white dark:hover:bg-white/[0.05] hover:bg-slate-100 transition-colors focus:outline-none"
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

      {/* ── Desplegable en Móvil ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t dark:border-white/[0.08] border-slate-200/80 dark:bg-[#09090b]/95 bg-white/95 backdrop-blur-2xl px-6 py-6 shadow-2xl transition-all">
          <nav className="flex flex-col gap-4 text-base font-medium dark:text-slate-300 text-slate-700">
            <a
              href="#tecnologia"
              onClick={(e) => scrollToSection(e, '#tecnologia')}
              className="py-2 dark:hover:text-white hover:text-slate-900 transition-colors border-b dark:border-white/[0.04] border-slate-100"
            >
              Tecnología
            </a>
            <a
              href="#activacion"
              onClick={(e) => scrollToSection(e, '#activacion')}
              className="py-2 dark:hover:text-white hover:text-slate-900 transition-colors border-b dark:border-white/[0.04] border-slate-100"
            >
              Activación
            </a>
            <a
              href="#playground"
              onClick={(e) => scrollToSection(e, '#playground')}
              className="py-2 dark:hover:text-white hover:text-slate-900 transition-colors border-b dark:border-white/[0.04] border-slate-100"
            >
              Simulador
            </a>
            <a
              href="#modelos"
              onClick={(e) => scrollToSection(e, '#modelos')}
              className="py-2 dark:hover:text-white hover:text-slate-900 transition-colors border-b dark:border-white/[0.04] border-slate-100"
            >
              Modelos
            </a>

            {/* Opciones de usuario en menú móvil */}
            {session && user ? (
              <div className="pt-2 flex flex-col gap-3">
                <Link
                  to="/admin/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#ddb225] text-black font-semibold text-sm transition-transform active:scale-[0.98]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ir al Panel de Control</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-red-500/30 text-red-500 font-medium text-sm hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  closeMobileMenu();
                  openAuthModal('login');
                }}
                className="mt-2 text-center w-full py-3 rounded-full bg-gradient-to-r from-[#ddb225] to-[#f3cf55] text-black font-semibold text-sm transition-transform active:scale-[0.98]"
              >
                Iniciar sesión
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};