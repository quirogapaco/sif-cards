import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppThemeProvider } from './context/AppThemeContext';
import AdminLayout from './layouts/AdminLayout';

// ── Páginas del Panel SuperAdmin ──────────────────────────────────────────────
import GlobalDashboardPage from './pages/admin/GlobalDashboardPage';
import CardsBatchesPage    from './pages/admin/CardsBatchesPage';
import UsersPage           from './pages/admin/UsersPage';
import OrganizationsPage   from './pages/admin/OrganizationsPage';
import RenewalsPage        from './pages/admin/RenewalsPage';
import SettingsPage        from './pages/admin/SettingsPage';
import DashboardPage       from './pages/admin/DashboardPage';   // ← Pestaña "Prueba"

/**
 * Raíz de la aplicación SiF con React Router.
 *
 * Árbol de rutas:
 *   /                        → redirect → /admin/dashboard
 *   /admin                   → AdminLayout (Sidebar + Navbar persistentes)
 *     /admin/dashboard       → Dashboard Global (métricas)
 *     /admin/cards           → Lotes & Tarjetas NFC
 *     /admin/users           → Clientes & Cuentas
 *     /admin/organizations   → Organizaciones B2B
 *     /admin/renewals        → Finanzas & Renovaciones
 *     /admin/settings        → Configuración Global
 *     /admin/prueba          → Prueba de Tarjetas (previsualización de temas)
 */
export default function App() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect raíz → dashboard */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Layout persistente del panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"     element={<GlobalDashboardPage />} />
            <Route path="cards"         element={<CardsBatchesPage />} />
            <Route path="users"         element={<UsersPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="renewals"      element={<RenewalsPage />} />
            <Route path="settings"      element={<SettingsPage />} />
            {/* ── Pestaña Prueba: previsualización de temas de tarjeta ── */}
            <Route path="prueba"        element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppThemeProvider>
  );
}