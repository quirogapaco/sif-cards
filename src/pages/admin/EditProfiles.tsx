import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Save, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { activationService } from '../../services/activationService';
import { userService, type TeamMember } from '../../services/userService';
import ProfileForm, { type ProfileFormData } from '../../components/profile/ProfileForm/ProfileForm';
import ProfileView from '../public/ProfileView';
import ProfileEditorLayout from '../../components/profile/ProfileEditorLayout/ProfileEditorLayout';
import type { Profile } from '../../types/database';

const getMemberDisplayName = (m: TeamMember) => {
  if (m.profiles && m.profiles.length > 0) {
    return m.profiles[0].display_name;
  }
  return `Colaborador (${m.id.substring(0, 6)})`;
};

export default function EditProfiles() {
  const { user } = useAuth();
  const location = useLocation();
  const initialBatchId = location.state?.batchId;
  const initialProfileId = location.state?.profileId;

  // Opciones simplificadas para el selector de perfiles
  const [profileOptions, setProfileOptions] = useState<{ id: string; display_name: string }[]>([]);
  // Perfil completo cargado actualmente en memoria
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  // Estados para org_admin
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [initLoading, setInitLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData | null>(null);

  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMemberDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── 1. Carga Inicial (Colaboradores u Opciones de Usuario) ──
  useEffect(() => {
    async function loadInitialData() {
      if (!user) return;
      setInitLoading(true);

      const dbUser = await userService.getUserRecord(user.id);
      
      if (dbUser?.role === 'org_admin' && dbUser.org_id) {
        // Cargar Colaboradores para Org Admin
        const members = await userService.getOrganizationTeam(dbUser.org_id);
        setTeamMembers(members);
        
        if (members.length > 0) {
          const firstMemberId = location.state?.memberId || members[0].id;
          setSelectedMemberId(firstMemberId);
          await loadProfilesForMember(members, firstMemberId, initialProfileId);
        } else {
          setInitLoading(false);
        }
      } else {
        // Usuario Normal
        const options = await profileService.getUserProfileOptions(user.id);
        setProfileOptions(options);
        
        if (options.length > 0) {
          const targetProfileId = initialProfileId && options.find(o => o.id === initialProfileId)
            ? initialProfileId 
            : options[0].id;
          await handleProfileSelect(targetProfileId);
        } else {
          setInitLoading(false);
        }
      }
    }

    loadInitialData();
  }, [user]);

  // ── 2. Carga de Opciones de Perfil por Colaborador (org_admin) ──
  const loadProfilesForMember = async (members: TeamMember[], memberId: string, profileIdToSelect?: string) => {
    setInitLoading(true);
    const member = members.find(m => m.id === memberId);
    const options = member?.profiles || [];
    setProfileOptions(options);
    
    if (options.length > 0) {
      const targetProfileId = profileIdToSelect && options.find(o => o.id === profileIdToSelect)
        ? profileIdToSelect 
        : options[0].id;
      await handleProfileSelect(targetProfileId);
    } else {
      setActiveProfile(null);
      setFormData(null);
      setInitLoading(false);
    }
  };

  // ── 3. Carga de un Perfil Específico (Completo) ──
  const handleProfileSelect = async (profileId: string) => {
    setInitLoading(true);
    
    const { profile, error } = await profileService.getProfileById(profileId);
    
    if (error || !profile) {
      setErrorMsg(error || 'Error al cargar el perfil.');
      setActiveProfile(null);
      setFormData(null);
      setInitLoading(false);
      return;
    }

    setActiveProfile(profile);
    
    // Restaurar borrador de sessionStorage si existe
    const draftKey = `sif_draft_${profile.id}`;
    const savedDraft = sessionStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (e) {
        setFormData(profileService.mapProfileToFormData(profile));
      }
    } else {
      setFormData(profileService.mapProfileToFormData(profile));
    }
    
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});
    setInitLoading(false);
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  // Guardar en sessionStorage automáticamente al cambiar (con debouncing)
  useEffect(() => {
    if (!activeProfile?.id || !formData) return;

    const timeoutId = setTimeout(() => {
      sessionStorage.setItem(`sif_draft_${activeProfile.id}`, JSON.stringify(formData));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, activeProfile?.id]);

  const handleConfirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    if (!activeProfile?.id || !formData) return;

    const currentProfileId = activeProfile.id;

    setSubmitLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { finalProfileData, error: uploadError } = await profileService.processProfileImages(
        formData,
        currentProfileId
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      const { success, error } = await profileService.updateProfile(
        currentProfileId,
        finalProfileData.slug,
        finalProfileData.theme_palette,
        finalProfileData
      );

      if (!success) {
        setErrorMsg(error || 'Ocurrió un error al actualizar el perfil.');
        if (error?.includes('en uso')) setFieldErrors({ slug: true });
      } else {
        setSuccessMsg('Perfil actualizado exitosamente.');
        
        // Limpiar el borrador
        sessionStorage.removeItem(`sif_draft_${currentProfileId}`);
        
        // Actualizar el perfil activo actual en memoria
        setActiveProfile((prev) => prev ? {
          ...prev,
          slug: finalProfileData.slug,
          theme_palette: finalProfileData.theme_palette,
          data: activationService.cleanProfileData(finalProfileData)
        } : null);

        // Actualizar el display_name en la lista de opciones si cambió
        setProfileOptions((prevOptions) => 
          prevOptions.map((opt) => 
            opt.id === currentProfileId 
              ? { ...opt, display_name: finalProfileData.display_name || opt.display_name }
              : opt
          )
        );
      }
    } catch (err) {
      setErrorMsg('Error inesperado durante la actualización.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sif-border border-t-sif-gold" />
      </div>
    );
  }

  // Si no tiene colaboradores (org_admin) o no tiene perfiles (user normal / org_admin en colaborador vacío)
  if (profileOptions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-sif-surface-subtle p-4 text-sif-muted">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-sif-text">No hay perfiles configurados</h2>
        <p className="text-sm text-sif-muted max-w-md">
          {teamMembers.length > 0
            ? 'Este colaborador aún no cuenta con perfiles registrados.'
            : 'Aún no has activado ninguna tarjeta inteligente asociada a esta cuenta. Activa una tarjeta primero para poder editar tu perfil.'}
        </p>
        
        {teamMembers.length > 0 && (
          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Cambiar Colaborador:</span>
            <div className="relative min-w-[200px] text-left">
              <button
                type="button"
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                className="w-full flex items-center justify-between bg-[#18181c] hover:bg-[#1f1f24] border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-xs text-white transition-all cursor-pointer shadow-inner"
              >
                <span className="truncate font-medium text-slate-100">
                  {teamMembers.find(m => m.id === selectedMemberId) 
                    ? getMemberDisplayName(teamMembers.find(m => m.id === selectedMemberId)!) 
                    : 'Selecciona un colaborador...'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMemberDropdownOpen ? 'rotate-180 text-white' : ''}`} />
              </button>
              {isMemberDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#18181c] border border-white/15 rounded-2xl shadow-2xl p-1.5 space-y-1 max-h-44 overflow-y-auto">
                  {teamMembers.map((m) => {
                    const isCurrent = m.id === selectedMemberId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(m.id);
                          loadProfilesForMember(teamMembers, m.id);
                          setIsMemberDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                          isCurrent
                            ? 'bg-[#ddb225]/15 text-[#ddb225] font-medium border border-[#ddb225]/30'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span className="truncate">{getMemberDisplayName(m)}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#ddb225] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const previewProfile: Profile | null = activeProfile && formData ? {
    ...activeProfile,
    slug: formData.slug,
    theme_palette: formData.theme_palette,
    data: activationService.cleanProfileData(formData),
  } : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-sif-bg">
      {/* Encabezado */}
      <div className="border-b border-sif-border bg-sif-surface px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-sif-text">Perfiles</h2>
          <p className="mt-0.5 text-xs text-sif-muted">
            Personaliza tus perfiles.
          </p>
        </div>

        {/* Selectores (Lote y Perfil) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
          
          {/* Selector de Colaborador (Sólo si hay más de 0, típicamente org_admin) */}
          {teamMembers.length > 0 && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto relative">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap hidden sm:block">Colaborador</span>
              <div className="relative w-full sm:min-w-[180px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMemberDropdownOpen(!isMemberDropdownOpen);
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between bg-[#18181c] hover:bg-[#1f1f24] border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-xs text-white transition-all cursor-pointer shadow-inner"
                >
                  <span className="truncate font-medium text-slate-100">
                    {teamMembers.find(m => m.id === selectedMemberId) 
                      ? getMemberDisplayName(teamMembers.find(m => m.id === selectedMemberId)!) 
                      : 'Selecciona...'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMemberDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                </button>
                {isMemberDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#18181c] border border-white/15 rounded-2xl shadow-2xl p-1.5 space-y-1 max-h-44 overflow-y-auto">
                    {teamMembers.map((m) => {
                      const isCurrent = m.id === selectedMemberId;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelectedMemberId(m.id);
                            loadProfilesForMember(teamMembers, m.id);
                            setIsMemberDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                            isCurrent
                              ? 'bg-[#ddb225]/15 text-[#ddb225] font-medium border border-[#ddb225]/30'
                              : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <span className="truncate">{getMemberDisplayName(m)}</span>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[#ddb225] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selector de perfiles */}
          {profileOptions.length > 0 && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto relative">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap hidden sm:block">Perfil</span>
              <div className="relative w-full sm:min-w-[200px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsMemberDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between bg-[#18181c] hover:bg-[#1f1f24] border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-xs text-white transition-all cursor-pointer shadow-inner"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-full bg-[#ddb225]/15 border border-[#ddb225]/30 flex items-center justify-center text-[10px] text-[#ddb225] font-bold shrink-0">
                      {(profileOptions.find(p => p.id === activeProfile?.id)?.display_name?.charAt(0).toUpperCase()) || 'P'}
                    </div>
                    <span className="truncate font-medium text-slate-100">
                      {profileOptions.find(p => p.id === activeProfile?.id)?.display_name || 'Selecciona un perfil...'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 sm:left-auto sm:right-0 mt-2 w-full sm:min-w-[240px] z-50 bg-[#18181c] border border-white/15 rounded-2xl shadow-2xl p-1.5 space-y-1 max-h-44 overflow-y-auto">
                    {profileOptions.map((p) => {
                      const isCurrent = p.id === activeProfile?.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            handleProfileSelect(p.id);
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                            isCurrent
                              ? 'bg-[#ddb225]/15 text-[#ddb225] font-medium border border-[#ddb225]/30'
                              : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ddb225]" />
                            <span className="truncate">{p.display_name || 'Perfil sin nombre'}</span>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[#ddb225] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alertas */}
      <div className="px-6 pt-4">
        {errorMsg && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="font-bold text-red-400 hover:underline">Cerrar</button>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="font-bold text-emerald-400 hover:underline">Cerrar</button>
          </div>
        )}
      </div>

      {/* Layout contenedor unificado */}
      <ProfileEditorLayout
        themePalette={formData?.theme_palette}
        childrenLeft={
          formData && (
            <ProfileForm
              formData={formData}
              onChange={(updated) => {
                setFormData(updated);
                setFieldErrors({});
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              onSubmit={handleOpenConfirm}
              loading={submitLoading}
              submitButtonText="Guardar Cambios"
              fieldErrors={fieldErrors}
              alwaysShowSubmit={true}
            />
          )
        }
        childrenRight={
          previewProfile ? (
            <ProfileView profile={previewProfile} isNfcSource={false} />
          ) : (
            <div className="flex h-full items-center justify-center pt-24 text-sif-muted">
              <span>Cargando vista previa...</span>
            </div>
          )
        }
      />

      {/* Modal de Confirmación */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-sif-border bg-sif-surface p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-sif-text">Guardar Cambios</h3>
            <p className="mb-6 text-sm text-sif-muted">
              ¿Estás seguro que deseas aplicar estos cambios a tu perfil? La nueva información será visible inmediatamente para cualquier persona que escanee tu tarjeta.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-sif-muted hover:bg-sif-surface-subtle transition-colors"
                disabled={submitLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={submitLoading}
                className="flex items-center gap-2 rounded-lg bg-sif-gold px-4 py-2 text-xs font-bold text-black hover:bg-[#f0cc5a] transition-all disabled:opacity-70 disabled:cursor-wait shadow-lg shadow-sif-gold/20"
              >
                {submitLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
