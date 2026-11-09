import { useState, useEffect, useMemo, useCallback } from 'react';
import { Building2, Briefcase, Globe, RefreshCw, Plus } from 'lucide-react';
import { orgService } from '../../services/orgService';
import type { Organization } from '../../types/database';
import { OrganizationsTable } from '../../components/admin/OrganizationsTable';
import { CreateOrgModal } from '../../components/admin/CreateOrgModal';
import { OrgDetailsModal } from '../../components/admin/OrgDetailsModal';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const loadOrganizations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orgService.getAllOrganizations();
      setOrganizations(data);
    } catch (err) {
      console.error('Failed to load organizations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = organizations.length;
    // TODO: Obtener métricas reales de contratos/dominios en un query avanzado o RPC.
    const activeContracts = total; 
    const domains = organizations.filter(o => o.settings && (o.settings as any).domain).length;

    return { total, activeContracts, domains };
  }, [organizations]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-sif-text">Organizaciones B2B</h1>
          <p className="mt-0.5 text-sm text-sif-muted">
            Gestión de empresas asociadas, contratos y accesos corporativos
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={loadOrganizations}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-border bg-sif-surface text-sif-muted transition-all hover:border-sif-gold/30 hover:text-sif-text disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-sif-gold/40 px-4 py-2 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--sif-gold), color-mix(in srgb, var(--sif-gold) 65%, var(--sif-silver)))',
              color: '#000',
              boxShadow: '0 2px 12px rgba(212,175,55,0.25)',
            }}
          >
            <Plus className="h-4 w-4" />
            Crear Organización
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Organizaciones', icon: Building2, value: metrics.total },
          { label: 'Contratos Activos', icon: Briefcase, value: metrics.activeContracts },
          { label: 'Dominios Vinculados', icon: Globe, value: metrics.domains },
        ].map(({ label, icon: Icon, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-sif-border bg-sif-surface p-4"
          >
            <Icon className="h-5 w-5 shrink-0 text-sif-muted" />
            <div>
              <p className="text-lg font-bold text-sif-text">{value}</p>
              <p className="text-[11px] text-sif-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla de Organizaciones */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface p-5">
        {isLoading && organizations.length === 0 ? (
          <div className="flex py-12 justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-sif-gold" />
          </div>
        ) : (
          <OrganizationsTable
            organizations={organizations}
            onViewDetails={(org) => setSelectedOrg(org)}
          />
        )}
      </div>

      <CreateOrgModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadOrganizations();
        }}
      />

      <OrgDetailsModal
        organization={selectedOrg}
        isOpen={!!selectedOrg}
        onClose={() => setSelectedOrg(null)}
        onUpdate={() => {
          loadOrganizations();
          // Optionally update the selected org locally to avoid closing the modal,
          // but closing it or letting the data refresh works fine for now.
          setSelectedOrg(null);
        }}
      />
    </div>
  );
}
