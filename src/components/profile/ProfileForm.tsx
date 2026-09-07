import { useState } from 'react';
import { CARD_THEME_FAMILIES } from '../../config/cardThemes';
import { BANNER_PRESETS } from '../../config/bannerPresets';
import SocialIcon from '../ui/SocialIcon';
import {
  User,
  Palette,
  Share2,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Globe,
  GraduationCap,
  Building2,
  Sparkles,
} from 'lucide-react';

export interface ProfileFormData {
  display_name: string;
  job_title: string;
  company: string;
  slug: string;
  avatar_url: string;
  banner_url: string;
  theme_palette: string;
  direct_contacts: {
    whatsapp: string;
    email: string;
    phone: string;
    location: string;
  };
  bio_description: string;
  social_links: Array<{ platform: string; url: string }>;
  languages: string[];
  education: Array<{ title: string; institution: string; period: string }>;
  businesses: Array<{ name: string; description: string; url: string }>;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitButtonText?: string;
}

const SUPPORTED_SOCIAL_PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'github', label: 'GitHub' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'website', label: 'Sitio Web' },
];

const PRESET_LANGUAGES = ['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués'];

export default function ProfileForm({
  formData,
  onChange,
  onSubmit,
  loading = false,
  submitButtonText = 'Activar mi tarjeta',
}: ProfileFormProps) {
  // Secciones del acordeón
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    section1: true,
    section2: true,
    section3: false,
    section4: false,
    section5: false,
  });

  const [customLanguage, setCustomLanguage] = useState('');
  const [bannerTab, setBannerTab] = useState<'presets' | 'custom'>('presets');

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper para autogenerar el slug a partir del nombre
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

  // Idiomas
  const addLanguage = (lang: string) => {
    const trimmed = lang.trim();
    if (trimmed && !formData.languages.includes(trimmed)) {
      onChange({
        ...formData,
        languages: [...formData.languages, trimmed],
      });
      setCustomLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    onChange({
      ...formData,
      languages: formData.languages.filter((l) => l !== lang),
    });
  };

  // Redes Sociales
  const addSocialLink = () => {
    onChange({
      ...formData,
      social_links: [
        ...formData.social_links,
        { platform: 'linkedin', url: '' },
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

  // Educación
  const addEducation = () => {
    onChange({
      ...formData,
      education: [...formData.education, { title: '', institution: '', period: '' }],
    });
  };

  const updateEducation = (
    index: number,
    field: 'title' | 'institution' | 'period',
    val: string
  ) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...formData, education: updated });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  // Emprendimientos
  const addBusiness = () => {
    onChange({
      ...formData,
      businesses: [...formData.businesses, { name: '', description: '', url: '' }],
    });
  };

  const updateBusiness = (
    index: number,
    field: 'name' | 'description' | 'url',
    val: string
  ) => {
    const updated = [...formData.businesses];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...formData, businesses: updated });
  };

  const removeBusiness = (index: number) => {
    onChange({
      ...formData,
      businesses: formData.businesses.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 text-sif-text">
      {/* ── SECCIÓN 1: Identidad Principal ── */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section1')}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-sif-surface-subtle/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-gold/30 bg-sif-gold/10 text-sif-gold">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-sif-text">1. Identidad Principal</h3>
              <p className="text-xs text-sif-muted">Datos de presentación obligatorios</p>
            </div>
          </div>
          {openSections.section1 ? (
            <ChevronUp className="h-4 w-4 text-sif-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-sif-muted" />
          )}
        </button>

        {openSections.section1 && (
          <div className="border-t border-sif-border p-5 flex flex-col gap-4">
            {/* Avatar */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">Foto de Perfil (Avatar URL)</label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => onChange({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  className="flex-1 rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
                />
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
                Enlace Personalizado (Slug) <span className="text-sif-gold">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm">
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
                  WhatsApp (con código de país) <span className="text-sif-gold">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.direct_contacts.whatsapp}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      direct_contacts: {
                        ...formData.direct_contacts,
                        whatsapp: e.target.value,
                      },
                    })
                  }
                  placeholder="+593 99 123 4567"
                  className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-sif-muted">
                  Email de Contacto <span className="text-sif-gold">*</span>
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

      {/* ── SECCIÓN 2: Personalización Visual y Estilo ── */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section2')}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-sif-surface-subtle/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-gold/30 bg-sif-gold/10 text-sif-gold">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-sif-text">2. Personalización Visual</h3>
              <p className="text-xs text-sif-muted">Paleta cromática y banner de encabezado</p>
            </div>
          </div>
          {openSections.section2 ? (
            <ChevronUp className="h-4 w-4 text-sif-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-sif-muted" />
          )}
        </button>

        {openSections.section2 && (
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
                <label className="text-xs font-medium text-sif-muted">Banner de Encabezado</label>
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
                    Catálogo SiF
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

      {/* ── SECCIÓN 3: Contacto Secundario y Redes Sociales ── */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section3')}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-sif-surface-subtle/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-gold/30 bg-sif-gold/10 text-sif-gold">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-sif-text">3. Contacto Secundario y Redes</h3>
              <p className="text-xs text-sif-muted">Teléfono adicional, ciudad y perfiles sociales</p>
            </div>
          </div>
          {openSections.section3 ? (
            <ChevronUp className="h-4 w-4 text-sif-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-sif-muted" />
          )}
        </button>

        {openSections.section3 && (
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
                  placeholder="+593 2 234 5678"
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
                      className="bg-transparent text-xs font-medium text-sif-text outline-none cursor-pointer"
                    >
                      {SUPPORTED_SOCIAL_PLATFORMS.map((plat) => (
                        <option key={plat.id} value={plat.id} className="bg-sif-surface text-sif-text">
                          {plat.label}
                        </option>
                      ))}
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

      {/* ── SECCIÓN 4: Acerca de Mí e Idiomas ── */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section4')}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-sif-surface-subtle/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-gold/30 bg-sif-gold/10 text-sif-gold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-sif-text">4. Acerca de Mí e Idiomas</h3>
              <p className="text-xs text-sif-muted">Biografía corta e idiomas que hablas</p>
            </div>
          </div>
          {openSections.section4 ? (
            <ChevronUp className="h-4 w-4 text-sif-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-sif-muted" />
          )}
        </button>

        {openSections.section4 && (
          <div className="border-t border-sif-border p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-sif-muted">Biografía Profesional</label>
              <textarea
                rows={3}
                value={formData.bio_description}
                onChange={(e) => onChange({ ...formData, bio_description: e.target.value })}
                placeholder="Breve resumen sobre tus intereses, trayectoria o propósito profesional..."
                className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold resize-none"
              />
            </div>

            {/* Idiomas */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-medium text-sif-muted">Idiomas</label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_LANGUAGES.map((lang) => {
                  const isSelected = formData.languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() =>
                        isSelected ? removeLanguage(lang) : addLanguage(lang)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-sif-gold text-black shadow-sm font-semibold'
                          : 'border border-sif-border bg-sif-surface-subtle text-sif-muted hover:border-sif-gold/40'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>

              {/* Agregar idioma personalizado */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLanguage(customLanguage);
                    }
                  }}
                  placeholder="Otro idioma (ej. Italiano)"
                  className="flex-1 rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                />
                <button
                  type="button"
                  onClick={() => addLanguage(customLanguage)}
                  className="rounded-xl border border-sif-gold/40 bg-sif-gold/10 px-3 py-2 text-xs font-semibold text-sif-gold hover:bg-sif-gold/20"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de idiomas seleccionados */}
              {formData.languages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {formData.languages.map((l) => (
                    <span
                      key={l}
                      className="inline-flex items-center gap-1.5 rounded-full border border-sif-gold/30 bg-sif-gold/10 px-3 py-1 text-xs font-medium text-sif-gold"
                    >
                      {l}
                      <button
                        type="button"
                        onClick={() => removeLanguage(l)}
                        className="hover:text-red-400"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── SECCIÓN 5: Trayectoria y Emprendimientos ── */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section5')}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-sif-surface-subtle/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-gold/30 bg-sif-gold/10 text-sif-gold">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-sif-text">5. Trayectoria y Emprendimientos</h3>
              <p className="text-xs text-sif-muted">Estudios académicos y proyectos propios</p>
            </div>
          </div>
          {openSections.section5 ? (
            <ChevronUp className="h-4 w-4 text-sif-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-sif-muted" />
          )}
        </button>

        {openSections.section5 && (
          <div className="border-t border-sif-border p-5 flex flex-col gap-6">
            {/* Educación */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-sif-text flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-sif-gold" />
                  <span>Educación / Títulos</span>
                </label>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-1 text-xs font-semibold text-sif-gold hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Añadir</span>
                </button>
              </div>

              {formData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-sif-border bg-sif-surface-subtle p-4 flex flex-col gap-2.5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-sif-muted hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <input
                    type="text"
                    value={edu.title}
                    onChange={(e) => updateEducation(idx, 'title', e.target.value)}
                    placeholder="Título o Maestría (ej. Ingeniería en Sistemas)"
                    className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                      placeholder="Universidad / Instituto"
                      className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                    />
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                      placeholder="Periodo (ej. 2018 - 2022)"
                      className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Emprendimientos */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-sif-text flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-sif-gold" />
                  <span>Negocios y Proyectos</span>
                </label>
                <button
                  type="button"
                  onClick={addBusiness}
                  className="flex items-center gap-1 text-xs font-semibold text-sif-gold hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Añadir</span>
                </button>
              </div>

              {formData.businesses.map((biz, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-sif-border bg-sif-surface-subtle p-4 flex flex-col gap-2.5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeBusiness(idx)}
                    className="absolute top-3 right-3 text-sif-muted hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <input
                    type="text"
                    value={biz.name}
                    onChange={(e) => updateBusiness(idx, 'name', e.target.value)}
                    placeholder="Nombre del proyecto / marca"
                    className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                  />

                  <input
                    type="text"
                    value={biz.description}
                    onChange={(e) => updateBusiness(idx, 'description', e.target.value)}
                    placeholder="Breve resumen del servicio"
                    className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                  />

                  <input
                    type="url"
                    value={biz.url}
                    onChange={(e) => updateBusiness(idx, 'url', e.target.value)}
                    placeholder="Enlace web (ej. https://miempresa.com)"
                    className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Botón Submit Principal ── */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-sm font-bold text-black transition-all duration-200 hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-2xl"
        style={{
          background:
            'linear-gradient(135deg, var(--sif-gold) 0%, #f0cc5a 50%, var(--sif-gold) 100%)',
          boxShadow: '0 4px 24px rgba(221, 178, 37, 0.35)',
        }}
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
        <span>{submitButtonText}</span>
      </button>
    </form>
  );
}
