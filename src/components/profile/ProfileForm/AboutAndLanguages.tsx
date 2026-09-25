import { useState } from 'react';
import type { ProfileFormData } from './ProfileForm';
import LabelWithHint from './LabelWithHint';

interface AboutAndLanguagesProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
}

const PRESET_LANGUAGES = ['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués'];

export default function AboutAndLanguages({ formData, onChange }: AboutAndLanguagesProps) {
  const [customLanguage, setCustomLanguage] = useState('');

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

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative mt-2">
        <LabelWithHint htmlFor="bio_description" label="Biografía Profesional" hint="Un breve resumen sobre ti, tus habilidades o lo que ofreces." />
        <textarea
          id="bio_description"
          rows={4}
          value={formData.bio_description}
          onChange={(e) => onChange({ ...formData, bio_description: e.target.value })}
          placeholder="Escribe algo sobre ti..."
          className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-2.5 text-sm text-sif-text outline-none focus:border-sif-gold resize-none transition-colors"
        />
      </div>

      {/* Idiomas */}
      <div className="flex flex-col gap-2.5 mt-2">
        <LabelWithHint label="Idiomas" hint="Idiomas en los que te puedes comunicar fluidamente." />
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
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
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
            className="flex-1 rounded-xl border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-xs text-sif-text outline-none focus:border-sif-gold"
          />
          <button
            type="button"
            onClick={() => addLanguage(customLanguage)}
            className="rounded-xl border border-sif-gold/40 bg-sif-gold/10 px-3 py-1.5 text-xs font-semibold text-sif-gold hover:bg-sif-gold/20"
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
                className="inline-flex items-center gap-1.5 rounded-full border border-sif-gold/30 bg-sif-gold/10 px-2 py-0.5 text-xs font-medium text-sif-gold"
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
  );
}
