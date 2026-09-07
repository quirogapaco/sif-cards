import { ExternalLink } from 'lucide-react';

/**
 * Sello de marca oficial al pie de la vista de perfil pública.
 * Estilizado en tonos del scope card-muted para no distraer.
 */
export default function ProfileFooter() {
  return (
    <footer
      className="pt-8 pb-20 border-t flex flex-col items-center justify-center gap-3 transition-colors duration-500"
      style={{ borderColor: 'var(--card-surface-border)' }}
    >
      {/* Monograma de marca */}
      <div
        className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase font-card-body transition-colors duration-500"
        style={{ color: 'var(--card-text-muted)' }}
      >
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold font-card-headline border transition-colors duration-500"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card-primary) 8%, transparent)',
            borderColor: 'color-mix(in srgb, var(--card-primary) 20%, transparent)',
            color: 'var(--card-primary)',
          }}
        >
          SiF
        </span>
        <span>Sharing is Fast</span>
      </div>

      {/* Enlace externo */}
      <a
        href="https://sif.link"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] flex items-center gap-1 transition-colors duration-300 font-card-body hover:opacity-80"
        style={{ color: 'var(--card-text-muted)' }}
      >
        Powered by sif.link
        <ExternalLink className="w-2.5 h-2.5" />
      </a>
    </footer>
  );
}
