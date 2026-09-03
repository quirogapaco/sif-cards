// Tipos para el sistema de doble tematización SiF

/** Modo del App Shell (plataforma SiF) */
export type AppThemeMode = 'dark' | 'light';

/** IDs de los 12 temas de tarjeta disponibles */
export type CardThemeId =
  | 'gold-dark'
  | 'gold-light'
  | 'purple-dark'
  | 'purple-light'
  | 'monochrome-dark'
  | 'monochrome-light'
  | 'sapphire-dark'
  | 'sapphire-light'
  | 'emerald-dark'
  | 'emerald-light'
  | 'wine-dark'
  | 'wine-light';

/** Modo de la tarjeta (independiente del App Shell) */
export type CardThemeMode = 'dark' | 'light';
