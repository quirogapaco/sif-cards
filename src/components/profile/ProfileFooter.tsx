import sifGold from '../../assets/sif_gold.png';

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
      <a
        href={import.meta.env.VITE_APP_DOMAIN || 'https://sifcards.com'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span
          className="text-[11px] flex items-center gap-1 font-card-body"
          style={{ color: 'var(--card-text-muted)' }}
        >
          Powered by
        </span>
        <img src={sifGold} alt="SIF Cards" className="h-16 w-auto object-contain opacity-80" />
      </a>
    </footer>
  );
}
