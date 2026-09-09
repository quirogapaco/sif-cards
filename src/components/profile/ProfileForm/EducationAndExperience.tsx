import { Briefcase, ChevronUp, ChevronDown, GraduationCap, Building2, Plus, Trash2 } from 'lucide-react';
import type { ProfileFormData } from './ProfileForm';

interface EducationAndExperienceProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function EducationAndExperience({ formData, onChange, isOpen, onToggle }: EducationAndExperienceProps) {
  const addEducation = () => {
    onChange({
      ...formData,
      education: [...formData.education, { title: '', institution: '', period: '' }],
    });
  };

  const updateEducation = (
    index: number,
    field: 'title' | 'institution' | 'period',
    val: string
  ) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...formData, education: updated });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const addBusiness = () => {
    onChange({
      ...formData,
      businesses: [...formData.businesses, { name: '', description: '', url: '' }],
    });
  };

  const updateBusiness = (
    index: number,
    field: 'name' | 'description' | 'url',
    val: string
  ) => {
    const updated = [...formData.businesses];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...formData, businesses: updated });
  };

  const removeBusiness = (index: number) => {
    onChange({
      ...formData,
      businesses: formData.businesses.filter((_, i) => i !== index),
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
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sif-text">5. Trayectoria y Emprendimientos</h3>
            <p className="text-xs text-sif-muted">Estudios académicos y proyectos propios</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-sif-muted" /> : <ChevronDown className="h-4 w-4 text-sif-muted" />}
      </button>

      {isOpen && (
        <div className="border-t border-sif-border p-5 flex flex-col gap-6">
          {/* Educación */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-sif-text flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-sif-gold" />
                <span>Educación / Títulos</span>
              </label>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-1 text-xs font-semibold text-sif-gold hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            {formData.education.map((edu, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-sif-border bg-sif-surface-subtle p-4 flex flex-col gap-2.5"
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between border-b border-sif-border pb-2 mb-1">
                  <span className="text-[11px] font-semibold text-sif-muted uppercase tracking-wider">
                    Título {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="text-sif-muted transition-colors hover:text-red-400 p-1 rounded-md hover:bg-red-500/10"
                    title="Eliminar título"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={edu.title}
                  onChange={(e) => updateEducation(idx, 'title', e.target.value)}
                  placeholder="Título o Maestría (ej. Ingeniería en Sistemas)"
                  className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    placeholder="Universidad / Instituto"
                    className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                  />
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                    placeholder="Periodo (ej. 2018 - 2022)"
                    className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Emprendimientos */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-sif-text flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-sif-gold" />
                <span>Negocios y Proyectos</span>
              </label>
              <button
                type="button"
                onClick={addBusiness}
                className="flex items-center gap-1 text-xs font-semibold text-sif-gold hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            {formData.businesses.map((biz, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-sif-border bg-sif-surface-subtle p-4 flex flex-col gap-2.5"
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between border-b border-sif-border pb-2 mb-1">
                  <span className="text-[11px] font-semibold text-sif-muted uppercase tracking-wider">
                    Trayectoria {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBusiness(idx)}
                    className="text-sif-muted transition-colors hover:text-red-400 p-1 rounded-md hover:bg-red-500/10"
                    title="Eliminar trayectoria"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={biz.name}
                  onChange={(e) => updateBusiness(idx, 'name', e.target.value)}
                  placeholder="Nombre del proyecto / marca"
                  className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                />

                <input
                  type="text"
                  value={biz.description}
                  onChange={(e) => updateBusiness(idx, 'description', e.target.value)}
                  placeholder="Breve resumen del servicio"
                  className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                />

                <input
                  type="url"
                  value={biz.url}
                  onChange={(e) => updateBusiness(idx, 'url', e.target.value)}
                  placeholder="Enlace web (ej. https://miempresa.com)"
                  className="rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
