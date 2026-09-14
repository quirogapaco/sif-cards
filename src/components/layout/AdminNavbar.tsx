import { useLocation } from 'react-router-dom';
import { Moon, Sun, ChevronRight, Home, Menu, LogOut } from 'lucide-react';
import { useAppTheme } from '../../context/AppThemeContext';
import { ADMIN_NAV_ITEMS } from '../../config/adminNav';
import { useState } from 'react';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

/**
 * Header del Panel SuperAdmin SiF.
 * - Botón hamburguesa para colapsar/expandir el sidebar.
 * - Breadcrumb dinámico basado en la ruta activa.
 * - Toggle Dark/Light + identificador SuperAdmin.
 * USA EXCLUSIVAMENTE tokens sif-* — NUNCA card-*.
 */
export default function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const { mode, toggleAppTheme } = useAppTheme();
  const location = useLocation();

  const activeItem = ADMIN_NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.path)
  );

  // ── Estado de sesión + modal ──────────────────────────────────────────
  const { user: authUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    // Para simplificar, obtenemos la instancia de supabase aquí en vez de importarla arriba (o la importamos)
    const { supabase } = await import('../../lib/supabase');
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="z-10 flex h-14 shrink-0 items-center border-b border-sif-border bg-sif-surface/80 px-4 backdrop-blur-md sm:px-5">

        {/* ── Hamburguesa + Breadcrumb ── */}
        <div className="flex flex-1 items-center gap-3 min-w-0">
          {/* Botón hamburguesa */}
          <button
            id="sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Alternar menú lateral"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sif-border text-sif-muted transition-all duration-150 hover:border-sif-gold hover:text-sif-gold active:scale-95"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 min-w-0 overflow-hidden"
          >
            <Home className="h-3.5 w-3.5 shrink-0 text-sif-muted" />
            <ChevronRight className="h-3 w-3 shrink-0 text-sif-muted" />
            <span className="hidden text-xs text-sif-muted sm:inline">Admin</span>
            {activeItem && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0 text-sif-muted" />
                <span
                  className="truncate text-xs font-semibold"
                  style={{ color: 'var(--sif-gold)' }}
                >
                  {activeItem.label}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* ── Acciones derechas ── */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        {/* Modo actual (solo desktop) */}
        <span className="hidden text-xs text-sif-muted lg:inline-block">
          Plataforma{' '}
          <span className="font-semibold" style={{ color: 'var(--sif-gold)' }}>
            {mode === 'dark' ? 'Dark' : 'Light'}
          </span>
        </span>

        {/* Toggle Dark / Light */}
        <button
          id="toggle-app-theme"
          onClick={toggleAppTheme}
          aria-label={`Cambiar a modo ${mode === 'dark' ? 'claro' : 'oscuro'}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-sif-border bg-sif-surface-subtle text-sif-muted transition-all duration-200 hover:border-sif-gold hover:text-sif-gold active:scale-95"
        >
          {mode === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Divisor */}
        <div className="h-5 w-px bg-sif-border" />

        {/* ── Perfil de Usuario / SuperAdmin ── */}
        {authUser ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-sif-border bg-sif-surface-subtle py-1 pl-1.5 pr-2.5">
            {/* Avatar (Foto o Iniciales) */}
            {authUser.user_metadata?.avatar_url ? (
              <img
                src={authUser.user_metadata.avatar_url}
                alt={authUser.user_metadata?.full_name || 'Usuario'}
                className="h-8 w-8 rounded-full border border-sif-gold/40 object-cover"
              />
            ) : (
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sif-border text-[11px] font-bold text-sif-text"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(212,175,55,0.35), rgba(226,232,240,0.15))',
                }}
              >
                {authUser.user_metadata?.full_name
                  ? authUser.user_metadata.full_name
                      .split(' ')
                      .slice(0, 2)
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                  : authUser.email?.substring(0, 2).toUpperCase() || 'US'}
              </div>
            )}

            {/* Datos de Usuario */}
            <div className="hidden flex-col leading-tight sm:flex min-w-0 max-w-[140px]">
              <span className="truncate text-xs font-semibold text-sif-text">
                {authUser.user_metadata?.full_name || authUser.email?.split('@')[0]}
              </span>
              <span className="truncate text-[10px]" style={{ color: 'var(--sif-gold)' }}>
                {authUser.email}
              </span>
            </div>

            {/* Divisor vertical interno */}
            <div className="h-4 w-px bg-sif-border" />

            {/* Botón Cerrar Sesión */}
            <button
              id="navbar-sign-out-btn"
              onClick={handleSignOut}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sif-muted transition-all duration-150 hover:bg-red-500/10 hover:text-red-400 active:scale-90"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setAuthModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setAuthModalOpen(true)}
            title="Haz clic para iniciar sesión"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-sif-border bg-sif-surface-subtle p-1 pr-3 transition-all duration-150 hover:border-sif-gold/50 active:scale-95"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border border-sif-border text-[11px] font-bold text-sif-text"
              style={{
                background:
                  'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(226,232,240,0.10))',
              }}
            >
              SA
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-xs font-semibold text-sif-text">
                Super Admin
              </span>
              <span className="text-[10px]" style={{ color: 'var(--sif-gold)' }}>
                Acceso Total
              </span>
            </div>
          </div>
        )}
        </div>
      </header>

      {/* ── Modal de Autenticación ── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
