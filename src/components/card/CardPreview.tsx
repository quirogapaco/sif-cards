import { useState } from 'react';
import { Download, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import type { ProfileData } from '../../types/profile';

interface CardPreviewProps {
  profile: ProfileData;
}

/**
 * Contenido visual de la tarjeta de perfil.
 * USA EXCLUSIVAMENTE clases card-* — NUNCA sif-*.
 * Las variables card-* son provistas por el [data-card-theme] del contenedor padre.
 */
export default function CardPreview({ profile }: CardPreviewProps) {
  const [avatarError, setAvatarError] = useState(false);

  const contactItems = [
    { id: 'whatsapp', Icon: Phone, label: 'WhatsApp', value: profile.phone },
    { id: 'email', Icon: Mail, label: 'Email', value: profile.email },
    { id: 'location', Icon: MapPin, label: 'Ubicación', value: profile.location },
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* Banner superior con gradiente de acento */}
      <div
        className="h-20 w-full rounded-t-3xl transition-all duration-500"
        style={{
          background:
            'linear-gradient(135deg, var(--card-primary) 0%, var(--card-secondary) 100%)',
          opacity: 0.85,
        }}
      />

      {/* Cuerpo de la tarjeta */}
      <div className="-mt-10 px-6 pb-6">
        {/* Avatar */}
        <div className="mb-3 flex justify-center">
          <div
            className="h-20 w-20 overflow-hidden rounded-full border-[3px] transition-colors duration-500"
            style={{ borderColor: 'var(--card-primary)' }}
          >
            {avatarError ? (
              /* Fallback: inicial del nombre */
              <div
                className="flex h-full w-full items-center justify-center text-2xl font-bold font-card-headline transition-colors duration-500"
                style={{
                  background: 'var(--card-primary)',
                  color: 'var(--card-primary-fg)',
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={profile.avatarUrl}
                alt={`Avatar de ${profile.name}`}
                className="h-full w-full object-cover"
                onError={() => setAvatarError(true)}
              />
            )}
          </div>
        </div>

        {/* Identidad */}
        <div className="mb-5 text-center">
          <h1
            className="text-xl font-bold leading-tight text-card-text font-card-headline transition-colors duration-500"
          >
            {profile.name}
          </h1>
          <p
            className="mt-0.5 text-sm font-medium text-card-primary font-card-body transition-colors duration-500"
          >
            {profile.title}
          </p>
          <span
            className="mt-2 inline-block rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider font-card-body transition-colors duration-500"
            style={{
              borderColor: 'var(--card-surface-border)',
              /* color-mix para opacidad sobre el color primario sin rgba(var()) */
              backgroundColor: 'color-mix(in srgb, var(--card-primary) 8%, transparent)',
              color: 'var(--card-text-muted)',
            }}
          >
            {profile.company}
          </span>
        </div>

        {/* CTA Principal — Guardar Contacto */}
        <button
          id="card-cta-save"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-card-primary py-2.5 text-sm font-semibold text-card-primary-fg shadow-lg transition-all duration-500 active:scale-95 font-card-body hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          Guardar Contacto
        </button>

        {/* Botones de Contacto */}
        <div className="mt-4 space-y-2">
          {contactItems.map(({ id, Icon, label, value }) => (
            <div
              key={id}
              id={`card-contact-${id}`}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-card-border bg-card-bg px-3 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-card-primary"
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="h-4 w-4 shrink-0 transition-colors duration-300"
                  style={{ color: 'var(--card-primary)' }}
                />
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wider text-card-muted font-card-body transition-colors duration-300"
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs font-medium text-card-text font-card-body transition-colors duration-300"
                  >
                    {value}
                  </p>
                </div>
              </div>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 text-card-muted transition-colors duration-300"
              />
            </div>
          ))}
        </div>

        {/* Footer — SiF Branding */}
        <div className="mt-6 border-t border-card-border pt-4 text-center transition-colors duration-500">
          <span
            className="inline-flex items-center gap-1 text-[11px] tracking-wide text-card-muted font-card-body"
          >
            Powered by{' '}
            <strong className="font-bold text-card-text">SiF</strong>
            <span className="mx-0.5">·</span>
            <span className="italic">Sharing is Fast</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
