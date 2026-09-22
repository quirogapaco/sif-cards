import { Camera, Image as ImageIcon } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { ProfileFormData } from './ProfileForm';

interface PersonalInfoProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  fieldErrors?: { [key: string]: boolean };
}

export default function PersonalInfo({ formData, onChange, fieldErrors = {} }: PersonalInfoProps) {
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
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            <label className="flex items-center justify-center gap-1.5 rounded-lg border border-sif-gold/30 bg-sif-gold/10 px-3 py-1.5 text-[11px] font-semibold text-sif-gold cursor-pointer hover:bg-sif-gold/20 transition-colors text-center w-fit">
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
          </div>
        </div>
      </div>

      {/* Nombre a Mostrar */}
      <div className="relative mt-2">
        <input
          type="text"
          id="display_name"
          required
          value={formData.display_name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder=" "
          className="peer w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 pb-1.5 pt-5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
        />
        <label htmlFor="display_name" className="absolute left-3 top-2 text-[10px] font-medium text-sif-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-sif-gold pointer-events-none">
          Nombre a Mostrar *
        </label>
      </div>

      {/* Cargo y Empresa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <input
            type="text"
            id="job_title"
            required
            value={formData.job_title}
            onChange={(e) => onChange({ ...formData, job_title: e.target.value })}
            placeholder=" "
            className="peer w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 pb-1.5 pt-5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
          />
          <label htmlFor="job_title" className="absolute left-3 top-2 text-[10px] font-medium text-sif-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-sif-gold pointer-events-none">
            Cargo / Ocupación *
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="company"
            required
            value={formData.company}
            onChange={(e) => onChange({ ...formData, company: e.target.value })}
            placeholder=" "
            className="peer w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 pb-1.5 pt-5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
          />
          <label htmlFor="company" className="absolute left-3 top-2 text-[10px] font-medium text-sif-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-sif-gold pointer-events-none">
            Empresa *
          </label>
        </div>
      </div>

      {/* Slug Personalizado */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium text-sif-muted ml-1">
          Enlace Personalizado *
        </label>
        <div className={`flex items-center rounded-xl border bg-sif-surface-subtle px-3 py-1.5 text-sm transition-colors ${
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
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-sif-muted ml-1">
            WhatsApp *
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
            className="flex items-center gap-2 rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-sm text-sif-text transition-colors focus-within:border-sif-gold [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:text-sif-text [&_.PhoneInputInput]:w-full [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon]:w-6"
          />
        </div>

        <div className="relative mt-[18px]">
          <input
            type="email"
            id="email"
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
            placeholder=" "
            className="peer w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 pb-1.5 pt-5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
          />
          <label htmlFor="email" className="absolute left-3 top-2 text-[10px] font-medium text-sif-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-sif-gold pointer-events-none">
            Email *
          </label>
        </div>
      </div>
    </div>
  );
}
