import { useState, useRef, useEffect } from 'react';
import { User, Palette, Share2, FileText, Briefcase, ArrowRight } from 'lucide-react';
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
    emails: string[];
    phone: string;
    location: string;
  };
  bio_description: string;
  social_links: Array<{ platform: string; url: string }>;
  languages: string[];
  education: Array<{ title: string; institution: string; period: string }>;
  businesses: Array<{ name: string; description: string; url: string }>;
  acceptMarketing?: boolean;
}

export interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitButtonText?: string;
  fieldErrors?: { [key: string]: boolean };
  alwaysShowSubmit?: boolean;
}

export default function ProfileForm({
  formData,
  onChange,
  onSubmit,
  loading = false,
  submitButtonText = 'Activar mi tarjeta',
  fieldErrors = {},
  alwaysShowSubmit = false,
}: ProfileFormProps) {
  // Navegación por Pestañas (Tabs)
  const [activeTab, setActiveTab] = useState<string>('personal');
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeTabElement = tabsContainerRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeTabElement) {
      activeTabElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'visuals', label: 'Visuales', icon: Palette },
    { id: 'contact', label: 'Contacto', icon: Share2 },
    { id: 'about', label: 'Biografía', icon: FileText },
    { id: 'education', label: 'Negocios y Proyectos', icon: Briefcase },
  ];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 text-sif-text">
      {/* ── Navegación Tabs ── */}
      <div 
        ref={tabsContainerRef}
        className="flex overflow-x-auto gap-1 border-b border-sif-border pb-px [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-tab-id={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-xs font-semibold transition-colors border-b-2 ${isActive
                  ? 'border-sif-gold text-sif-gold bg-sif-gold/5'
                  : 'border-transparent text-sif-muted hover:text-sif-text hover:bg-sif-surface-subtle/50'
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Contenido Activo ── */}
      <div className="pt-2 min-h-[300px]">
        {activeTab === 'personal' && (
          <PersonalInfo
            formData={formData}
            onChange={onChange}
            fieldErrors={fieldErrors}
          />
        )}

        {activeTab === 'visuals' && (
          <Visuals
            formData={formData}
            onChange={onChange}
          />
        )}

        {activeTab === 'contact' && (
          <ContactAndMedia
            formData={formData}
            onChange={onChange}
          />
        )}

        {activeTab === 'about' && (
          <AboutAndLanguages
            formData={formData}
            onChange={onChange}
          />
        )}

        {activeTab === 'education' && (
          <EducationAndExperience
            formData={formData}
            onChange={onChange}
          />
        )}
      </div>

      {/* ── Botones de Acción (Siguiente / Enviar) ── */}
      <div className="flex flex-col gap-2 mt-2">
        {tabs.findIndex(t => t.id === activeTab) < tabs.length - 1 && (
          <button
            type="button"
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              setActiveTab(tabs[currentIndex + 1].id);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-sif-gold bg-sif-gold/5 py-2.5 text-sm font-bold text-sif-gold transition-all duration-200 hover:bg-sif-gold/15 active:scale-[0.98]"
          >
            <span>Siguiente</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {(alwaysShowSubmit || tabs.findIndex(t => t.id === activeTab) === tabs.length - 1) && (
          <>
            <div className="flex flex-col gap-4 mt-6 mb-4">
              {/* Casilla Opcional de Comunicaciones */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    name="acceptMarketing"
                    checked={formData.acceptMarketing || false}
                    onChange={(e) => onChange({ ...formData, acceptMarketing: e.target.checked })}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-600 bg-transparent transition-all checked:border-[#ddb225] checked:bg-[#ddb225] hover:border-[#ddb225]"
                  />
                  {/* Icono de Check */}
                  <span className="absolute text-black opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 select-none group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                  Autorizo el envío de comunicados sobre actualizaciones, nuevas características y ofertas relacionadas con el servicio.
                </span>
              </label>

              {/* Texto Obligatorio de Términos */}
              <p className="text-xs text-slate-500 dark:text-slate-500 text-center leading-relaxed">
                Al hacer clic en "{submitButtonText}", confirmas que has leído y aceptas nuestros{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#ddb225] transition-colors">
                  Términos y Condiciones
                </a>
                {' '}y{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#ddb225] transition-colors">
                  Políticas de Privacidad
                </a>.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold text-black transition-all duration-200 hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, var(--sif-gold) 0%, #f0cc5a 50%, var(--sif-gold) 100%)',
                boxShadow: '0 4px 24px rgba(221, 178, 37, 0.35)',
              }}
            >
              {loading && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              )}
              <span>{submitButtonText}</span>
            </button>
          </>
        )}
      </div>
    </form>
  );
}
