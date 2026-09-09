export interface BannerPreset {
  id: string;
  name: string;
  family: 'gold' | 'emerald' | 'sapphire' | 'wine' | 'monochrome' | 'purple';
  url: string;
}

export const BANNER_PRESETS: BannerPreset[] = [
  // ── GOLD ──
  {
    id: 'gold-mesh-1',
    name: 'Oro Líquido 3D',
    family: 'gold',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'gold-mesh-2',
    name: 'Ónix & Polvo de Oro',
    family: 'gold',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  },

  // ── EMERALD ──
  {
    id: 'emerald-mesh-1',
    name: 'Esmeralda Profunda',
    family: 'emerald',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop',
  },


  // ── SAPPHIRE ──
  {
    id: 'sapphire-mesh-1',
    name: 'Océano Cósmico',
    family: 'sapphire',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
  },


  // ── WINE ──
  {
    id: 'wine-mesh-1',
    name: 'Rubí Borgoña',
    family: 'wine',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'wine-mesh-2',
    name: 'Seda Rosa Metal',
    family: 'wine',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop',
  },

];
