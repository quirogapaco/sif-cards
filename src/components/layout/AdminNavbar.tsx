import { useLocation } from 'react-router-dom';
import { Moon, Sun, ChevronRight, Home, Menu } from 'lucide-react';
import { useAppTheme } from '../../context/AppThemeContext';
import { ADMIN_NAV_ITEMS } from '../../config/adminNav';

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

  return (
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

        {/* Identificador SuperAdmin */}
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
