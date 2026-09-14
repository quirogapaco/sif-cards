import React, { useState } from 'react';
import { Download, Phone, Mail, MapPin, ExternalLink, Share2, Globe, BookOpen } from 'lucide-react';

type ThemeMode = 'dark' | 'light';
type PaletteKey = 'gold' | 'purple' | 'monochrome' | 'sapphire' | 'emerald' | 'wine';

interface PaletteOption {
  key: PaletteKey;
  label: string;
  color: string;
}

const paletteOptions: PaletteOption[] = [
  { key: 'gold', label: 'Gold', color: '#ddb225' },
  { key: 'purple', label: 'Purple', color: '#a855f7' },
  { key: 'monochrome', label: 'Mono', color: '#94a3b8' },
  { key: 'sapphire', label: 'Sapphire', color: '#3b82f6' },
  { key: 'emerald', label: 'Emerald', color: '#10b981' },
  { key: 'wine', label: 'Wine', color: '#f43f5e' },
];

const PREVIEW_PROFILE = {
  name: 'Alejandra Vega',
  title: 'Managing Partner & CIO',
  company: 'Aether Capital',
  email: 'a.vega@aethercapital.io',
  phone: '+1 (415) 890-2340',
  location: 'San Francisco, CA',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  bio: 'Arquitecta de inversión privada y capital de riesgo para tecnología de frontera e infraestructura digital en mercados globales.',
};

