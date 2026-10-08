import { useState } from 'react';
import { X, Building2, UploadCloud, Loader2, Settings2, Plus } from 'lucide-react';
import { orgService } from '../../services/orgService';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOrgModal({ isOpen, onClose, onSuccess }: CreateOrgModalProps) {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  const [mode, setMode] = useState<'kv' | 'raw'>('kv');
  const [kvList, setKvList] = useState([{ key: 'primaryColor', value: '#D4AF37' }]);
  const [settingsJson, setSettingsJson] = useState('{\n  "primaryColor": "#D4AF37"\n}');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleModeSwitch = (newMode: 'kv' | 'raw') => {
    setError(null);
    if (newMode === 'raw' && mode === 'kv') {
      const obj = kvList.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
        return acc;
      }, {} as Record<string, string>);
      setSettingsJson(JSON.stringify(obj, null, 2));
      setMode('raw');
    } else if (newMode === 'kv' && mode === 'raw') {
      try {
        const obj = JSON.parse(settingsJson);
        if (typeof obj === 'object' && obj !== null) {
          const list = Object.entries(obj).map(([k, v]) => ({ key: k, value: String(v) }));
          setKvList(list.length > 0 ? list : [{ key: '', value: '' }]);
        }
        setMode('kv');
      } catch {
        setError('El JSON es inválido. Corrígelo antes de cambiar a modo Lista.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) throw new Error('El nombre es requerido');
      
      let parsedSettings = {};
      if (mode === 'raw') {
        try {
          parsedSettings = JSON.parse(settingsJson);
        } catch {
          throw new Error('El JSON de configuraciones es inválido');
        }
      } else {
        parsedSettings = kvList.reduce((acc, curr) => {
          if (curr.key.trim()) {
            acc[curr.key.trim()] = curr.value;
          }
          return acc;
        }, {} as Record<string, string>);
      }

      await orgService.createOrganization(
        name.trim(),
        logoUrl.trim() || null,
        parsedSettings
      );

      setName('');
      setLogoUrl('');
      setKvList([{ key: 'primaryColor', value: '#D4AF37' }]);
      setSettingsJson('{\n  "primaryColor": "#D4AF37"\n}');
      setMode('kv');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la organización');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-sif-border bg-sif-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sif-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-sif-gold" />
            <h2 className="text-lg font-bold text-sif-text">Crear Organización B2B</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-sif-muted transition-colors hover:bg-sif-surface-subtle hover:text-sif-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sif-muted">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Acme Corp"
              className="w-full rounded-xl border border-sif-border bg-sif-surface py-2.5 px-4 text-sm text-sif-text placeholder-sif-muted focus:border-sif-gold focus:outline-none focus:ring-1 focus:ring-sif-gold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sif-muted flex items-center gap-1.5">
              <UploadCloud className="h-3 w-3" /> URL del Logo
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-sif-border bg-sif-surface py-2.5 px-4 text-sm text-sif-text placeholder-sif-muted focus:border-sif-gold focus:outline-none focus:ring-1 focus:ring-sif-gold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-sif-muted flex items-center gap-1.5">
                <Settings2 className="h-3 w-3" /> Configuraciones
              </label>
              <div className="flex items-center rounded-lg border border-sif-border bg-sif-surface p-0.5">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('kv')}
                  className={`rounded-md px-2 py-1 text-[10px] font-bold transition-all ${mode === 'kv' ? 'bg-sif-surface-subtle text-sif-text shadow-sm' : 'text-sif-muted hover:text-sif-text'}`}
                >Lista</button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('raw')}
                  className={`rounded-md px-2 py-1 text-[10px] font-bold transition-all ${mode === 'raw' ? 'bg-sif-surface-subtle text-sif-text shadow-sm' : 'text-sif-muted hover:text-sif-text'}`}
                >Raw JSON</button>
              </div>
            </div>

            {mode === 'raw' ? (
              <textarea
                value={settingsJson}
                onChange={(e) => setSettingsJson(e.target.value)}
                rows={4}
                className="w-full font-mono rounded-xl border border-sif-border bg-sif-surface py-2.5 px-4 text-xs text-sif-text placeholder-sif-muted focus:border-sif-gold focus:outline-none focus:ring-1 focus:ring-sif-gold"
              />
            ) : (
              <div className="flex flex-col gap-2 rounded-xl border border-sif-border bg-sif-surface p-3 max-h-40 overflow-y-auto">
                {kvList.map((kv, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Clave (ej. theme)"
                      value={kv.key}
                      onChange={(e) => {
                        const next = [...kvList];
                        next[i].key = e.target.value;
                        setKvList(next);
                      }}
                      className="w-[45%] rounded-lg border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-xs text-sif-text focus:border-sif-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Valor"
                      value={kv.value}
                      onChange={(e) => {
                        const next = [...kvList];
                        next[i].value = e.target.value;
                        setKvList(next);
                      }}
                      className="w-[45%] rounded-lg border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-xs text-sif-text focus:border-sif-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setKvList(kvList.filter((_, idx) => idx !== i))}
                      className="text-sif-muted hover:text-red-400 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setKvList([...kvList, { key: '', value: '' }])}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-sif-border py-1.5 text-xs font-semibold text-sif-muted hover:border-sif-gold/40 hover:text-sif-gold transition-colors"
                >
                  <Plus className="h-3 w-3" /> Agregar campo
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-sif-muted hover:bg-sif-surface-subtle hover:text-sif-text"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--sif-gold), color-mix(in srgb, var(--sif-gold) 65%, var(--sif-silver)))',
                color: '#000',
              }}
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</>
              ) : (
                'Crear Organización'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
