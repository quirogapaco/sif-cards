import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { CARD_THEME_FAMILIES } from '../../config/cardThemes';
import { useAppTheme } from '../../context/AppThemeContext';
import ProfileCard from '../../components/card/ProfileCard';
import type { CardThemeMode } from '../../types/themes';

/**
 * Vista principal del dashboard administrativo.
 * USA EXCLUSIVAMENTE clases sif-* en el shell.
 * La tarjeta (ProfileCard) gestiona su propio scope card-*.
 */
export default function DashboardPage() {
  const { mode: appMode } = useAppTheme();

  // Estado LOCAL de la tarjeta — independiente del App Shell
  const [cardMode, setCardMode] = useState<CardThemeMode>('dark');
  const [selectedFamily, setSelectedFamily] = useState('emerald');

  const selectedCardTheme = `${selectedFamily}-${cardMode}` as string;
  const activeFamily = CARD_THEME_FAMILIES.find((f) => f.id === selectedFamily);

  const handleFamilySelect = (familyId: string) => {
    setSelectedFamily(familyId);
  };

  const handleCardModeToggle = (mode: CardThemeMode) => {
    setCardMode(mode);
  };



  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Encabezado de página */}
      <div className="border-b border-sif-border bg-sif-surface px-6 py-4">
        <h2 className="text-base font-semibold text-sif-text">
          Dashboard de Tarjetas
        </h2>
        <p className="mt-0.5 text-xs text-sif-muted">
          Gestión y personalización de tarjetas NFC
        </p>
      </div>

      {/* Layout split-screen */}
      <div className="flex flex-1 flex-col gap-6 overflow-auto p-6 lg:flex-row lg:items-start">

        {/* ── Columna Izquierda: Controles ── */}
        <section
          aria-label="Controles de personalización"
          className="w-full shrink-0 lg:w-72 xl:w-80"
        >
          {/* Título */}
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-sif-text">
              Personalización de Tarjeta
            </h3>
            <p className="mt-0.5 text-xs text-sif-muted">
              Los cambios solo afectan al perfil
            </p>
          </div>

          {/* Panel de controles */}
          <div className="rounded-2xl border border-sif-border bg-sif-surface p-5 space-y-5 shadow-sm">

            {/* 1. Selector de Modo de la Tarjeta (Dark / Light) */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-sif-muted">
                Modo del Perfil
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-sif-border bg-sif-surface-subtle p-1">
                {(['dark', 'light'] as CardThemeMode[]).map((m) => (
                  <button
                    key={m}
                    id={`card-mode-${m}`}
                    onClick={() => handleCardModeToggle(m)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                      cardMode === m
                        ? 'bg-sif-surface text-sif-text shadow-sm ring-1 ring-sif-border'
                        : 'text-sif-muted hover:text-sif-text'
                    }`}
                  >
                    {m === 'dark' ? (
                      <Moon className="h-3.5 w-3.5" />
                    ) : (
                      <Sun className="h-3.5 w-3.5" />
                    )}
                    {m === 'dark' ? 'Dark' : 'Light'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Grid de Familias de Color */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-sif-muted">
                Paleta de Marca
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CARD_THEME_FAMILIES.map((fam) => {
                  const isSelected = selectedFamily === fam.id;
                  return (
                    <button
                      key={fam.id}
                      id={`theme-family-${fam.id}`}
                      onClick={() => handleFamilySelect(fam.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all duration-200 ${
                        isSelected
                          ? 'border-transparent shadow-sm ring-2'
                          : 'border-sif-border bg-sif-surface-subtle text-sif-muted hover:border-sif-border hover:text-sif-text'
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: `${fam.accentColor}18`,
                              ringColor: fam.accentColor,
                              boxShadow: `0 0 0 2px ${fam.accentColor}55`,
                            }
                          : {}
                      }
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: fam.accentColor }}
                      />
                      <span
                        className="text-[11px] font-medium leading-none"
                        style={isSelected ? { color: fam.accentColor } : {}}
                      >
                        {fam.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Etiqueta de estado */}
            <div className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-sif-muted mb-1.5">
                Estado Actual
              </p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sif-muted">App Theme</span>
                  <span
                    className="text-xs font-semibold capitalize"
                    style={{ color: 'var(--sif-gold)' }}
                  >
                    {appMode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sif-muted">Card Theme</span>
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${activeFamily?.accentColor ?? '#888'}22`,
                      color: activeFamily?.accentColor ?? 'var(--sif-muted)',
                      border: `1px solid ${activeFamily?.accentColor ?? '#888'}44`,
                    }}
                  >
                    {selectedCardTheme}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hint de aislamiento */}
          <p className="mt-3 text-center text-[10px] text-sif-muted">
            Ambos temas son{' '}
            <span style={{ color: 'var(--sif-gold)' }} className="font-semibold">
              completamente independientes
            </span>
          </p>
        </section>

        {/* ── Columna Derecha: Mockup de la Tarjeta ── */}
        <section
          aria-label="Vista previa de la tarjeta"
          className="flex flex-1 flex-col items-center"
        >
          <p className="mb-4 text-xs uppercase tracking-widest text-sif-muted">
            Vista Previa del Perfil
          </p>

          {/* Área de mockup con rejilla de fondo */}
          <div
            className="flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-sif-border p-8"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundColor: 'var(--sif-surface-subtle)',
              minHeight: '520px',
            }}
          >
            <ProfileCard theme={selectedCardTheme} />
          </div>
        </section>
      </div>
    </div>
  );
}
