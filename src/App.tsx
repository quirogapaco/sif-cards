import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppThemeProvider } from './context/AppThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingFallback from './components/ui/LoadingFallback';
import AuthModal from './components/auth/AuthModal';

// ── Landing Page (Pública) ──────────────────────────────────────────────────
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));

// ── Páginas de Resolución y Onboarding ─────────────────────────────────────
const CardResolver = lazy(() => import('./pages/resolver/CardResolver'));
const ActivateCardPage = lazy(() => import('./pages/onboarding/ActivateCardPage'));

// ── Layout persistente del panel Admin ─────────────────────────────────────
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// ── Páginas del Panel SuperAdmin ───────────────────────────────────────────
const GlobalDashboardPage = lazy(() => import('./pages/admin/batchAdmin/GlobalDashboardPage'));
const CardsBatchesPage = lazy(() => import('./pages/admin/batchAdmin/CardsBatchesPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const OrganizationsPage = lazy(() => import('./pages/admin/OrganizationsPage'));
const RenewalsPage = lazy(() => import('./pages/admin/RenewalsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const EditProfiles = lazy(() => import('./pages/admin/EditProfiles'));

/**
 * Componente modal de autenticación global enlazado al AuthContext.
 */
function GlobalAuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode } = useAuth();
  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      initialMode={authModalMode}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <GlobalAuthModal />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* ── Ruta raíz: Landing Page Oficial ── */}
              <Route path="/" element={<LandingPage />} />

              {/* ── Rutas Públicas de Resolución y Onboarding ── */}
              <Route path="/t/:token" element={<CardResolver />} />
              <Route path="/p/:slug/:token" element={<CardResolver />} />
              <Route path="/activate/:token" element={<ActivateCardPage />} />

              {/* ── Layout persistente del panel Admin (Protegido globalmente) ── */}
              <Route element={<ProtectedRoute allowedRoles={['superadmin', 'org_admin', 'user']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />

                  {/* Rutas compartidas (todos los roles) */}
                  <Route element={<ProtectedRoute allowedRoles={['superadmin', 'org_admin', 'user']} />}>
                    <Route path="dashboard" element={<GlobalDashboardPage />} />
                  </Route>

                  {/* Rutas para superadmin y org_admin */}
                  <Route element={<ProtectedRoute allowedRoles={['superadmin', 'org_admin']} />}>
                    <Route path="cards" element={<CardsBatchesPage />} />
                  </Route>

                  {/* Rutas solo para superadmin */}
                  <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
                    <Route path="users" element={<UsersPage />} />
                    <Route path="organizations" element={<OrganizationsPage />} />
                    <Route path="renewals" element={<RenewalsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* ── Pestaña Mi Perfil: edición de perfiles ── */}
                  <Route element={<ProtectedRoute allowedRoles={['superadmin', 'org_admin', 'user']} />}>
                    <Route path="profile" element={<EditProfiles />} />
                  </Route>
                </Route>
              </Route>

              {/* ── Ruta corporativa con prefijo de lote (B2B) ── */}
              <Route path="/:prefix/:token" element={<CardResolver />} />

              {/* ── Fallback 404: redirige a la Landing ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppThemeProvider>
    </AuthProvider>
  );
}
