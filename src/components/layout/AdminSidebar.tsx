import { NavLink, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '../../config/adminNav';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  expanded: boolean;
  onClose: () => void;
}

/**
 * Sidebar del Panel SuperAdmin SIF.
 *
 * Comportamiento:
 * - Mobile (<lg): drawer overlay que desliza desde la izquierda.
 * - Desktop (lg+): inline; alterna entre ancho completo (w-60)
 *   e icono-solo (w-14) con transición suave.
 *
 * USA EXCLUSIVAMENTE tokens sif-* — NUNCA card-*.
 */
export default function AdminSidebar({ expanded, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { userRole, user } = useAuth();

  return (
    <aside
      className={[
        // ── Posicionamiento base ──
        'z-30 flex h-full shrink-0 flex-col border-r border-sif-border bg-sif-surface',
        'transition-all duration-300 ease-in-out',
        // ── Mobile: drawer overlay ──
        'fixed inset-y-0 left-0 lg:relative lg:inset-auto',
        // ── Ancho según estado ──
        expanded ? 'w-60' : '-translate-x-full lg:translate-x-0 lg:w-14',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Logo / Branding ── */}
      <div className="flex h-14 items-center border-b border-sif-border px-3">
        {/* Monograma — siempre visible */}
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-sif-border"
          style={{
            background:
              'linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(226,232,240,0.08) 100%)',
          }}
        >
          <span
            className="font-serif text-sm font-bold"
            style={{ color: 'var(--sif-gold)' }}
          >
            S
          </span>
        </div>

        {/* Texto — solo cuando está expandido */}
        <div
          className={`ml-3 min-w-0 overflow-hidden transition-all duration-200 ${
            expanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 lg:invisible'
          }`}
        >
          <p
            className="whitespace-nowrap font-serif text-sm font-bold tracking-tight"
            style={{
              background:
                'linear-gradient(90deg, var(--sif-gold) 0%, var(--sif-silver) 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SIF
          </p>
          <p className="whitespace-nowrap text-[9px] font-medium uppercase tracking-widest text-sif-muted">
            Sharing is Fast
          </p>
        </div>

        {/* Botón cerrar — solo mobile */}
        <button
          onClick={onClose}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-sif-muted hover:text-sif-text lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Navegación ── */}
      <nav className="flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-2 pt-3">
        {expanded && (
          <p className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-widest text-sif-muted">
            Panel de Control
          </p>
        )}

        {ADMIN_NAV_ITEMS.filter(
          (item) => !item.allowedRoles || (userRole && item.allowedRoles.includes(userRole))
        ).map(({ id, label, path, icon: Icon }) => {
          const isPrueba = id === 'prueba';
          const isActive = location.pathname.startsWith(path);

          return (
            <NavLink
              key={id}
              to={path}
              id={`sidebar-nav-${id}`}
              onClick={() => {
                // Cierra el drawer en mobile al navegar
                if (window.innerWidth < 1024) onClose();
              }}
              title={!expanded ? label : undefined}
              className={[
                'group flex items-center rounded-xl px-2 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-sif-surface-subtle text-sif-text'
                  : 'text-sif-muted hover:bg-sif-surface-subtle hover:text-sif-text',
                isPrueba && expanded ? 'mt-2 border border-dashed border-sif-border' : '',
                isPrueba && !expanded ? 'mt-2' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                isActive
                  ? { boxShadow: 'inset 3px 0 0 var(--sif-gold)' }
                  : {}
              }
            >
              <Icon
                className="h-4 w-4 shrink-0 transition-colors"
                style={isActive ? { color: 'var(--sif-gold)' } : {}}
              />

              {/* Label — solo expandido */}
              <span
                className={`ml-3 flex-1 truncate transition-all duration-200 ${
                  expanded ? 'opacity-100' : 'w-0 opacity-0 overflow-hidden'
                }`}
              >
                {label}
              </span>

              {/* Badge "Dev" — solo expandido + prueba */}
              {isPrueba && expanded && (
                <span
                  className="ml-auto rounded px-1 py-px text-[8px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    color: 'var(--sif-gold)',
                  }}
                >
                  Dev
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer del sidebar (solo expandido) ── */}
      <div className="mt-auto border-t border-sif-border p-3">
        <div className={`flex items-center ${expanded ? 'gap-2.5' : 'justify-center'}`}>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sif-border text-[11px] font-bold text-sif-text"
            style={{
              background:
                'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(226,232,240,0.12))',
            }}
          >
            SA
          </div>
          {expanded && user && (
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-xs font-semibold text-sif-text">
                {user.user_metadata?.full_name || 'Admin'}
              </p>
              <p className="truncate text-[10px] text-sif-muted">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
