// src/services/analyticsService.ts
//
// Servicio fire-and-forget de telemetría SIF.
// Nunca lanza excepciones ni bloquea la UI: todos los errores se capturan
// internamente. Compatible con bloqueadores de rastreo e incógnito estricto.

import { supabase } from '../lib/supabase';
import type { AnalyticsEventType, AnalyticsEventInsert } from '../types/database';

// ── Payloads tipados por evento ─────────────────────────────────────────────

interface NfcTapPayload {
  event_type: 'nfc_tap';
  token: string;
  pathname: string;
  referrer: string;
  screen_width: number;
  user_agent: string;
}

interface ProfileViewPayload {
  event_type: 'profile_view';
  pathname: string;
  referrer: string;
  screen_width: number;
  user_agent: string;
}

interface ContactDownloadPayload {
  event_type: 'contact_download';
  format: 'vcf';
  timestamp: string;
}

interface DirectContactClickPayload {
  event_type: 'direct_contact_click';
  channel: 'whatsapp' | 'email' | 'phone' | 'location';
  target_value: string;
}

interface SocialLinkClickPayload {
  event_type: 'social_link_click';
  platform: string;
  target_url: string;
}

interface ProfileSharePayload {
  event_type: 'profile_share';
  method: 'native_share' | 'clipboard';
}

export type TrackEventPayload =
  | NfcTapPayload
  | ProfileViewPayload
  | ContactDownloadPayload
  | DirectContactClickPayload
  | SocialLinkClickPayload
  | ProfileSharePayload;

// ── Función principal ───────────────────────────────────────────────────────

/**
 * Registra un evento de analítica de forma asíncrona y silenciosa (fire-and-forget).
 * No bloquea la UI ni lanza excepciones. Los errores se capturan con console.error.
 *
 * @param profileId - ID del perfil cuyo evento se registra
 * @param payload   - Datos tipados del evento
 */
export function trackEvent(profileId: string, payload: TrackEventPayload): void {
  const { event_type, ...meta } = payload;

  // Construir el registro para insertar
  const record: AnalyticsEventInsert = {
    profile_id: profileId,
    event_type: event_type as AnalyticsEventType,
    metadata: {
      ...meta,
      // Enriquecimiento automático con datos ambientales del cliente
      _client_ts: new Date().toISOString(),
      _user_agent: navigator.userAgent,
      _referrer: document.referrer || null,
      _screen_width: window.innerWidth,
    } as Record<string, unknown>,
  };

  // Fire-and-forget: sin await en la UI
  // Se envuelve en Promise.resolve() porque el builder de Supabase devuelve
  // PromiseLike (sin .catch()); así obtenemos un Promise nativo completo.
  void Promise.resolve(
    supabase
      .from('analytics')
      .insert(record)
  )
    .then(({ error }) => {
      if (error) {
        // Silencioso para el usuario; visible para debugging interno
        console.error('[Analytics] Error al registrar evento:', event_type, error.message);
      }
    })
    .catch((err: unknown) => {
      // Captura fallos de red, bloqueadores de rastreo, modo incógnito, etc.
      console.error('[Analytics] Excepción en trackEvent:', err);
    });
}
