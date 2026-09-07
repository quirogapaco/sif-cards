// src/utils/exportExcel.ts
import * as XLSX from 'xlsx';
import type { Card } from '../types/database';
import { getCardFullUrl } from './cardUtils';

export function exportBatchToExcel(batchName: string, cardType: string, cards: Card[]): void {
  const rows = cards.map((card) => ({
    'Numero_Serie': card.serial_number || '',
    'Tipo_Tarjeta': card.batch?.card_type || cardType || '',
    'URL_NFC_QR': getCardFullUrl(card.relative_path, card.token),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tarjetas');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create Blob
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');

  const sanitizedName = batchName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `sif_lote_${sanitizedName}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
