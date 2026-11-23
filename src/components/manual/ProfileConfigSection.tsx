import React, { useState } from 'react';
import { User, Palette, Share2, FileText, Briefcase, Eye, CheckCircle2 } from 'lucide-react';
import { PlaygroundSection } from '../landing/PlaygroundSection';

interface TabSectionInfo {
  id: string;
  label: string;
  icon: React.ElementType;
  summary: string;
  fields: string[];
}

const PROFILE_TABS_GUIDE: TabSectionInfo[] = [
  {
    id: 'personal',
    label: 'Personal',
    icon: User,
    summary: 'Los datos esenciales de tu identidad profesional y tus canales principales de contacto.',
    fields: [
      'Foto de perfil',
      'Nombre a mostrar',
      'Cargo / Ocupación',
      'Empresa',
      'Enlace personalizado del perfil',
      'WhatsApp',
      'Emails',
    ],
  },
  {
    id: 'visuals',
    label: 'Visuales',
    icon: Palette,
    summary: 'Personaliza la estética de tu tarjeta digital para reflejar los colores de tu marca.',
    fields: [
      'Paleta cromática (Gold, Purple, Mono, Sapphire, Emerald, Wine)',
      'Modo del perfil (Claro / Oscuro)',
      'Banner de perfil (Foto personalizada o galería predeterminada)',
    ],
  },
  {
    id: 'contact',
    label: 'Contacto',
    icon: Share2,
    summary: 'Conecta tus redes sociales eligiendo el diseño de cada botón (círculo o rectángulo) y ubicación.',
    fields: [
      'Teléfono fijo / secundario',
      'Ubicación / Ciudad',
      'Redes sociales (LinkedIn, Instagram, TikTok, Facebook, X, GitHub, YouTube, Sitio Web)',
      'Selector de estilo por red (Círculo o Rectángulo)',
    ],
  },
  {
    id: 'about',
    label: 'Biografía',
    icon: FileText,
    summary: 'Presenta tu propuesta de valor profesional y los idiomas en los que te comunicas.',
    fields: [
      'Biografía profesional (resumen de habilidades y servicios)',
      'Idiomas (selección rápida o idiomas personalizados)',
    ],
  },
  {
    id: 'education',
    label: 'Negocios y Proyectos',
    icon: Briefcase,
    summary: 'Destaca tu trayectoria académica, empresas, catálogos o proyectos con enlaces directos.',
    fields: [
      'Educación / Títulos (Título, Universidad/Instituto, Periodo)',
      'Negocios y Proyectos (Nombre de la marca, Breve resumen del servicio, Enlace web)',
    ],
  },
];

export const ProfileConfigSection: React.FC = () => {
  const [selectedTabId, setSelectedTabId] = useState<string>('personal');
  const activeTab =
    PROFILE_TABS_GUIDE.find((t) => t.id === selectedTabId) || PROFILE_TABS_GUIDE[0];

  return (
    <section
      id="configuracion-perfil"
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b dark:border-white/[0.06] border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de Sección 2 */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-[#ddb225]/30 border-amber-500/30 bg-[#ddb225]/10 text-[#ddb225] font-mono text-[11px] uppercase tracking-widest mb-3 font-semibold">
            <span>Sección 02</span>
            <span>·</span>
            <span>Gestión en Línea</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white text-slate-900">
            2. Configuración de tu Perfil Digital
          </h2>
          <p className="mt-3 text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed">
            Tu perfil se gestiona a través de una interfaz accesible y elegante en{' '}
            <span className="font-semibold text-[#ddb225]">sifcards.com</span>. Navega intuitivamente por las 5 pestañas superiores para configurar tu información y observa los cambios en tiempo real.
          </p>
        </div>

        {/* Explorador Interactivo de las 5 Pestañas de Edición */}
        <div className="rounded-3xl border dark:border-white/[0.08] border-slate-200 dark:bg-[#121215] bg-white p-5 sm:p-8 shadow-xl mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b dark:border-white/[0.08] border-slate-200">
            <div>
              <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900">
                Secciones de edición del perfil
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
                Haz clic en cada pestaña para explorar los campos disponibles:
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-fit">
              <Eye className="w-3.5 h-3.5" />
              <span>Con Vista Previa en Vivo</span>
            </div>
          </div>

          {/* Barra de 5 Pestañas igual al editor real */}
          <div className="flex overflow-x-auto gap-2 py-4 [&::-webkit-scrollbar]:hidden">
            {PROFILE_TABS_GUIDE.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === selectedTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTabId(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? 'border-[#ddb225] bg-[#ddb225]/15 text-[#ddb225] shadow-sm'
                      : 'dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.02] bg-slate-50 dark:text-slate-400 text-slate-600 hover:border-[#ddb225]/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Detalle de la Pestaña Activa */}
          <div className="mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl dark:bg-black/30 bg-slate-50 border dark:border-white/[0.06] border-slate-200/80 p-5 sm:p-6">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ddb225] font-semibold">
                Pestaña seleccionada
              </span>
              <h4 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <activeTab.icon className="w-5 h-5 text-[#ddb225]" />
                <span>{activeTab.label}</span>
              </h4>
              <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                {activeTab.summary}
              </p>
            </div>

            <div className="lg:col-span-7">
              <p className="text-[11px] font-mono uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-3 font-semibold">
                Campos Disponibles en {activeTab.label}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeTab.fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-xl dark:bg-[#121215] bg-white border dark:border-white/[0.07] border-slate-200 px-3.5 py-2.5 text-xs font-medium dark:text-slate-200 text-slate-800 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#ddb225] shrink-0" />
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Simulador Interactivo reutilizado directamente de src/components/landing/PlaygroundSection.tsx */}
        <div className="rounded-3xl border dark:border-white/[0.08] border-slate-200 overflow-hidden shadow-xl">
          <PlaygroundSection />
        </div>
      </div>
    </section>
  );
};
