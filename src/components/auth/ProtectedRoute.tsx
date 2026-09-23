import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/database';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, userRole, loading, openAuthModal } = useAuth();

  useEffect(() => {
    // Si la verificación terminó y no hay sesión activa en una ruta protegida, abre el modal de login
    if (!loading && allowedRoles && !session) {
      openAuthModal('login');
    }
  }, [loading, allowedRoles, session, openAuthModal]);

  // Pantalla de carga sutil durante la comprobación de sesión
  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#ddb225]" />
          <p className="text-sm font-medium text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // 1. Sin sesión activa: Redirección inmediata a la raíz (bloquea el acceso a la URL)
  if (allowedRoles && !session) {
    return <Navigate to="/" replace />;
  }

  // 2. Rol no autorizado: Redirección inmediata a la raíz
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
