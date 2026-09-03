// Configuración extensible de familias de temas para las tarjetas de perfil.
// Para agregar un nuevo tema: añade un objeto a CARD_THEME_FAMILIES y los
// bloques CSS correspondientes en index.css.

export interface CardThemeFamily {
  id: string;
  name: string;
  /** Color de acento para la previsualización en la UI */
  accentColor: string;
  darkId: string;
  lightId: string;
}

export const CARD_THEME_FAMILIES: CardThemeFamily[] = [
  {
    id: 'gold',
    name: 'Gold',
    accentColor: '#F59E0B',
    darkId: 'gold-dark',
    lightId: 'gold-light',
  },
  {
    id: 'purple',
    name: 'Purple',
    accentColor: '#A855F7',
    darkId: 'purple-dark',
    lightId: 'purple-light',
  },
  {
    id: 'monochrome',
    name: 'Mono',
    accentColor: '#737373',
    darkId: 'monochrome-dark',
    lightId: 'monochrome-light',
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    accentColor: '#3B82F6',
    darkId: 'sapphire-dark',
    lightId: 'sapphire-light',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    accentColor: '#10B981',
    darkId: 'emerald-dark',
    lightId: 'emerald-light',
  },
  {
    id: 'wine',
    name: 'Wine',
    accentColor: '#FB7185',
    darkId: 'wine-dark',
    lightId: 'wine-light',
  },
];

export const DEFAULT_CARD_THEME = 'emerald-dark';
