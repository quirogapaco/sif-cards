import { useState } from 'react';
import { Palette, ChevronUp, ChevronDown, Check, Camera } from 'lucide-react';
import { CARD_THEME_FAMILIES } from '../../../config/cardThemes';
import { BANNER_PRESETS } from '../../../config/bannerPresets';
import type { ProfileFormData } from './ProfileForm';

interface VisualsProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Visuals({ formData, onChange, isOpen, onToggle }: VisualsProps) {
  const [bannerTab, setBannerTab] = useState<'presets' | 'custom'>('presets');

  return (
    <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-sif-surface-subtle/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-gold/30 bg-sif-gold/10 text-sif-gold">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sif-text">2. Personalización Visual</h3>
            <p className="text-xs text-sif-muted">Paleta cromática y foto de portada</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-sif-muted" /> : <ChevronDown className="h-4 w-4 text-sif-muted" />}
      </button>

      {isOpen && (
        <div className="border-t border-sif-border p-5 flex flex-col gap-5">
          {/* Selector de Paleta */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-sif-muted">
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
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
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
              <label className="text-xs font-medium text-sif-muted">Banner de Perfil</label>
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
                <label className={`group relative h-20 rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center ${
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
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          onChange({ ...formData, banner_url: reader.result as string });
                        };
                        reader.readAsDataURL(file);
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
                      className={`group relative h-20 rounded-xl overflow-hidden cursor-pointer border transition-all ${
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
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => onChange({ ...formData, banner_url: e.target.value })}
                  placeholder="https://ejemplo.com/mi-banner.jpg"
                  className="flex-1 rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
