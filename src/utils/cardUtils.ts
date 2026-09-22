// src/utils/cardUtils.ts

const DOMAIN = import.meta.env.VITE_APP_DOMAIN || 'https://sifcards.com';

/**
 * Calcula la URL completa a grabar en el chip NFC / QR
 */
export function getCardFullUrl(relativePath: string | null, token?: string): string {
  if (relativePath) {
    return `${DOMAIN}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
  }
  return `${DOMAIN}/t/${token || ''}`;
}

/**
 * Limpia y normaliza un prefijo corporativo (slug URL)
 */
export function slugifyPrefix(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/^-+|-+$/g, '');
}