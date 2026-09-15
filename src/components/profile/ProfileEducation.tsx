import { BookMarked } from 'lucide-react';
import EducationItem from './EducationItem';

interface EducationEntry {
  title: string;
  institution: string;
  period: string;
}

interface ProfileEducationProps {
  educationList?: EducationEntry[];
}

/**
 * Contenedor del historial académico con encabezado de sección.
 * No renderiza nada si la lista está vacía o no existe.
 */
export default function ProfileEducation({ educationList }: ProfileEducationProps) {
  if (!educationList || educationList.length === 0) return null;

  return (
    <div
      className="rounded-2xl border p-5 shadow-sm transition-colors duration-500"
      style={{
        backgroundColor: 'var(--card-surface-card)',
        borderColor: 'var(--card-surface-border)',
      }}
    >
      {/* Encabezado de sección */}
      <h3
        className="text-base font-semibold flex items-center gap-2 mb-3 font-card-headline transition-colors duration-500"
        style={{ color: 'var(--card-primary)' }}
      >
        <BookMarked className="w-5 h-5 shrink-0" />
        Educación
      </h3>

      {/* Lista de entradas */}
      <div className="flex flex-col gap-3">
        {educationList.map((entry, idx) => (
          <div key={idx}>
            <EducationItem
              title={entry.title}
              institution={entry.institution}
              period={entry.period}
            />
            {/* Divisor entre entradas (excepto la última) */}
            {idx < educationList.length - 1 && (
              <div
                className="mt-3 border-t transition-colors duration-500"
                style={{ borderColor: 'var(--card-surface-border)' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
