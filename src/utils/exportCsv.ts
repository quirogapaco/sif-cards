// src/utils/exportCsv.ts
import type { Card } from '../types/database';
import { getCardFullUrl } from './cardUtils';

export function exportBatchToCsv(batchName: string, cardType: string, cards: Card[]): void {
  const headers = [
    'Numero_Serie',
    'Tipo_Tarjeta',
    'URL_NFC_QR',
  ];

  const rows = cards.map((card) => [
    card.serial_number || '',
    card.card_type || cardType || '',
    getCardFullUrl(card.relative_path, card.token),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((value) => `"${value}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const sanitizedName = batchName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `sif_lote_${sanitizedName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}