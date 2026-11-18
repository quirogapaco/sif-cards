import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Wifi, UserCheck, BarChart3, Building2, ArrowLeft } from 'lucide-react';
import { Navbar } from '../../components/landing/Navbar';
import { EditionsSection } from '../../components/landing/EditionsSection';
import { FooterCTA } from '../../components/landing/FooterCTA';
import { PhysicalCardSection } from '../../components/manual/PhysicalCardSection';
import { ProfileConfigSection } from '../../components/manual/ProfileConfigSection';
import { AnalyticsProSection } from '../../components/manual/AnalyticsProSection';
import { EnterpriseB2BSection } from '../../components/manual/EnterpriseB2BSection';

const MANUAL_STEPS = [
  { id: '#conectividad-fisica', number: '01', label: 'Conectividad Física', icon: Wifi },
  { id: '#configuracion-perfil', number: '02', label: 'Perfil Digital', icon: UserCheck },
  { id: '#analytics-pro', number: '03', label: 'Analytics Pro', icon: BarChart3 },
  { id: '#vista-empresarial', number: '04', label: 'Dashboard B2B', icon: Building2 },
];

export default function ManualPage() {
  const [selectedEdition, setSelectedEdition] = useState<'gold' | 'silver'>('gold');

  const scrollToStep = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-dvh dark:bg-[#09090b] bg-[#fafafa] dark:text-slate-300 text-slate-700 relative selection:bg-[#ddb225] selection:text-black overflow-x-hidden transition-colors duration-300">
      {/* Luces ambientales sutiles */}
      <div className="fixed inset-0 pointer-events-none -z-10 dark:bg-[radial-gradient(circle_at_75%_20%,rgba(221,178,37,0.06),transparent_55%)] bg-[radial-gradient(circle_at_75%_20%,rgba(221,178,37,0.08),transparent_60%)]" />
      <div className="fixed inset-0 pointer-events-none -z-10 dark:bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.03),transparent_45%)] bg-[radial-gradient(circle_at_25%_10%,rgba(0,0,0,0.02),transparent_50%)]" />

      <Navbar edition={selectedEdition} />

      <main className="pt-28 sm:pt-32">
        {/* ── HERO DEL MANUAL DE USO ── */}
        <section className="relative px-4 sm:px-6 lg:px-10 pb-12 sm:pb-14 border-b dark:border-white/[0.06] border-slate-200/80">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-4 flex items-center justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium dark:text-slate-400 text-slate-600 hover:text-[#ddb225] dark:hover:text-[#ddb225] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al inicio</span>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border dark:border-white/10 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm mb-5">
              <BookOpen className="w-3.5 h-3.5 text-[#ddb225]" />
              <span className="text-[11px] font-mono uppercase tracking-widest dark:text-slate-300 text-slate-700 font-semibold">
                Guía Oficial Interactiva
              </span>
            </div>

            <h1 className="font-serif font-normal dark:text-white text-slate-900 text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] max-w-3xl mx-auto">
              Manual de Uso SIF:{' '}
              <span className="italic block mt-1 text-[#ddb225]">
                Configura Tu Tarjeta
              </span>
            </h1>

            <p className="mt-5 text-xs sm:text-sm lg:text-base dark:text-slate-400 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              SIF revoluciona la forma en que los profesionales y las empresas se conectan, combinando tecnologías avanzadas para ofrecer una identidad digital medible. Explora interactivamente el funcionamiento de tu ecosistema SIF, desde la interacción física hasta el análisis de tus datos.
            </p>
          </div>
        </section>

        {/* ── BARRA DE ÍNDICE INTERACTIVA (STICKY) ── */}
        <div className="sticky top-24 z-30 dark:bg-[#09090b]/90 bg-white/90 backdrop-blur-xl border-b dark:border-white/[0.08] border-slate-200/80 py-3 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {MANUAL_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <a
                  key={step.id}
                  href={step.id}
                  onClick={(e) => scrollToStep(e, step.id)}
                  className="flex items-center gap-2 whitespace-nowrap px-3.5 py-2 rounded-full border dark:border-white/10 border-slate-200 dark:bg-[#121215] bg-slate-100 hover:border-[#ddb225]/60 hover:text-[#ddb225] text-xs font-semibold dark:text-slate-200 text-slate-800 transition-all shadow-xs"
                >
                  <span className="font-mono text-[10px] text-[#ddb225] font-bold">{step.number}</span>
                  <Icon className="w-3.5 h-3.5 text-[#ddb225]" />
                  <span>{step.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── 1. LA SIF CARD: CONECTIVIDAD FÍSICA ── */}
        <PhysicalCardSection
          edition={selectedEdition}
          onEditionChange={setSelectedEdition}
        />

        {/* ── 2. CONFIGURACIÓN DE TU PERFIL DIGITAL ── */}
        <ProfileConfigSection />

        {/* ── 3. PANEL DE ESTADÍSTICAS (ANALYTICS PRO) ── */}
        <AnalyticsProSection />

        {/* ── 4. VISTA EMPRESARIAL (DASHBOARD B2B) ── */}
        <EnterpriseB2BSection />

        {/* ── CIERRE COMERCIAL: EDICIONES & PRECIOS ── */}
        <EditionsSection />

        {/* ── FOOTER ── */}
        <FooterCTA />
      </main>
    </div>
  );
}
