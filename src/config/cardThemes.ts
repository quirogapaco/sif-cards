// Configuración extensible de familias de temas para las tarjetas de perfil.
// Para agregar un nuevo tema: añade un objeto a CARD_THEME_FAMILIES y los
// bloques CSS correspondientes en index.css.

export interface CardThemeFamily {
  id: string;
  name: string;
  /** Color de acento (se lee desde CSS mediante --card-primary) */
  darkId: string;
  lightId: string;
}

export const CARD_THEME_FAMILIES: CardThemeFamily[] = [
  {
    id: 'gold',
    name: 'Gold',
    darkId: 'gold-dark',
    lightId: 'gold-light',
  },
  {
    id: 'purple',
    name: 'Purple',
    darkId: 'purple-dark',
    lightId: 'purple-light',
  },
  {
    id: 'monochrome',
    name: 'Mono',
    darkId: 'monochrome-dark',
    lightId: 'monochrome-light',
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    darkId: 'sapphire-dark',
    lightId: 'sapphire-light',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    darkId: 'emerald-dark',
    lightId: 'emerald-light',
  },
  {
    id: 'wine',
    name: 'Wine',
    darkId: 'wine-dark',
    lightId: 'wine-light',
  },
];

export const DEFAULT_CARD_THEME = 'emerald-dark';
