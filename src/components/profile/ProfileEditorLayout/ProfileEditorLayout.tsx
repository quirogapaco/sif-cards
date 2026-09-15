import React, { useState } from 'react';
import { Eye, Edit3 } from 'lucide-react';

interface ProfileEditorLayoutProps {
  /** Formulario u otra sección izquierda */
  childrenLeft: React.ReactNode;
  /** Vista previa u otra sección derecha */
  childrenRight: React.ReactNode;
  /** Tema activo para mostrar la etiqueta en el header de la vista previa */
  themePalette?: string;
}

export default function ProfileEditorLayout({
  childrenLeft,
  childrenRight,
  themePalette,
}: ProfileEditorLayoutProps) {
  // Tab activo en pantallas móviles ('form' | 'preview')
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 overflow-auto px-6 pb-28 lg:pb-6 lg:flex-row lg:items-start w-full">
        {/* Columna Izquierda */}
        <section className={`w-full shrink-0 lg:w-1/2 xl:w-7/12 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {childrenLeft}
        </section>

        {/* Columna Derecha */}
        <section className={`flex flex-1 flex-col lg:sticky lg:top-0 ${mobileTab === 'form' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between px-1 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sif-muted flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-sif-gold" />
              <span>Vista Previa en Vivo</span>
            </span>
            {themePalette && (
              <span className="text-[10px] text-sif-gold font-mono border border-sif-gold/30 px-2 py-0.5 rounded-full bg-sif-gold/10">
                {themePalette}
              </span>
            )}
          </div>
          
          <div
            data-card-theme={themePalette || 'emerald-dark'}
            className="rounded-3xl border border-sif-border bg-sif-surface shadow-2xl overflow-hidden min-h-[600px]"
          >
            {childrenRight}
          </div>
        </section>
      </div>

      {/* ── BOTÓN FLOTANTE INFERIOR MÓVIL [ Formulario | Vista Previa ] ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <div className="flex items-center rounded-full border border-sif-border bg-sif-surface/95 p-1.5 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setMobileTab('form')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
              mobileTab === 'form'
                ? 'bg-sif-gold text-black shadow-md'
                : 'text-sif-muted hover:text-sif-text'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Formulario</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
              mobileTab === 'preview'
                ? 'bg-sif-gold text-black shadow-md'
                : 'text-sif-muted hover:text-sif-text'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Vista Previa</span>
          </button>
        </div>
      </div>
    </>
  );
}
