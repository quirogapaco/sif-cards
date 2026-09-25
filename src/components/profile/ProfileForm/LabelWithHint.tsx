import { Info } from 'lucide-react';

export default function LabelWithHint({ htmlFor, label, hint }: { htmlFor?: string, label: string, hint?: string }) {
  return (
    <div className="flex items-center mb-1.5 ml-1">
      <label htmlFor={htmlFor} className="text-[11px] font-semibold text-sif-text tracking-wide">{label}</label>
      {hint && (
        <div className="group relative ml-1.5 flex items-center justify-center">
          <Info className="h-3.5 w-3.5 text-sif-muted hover:text-sif-gold cursor-help transition-colors" />
          <div className="pointer-events-none absolute left-1/2 bottom-full -translate-x-1/2 mb-2 w-[180px] rounded-lg bg-sif-surface border border-sif-border px-3 py-2 text-[10px] text-sif-text opacity-0 transition-opacity group-hover:opacity-100 shadow-xl z-50 text-center leading-tight">
            {hint}
          </div>
        </div>
      )}
    </div>
  );
}
