import CardPreview from './CardPreview';
import { DEMO_PROFILE } from '../../types/profile';

interface ProfileCardProps {
  /** ID del tema de tarjeta: e.g. 'emerald-dark', 'gold-light' */
  theme: string;
}

/**
 * Contenedor aislado de la tarjeta de perfil.
 * Declara [data-card-theme] para activar el scope de variables card-*.
 * USA EXCLUSIVAMENTE clases card-* — NUNCA sif-*.
 */
export default function ProfileCard({ theme }: ProfileCardProps) {
  return (
    <div
      data-card-theme={theme}
      className="w-full max-w-sm overflow-hidden rounded-3xl bg-card-surface shadow-2xl transition-all duration-500"
      style={{
        // Sombra de acento sutil derivada del color primario de la tarjeta
        boxShadow:
          '0 25px 60px -12px rgba(0,0,0,0.45), 0 0 0 1px var(--card-surface-border)',
      }}
    >
      <CardPreview profile={DEMO_PROFILE} />
    </div>
  );
}
