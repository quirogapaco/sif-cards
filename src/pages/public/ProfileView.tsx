import { useCallback } from 'react';
import { Download, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import type { Profile } from '../../types/database';
import { downloadVCard } from '../../utils/vcfGenerator';
import { useProfileAnalytics } from '../../hooks/useProfileAnalytics';

import ProfileBanner      from '../../components/profile/ProfileBanner';
import ProfileAvatar      from '../../components/profile/ProfileAvatar';
import ProfileSocialBar   from '../../components/profile/ProfileSocialBar';
import ContactItem        from '../../components/profile/ContactItem';
import ProfileBioSection  from '../../components/profile/ProfileBioSection';
import ProfileEducation   from '../../components/profile/ProfileEducation';
import ProfileBusinesses  from '../../components/profile/ProfileBusinesses';
import ProfileFooter      from '../../components/profile/ProfileFooter';

interface ProfileViewProps {
  profile: Profile;
  /** true si el acceso proviene de chip NFC (/t/:token o /:prefix/:token) */
  isNfcSource?: boolean;
  /** Token del chip NFC, solo cuando isNfcSource = true */
  token?: string;
}

/**
 * Vista pública del perfil SIF.
 * Envoltura raíz con [data-card-theme] para el scope aislado de CSS.
 * Todos los hijos consumen exclusivamente variables card-*.
 */
export default function ProfileView({ profile, isNfcSource = false, token }: ProfileViewProps) {
  const data     = profile.data;
  const theme    = profile.theme_palette || 'emerald-dark';
  const contacts = data.direct_contacts;

  // ── Telemetría ──────────────────────────────────────────────────────────────
  const { trackContactSave, trackDirectContact, trackSocialClick, trackShare } =
    useProfileAnalytics({ profileId: profile.id, isNfcSource, token });

  // ── Estado del botón Compartir ──────────────────────────────────────────────
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');

  const handleSaveContact = useCallback(() => {
    trackContactSave();
    downloadVCard(data, profile.slug);
  }, [trackContactSave, data, profile.slug]);

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/p/${profile.slug}`;
    const shareData = {
      title: data.display_name,
      text: `${data.job_title} · ${data.company}`,
      url: shareUrl,
    };

    // Intentar Web Share API nativa (móviles)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        trackShare('native_share');
      } catch {
        // El usuario canceló — no contabilizar ni mostrar error
      }
      return;
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackShare('clipboard');
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2000);
    } catch {
      // Fallback final: selección manual con prompt
      window.prompt('Copia el enlace del perfil:', shareUrl);
    }
  }, [profile.slug, data.display_name, data.job_title, data.company, trackShare]);

  return (
    <div
      data-card-theme={theme}
      className="min-h-screen w-full font-card-body transition-colors duration-300"
      style={{ backgroundColor: 'var(--card-surface)', color: 'var(--card-text-main)' }}
    >
      {/* ── 1. Banner Superior ─────────────────────────────────────────────── */}
      <ProfileBanner bannerUrl={data.banner_url} />

      {/* ── 2. Contenido Central ───────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-6 space-y-5">

        {/* ── 2a. Header: Avatar + Identidad ─────────────────────────────── */}
        <div className="flex flex-col items-center text-center -mt-[72px] space-y-3">

          {/* Avatar flotante solapado */}
          <ProfileAvatar
            avatarUrl={data.avatar_url}
            displayName={data.display_name}
          />

          {/* Identidad */}
          <div className="space-y-1.5 pt-1">
            <h1
              className="text-2xl font-bold leading-tight font-card-headline transition-colors duration-500"
              style={{ color: 'var(--card-text-main)' }}
            >
              {data.display_name}
            </h1>

            <p
              className="text-sm font-semibold font-card-body transition-colors duration-500"
              style={{ color: 'var(--card-primary)' }}
            >
              {data.job_title}
            </p>

            {/* Badge de empresa */}
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider font-card-body transition-colors duration-300"
              style={{
                borderColor: 'var(--card-surface-border)',
                backgroundColor: 'color-mix(in srgb, var(--card-primary) 8%, transparent)',
                color: 'var(--card-text-muted)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--card-primary)' }}
              />
              {data.company}
            </span>
          </div>
        </div>

        {/* ── 2b. CTAs: Guardar Contacto + Compartir ──────────────────────── */}
        <div className="flex items-center gap-3">
          {/* CTA principal: Guardar Contacto */}
          <button
            id="profile-cta-save"
            onClick={handleSaveContact}
            className="flex-1 group relative overflow-hidden rounded-full py-3.5 px-8 font-semibold text-sm shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl font-card-headline flex items-center justify-center gap-2.5"
            style={{
              backgroundColor: 'var(--card-primary)',
              color: 'var(--card-primary-fg)',
              boxShadow: '0 8px 24px -4px color-mix(in srgb, var(--card-primary) 40%, transparent)',
            }}
          >
            {/* Efecto de brillo al hover */}
            <span
              className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"
            />
            <Download className="w-4 h-4 relative z-10 shrink-0" />
            <span className="relative z-10">Guardar Contacto</span>
          </button>

          {/* Botón compartir */}
          <button
            id="profile-cta-share"
            onClick={handleShare}
            title={shareState === 'copied' ? '¡Enlace copiado!' : 'Compartir perfil'}
            aria-label="Compartir perfil"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: 'var(--card-surface-border)',
              backgroundColor: 'var(--card-surface-card)',
              color: shareState === 'copied' ? 'var(--card-primary)' : 'var(--card-text-muted)',
            }}
          >
            {shareState === 'copied'
              ? <Check className="w-4 h-4" />
              : <Share2 className="w-4 h-4" />
            }
          </button>
        </div>

        {/* ── 2c. Barra Social ───────────────────────────────────────────── */}
        <ProfileSocialBar
          socialLinks={data.social_links}
          onSocialClick={trackSocialClick}
        />

        {/* ── 2d. Contactos Directos ─────────────────────────────────────── */}
        <div className="space-y-3">
          <ContactItem type="whatsapp" value={contacts?.whatsapp} onTrack={trackDirectContact} />
          <ContactItem type="email"    value={contacts?.email}    onTrack={trackDirectContact} />
          <ContactItem type="phone"    value={contacts?.phone}    onTrack={trackDirectContact} />
          <ContactItem type="location" value={contacts?.location} onTrack={trackDirectContact} />
        </div>

        {/* ── 2e. Bio Profesional + Idiomas ──────────────────────────────── */}
        <ProfileBioSection
          bio={data.bio_description}
          languages={data.languages}
        />

        {/* ── 2f. Educación ──────────────────────────────────────────────── */}
        <ProfileEducation educationList={data.education} />

        {/* ── 2g. Trayectoria (Businesses) ───────────────────────────────── */}
        <ProfileBusinesses businessesList={data.businesses} />

        {/* ── 2h. Footer SIF ─────────────────────────────────────────────── */}
        <ProfileFooter />
      </div>
    </div>
  );
}
