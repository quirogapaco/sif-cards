import { useState, useEffect, useRef } from 'react';
import { Users, Contact, ChevronDown, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import type { TeamMember } from '../../services/userService';

export interface DashboardFilters {
  dateRange: string;
  selectedUserId: string;
  selectedProfileId: string;
}

interface TopBarFiltersProps {
  onFilterChange?: (filters: DashboardFilters) => void;
}

export default function TopBarFilters({ onFilterChange }: TopBarFiltersProps) {
  const { user, userRole, orgId } = useAuth();

  // Estados de datos
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [profilesList, setProfilesList] = useState<{ id: string; display_name: string }[]>([]);

  // Estados de carga
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Estados de selección
  const [activeRange, setActiveRange] = useState('30D');
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('all');

  const ranges = ['7D', '30D', '3M', '1Y'];

  // Usar useRef para evitar problemas de dependencia (infinite loop) con onFilterChange
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  // Notificar al padre solo cuando los valores locales cambian
  useEffect(() => {
    // Si la instrucción es "si esta en all no haga nada", podemos omitir la llamada si no lo deseas
    // Pero 'all' es válido para ver todo el dashboard. Para evitar spam, simplemente disparamos:
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current({
        dateRange: activeRange,
        selectedUserId,
        selectedProfileId,
      });
    }
  }, [activeRange, selectedUserId, selectedProfileId]);

  // Fetch inicial basado en el rol
  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      if (userRole === 'org_admin' && orgId) {
        setIsLoadingUsers(true);
        setIsLoadingProfiles(true); // Bloquea perfiles hasta que se resuelva
        const teamData = await dashboardService.getAdminFilterOptions(orgId);
        if (mounted) {
          setTeam(teamData);
          setIsLoadingUsers(false);
          setIsLoadingProfiles(false);
        }
      } else if (userRole === 'user' && user) {
        setIsLoadingProfiles(true);
        const opts = await dashboardService.getUserFilterOptions(user.id);
        if (mounted) {
          setProfilesList(opts);
          setIsLoadingProfiles(false);
        }
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, [userRole, orgId, user]);

  // Cuando un admin selecciona un usuario, actualizar la lista de perfiles localmente
  useEffect(() => {
    if (userRole === 'org_admin') {
      if (selectedUserId === 'all') {
        setProfilesList([]);
        setSelectedProfileId('all');
      } else {
        const selectedMember = team.find(m => m.id === selectedUserId);
        if (selectedMember) {
          setProfilesList(selectedMember.profiles);
        } else {
          setProfilesList([]);
        }
        setSelectedProfileId('all'); // reset perfil al cambiar de usuario
      }
    }
  }, [selectedUserId, team, userRole]);

  return (
    <div className="sticky top-2 sm:top-4 z-40 mb-6">
      <div className="backdrop-blur-xl bg-[var(--sif-surface)]/80 border border-[var(--sif-border)] rounded-2xl shadow-xl p-2.5 sm:p-3 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 w-full lg:w-auto">
            
            {/* Select de Usuarios (SOLO PARA ADMIN) */}
            {userRole === 'org_admin' && (
              <div className="flex items-center gap-2 flex-1 sm:max-w-[220px]">
                <div className="w-8 h-8 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-silver)] flex-shrink-0 shadow-sm">
                  <Users className="w-4 h-4" />
                </div>
                <div className="relative w-full">
                  <select 
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={isLoadingUsers}
                    className="w-full appearance-none bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] text-[var(--sif-text)] text-xs sm:text-sm font-medium rounded-xl pl-3 pr-9 py-2 focus:outline-none focus:border-[var(--sif-gold)] transition-colors cursor-pointer truncate disabled:opacity-50"
                  >
                    <option value="all">Todos los Usuarios</option>
                    {team.map(m => {
                      const displayName = m.profiles[0]?.display_name 
                        ? `${m.profiles[0].display_name} ` 
                        : `Usuario ${m.id.substring(0, 6)}`;
                      return (
                        <option key={m.id} value={m.id}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[var(--sif-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Select de Perfiles */}
            <div className="flex items-center gap-2 flex-1 sm:max-w-[220px]">
              <div className="w-8 h-8 rounded-xl bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] flex items-center justify-center text-[var(--sif-gold)] flex-shrink-0 shadow-sm">
                <Contact className="w-4 h-4" />
              </div>
              <div className="relative w-full">
                <select 
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  disabled={isLoadingProfiles || (userRole === 'org_admin' && selectedUserId === 'all')}
                  className="w-full appearance-none bg-[var(--sif-surface-subtle)] border border-[var(--sif-border)] text-[var(--sif-text)] text-xs sm:text-sm font-medium rounded-xl pl-3 pr-9 py-2 focus:outline-none focus:border-[var(--sif-gold)] transition-colors cursor-pointer truncate disabled:opacity-50"
                >
                  {isLoadingProfiles ? (
                    <option value="all">Cargando...</option>
                  ) : (
                    <>
                      <option value="all">
                        {userRole === 'org_admin' ? 'Todos los perfiles' : 'Todos mis perfiles'}
                      </option>
                      {profilesList.map(p => (
                        <option key={p.id} value={p.id}>{p.display_name}</option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-[var(--sif-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-1 bg-[var(--sif-surface-subtle)] p-1 rounded-xl border border-[var(--sif-border)] flex-shrink-0">
              {ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeRange === range
                      ? 'bg-[var(--sif-gold)] text-[#09090b] shadow-sm shadow-[var(--sif-gold)]/20'
                      : 'text-[var(--sif-muted)] hover:text-[var(--sif-text)] hover:bg-[var(--sif-surface)]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <div className="hidden sm:block w-[1px] h-6 bg-[var(--sif-border)] mx-1"></div>
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--sif-text)] hover:text-[var(--sif-gold)] bg-[var(--sif-surface-subtle)] hover:bg-[var(--sif-surface)] border border-[var(--sif-border)] rounded-xl transition-colors flex-shrink-0">
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}