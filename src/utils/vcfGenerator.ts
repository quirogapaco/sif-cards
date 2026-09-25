import type { ProfileData } from '../types/database';

/**
 * Genera y descarga un archivo VCard (.vcf) con los datos del perfil.
 * @param data - ProfileData tipado desde Supabase
 * @param slug - Slug del perfil para el nombre del archivo
 */
export function downloadVCard(data: ProfileData, slug: string = 'contacto'): void {
  const phone = data.direct_contacts?.whatsapp || data.direct_contacts?.phone || '';
  const emails = data.direct_contacts?.emails?.length 
    ? data.direct_contacts.emails.filter(Boolean) 
    : (data.direct_contacts?.email ? [data.direct_contacts.email] : []);
  const bio   = data.bio_description || '';

  // Sanitize phone: keep only digits and leading +
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.display_name}`,
    `ORG:${data.company}`,
    `TITLE:${data.job_title}`,
    cleanPhone ? `TEL;TYPE=CELL:${cleanPhone}` : '',
    ...emails.map(e => `EMAIL:${e}`),
    bio ? `NOTE:${bio.replace(/\n/g, '\\n')}` : '',
    'END:VCARD',
  ].filter(Boolean);

  const vcfContent = lines.join('\r\n');
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${slug}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
