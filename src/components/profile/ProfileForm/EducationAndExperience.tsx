import { GraduationCap, Building2, Plus, Trash2 } from 'lucide-react';
import type { ProfileFormData } from './ProfileForm';
import LabelWithHint from './LabelWithHint';

interface EducationAndExperienceProps {
  formData: ProfileFormData;
  onChange: (updated: ProfileFormData) => void;
}

export default function EducationAndExperience({ formData, onChange }: EducationAndExperienceProps) {
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
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            className="rounded-xl border border-sif-border bg-sif-surface-subtle p-3 flex flex-col gap-2"
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

            <div className="relative">
              <LabelWithHint htmlFor={`edu_title_${idx}`} label="Título o Maestría" />
              <input
                type="text"
                id={`edu_title_${idx}`}
                value={edu.title}
                onChange={(e) => updateEducation(idx, 'title', e.target.value)}
                placeholder="Ej: Licenciatura en Diseño"
                className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <div className="relative">
                <LabelWithHint htmlFor={`edu_inst_${idx}`} label="Universidad / Instituto" />
                <input
                  type="text"
                  id={`edu_inst_${idx}`}
                  value={edu.institution}
                  onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                  placeholder="Ej: Universidad Nacional"
                  className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold transition-colors"
                />
              </div>
              <div className="relative">
                <LabelWithHint htmlFor={`edu_per_${idx}`} label="Periodo" />
                <input
                  type="text"
                  id={`edu_per_${idx}`}
                  value={edu.period}
                  onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                  placeholder="Ej: 2018 - 2022"
                  className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold transition-colors"
                />
              </div>
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
            className="rounded-xl border border-sif-border bg-sif-surface-subtle p-3 flex flex-col gap-2"
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

            <div className="relative">
              <LabelWithHint htmlFor={`biz_name_${idx}`} label="Nombre del proyecto / marca" />
              <input
                type="text"
                id={`biz_name_${idx}`}
                value={biz.name}
                onChange={(e) => updateBusiness(idx, 'name', e.target.value)}
                placeholder="Ej: Mi Empresa S.A."
                className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold transition-colors"
              />
            </div>

            <div className="relative mt-1">
              <LabelWithHint htmlFor={`biz_desc_${idx}`} label="Breve resumen del servicio" />
              <input
                type="text"
                id={`biz_desc_${idx}`}
                value={biz.description}
                onChange={(e) => updateBusiness(idx, 'description', e.target.value)}
                placeholder="Ej: Consultoría en marketing digital."
                className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold transition-colors"
              />
            </div>

            <div className="relative mt-1">
              <LabelWithHint htmlFor={`biz_url_${idx}`} label="Enlace web" hint="URL del proyecto, si tiene." />
              <input
                type="url"
                id={`biz_url_${idx}`}
                value={biz.url}
                onChange={(e) => updateBusiness(idx, 'url', e.target.value)}
                placeholder="Ej: https://miempresa.com"
                className="w-full rounded-lg border border-sif-border bg-sif-surface px-3 py-2 text-xs text-sif-text outline-none focus:border-sif-gold transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
