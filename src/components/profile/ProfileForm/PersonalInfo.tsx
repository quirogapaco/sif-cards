import { useState } from 'react';
import { Camera, Image as ImageIcon, Info } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import ImageCropperModal from '../ImageCropperModal';
import 'react-phone-number-input/style.css';
import type { ProfileFormData } from './ProfileForm';
import LabelWithHint from './LabelWithHint';

interface PersonalInfoProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  fieldErrors?: { [key: string]: boolean };
}

export default function PersonalInfo({ formData, onChange, fieldErrors = {} }: PersonalInfoProps) {
  const [cropperData, setCropperData] = useState<{ src: string; file: File } | null>(null);

  const handleNameChange = (name: string) => {
    onChange({
      ...formData,
      display_name: name,
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
                    setCropperData({ src: tempUrl, file });
                    e.target.value = '';
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Nombre a Mostrar */}
      <div className="relative mt-2">
        <LabelWithHint htmlFor="display_name" label="Nombre a Mostrar *" hint="Así aparecerá tu nombre principal en la tarjeta." />
        <input
          type="text"
          id="display_name"
          required
          value={formData.display_name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ej: Juan Pérez"
          className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
        />
      </div>

      {/* Cargo y Empresa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <LabelWithHint htmlFor="job_title" label="Cargo / Ocupación *" hint="Tu puesto actual o profesión destacada." />
          <input
            type="text"
            id="job_title"
            required
            value={formData.job_title}
            onChange={(e) => onChange({ ...formData, job_title: e.target.value })}
            placeholder="Ej: Gerente de Ventas"
            className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
          />
        </div>

        <div className="relative">
          <LabelWithHint htmlFor="company" label="Empresa *" hint="La empresa para la que trabajas o tu propia marca." />
          <input
            type="text"
            id="company"
            required
            value={formData.company}
            onChange={(e) => onChange({ ...formData, company: e.target.value })}
            placeholder="Ej: TechCorp S.A."
            className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
          />
        </div>
      </div>

      {/* Slug Personalizado */}
      <div className="flex flex-col gap-1">
        <LabelWithHint label="Personaliza el enlace de tu perfil *" hint="Este será tu enlace único para compartir (ej: sif.link/p/tu-nombre)." />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        <div className="flex flex-col gap-1">
          <LabelWithHint label="WhatsApp *" hint="Número principal para que te contacten rápidamente por WhatsApp." />
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

        <div className="flex flex-col gap-1 w-full sm:col-span-1">
          <LabelWithHint label="Emails *" hint="Agrega uno o varios correos a los que te puedan escribir." />
          {(formData.direct_contacts.emails?.length ? formData.direct_contacts.emails : ['']).map((em, idx, arr) => (
            <div key={idx} className="relative flex gap-2 items-center w-full mt-1">
              <div className="relative flex-1">
                <input
                  type="email"
                  required={idx === 0}
                  value={em}
                  onChange={(e) => {
                    const newEmails = [...(formData.direct_contacts.emails?.length ? formData.direct_contacts.emails : [''])];
                    newEmails[idx] = e.target.value;
                    onChange({
                      ...formData,
                      direct_contacts: {
                        ...formData.direct_contacts,
                        emails: newEmails,
                        email: idx === 0 ? e.target.value : formData.direct_contacts.email,
                      },
                    });
                  }}
                  className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold transition-colors"
                  placeholder={`Ej: correo${idx > 0 ? idx + 1 : ''}@empresa.com`}
                />
              </div>
              
              {idx === arr.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentEmails = formData.direct_contacts.emails?.length ? formData.direct_contacts.emails : [''];
                    onChange({
                      ...formData,
                      direct_contacts: {
                        ...formData.direct_contacts,
                        emails: [...currentEmails, ''],
                      },
                    });
                  }}
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-sif-gold/10 text-sif-gold border border-sif-gold/30 hover:bg-sif-gold/20 transition-colors"
                >
                  <span className="text-lg font-medium">+</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const currentEmails = formData.direct_contacts.emails?.length ? formData.direct_contacts.emails : [''];
                    const newEmails = currentEmails.filter((_, i) => i !== idx);
                    onChange({
                      ...formData,
                      direct_contacts: {
                        ...formData.direct_contacts,
                        emails: newEmails,
                        email: newEmails[0] || '',
                      },
                    });
                  }}
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  <span className="text-lg font-medium">-</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {cropperData && (
        <ImageCropperModal
          imageSrc={cropperData.src}
          aspect={1}
          cropShape="round"
          title="Recortar Foto de Perfil"
          onClose={() => setCropperData(null)}
          onCropComplete={(croppedFile) => {
            const tempUrl = URL.createObjectURL(croppedFile);
            onChange({ ...formData, avatar_url: tempUrl, avatar_file: croppedFile });
            setCropperData(null);
          }}
        />
      )}
    </div>
  );
}
