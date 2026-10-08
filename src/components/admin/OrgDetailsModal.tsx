import { useState, useEffect } from 'react';
import { X, Building2, Users, Package2, Settings2, Plus, Loader2, Save, UploadCloud } from 'lucide-react';
import { orgService } from '../../services/orgService';
import { batchService, type BatchSummary } from '../../services/batchService';
import { userService, type OrgAdminListItem } from '../../services/userService';
import type { Organization } from '../../types/database';
import { CreateBatchModal } from '../batches/CreateBatchModal';

interface OrgDetailsModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

type Tab = 'settings' | 'admins' | 'batches';

export function OrgDetailsModal({ organization, isOpen, onClose, onUpdate }: OrgDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);

  // Settings State
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [mode, setMode] = useState<'kv' | 'raw'>('kv');
  const [kvList, setKvList] = useState([{ key: '', value: '' }]);
  const [settingsJson, setSettingsJson] = useState('{}');

  // Data States
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [admins, setAdmins] = useState<OrgAdminListItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && organization) {
      setName(organization.name);
      setLogoUrl(organization.logo_url || '');
      
      const settingsStr = JSON.stringify(organization.settings || {}, null, 2);
      setSettingsJson(settingsStr);
      
      const obj = organization.settings || {};
      const list = Object.entries(obj).map(([k, v]) => ({ key: k, value: String(v) }));
      setKvList(list.length > 0 ? list : [{ key: '', value: '' }]);
      setMode('kv');
      setActiveTab('settings');
      
      loadTabData('admins');
      loadTabData('batches');
    }
  }, [isOpen, organization]);

  const loadTabData = async (tab: Tab) => {
    if (!organization) return;
    setIsLoadingData(true);
    try {
      if (tab === 'batches') {
        const data = await batchService.getOrgBatches(organization.id);
        setBatches(data);
      } else if (tab === 'admins') {
        const orgAdmins = await userService.getOrgAdminsList(organization.id);
        setAdmins(orgAdmins);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (!isOpen || !organization) return null;

  const handleModeSwitch = (newMode: 'kv' | 'raw') => {
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
        const list = Object.entries(obj).map(([k, v]) => ({ key: k, value: String(v) }));
        setKvList(list.length > 0 ? list : [{ key: '', value: '' }]);
        setMode('kv');
      } catch {
        // ignore if invalid JSON
      }
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      let parsedSettings = {};
      if (mode === 'raw') {
        parsedSettings = JSON.parse(settingsJson);
      } else {
        parsedSettings = kvList.reduce((acc, curr) => {
          if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
          return acc;
        }, {} as Record<string, string>);
      }

      await orgService.updateOrganization(organization.id, {
        name,
        logo_url: logoUrl || null,
        settings: parsedSettings
      });
      onUpdate();
    } catch (error) {
      console.error("Error saving settings", error);
      alert("Error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  const urlPrefix = (organization.settings as any)?.url_prefix || undefined;

  return (
    <>
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-sif-border bg-sif-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sif-border bg-sif-surface-subtle px-6 py-4">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt="logo" className="h-10 w-10 rounded-lg object-cover border border-sif-border bg-white" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sif-surface border border-sif-border">
                <Building2 className="h-5 w-5 text-sif-gold" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-sif-text">{organization.name}</h2>
              <p className="text-xs text-sif-muted font-mono">{organization.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-sif-muted hover:bg-sif-surface hover:text-sif-text">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-sif-border bg-sif-surface-subtle/30 p-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-sif-surface border border-sif-gold/30 text-sif-gold shadow-sm' : 'text-sif-muted hover:text-sif-text'}`}
            >
              <Settings2 className="h-4 w-4" /> Configuración General
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeTab === 'admins' ? 'bg-sif-surface border border-sif-gold/30 text-sif-gold shadow-sm' : 'text-sif-muted hover:text-sif-text'}`}
            >
              <Users className="h-4 w-4" /> Administradores
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeTab === 'batches' ? 'bg-sif-surface border border-sif-gold/30 text-sif-gold shadow-sm' : 'text-sif-muted hover:text-sif-text'}`}
            >
              <Package2 className="h-4 w-4" /> Lotes y Tarjetas
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-6 max-w-2xl">
                <h3 className="text-lg font-bold text-sif-text border-b border-sif-border pb-2">Datos y Marca Blanca</h3>
                
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-sif-muted">Nombre de la Empresa</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle py-2.5 px-4 text-sm text-sif-text focus:border-sif-gold focus:outline-none" />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-sif-muted flex items-center gap-1.5"><UploadCloud className="h-3 w-3" /> URL del Logo</label>
                  <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full rounded-xl border border-sif-border bg-sif-surface-subtle py-2.5 px-4 text-sm text-sif-text focus:border-sif-gold focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-sif-muted flex items-center gap-1.5"><Settings2 className="h-3 w-3" /> Variables de Entorno (JSON)</label>
                    <div className="flex items-center rounded-lg border border-sif-border bg-sif-surface p-0.5">
                      <button type="button" onClick={() => handleModeSwitch('kv')} className={`rounded-md px-2 py-1 text-[10px] font-bold ${mode === 'kv' ? 'bg-sif-surface-subtle text-sif-text' : 'text-sif-muted'}`}>Lista</button>
                      <button type="button" onClick={() => handleModeSwitch('raw')} className={`rounded-md px-2 py-1 text-[10px] font-bold ${mode === 'raw' ? 'bg-sif-surface-subtle text-sif-text' : 'text-sif-muted'}`}>Raw</button>
                    </div>
                  </div>
                  {mode === 'raw' ? (
                    <textarea value={settingsJson} onChange={(e) => setSettingsJson(e.target.value)} rows={6} className="w-full font-mono rounded-xl border border-sif-border bg-sif-surface-subtle py-2.5 px-4 text-xs text-sif-text focus:border-sif-gold focus:outline-none" />
                  ) : (
                    <div className="flex flex-col gap-2 rounded-xl border border-sif-border bg-sif-surface p-4">
                      {kvList.map((kv, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="text" placeholder="Clave" value={kv.key} onChange={(e) => { const next = [...kvList]; next[i].key = e.target.value; setKvList(next); }} className="w-1/2 rounded-lg border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-xs text-sif-text focus:border-sif-gold focus:outline-none" />
                          <input type="text" placeholder="Valor" value={kv.value} onChange={(e) => { const next = [...kvList]; next[i].value = e.target.value; setKvList(next); }} className="w-1/2 rounded-lg border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-xs text-sif-text focus:border-sif-gold focus:outline-none" />
                          <button onClick={() => setKvList(kvList.filter((_, idx) => idx !== i))} className="text-sif-muted hover:text-red-400 p-1"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                      <button onClick={() => setKvList([...kvList, { key: '', value: '' }])} className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-sif-border py-2 text-xs font-semibold text-sif-muted hover:border-sif-gold/40 hover:text-sif-gold">
                        <Plus className="h-3 w-3" /> Agregar campo
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-sif-gold px-6 py-2.5 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'admins' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-sif-border pb-2">
                  <h3 className="text-lg font-bold text-sif-text">Administradores Asignados</h3>
                  <button className="flex items-center gap-2 rounded-lg border border-sif-gold/30 px-3 py-1.5 text-xs font-bold text-sif-gold hover:bg-sif-gold/10 transition-colors">
                    <Plus className="h-3 w-3" /> Asignar Nuevo
                  </button>
                </div>
                {isLoadingData ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-sif-gold" /></div>
                ) : admins.length === 0 ? (
                  <p className="text-sm text-sif-muted text-center py-8 border border-dashed border-sif-border rounded-xl">No hay administradores asignados a esta organización aún.</p>
                ) : (
                  <div className="grid gap-3">
                    {admins.map(admin => (
                      <div key={admin.id} className="flex items-center justify-between rounded-xl border border-sif-border bg-sif-surface p-4">
                        <div>
                          <p className="font-bold text-sif-text">{admin.display_name || 'Sin nombre'}</p>
                          <p className="text-xs text-sif-muted">{admin.email}</p>
                        </div>
                        <button className="text-xs text-red-400 hover:underline">Revocar acceso</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'batches' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-sif-border pb-2">
                  <h3 className="text-lg font-bold text-sif-text">Lotes Corporativos</h3>
                  <button 
                    onClick={() => setIsCreateBatchOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-sif-gold px-4 py-2 text-sm font-bold text-black hover:opacity-90 shadow-lg shadow-sif-gold/20"
                  >
                    <Package2 className="h-4 w-4" /> Crear Lote para {organization.name}
                  </button>
                </div>
                {isLoadingData ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-sif-gold" /></div>
                ) : batches.length === 0 ? (
                  <p className="text-sm text-sif-muted text-center py-8 border border-dashed border-sif-border rounded-xl">Esta empresa no tiene lotes de tarjetas asignados.</p>
                ) : (
                  <div className="grid gap-3">
                    {batches.map(batch => (
                      <div key={batch.id} className="flex flex-col gap-2 rounded-xl border border-sif-border bg-sif-surface p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sif-text">{batch.name}</p>
                          <span className="rounded-full border border-sif-border bg-sif-surface-subtle px-2 py-0.5 text-[10px] text-sif-muted">{batch.card_type}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-sif-muted">
                          <span>Total: {batch.cards_count}</span>
                          <span>Activas: <strong className="text-sif-gold">{batch.active_count}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
    <CreateBatchModal
      isOpen={isCreateBatchOpen}
      onClose={() => setIsCreateBatchOpen(false)}
      onSuccess={() => {
        loadTabData('batches');
      }}
      initialOrgId={organization.id}
      initialUrlPrefix={urlPrefix}
    />
    </>
  );
}
