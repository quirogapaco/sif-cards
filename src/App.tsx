import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppThemeProvider } from './context/AppThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingFallback from './components/ui/LoadingFallback';

// ── Páginas de Resolución y Onboarding ─────────────────────────────────────
const CardResolver = lazy(() => import('./pages/resolver/CardResolver'));
const ActivateCardPage = lazy(() => import('./pages/onboarding/ActivateCardPage'));

// ── Layout persistente del panel Admin ─────────────────────────────────────
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// ── Páginas del Panel SuperAdmin ───────────────────────────────────────────
const GlobalDashboardPage = lazy(() => import('./pages/admin/GlobalDashboardPage'));
const CardsBatchesPage = lazy(() => import('./pages/admin/CardsBatchesPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const OrganizationsPage = lazy(() => import('./pages/admin/OrganizationsPage'));
const RenewalsPage = lazy(() => import('./pages/admin/RenewalsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));

/**
 * Raíz de la aplicación SiF con React Router.
 *
 * Árbol de rutas:
 *   /                        → redirect → /admin/dashboard
 *   /t/:token                → Resolución estándar de chip NFC / QR físico
 *   /p/:slug                 → Acceso público directo por slug de perfil
 *   /activate/:token         → Activación y onboarding de tarjeta virgen
 *   /admin                   → AdminLayout (Sidebar + Navbar persistentes)
 *     /admin/dashboard       → Dashboard Global (métricas)
 *     /admin/cards           → Lotes & Tarjetas NFC
 *     /admin/users           → Clientes & Cuentas
 *     /admin/organizations   → Organizaciones B2B
 *     /admin/renewals        → Finanzas & Renovaciones
 *     /admin/settings        → Configuración Global
 *     /admin/prueba          → Prueba de Tarjetas (previsualización de temas)
 *   /:prefix/:token          → Ruta corporativa con prefijo de lote (B2B, e.g. /segurossuarez/a7x9q2)
 */
export default function App() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Redirect raíz → dashboard */}
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

              {/* ── Rutas Públicas de Resolución y Onboarding ── */}
              <Route path="/t/:token" element={<CardResolver />} />
              <Route path="/p/:slug/:token" element={<CardResolver />} />
              <Route path="/activate/:token" element={<ActivateCardPage />} />

              {/* ── Layout persistente del panel Admin ── */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />

                {/* Rutas para superadmin y org_admin */}
                <Route element={<ProtectedRoute allowedRoles={['superadmin', 'org_admin']} />}>
                  <Route path="dashboard" element={<GlobalDashboardPage />} />
                  <Route path="cards" element={<CardsBatchesPage />} />
                </Route>

                {/* Rutas solo para superadmin */}
                <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
                  <Route path="users" element={<UsersPage />} />
                  <Route path="organizations" element={<OrganizationsPage />} />
                  <Route path="renewals" element={<RenewalsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* ── Pestaña Prueba: previsualización de temas de tarjeta ── */}
                {/* Accesible para usuarios (y admins) */}
                <Route element={<ProtectedRoute allowedRoles={['superadmin', 'org_admin', 'user']} />}>
                  <Route path="prueba" element={<DashboardPage />} />
                </Route>
              </Route>

              {/* ── Ruta corporativa con prefijo de lote (B2B) ── */}
              <Route path="/:prefix/:token" element={<CardResolver />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppThemeProvider>
    </AuthProvider>
  );
}
