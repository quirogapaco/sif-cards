import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppThemeProvider } from './context/AppThemeContext';
import LoadingFallback from './components/ui/LoadingFallback';

// ── Landing Page (Pública) ──────────────────────────────────────────────────
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));

// ── Páginas de Resolución y Onboarding ─────────────────────────────────────
const CardResolver     = lazy(() => import('./pages/resolver/CardResolver'));
const ActivateCardPage = lazy(() => import('./pages/onboarding/ActivateCardPage'));

// ── Layout persistente del panel Admin ─────────────────────────────────────
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// ── Páginas del Panel SuperAdmin ───────────────────────────────────────────
const GlobalDashboardPage = lazy(() => import('./pages/admin/GlobalDashboardPage'));
const CardsBatchesPage    = lazy(() => import('./pages/admin/CardsBatchesPage'));
const UsersPage           = lazy(() => import('./pages/admin/UsersPage'));
const OrganizationsPage   = lazy(() => import('./pages/admin/OrganizationsPage'));
const RenewalsPage        = lazy(() => import('./pages/admin/RenewalsPage'));
const SettingsPage        = lazy(() => import('./pages/admin/SettingsPage'));
const DashboardPage       = lazy(() => import('./pages/admin/DashboardPage'));

export default function App() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* ── Ruta raíz: Landing Page Oficial ── */}
            <Route path="/" element={<LandingPage />} />

            {/* ── Rutas Públicas de Resolución y Onboarding ── */}
            <Route path="/t/:token" element={<CardResolver />} />
            <Route path="/p/:slug/:token" element={<CardResolver />} />
            <Route path="/activate/:token" element={<ActivateCardPage />} />

            {/* ── Layout persistente del panel Admin ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"     element={<GlobalDashboardPage />} />
              <Route path="cards"         element={<CardsBatchesPage />} />
              <Route path="users"         element={<UsersPage />} />
              <Route path="organizations" element={<OrganizationsPage />} />
              <Route path="renewals"      element={<RenewalsPage />} />
              <Route path="settings"      element={<SettingsPage />} />
              <Route path="prueba"        element={<DashboardPage />} />
            </Route>

            {/* ── Ruta corporativa con prefijo de lote (B2B) ── */}
            <Route path="/:prefix/:token" element={<CardResolver />} />

            {/* ── Fallback 404: redirige a la Landing ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppThemeProvider>
  );
}