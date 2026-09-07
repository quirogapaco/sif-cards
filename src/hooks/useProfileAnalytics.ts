// src/hooks/useProfileAnalytics.ts
//
// Hook personalizado que encapsula toda la lógica de telemetría del perfil público.
// - useRef protege el evento de vista inicial contra doble disparo (React StrictMode)
// - useCallback garantiza referencias estables → cero re-renders en hijos
// - Completamente pasivo: no maneja estado propio que genere re-renders

import { useEffect, useRef, useCallback } from 'react';
import { trackEvent } from '../services/analyticsService';

interface UseProfileAnalyticsParams {
  /** ID del perfil al que pertenecen los eventos */
  profileId: string;
  /** true si el acceso proviene de una tarjeta física (/t/:token o /:prefix/:token) */
  isNfcSource: boolean;
  /** Token del chip NFC, solo cuando isNfcSource = true */
  token?: string;
}

interface UseProfileAnalyticsReturn {
  /** Registra la descarga del contacto vCard */
  trackContactSave: () => void;
  /** Registra el clic en un canal de contacto directo */
  trackDirectContact: (channel: 'whatsapp' | 'email' | 'phone' | 'location', targetValue: string) => void;
  /** Registra el clic en un enlace de red social */
  trackSocialClick: (platform: string, targetUrl: string) => void;
  /** Registra la acción de compartir el perfil */
  trackShare: (method: 'native_share' | 'clipboard') => void;
}

/**
 * Instancia el sistema de telemetría para un perfil público.
 * Debe usarse una sola vez en la raíz de ProfileView.
 */
export function useProfileAnalytics({
  profileId,
  isNfcSource,
  token,
}: UseProfileAnalyticsParams): UseProfileAnalyticsReturn {
  // Flag para disparar el evento de vista exactamente una vez por montaje,
  // incluso en React StrictMode (donde los efectos se ejecutan dos veces en desarrollo).
  const viewTracked = useRef(false);

  useEffect(() => {
    if (viewTracked.current) return; // Ya registrado en esta sesión de montaje
    viewTracked.current = true;

    if (isNfcSource && token) {
      trackEvent(profileId, {
        event_type: 'nfc_tap',
        token,
        pathname: window.location.pathname,
        referrer: document.referrer,
        screen_width: window.innerWidth,
        user_agent: navigator.userAgent,
      });
    } else {
      trackEvent(profileId, {
        event_type: 'profile_view',
        pathname: window.location.pathname,
        referrer: document.referrer,
        screen_width: window.innerWidth,
        user_agent: navigator.userAgent,
      });
    }

    // Cleanup: si el componente se desmonta y remonta (StrictMode dev),
    // reseteamos el flag para que el siguiente montaje real también registre.
    return () => {
      viewTracked.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]); // Solo depende del profileId — intencionalmente estable

  // ── Callbacks expuestos ────────────────────────────────────────────────────

  const trackContactSave = useCallback(() => {
    trackEvent(profileId, {
      event_type: 'contact_download',
      format: 'vcf',
      timestamp: new Date().toISOString(),
    });
  }, [profileId]);

  const trackDirectContact = useCallback(
    (channel: 'whatsapp' | 'email' | 'phone' | 'location', targetValue: string) => {
      trackEvent(profileId, {
        event_type: 'direct_contact_click',
        channel,
        target_value: targetValue,
      });
    },
    [profileId]
  );

  const trackSocialClick = useCallback(
    (platform: string, targetUrl: string) => {
      trackEvent(profileId, {
        event_type: 'social_link_click',
        platform,
        target_url: targetUrl,
      });
    },
    [profileId]
  );

  const trackShare = useCallback(
    (method: 'native_share' | 'clipboard') => {
      trackEvent(profileId, {
        event_type: 'profile_share',
        method,
      });
    },
    [profileId]
  );

  return { trackContactSave, trackDirectContact, trackSocialClick, trackShare };
}
