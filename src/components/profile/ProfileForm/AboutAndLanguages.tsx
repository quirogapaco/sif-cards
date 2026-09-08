import { useState } from 'react';
import { FileText, ChevronUp, ChevronDown } from 'lucide-react';
import type { ProfileFormData } from './ProfileForm';

interface AboutAndLanguagesProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PRESET_LANGUAGES = ['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués'];

export default function AboutAndLanguages({ formData, onChange, isOpen, onToggle }: AboutAndLanguagesProps) {
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
    <div className="rounded-2xl border border-sif-border bg-sif-surface overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
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
        {isOpen ? <ChevronUp className="h-4 w-4 text-sif-muted" /> : <ChevronDown className="h-4 w-4 text-sif-muted" />}
      </button>

      {isOpen && (
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
  );
}
