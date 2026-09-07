interface ProfileBannerProps {
  bannerUrl?: string;
}

/**
 * Banner superior fluido con gradiente de fallback.
 * Usa únicamente variables CSS del scope [data-card-theme].
 */
export default function ProfileBanner({ bannerUrl }: ProfileBannerProps) {
  if (bannerUrl) {
    return (
      <div
        className="w-full h-60 bg-cover bg-center"
        style={{ backgroundImage: `url('${bannerUrl}')` }}
        role="img"
        aria-label="Banner de perfil"
      />
    );
  }

  return (
    <div
      className="w-full h-60 transition-all duration-500"
      style={{
        background:
          'linear-gradient(135deg, var(--card-primary) 0%, var(--card-secondary) 100%)',
        opacity: 0.85,
      }}
      role="img"
      aria-label="Banner de perfil"
    />
  );
}
