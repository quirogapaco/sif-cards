import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { userService } from '../services/userService';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { UserRole } from '../types/database';

export type AuthMode = 'login' | 'register';

interface AuthContextValue {
  session: Session | null;
  user: SupabaseUser | null;
  userRole: UserRole | null;
  orgId: string | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  userRole: null,
  orgId: null,
  loading: true,
  isAuthModalOpen: false,
  authModalMode: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Estado global del modal de autenticación ──
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  /**
   * Cierre de sesión completo: invalida token en Supabase, resetea estado local y limpia storage.
   */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error al cerrar sesión en Supabase:', err);
    } finally {
      setSession(null);
      setUser(null);
      setUserRole(null);
      setOrgId(null);
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Error al limpiar storage del navegador:', e);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await userService.ensureUserRecord(initialSession.user.id);
          const record = await userService.getUserRecord(initialSession.user.id);
          if (mounted) {
            setUserRole(record?.role as UserRole | null);
            setOrgId(record?.org_id || null);
          }
        }
        
        setLoading(false);
      }
    }

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await userService.ensureUserRecord(newSession.user.id);
        const record = await userService.getUserRecord(newSession.user.id);
        setUserRole(record?.role as UserRole | null);
        setOrgId(record?.org_id || null);
      } else {
        setUserRole(null);
        setOrgId(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        orgId,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
