import { BookOpen } from 'lucide-react';

interface ProfileBioSectionProps {
  bio?: string;
  languages?: string[];
}

/**
 * Sección de perfil profesional y badges de idiomas.
 * Solo se renderiza si bio o languages tienen contenido.
 */
export default function ProfileBioSection({ bio, languages }: ProfileBioSectionProps) {
  const hasBio = bio && bio.trim().length > 0;
  const hasLanguages = languages && languages.length > 0;

  if (!hasBio && !hasLanguages) return null;

  return (
    <div
      className="rounded-3xl border p-6 shadow-sm transition-colors duration-500"
      style={{
        backgroundColor: 'var(--card-surface-card)',
        borderColor: 'var(--card-surface-border)',
      }}
    >
      {/* Encabezado de sección */}
      <h3
        className="text-base font-semibold flex items-center gap-2 mb-4 font-card-headline transition-colors duration-500"
        style={{ color: 'var(--card-primary)' }}
      >
        <BookOpen className="w-5 h-5 shrink-0" />
        Perfil Profesional
      </h3>

      {/* Texto de biografía */}
      {hasBio && (
        <p
          className="text-sm leading-relaxed font-card-body transition-colors duration-500"
          style={{ color: 'var(--card-text-muted)' }}
        >
          {bio}
        </p>
      )}

      {/* Badges de idiomas */}
      {hasLanguages && (
        <div className={hasBio ? 'mt-6 pt-6 border-t' : ''} style={{ borderColor: 'var(--card-surface-border)' }}>
          {hasBio && (
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mb-3 font-card-body"
              style={{ color: 'var(--card-text-muted)' }}
            >
              Idiomas
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {languages!.map((lang, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full border text-xs font-semibold font-card-body transition-colors duration-300"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--card-primary) 10%, transparent)',
                  color: 'var(--card-primary)',
                  borderColor: 'color-mix(in srgb, var(--card-primary) 20%, transparent)',
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
