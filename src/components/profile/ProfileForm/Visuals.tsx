import { useState } from 'react';
import { Palette, ChevronUp, ChevronDown, Check, Camera } from 'lucide-react';
import { CARD_THEME_FAMILIES } from '../../../config/cardThemes';
import { BANNER_PRESETS } from '../../../config/bannerPresets';
import type { ProfileFormData } from './ProfileForm';

interface VisualsProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
}

export default function Visuals({ formData, onChange }: VisualsProps) {
  const [bannerTab, setBannerTab] = useState<'presets' | 'custom'>('presets');

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Selector de Paleta */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-medium text-sif-muted ml-1">
          Paleta Cromática ({CARD_THEME_FAMILIES.find(f => f.darkId === formData.theme_palette || f.lightId === formData.theme_palette)?.name || 'Emerald'})
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CARD_THEME_FAMILIES.map((family) => {
            const isSelected =
              formData.theme_palette === family.darkId ||
              formData.theme_palette === family.lightId;

            return (
              <button
                key={family.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...formData,
                    theme_palette: family.darkId,
                  })
                }
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-sif-gold bg-sif-gold/10 ring-2 ring-sif-gold/30'
                    : 'border-sif-border bg-sif-surface-subtle hover:border-sif-gold/40'
                }`}
              >
                <div
                  className="h-6 w-6 rounded-full border border-white/20 shadow-md mb-1.5 flex items-center justify-center"
                  style={{ backgroundColor: family.accentColor }}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 text-black stroke-[3]" />}
                </div>
                <span className="text-[11px] font-medium text-sif-text">
                  {family.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner de Encabezado */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-medium text-sif-muted ml-1">Banner de Perfil</label>
          <div className="flex items-center rounded-lg border border-sif-border bg-sif-surface-subtle p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setBannerTab('presets')}
              className={`px-3 py-1 rounded-md transition-all ${
                bannerTab === 'presets'
                  ? 'bg-sif-gold text-black font-medium shadow-sm'
                  : 'text-sif-muted hover:text-sif-text'
              }`}
            >
              Predeterminado
            </button>
            <button
              type="button"
              onClick={() => setBannerTab('custom')}
              className={`px-3 py-1 rounded-md transition-all ${
                bannerTab === 'custom'
                  ? 'bg-sif-gold text-black font-medium shadow-sm'
                  : 'text-sif-muted hover:text-sif-text'
              }`}
            >
              URL Propia
            </button>
          </div>
        </div>

        {bannerTab === 'presets' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
            <label className={`group relative h-16 rounded-lg overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center ${
              formData.banner_url && !BANNER_PRESETS.some(p => p.url === formData.banner_url)
                ? 'border-2 border-sif-gold ring-2 ring-sif-gold/40'
                : 'border-2 border-dashed border-sif-border hover:border-sif-gold/50 bg-sif-surface-subtle'
            }`}>
              {formData.banner_url && !BANNER_PRESETS.some(p => p.url === formData.banner_url) ? (
                <>
                  <img src={formData.banner_url} alt="Custom banner" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex items-end">
                    <span className="text-[10px] font-medium text-white truncate">
                      Tu Foto
                    </span>
                  </div>
                  <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-sif-gold text-black flex items-center justify-center">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 text-sif-muted group-hover:text-sif-gold mb-1 transition-colors" />
                  <span className="text-[10px] font-medium text-sif-muted group-hover:text-sif-gold transition-colors">Subir Foto</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const tempUrl = URL.createObjectURL(file);
                    onChange({ ...formData, banner_url: tempUrl, banner_file: file });
                  }
                }}
              />
            </label>
            {BANNER_PRESETS.map((preset) => {
              const isSelected = formData.banner_url === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => onChange({ ...formData, banner_url: preset.url })}
                  className={`group relative h-16 rounded-lg overflow-hidden cursor-pointer border transition-all ${
                    isSelected
                      ? 'border-sif-gold ring-2 ring-sif-gold/40'
                      : 'border-sif-border hover:border-sif-gold/50'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex items-end">
                    <span className="text-[10px] font-medium text-white truncate">
                      {preset.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-sif-gold text-black flex items-center justify-center">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative mt-2">
            <input
              type="url"
              id="banner_url"
              value={formData.banner_url}
              onChange={(e) => onChange({ ...formData, banner_url: e.target.value })}
              placeholder=" "
              className="peer w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 pb-1.5 pt-5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
            />
            <label htmlFor="banner_url" className="absolute left-3 top-2 text-[10px] font-medium text-sif-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-sif-gold pointer-events-none">
              URL del Banner (https://...)
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
