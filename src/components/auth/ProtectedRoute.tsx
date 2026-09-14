import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/database';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sif-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sif-gold border-t-transparent" />
          <p className="text-sm font-medium text-sif-muted">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !session) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-sif-bg">
        <h2 className="mb-2 text-2xl font-bold text-sif-text">Acceso Restringido</h2>
        <p className="text-sif-muted">
          Inicia sesión para acceder a esta sección.
        </p>
      </div>
    );
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-sif-bg">
        <h2 className="mb-2 text-2xl font-bold text-sif-text">Acceso Denegado</h2>
        <p className="text-sif-muted">
          No tienes permisos suficientes para ver esta página.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
