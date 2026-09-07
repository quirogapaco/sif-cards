import { GraduationCap } from 'lucide-react';

interface EducationItemProps {
  title: string;
  institution: string;
  period: string;
}

/**
 * Tarjeta individual de una entrada académica o de experiencia.
 */
export default function EducationItem({ title, institution, period }: EducationItemProps) {
  return (
    <div className="flex gap-4 items-start">
      {/* Ícono de institución */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-500"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--card-surface-card) 80%, transparent)',
          borderColor: 'var(--card-surface-border)',
          color: 'var(--card-text-muted)',
        }}
      >
        <GraduationCap className="w-5 h-5" />
      </div>

      {/* Datos de la entrada */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-semibold leading-snug font-card-body transition-colors duration-500"
          style={{ color: 'var(--card-text-main)' }}
        >
          {title}
        </h4>
        <p
          className="text-sm mt-0.5 font-card-body transition-colors duration-500"
          style={{ color: 'var(--card-text-muted)' }}
        >
          {institution}
        </p>
        <p
          className="text-[11px] mt-1.5 font-semibold uppercase tracking-wider font-card-body transition-colors duration-500"
          style={{ color: 'color-mix(in srgb, var(--card-text-muted) 70%, transparent)' }}
        >
          {period}
        </p>
      </div>
    </div>
  );
}
