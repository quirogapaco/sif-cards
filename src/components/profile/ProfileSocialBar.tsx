import SocialIcon from '../ui/SocialIcon';

interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileSocialBarProps {
  socialLinks?: SocialLink[];
  /** Callback opcional de telemetría: recibe la plataforma y la URL destino */
  onSocialClick?: (platform: string, targetUrl: string) => void;
}

/**
 * Barra de íconos sociales enlazados.
 * Reutiliza el componente centralizado SocialIcon para renderizado SVG consistente.
 * Retorna null si no hay links disponibles.
 */
export default function ProfileSocialBar({ socialLinks, onSocialClick }: ProfileSocialBarProps) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {socialLinks.map((link, idx) => {
        return (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.platform}
            onClick={() => onSocialClick?.(link.platform, link.url)}
            className="w-12 h-12 rounded-full border flex items-center justify-center shadow-sm transition-colors duration-300"
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
        );
      })}
    </div>
  );
}
