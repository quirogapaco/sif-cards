import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppThemeMode } from '../types/themes';
import { DEFAULT_APP_THEME, APP_THEME_STORAGE_KEY } from '../config/appTheme';

interface AppThemeContextValue {
  mode: AppThemeMode;
  toggleAppTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppThemeMode>(() => {
    const stored = localStorage.getItem(APP_THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : DEFAULT_APP_THEME;
  });

  // Aplica el atributo en <html> cada vez que el modo cambia
  useEffect(() => {
    document.documentElement.setAttribute('data-app-theme', mode);
    localStorage.setItem(APP_THEME_STORAGE_KEY, mode);
  }, [mode]);

  const toggleAppTheme = () =>
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <AppThemeContext.Provider value={{ mode, toggleAppTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
}

/** Hook para consumir el contexto del tema global SiF */
export function useAppTheme(): AppThemeContextValue {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used inside <AppThemeProvider>');
  }
  return ctx;
}
