import { User, ChevronUp, ChevronDown, Camera, Image as ImageIcon } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { ProfileFormData } from './ProfileForm';

interface PersonalInfoProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  isOpen: boolean;
  onToggle: () => void;
  fieldErrors?: { [key: string]: boolean };
}

export default function PersonalInfo({ formData, onChange, isOpen, onToggle, fieldErrors = {} }: PersonalInfoProps) {
  const handleNameChange = (name: string) => {
    const slugified = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    onChange({
      ...formData,
      display_name: name,
      slug: slugified,
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
            <User className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sif-text">1. Datos Personales</h3>
            <p className="text-xs text-sif-muted">Estos datos son obligatorios y aparecerán en tu perfil.</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-sif-muted" /> : <ChevronDown className="h-4 w-4 text-sif-muted" />}
      </button>

      {isOpen && (
        <div className="border-t border-sif-border p-5 flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-sif-muted">Foto de Perfil</label>
            <div className="flex items-center gap-4">
              {formData.avatar_url ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-sif-gold shrink-0 bg-sif-surface-subtle">
                  <img src={formData.avatar_url} alt="Avatar preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-sif-border bg-sif-surface-subtle shrink-0">
                  <ImageIcon className="h-6 w-6 text-sif-muted" />
                </div>
              )}
              
              <div className="flex-1 flex flex-col gap-2">
                <label className="flex items-center justify-center gap-2 rounded-xl border border-sif-gold/30 bg-sif-gold/10 px-4 py-2 text-xs font-semibold text-sif-gold cursor-pointer hover:bg-sif-gold/20 transition-colors text-center w-fit">
                  <Camera className="h-4 w-4" />
                  <span>Tomar Foto o Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const tempUrl = URL.createObjectURL(file);
                        onChange({ ...formData, avatar_url: tempUrl, avatar_file: file });
                      }
                    }}
                  />
                </label>
                <p className="text-[10px] text-sif-muted">
                  Selecciona una imagen desde tu galería o usa la cámara.
                </p>
              </div>
            </div>
          </div>

          {/* Nombre a Mostrar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-sif-muted">
              Nombre a Mostrar <span className="text-sif-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.display_name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
            />
          </div>

          {/* Cargo y Empresa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">
                Cargo / Ocupación <span className="text-sif-gold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => onChange({ ...formData, job_title: e.target.value })}
                placeholder="Ej. Director de Marketing"
                className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">
                Empresa <span className="text-sif-gold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => onChange({ ...formData, company: e.target.value })}
                placeholder="Ej. SiF Tech"
                className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
              />
            </div>
          </div>

          {/* Slug Personalizado */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-sif-muted">
              Enlace Personalizado <span className="text-sif-gold">*</span>
            </label>
            <div className={`flex items-center rounded-xl border bg-sif-surface-subtle px-4 py-2.5 text-sm transition-colors ${
              fieldErrors.slug ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'border-sif-border focus-within:border-sif-gold'
            }`}>
              <span className="text-sif-muted select-none">sif.link/p/</span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ''),
                  })
                }
                placeholder="juan-perez"
                className="flex-1 bg-transparent font-semibold text-sif-gold outline-none"
              />
            </div>
          </div>

          {/* WhatsApp & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">
                WhatsApp <span className="text-sif-gold">*</span>
              </label>
              <PhoneInput
                international
                defaultCountry="EC"
                value={formData.direct_contacts.whatsapp}
                onChange={(value) =>
                  onChange({
                    ...formData,
                    direct_contacts: {
                      ...formData.direct_contacts,
                      whatsapp: value || '',
                    },
                  })
                }
                className="flex items-center gap-2 rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2 text-sm text-sif-text transition-colors focus-within:border-sif-gold [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:text-sif-text [&_.PhoneInputInput]:w-full [&_.PhoneInputCountryIcon]:h-5 [&_.PhoneInputCountryIcon]:w-7"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">
                Email <span className="text-sif-gold">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.direct_contacts.email}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    direct_contacts: {
                      ...formData.direct_contacts,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="juan@correo.com"
                className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
