import { useState } from 'react';

interface ProfileAvatarProps {
  avatarUrl?: string;
  displayName: string;
}

/**
 * Avatar circular flotante solapado sobre el banner (-mt-20).
 * Fallback: inicial del nombre sobre bg-card-primary.
 */
export default function ProfileAvatar({ avatarUrl, displayName }: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initial = displayName.trim().charAt(0).toUpperCase();
  const showFallback = !avatarUrl || imgError;

  return (
    <div
      className="w-36 h-36 rounded-full border-4 overflow-hidden shadow-2xl z-20 transition-colors duration-500 shrink-0"
      style={{ borderColor: 'var(--card-surface)' }}
    >
      {showFallback ? (
        <div
          className="w-full h-full flex items-center justify-center text-5xl font-bold font-card-headline transition-colors duration-500"
          style={{
            background: 'var(--card-primary)',
            color: 'var(--card-primary-fg)',
          }}
        >
          {initial}
        </div>
      ) : (
        <img
          src={avatarUrl}
          alt={`Foto de ${displayName}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
