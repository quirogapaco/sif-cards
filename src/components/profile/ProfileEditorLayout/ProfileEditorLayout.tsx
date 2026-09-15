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
        <section 
          className={`
            ${mobileTab === 'form' ? 'hidden lg:flex' : 'fixed inset-0 z-40 bg-sif-bg lg:static lg:bg-transparent lg:z-auto'} 
            flex flex-col lg:flex-1 lg:items-center lg:sticky lg:top-8
          `}
        >
          <div className={`flex items-center justify-between mb-3 w-full shrink-0 lg:w-[375px] ${mobileTab === 'preview' ? 'px-6 pt-6 lg:p-0' : 'px-1'}`}>
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
            className={`
              bg-sif-surface overflow-y-auto
              ${mobileTab === 'preview' ? 'w-full flex-1 pb-24' : 'rounded-3xl border border-sif-border shadow-2xl min-h-[600px] overflow-hidden'}
              lg:w-[375px] lg:h-[800px] lg:max-h-[85vh] lg:min-h-0 lg:rounded-[40px] lg:border-[8px] lg:border-gray-900 lg:shadow-2xl lg:overflow-y-auto lg:pb-0 lg:flex-none
              [&::-webkit-scrollbar]:hidden
            `}
          >
            {childrenRight}
          </div>
        </section>
      </div>

      {/* ── BOTÓN FLOTANTE INFERIOR MÓVIL [ Formulario | Vista Previa ] ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
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
