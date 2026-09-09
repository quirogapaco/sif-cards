import { Share2, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import SocialIcon from '../../ui/SocialIcon';
import type { ProfileFormData } from './ProfileForm';

interface ContactAndMediaProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SUPPORTED_SOCIAL_PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'github', label: 'GitHub' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'website', label: 'Sitio Web' },
  { id: 'other', label: 'Otro' },
];

export default function ContactAndMedia({ formData, onChange, isOpen, onToggle }: ContactAndMediaProps) {
  const addSocialLink = () => {
    const usedPlatforms = formData.social_links.map(l => l.platform);
    const availablePlatform = SUPPORTED_SOCIAL_PLATFORMS.find(
      p => !usedPlatforms.includes(p.id) || p.id === 'other' || p.id === 'website'
    )?.id || 'other';

    onChange({
      ...formData,
      social_links: [
        ...formData.social_links,
        { platform: availablePlatform, url: '' },
      ],
    });
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', val: string) => {
    const updated = [...formData.social_links];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...formData, social_links: updated });
  };

  const removeSocialLink = (index: number) => {
    onChange({
      ...formData,
      social_links: formData.social_links.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-sif-surface-subtle/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-gold/30 bg-sif-gold/10 text-sif-gold">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sif-text">3. Contacto Secundario y Redes Sociales</h3>
            <p className="text-xs text-sif-muted">Información adicional de contacto</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-sif-muted" /> : <ChevronDown className="h-4 w-4 text-sif-muted" />}
      </button>

      {isOpen && (
        <div className="border-t border-sif-border p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">Teléfono Fijo / Secundario</label>
              <input
                type="text"
                value={formData.direct_contacts.phone}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    direct_contacts: {
                      ...formData.direct_contacts,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder="2 234 5678"
                className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">Ubicación / Ciudad</label>
              <input
                type="text"
                value={formData.direct_contacts.location}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    direct_contacts: {
                      ...formData.direct_contacts,
                      location: e.target.value,
                    },
                  })
                }
                placeholder="Ej. Ambato, Ecuador"
                className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
              />
            </div>
          </div>

          {/* Redes Sociales Dinámicas */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-sif-muted">Redes Sociales</label>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center gap-1.5 text-xs font-semibold text-sif-gold hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Añadir Red Social</span>
              </button>
            </div>

            {formData.social_links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-2">
                  <SocialIcon platform={link.platform} className="h-4 w-4 text-sif-gold shrink-0" />
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                    className="bg-transparent text-xs font-medium text-sif-text outline-none cursor-pointer max-w-[120px]"
                  >
                    {SUPPORTED_SOCIAL_PLATFORMS.map((plat) => {
                      const isUsed = formData.social_links.some((l, i) => i !== idx && l.platform === plat.id);
                      const isDisabled = isUsed && plat.id !== 'other' && plat.id !== 'website';

                      return (
                        <option 
                          key={plat.id} 
                          value={plat.id} 
                          className="bg-sif-surface text-sif-text"
                          disabled={isDisabled}
                        >
                          {plat.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-xs text-sif-text outline-none focus:border-sif-gold"
                />

                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sif-border text-sif-muted transition-colors hover:border-red-500/40 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
