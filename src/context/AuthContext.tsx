import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { userService } from '../services/userService';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { UserRole } from '../types/database';

interface AuthContextValue {
  session: Session | null;
  user: SupabaseUser | null;
  userRole: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  userRole: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          // Ensure user record exists and then fetch role
          await userService.ensureUserRecord(initialSession.user.id);
          const role = await userService.getUserRole(initialSession.user.id);
          if (mounted) setUserRole(role);
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
        const role = await userService.getUserRole(newSession.user.id);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
