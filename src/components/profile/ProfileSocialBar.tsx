import SocialIcon from '../ui/SocialIcon';

interface SocialLink {
  platform: string;
  url: string;
  shape?: 'circle' | 'rect';
}

interface ProfileSocialBarProps {
  socialLinks?: SocialLink[];
  /** Callback opcional de telemetría: recibe la plataforma y la URL destino */
  onSocialClick?: (platform: string, targetUrl: string) => void;
}

const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  x: 'X',
  twitter: 'X',
  github: 'GitHub',
  youtube: 'YouTube',
  riman: 'RIMAN',
  website: 'Sitio Web',
  other: 'Enlace',
};

/**
 * Barra de íconos/botones sociales enlazados.
 * Cada red puede mostrarse de forma independiente como círculo ('circle') o rectángulo ('rect').
 */
export default function ProfileSocialBar({
  socialLinks,
  onSocialClick,
}: ProfileSocialBarProps) {
  if (!socialLinks || socialLinks.length === 0) return null;

  const rimanLinks = socialLinks.filter(
    (link) => link.platform.toLowerCase().trim() === 'riman'
  );
  const otherLinks = socialLinks.filter(
    (link) => link.platform.toLowerCase().trim() !== 'riman'
  );

  const circleLinks = otherLinks.filter((link) => link.shape !== 'rect');
  const rectLinks = otherLinks.filter((link) => link.shape === 'rect');

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 1. Botón exclusivo de RIMAN (independiente, justo debajo de Guardar Contacto) */}
      {rimanLinks.map((link, idx) => (
        <a
          key={`riman-${idx}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RIMAN"
          onClick={() => onSocialClick?.(link.platform, link.url)}
          className="w-full flex items-center justify-center h-14 px-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300"
        >
          <span className="font-serif font-bold text-xl tracking-[0.2em] text-[#2a4136]">
            RIMAN
          </span>
        </a>
      ))}

      {/* 2. Redes en formato Círculo */}
      {circleLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {circleLinks.map((link, idx) => (
            <a
              key={`circle-${idx}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
              onClick={() => onSocialClick?.(link.platform, link.url)}
              className="w-10 h-10 rounded-full border flex items-center justify-center shadow-sm transition-colors duration-300"
              style={{
                borderColor: 'var(--card-surface-border)',
                backgroundColor: 'var(--card-surface-card)',
                color: 'var(--card-text-muted)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--card-primary)';
                el.style.color = 'var(--card-primary)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--card-surface-border)';
                el.style.color = 'var(--card-text-muted)';
              }}
            >
              <SocialIcon platform={link.platform} className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}

      {/* 3. Redes en formato Rectángulo */}
      {rectLinks.length > 0 && (
        <div className="flex flex-row flex-wrap gap-3 w-full">
          {rectLinks.map((link, idx) => {
            const normalized = link.platform.toLowerCase().trim();
            const label = SOCIAL_PLATFORM_LABELS[normalized] ?? link.platform;

            return (
              <a
                key={`rect-${idx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onClick={() => onSocialClick?.(link.platform, link.url)}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 h-14 px-4 rounded-2xl shadow-lg hover:-translate-y-1 transition-transform duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, var(--card-primary) 0%, color-mix(in srgb, var(--card-primary) 78%, white) 100%)',
                  color: 'var(--card-primary-fg)',
                  boxShadow: '0 8px 20px -4px color-mix(in srgb, var(--card-primary) 40%, transparent)',
                }}
              >
                <SocialIcon platform={link.platform} className="w-5 h-5 shrink-0" />
                <span className="font-semibold tracking-wide text-sm">{label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
