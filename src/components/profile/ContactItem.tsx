import { MessageCircle, Mail, Phone, MapPin, ExternalLink, type LucideIcon } from 'lucide-react';

type ContactType = 'whatsapp' | 'email' | 'phone' | 'location';

interface ContactItemProps {
  type: ContactType;
  value?: string;
  /** Callback opcional de telemetría: recibe el canal y el valor de contacto */
  onTrack?: (channel: ContactType, targetValue: string) => void;
}

interface ContactConfig {
  label: string;
  Icon: LucideIcon;
  buildHref: (value: string) => string;
}

const CONTACT_CONFIG: Record<ContactType, ContactConfig> = {
  whatsapp: {
    label: 'WhatsApp',
    Icon: MessageCircle,
    buildHref: (v) => `https://wa.me/${v.replace(/[^\d+]/g, '')}`,
  },
  email: {
    label: 'Email',
    Icon: Mail,
    buildHref: (v) => `mailto:${v}`,
  },
  phone: {
    label: 'Teléfono',
    Icon: Phone,
    buildHref: (v) => `tel:${v.replace(/[^\d+]/g, '')}`,
  },
  location: {
    label: 'Ubicación',
    Icon: MapPin,
    buildHref: (v) => `https://maps.google.com/?q=${encodeURIComponent(v)}`,
  },
};

/**
 * Fila de contacto interactiva con ícono, label y acción de enlace.
 * Retorna null si el valor está vacío o no definido.
 */
export default function ContactItem({ type, value, onTrack }: ContactItemProps) {
  if (!value || value.trim() === '') return null;

  const { label, Icon, buildHref } = CONTACT_CONFIG[type];
  const href = buildHref(value.trim());

  return (
    <a
      href={href}
      target={type === 'email' || type === 'phone' ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onClick={() => onTrack?.(type, value!.trim())}
      className="flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 group"
      style={{
        backgroundColor: 'var(--card-surface-card)',
        borderColor: 'var(--card-surface-border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in srgb, var(--card-primary) 50%, transparent)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-surface-border)';
      }}
    >
      {/* Ícono en contenedor circular */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card-primary) 10%, transparent)',
            color: 'var(--card-primary)',
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider font-card-body"
            style={{ color: 'var(--card-text-muted)' }}
          >
            {label}
          </p>
          <p
            className="text-sm font-medium truncate font-card-body transition-colors duration-300"
            style={{ color: 'var(--card-text-main)' }}
          >
            {value}
          </p>
        </div>
      </div>

      {/* Ícono externo sutil */}
      <ExternalLink
        className="w-4 h-4 shrink-0 ml-2 transition-colors duration-300"
        style={{ color: 'var(--card-text-muted)' }}
      />
    </a>
  );
}
