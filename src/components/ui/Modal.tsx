import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

/**
 * Modal accesible con:
 * - Backdrop con backdrop-blur-sm
 * - Cierre con tecla Escape
 * - Bloqueo de scroll del body
 * - Foco automático al abrir
 * - Tokens exclusivos sif-*
 */
export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  /* ── Escape para cerrar ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* ── Bloqueo de scroll del body ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Foco al abrir ── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => dialogRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative z-10 w-full ${maxWidth} rounded-3xl border border-sif-border bg-sif-surface p-6 shadow-2xl outline-none`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-base font-bold text-sif-text"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-sif-border text-sif-muted transition-all duration-150 hover:border-sif-gold hover:text-sif-gold active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
}
