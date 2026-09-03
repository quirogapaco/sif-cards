import { useState, useEffect, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { batchService, type CreateBatchDTO } from '../../services/batchService';
import { exportBatchToCsv } from '../../utils/exportCsv';
import { slugifyPrefix } from '../../utils/cardUtils';
import { Package, Loader2, CheckCircle2 } from 'lucide-react';

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CARD_TYPE_OPTIONS = [
  { value: 'matte-black-gold',   label: 'Negro Mate · Foil Oro' },
  { value: 'matte-black-silver', label: 'Negro Mate · Foil Plata' },
  { value: 'matte-white-gold',   label: 'Blanco Marfil · Foil Oro' },
  { value: 'matte-white-silver', label: 'Blanco Marfil · Foil Plata' },
];

const INITIAL_FORM: CreateBatchDTO = {
  name: '',
  card_type: 'matte-black-gold',
  quantity: 50,
  notes: '',
  url_prefix: '',
};

type SubmitState = 'idle' | 'loading' | 'success';

export function CreateBatchModal({ isOpen, onClose, onSuccess }: CreateBatchModalProps) {
  const [form, setForm] = useState<CreateBatchDTO>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [error, setError] = useState<string | null>(null);

  /* Reset al cerrar */
  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      setSubmitState('idle');
      setError(null);
    }
  }, [isOpen]);

  /* Preview dinámica de URL */
  const slugifiedPrefix = form.url_prefix ? slugifyPrefix(form.url_prefix) : '';
  const urlPreview = slugifiedPrefix
    ? `sif.link/${slugifiedPrefix}/:token`
    : 'sif.link/t/:token';

  const isFormValid =
    form.name.trim().length >= 3 &&
    form.quantity >= 1 &&
    form.quantity <= 1000;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || submitState === 'loading') return;

    setSubmitState('loading');
    setError(null);

    try {
      const dto: CreateBatchDTO = {
        ...form,
        url_prefix: slugifiedPrefix || undefined,
        notes: form.notes?.trim() || undefined,
      };

      const result = await batchService.createBatch(dto);

      /* Descargar CSV automáticamente */
      const cards = await batchService.getCardsByBatchId(result.batch_id);
      exportBatchToCsv(form.name, form.card_type, cards);

      setSubmitState('success');

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado al crear el lote.');
      setSubmitState('idle');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Lote de Tarjetas NFC" maxWidth="max-w-lg">
      {/* Estado de éxito */}
      {submitState === 'success' ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <CheckCircle2 className="h-14 w-14 text-sif-gold" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-bold text-sif-text">¡Lote creado exitosamente!</p>
            <p className="mt-1 text-xs text-sif-muted">
              El CSV para fabricación se ha descargado automáticamente.
            </p>
          </div>
        </div>
      ) : (
        <form id="create-batch-form" onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
          {/* Error global */}
          {error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Nombre del lote */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="batch-name" className="text-[11px] font-semibold uppercase tracking-wider text-sif-muted">
              Nombre / Referencia *
            </label>
            <input
              id="batch-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Lote 01 - Preventa Ambato"
              required
              minLength={3}
              autoComplete="off"
              spellCheck={false}
              className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text placeholder:text-sif-muted focus:border-sif-gold/50 focus:bg-sif-surface-subtle focus:outline-none focus:ring-1 focus:ring-sif-gold/30 transition-colors"
            />
          </div>

          {/* Cantidad */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="batch-quantity" className="text-[11px] font-semibold uppercase tracking-wider text-sif-muted">
              Cantidad de Tarjetas * (1–1000)
            </label>
            <input
              id="batch-quantity"
              name="quantity"
              type="number"
              min={1}
              max={1000}
              value={form.quantity}
              onChange={handleChange}
              required
              autoComplete="off"
              className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text placeholder:text-sif-muted focus:border-sif-gold/50 focus:bg-sif-surface-subtle focus:outline-none focus:ring-1 focus:ring-sif-gold/30 transition-colors"
            />
          </div>

          {/* Tipo de plástico */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="batch-card-type" className="text-[11px] font-semibold uppercase tracking-wider text-sif-muted">
              Tipo de Plástico / Acabado *
            </label>
            <select
              id="batch-card-type"
              name="card_type"
              value={form.card_type}
              onChange={handleChange}
              className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text focus:border-sif-gold/50 focus:bg-sif-surface-subtle focus:outline-none focus:ring-1 focus:ring-sif-gold/30 transition-colors cursor-pointer"
            >
              {CARD_TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Prefijo URL B2B */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="batch-url-prefix" className="text-[11px] font-semibold uppercase tracking-wider text-sif-muted">
              Prefijo URL Corporativo <span className="normal-case font-normal">(Opcional)</span>
            </label>
            <input
              id="batch-url-prefix"
              name="url_prefix"
              type="text"
              value={form.url_prefix ?? ''}
              onChange={handleChange}
              placeholder="Ej. empresa-xyz"
              autoComplete="off"
              spellCheck={false}
              className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm font-mono text-sif-text placeholder:text-sif-muted focus:border-sif-gold/50 focus:bg-sif-surface-subtle focus:outline-none focus:ring-1 focus:ring-sif-gold/30 transition-colors"
            />
            {/* Previsualización dinámica */}
            <div className="flex items-center gap-2 rounded-xl border border-sif-border bg-sif-surface px-3 py-2">
              <Package className="h-3.5 w-3.5 shrink-0 text-sif-muted" />
              <span className="font-mono text-[11px] text-sif-muted">
                Preview:{' '}
                <span style={{ color: 'var(--sif-gold)' }} className="font-semibold">
                  {urlPreview}
                </span>
              </span>
            </div>
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="batch-notes" className="text-[11px] font-semibold uppercase tracking-wider text-sif-muted">
              Notas / Proveedor <span className="normal-case font-normal">(Opcional)</span>
            </label>
            <textarea
              id="batch-notes"
              name="notes"
              value={form.notes ?? ''}
              onChange={handleChange}
              rows={3}
              spellCheck={false}
              placeholder="Ej. Proveedor: PlasticCard MX. Entrega estimada: 15 días."
              className="resize-none rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text placeholder:text-sif-muted focus:border-sif-gold/50 focus:bg-sif-surface-subtle focus:outline-none focus:ring-1 focus:ring-sif-gold/30 transition-colors"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 border-t border-sif-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-sif-border px-5 py-2.5 text-sm font-semibold text-sif-muted transition-all hover:border-sif-gold/30 hover:text-sif-text"
            >
              Cancelar
            </button>
            <button
              id="create-batch-submit"
              type="submit"
              disabled={!isFormValid || submitState === 'loading'}
              className="flex items-center gap-2 rounded-xl border border-sif-gold/40 px-5 py-2.5 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: isFormValid
                  ? 'linear-gradient(135deg, var(--sif-gold), color-mix(in srgb, var(--sif-gold) 70%, var(--sif-silver)))'
                  : 'var(--sif-surface-subtle)',
                color: isFormValid ? '#000' : 'var(--sif-muted)',
              }}
            >
              {submitState === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4" />
                  Crear Lote y Descargar CSV
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
