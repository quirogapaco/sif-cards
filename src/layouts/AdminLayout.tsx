import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/layout/AdminNavbar';
import AdminSidebar from '../components/layout/AdminSidebar';

/**
 * Layout maestro del Panel SuperAdmin SIF.
 *
 * Estructura corregida:
 *   ┌──────────┬────────────────────────────────┐
 *   │          │  AdminNavbar (solo content)     │
 *   │ Sidebar  ├────────────────────────────────┤
 *   │ (full h) │  <Outlet />                    │
 *   └──────────┴────────────────────────────────┘
 *
 * - Desktop lg+: sidebar inline, alterna entre ancho completo (w-60)
 *   e icono-solo (w-14) con transición suave.
 * - Mobile: sidebar como drawer overlay con backdrop.
 */
export default function AdminLayout() {
  // true = expandido / false = colapsado
  const [expanded, setExpanded] = useState(true);

  const toggle = () => setExpanded((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-sif-bg text-sif-text transition-colors duration-300">

      {/* ── Backdrop para móvil (solo visible cuando el drawer está abierto) ── */}
      {expanded && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (columna izquierda, toda la altura) ── */}
      <AdminSidebar expanded={expanded} onClose={toggle} />

      {/* ── Columna derecha: Navbar + Contenido ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar onToggleSidebar={toggle} />

        <main className="flex-1 overflow-auto bg-sif-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