export const PlaygroundSection: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<ThemeMode>('dark');
  const [currentPalette, setCurrentPalette] = useState<PaletteKey>('emerald');
  const [avatarError, setAvatarError] = useState(false);

  const themeScope = `${currentPalette}-${currentMode}`;

  const contactItems = [
    { id: 'whatsapp', Icon: Phone, label: 'WhatsApp', value: PREVIEW_PROFILE.phone },
    { id: 'email', Icon: Mail, label: 'Email', value: PREVIEW_PROFILE.email },
    { id: 'phone', Icon: Phone, label: 'Teléfono', value: PREVIEW_PROFILE.phone },
    { id: 'location', Icon: MapPin, label: 'Ubicación', value: PREVIEW_PROFILE.location },
  ];

  return (
    <section
      id="playground"
      className="relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 dark:bg-[#09090b] bg-[#fafafa] dark:text-slate-300 text-slate-700 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(16,185,129,0.035),transparent_65%)]" />

      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <header className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-white/10 border-slate-200 dark:bg-white/[0.02] bg-white dark:text-slate-400 text-slate-600 font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-3 shadow-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PERSONALIZACIÓN EN TIEMPO REAL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight dark:text-[#EBF1F9] text-slate-900 leading-tight">
            Diseñado para reflejar tu identidad,{' '}
            <span className="font-serif italic font-normal dark:text-slate-200 text-slate-700">no la nuestra.</span>
          </h2>

          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
            Personaliza el tema y modo en vivo. Cada tarjeta física sincroniza su perfil digital de manera independiente.
          </p>
        </header>

        {/* Contenedor parejo y centrado */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center justify-center max-w-3xl mx-auto">
          
          {/* ── COLUMNA IZQUIERDA: DOCK RESPONSIVE ── */}
          <aside className="w-full max-w-[340px] sm:max-w-[370px] lg:max-w-none mx-auto lg:col-span-6 dark:bg-[#121215] bg-white border dark:border-white/[0.08] border-slate-200/90 rounded-2xl lg:rounded-3xl p-2 sm:p-2.5 lg:p-7 shadow-xl backdrop-blur-xl lg:h-[530px] flex flex-col justify-between">
            {/* 1. Versión móvil */}
            <div className="flex lg:hidden items-center justify-between gap-2 px-1">
              <div className="flex items-center p-0.5 bg-black/60 border border-white/10 rounded-full gap-0.5">
                <button
                  type="button"
                  title="Modo Oscuro"
                  onClick={() => setCurrentMode('dark')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    currentMode === 'dark' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  title="Modo Claro"
                  onClick={() => setCurrentMode('light')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    currentMode === 'light' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <span className="h-4 w-px bg-white/10" />

              <div className="flex items-center gap-1.5">
                {paletteOptions.map((item) => {
                  const isActive = currentPalette === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      title={item.label}
                      onClick={() => setCurrentPalette(item.key)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isActive ? 'ring-2 ring-white/60 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{
                          backgroundColor: item.color,
                          boxShadow: isActive ? `0 0 8px ${item.color}` : 'none',
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider pl-1">
                {currentPalette.slice(0, 4)}
              </span>
            </div>

            {/* 2. Versión escritorio */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-1">
                <h3 className="dark:text-[#EBF1F9] text-slate-900 text-xs font-bold tracking-wider uppercase">
                  Personalización de Tarjeta
                </h3>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                  EN VIVO
                </span>
              </div>
              <p className="dark:text-slate-400 text-slate-600 text-[11px] mb-4">
                Los cambios solo afectan la vista de tu perfil.
              </p>

              {/* Selector Dark / Light */}
              <div className="mb-4">
                <label className="text-[10px] font-mono tracking-widest dark:text-slate-400 text-slate-700 uppercase mb-2 block font-semibold">
                  Modo del Perfil
                </label>
                <div className="grid grid-cols-2 p-1 dark:bg-black/40 bg-slate-100 dark:border-white/5 border-slate-200 rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentMode('dark')}
                    className={`py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition cursor-pointer ${
                      currentMode === 'dark'
                        ? 'dark:border-white/20 dark:bg-white/[0.08] bg-slate-900 text-white shadow-sm'
                        : 'dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentMode('light')}
                    className={`py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition cursor-pointer ${
                      currentMode === 'light'
                        ? 'dark:border-white/20 dark:bg-white/[0.08] bg-slate-900 text-white shadow-sm'
                        : 'dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* Selector de Paletas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-mono tracking-widest dark:text-slate-400 text-slate-700 uppercase font-semibold">
                    Paleta de Marca
                  </label>
                  <span className="text-[10px] font-mono uppercase tracking-wider dark:text-slate-200 text-slate-800 font-semibold">
                    {currentPalette}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {paletteOptions.map((item) => {
                    const isActive = currentPalette === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setCurrentPalette(item.key)}
                        className={`p-2.5 rounded-xl flex items-center gap-2.5 text-xs font-medium transition text-left cursor-pointer border ${
                          isActive
                            ? 'dark:border-white/35 dark:bg-white/[0.08] bg-slate-900 text-white shadow-sm border-slate-900'
                            : 'dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.02] bg-slate-100/70 dark:text-slate-400 text-slate-700 dark:hover:border-white/20 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: isActive ? `0 0 8px ${item.color}66` : 'none',
                          }}
                        />
                        <span className="font-semibold text-[11px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer desktop */}
            <div className="hidden lg:block pt-3 border-t dark:border-white/[0.06] border-slate-200">
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                <span className="dark:text-slate-400 text-slate-600 font-medium">Card Theme:</span>
                <span className="px-2.5 py-0.5 rounded-lg border dark:border-white/10 border-slate-200 dark:bg-white/[0.04] bg-slate-100 dark:text-white text-slate-900 uppercase font-semibold tracking-wide">
                  {themeScope}
                </span>
              </div>
              <p className="dark:text-slate-500 text-slate-600 text-[10px] mt-2 flex items-center gap-1.5 font-medium">
                <span>✦</span>
                Temas independientes por tarjeta.
              </p>
            </div>
          </aside>

          {/* ── COLUMNA DERECHA: SMARTPHONE PREVIEW ── */}
          <div className="w-full max-w-[320px] sm:max-w-[350px] mx-auto lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full bg-[#050507] border-[5px] border-[#222226] rounded-[38px] p-2 shadow-2xl relative overflow-hidden ring-1 ring-white/10 h-[510px] sm:h-[530px] flex flex-col">
              {/* Dynamic Island */}
              <div className="w-20 h-3.5 bg-black rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center justify-end pr-2 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0f172a] border border-[#1e293b]" />
              </div>

              {/* Pantalla interna */}
              <div
                data-card-theme={themeScope}
                className="rounded-[30px] overflow-y-auto h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-card-surface border border-card-border relative flex flex-col pb-4 transition-colors duration-500"
              >
                {/* Banner */}
                <div
                  className="h-28 sm:h-30 w-full relative flex-shrink-0 transition-all duration-500 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--card-primary) 0%, var(--card-secondary) 100%)',
                    opacity: 0.9,
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at 75% 20%, rgba(255,255,255,0.22) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                      mixBlendMode: 'overlay',
                    }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-6 transition-colors duration-500"
                    style={{
                      background: 'linear-gradient(to top, var(--card-surface) 0%, transparent 100%)',
                    }}
                  />
                </div>

                {/* Avatar */}
                <div className="relative z-10 -mt-10 flex justify-center">
                  <div
                    className="h-16 w-16 overflow-hidden rounded-full border-[2.5px] shadow-xl bg-card-surface transition-colors duration-500"
                    style={{ borderColor: 'var(--card-primary)' }}
                  >
                    {avatarError ? (
                      <div
                        className="flex h-full w-full items-center justify-center text-lg font-bold font-card-headline transition-colors duration-500"
                        style={{
                          background: 'var(--card-primary)',
                          color: 'var(--card-primary-fg)',
                        }}
                      >
                        {PREVIEW_PROFILE.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <img
                        src={PREVIEW_PROFILE.avatarUrl}
                        alt={`Avatar de ${PREVIEW_PROFILE.name}`}
                        className="h-full w-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    )}
                  </div>
                </div>

                {/* Identidad */}
                <div className="text-center px-4 mt-1.5">
                  <h4 className="text-base font-bold leading-tight text-card-text font-card-headline transition-colors duration-500">
                    {PREVIEW_PROFILE.name}
                  </h4>
                  <p className="mt-0.5 text-[11px] font-medium text-card-primary font-card-body transition-colors duration-500">
                    {PREVIEW_PROFILE.title}
                  </p>

                  <div className="mt-1 flex justify-center">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-semibold uppercase tracking-wider font-card-body border transition-colors duration-500"
                      style={{
                        borderColor: 'var(--card-surface-border)',
                        backgroundColor: 'color-mix(in srgb, var(--card-primary) 12%, transparent)',
                        color: 'var(--card-text-main)',
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: 'var(--card-primary)' }}
                      />
                      {PREVIEW_PROFILE.company}
                    </span>
                  </div>
                </div>

                {/* Acciones principales */}
                <div className="px-3.5 mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-card-primary text-card-primary-fg text-[11px] font-semibold shadow-md transition-all duration-300 hover:opacity-90 active:scale-95 font-card-body cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    <span>Guardar Contacto</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Compartir perfil"
                    className="w-7 h-7 rounded-full flex items-center justify-center border border-card-border bg-card-bg text-card-text transition-colors duration-300 hover:border-card-primary flex-shrink-0 cursor-pointer"
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                </div>

                {/* Redes */}
                <div className="flex justify-center items-center gap-2 mt-2">
                  {[
                    {
                      id: 'li',
                      icon: (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63Z" />
                        </svg>
                      ),
                    },
                    {
                      id: 'tw',
                      icon: (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                    },
                    {
                      id: 'ig',
                      icon: (
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      ),
                    },
                    { id: 'web', icon: <Globe className="w-2.5 h-2.5" /> },
                  ].map((social) => (
                    <a
                      key={social.id}
                      href="#"
                      className="w-5.5 h-5.5 rounded-full flex items-center justify-center border border-card-border bg-card-bg text-card-muted transition-colors duration-300 hover:border-card-primary hover:text-card-text"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>

                {/* Contactos */}
                <div className="px-3.5 mt-2.5 space-y-1.5">
                  {contactItems.map(({ id, Icon, label, value }) => (
                    <div
                      key={id}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-card-border bg-card-bg px-2.5 py-1.5 transition-all duration-300 hover:border-card-primary"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon
                          className="h-3 w-3 shrink-0 transition-colors duration-300"
                          style={{ color: 'var(--card-primary)' }}
                        />
                        <div className="min-w-0">
                          <p className="text-[7.5px] uppercase tracking-wider text-card-muted font-card-body transition-colors duration-300">
                            {label}
                          </p>
                          <p className="text-[10px] font-medium text-card-text font-card-body transition-colors duration-300 truncate">
                            {value}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0 text-card-muted transition-colors duration-300" />
                    </div>
                  ))}
                </div>

                {/* Bio Profesional */}
                <article className="rounded-xl border border-card-border bg-card-bg p-2 mx-3.5 mt-2 transition-colors duration-300">
                  <div
                    className="flex items-center gap-1 text-[9.5px] font-semibold mb-0.5 font-card-headline"
                    style={{ color: 'var(--card-primary)' }}
                  >
                    <BookOpen className="w-2.5 h-2.5" />
                    <span>Perfil Profesional</span>
                  </div>
                  <p className="text-[9px] leading-relaxed text-card-muted font-card-body font-light line-clamp-2">
                    {PREVIEW_PROFILE.bio}
                  </p>
                </article>

                {/* Footer SIF */}
                <div className="mt-2.5 border-t border-card-border pt-2 text-center transition-colors duration-500">
                  <span className="inline-flex items-center gap-1 text-[8.5px] tracking-wide text-card-muted font-card-body">
                    Powered by <strong className="font-bold text-card-text">SIF</strong>
                    <span>·</span>
                    <span className="italic">Sharing is Fast</span>
                    <ExternalLink className="h-2 w-2" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaygroundSection;