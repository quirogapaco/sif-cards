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
    try {
      const stored = localStorage.getItem(APP_THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch {
      // Ignorar excepciones de acceso a localStorage en navegadores restrictivos
    }
    return DEFAULT_APP_THEME;
  });

  // Sincroniza la clase .dark y data-app-theme en <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-app-theme', mode);
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(APP_THEME_STORAGE_KEY, mode);
    } catch {
      // Fallback silencioso
    }
  }, [mode]);

  const toggleAppTheme = () =>
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <AppThemeContext.Provider value={{ mode, toggleAppTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
}

/** Hook para consumir el contexto del tema global SIF */
export function useAppTheme(): AppThemeContextValue {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used inside <AppThemeProvider>');
  }
  return ctx;
}
