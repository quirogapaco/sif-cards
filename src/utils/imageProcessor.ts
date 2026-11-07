const STANDARD_WEB_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

/**
 * Verifica si un archivo es de formato HEIC o HEIF por su MIME type o extensión.
 */
export function isHeicFile(file: File): boolean {
  const mime = file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return (
    mime === 'image/heic' ||
    mime === 'image/heif' ||
    mime === 'image/heic-sequence' ||
    mime === 'image/heif-sequence' ||
    ext === 'heic' ||
    ext === 'heif'
  );
}

/**
 * Procesa el archivo de imagen únicamente cuando el formato no es estándar (.heic / .heif).
 * Si el archivo ya está en un formato web compatible (JPG, PNG, WEBP, etc.),
 * se retorna directamente sin ningún procesamiento adicional.
 */
export async function ensureCompatibleImage(file: File): Promise<File> {
  const mime = file.type.toLowerCase();

  // Si ya es un formato estándar y no tiene extensión .heic/.heif, retornar directo
  if (STANDARD_WEB_MIME_TYPES.has(mime) && !isHeicFile(file)) {
    return file;
  }

  // Solo convertir cuando el archivo sea HEIC / HEIF
  if (isHeicFile(file)) {
    const heic2anyModule = await import('heic2any');
    const heic2any = heic2anyModule.default || heic2anyModule;

    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    const convertedBlob = Array.isArray(result) ? result[0] : result;
    const baseName = file.name.replace(/\.(heic|heif)$/i, '') || 'image';

    return new File([convertedBlob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  }

  return file;
}

