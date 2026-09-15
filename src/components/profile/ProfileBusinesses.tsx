import { Building2 } from 'lucide-react';
import BusinessItem from './BusinessItem';

interface BusinessEntry {
  name: string;
  description: string;
  url: string;
}

interface ProfileBusinessesProps {
  businessesList?: BusinessEntry[];
}

/**
 * Contenedor del historial de trayectoria/emprendimientos.
 * No renderiza nada si la lista está vacía o no existe.
 */
export default function ProfileBusinesses({ businessesList }: ProfileBusinessesProps) {
  if (!businessesList || businessesList.length === 0) return null;

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
        <Building2 className="w-5 h-5 shrink-0" />
        Trayectoria
      </h3>

      {/* Lista de entradas */}
      <div className="flex flex-col gap-3">
        {businessesList.map((entry, idx) => (
          <div key={idx}>
            <BusinessItem
              name={entry.name}
              description={entry.description}
              url={entry.url}
            />
            {/* Divisor entre entradas (excepto la última) */}
            {idx < businessesList.length - 1 && (
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
