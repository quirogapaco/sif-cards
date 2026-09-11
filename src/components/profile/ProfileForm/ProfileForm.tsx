import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import PersonalInfo from './PersonalInfo';
import Visuals from './Visuals';
import ContactAndMedia from './ContactAndMedia';
import AboutAndLanguages from './AboutAndLanguages';
import EducationAndExperience from './EducationAndExperience';

export interface ProfileFormData {
  display_name: string;
  job_title: string;
  company: string;
  slug: string;
  avatar_url: string;
  avatar_file?: File;
  banner_url: string;
  banner_file?: File;
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

export interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitButtonText?: string;
}

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

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 text-sif-text">
      <PersonalInfo
        formData={formData}
        onChange={onChange}
        isOpen={openSections.section1}
        onToggle={() => toggleSection('section1')}
      />
      
      <Visuals
        formData={formData}
        onChange={onChange}
        isOpen={openSections.section2}
        onToggle={() => toggleSection('section2')}
      />

      <ContactAndMedia
        formData={formData}
        onChange={onChange}
        isOpen={openSections.section3}
        onToggle={() => toggleSection('section3')}
      />

      <AboutAndLanguages
        formData={formData}
        onChange={onChange}
        isOpen={openSections.section4}
        onToggle={() => toggleSection('section4')}
      />

      <EducationAndExperience
        formData={formData}
        onChange={onChange}
        isOpen={openSections.section5}
        onToggle={() => toggleSection('section5')}
      />

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
