import { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { activationService } from '../../services/activationService';
import ProfileForm, { type ProfileFormData } from '../../components/profile/ProfileForm/ProfileForm';
import ProfileView from '../public/ProfileView';
import ProfileEditorLayout from '../../components/profile/ProfileEditorLayout/ProfileEditorLayout';
import type { Profile } from '../../types/database';

export default function EditProfiles() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  const [initLoading, setInitLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData | null>(null);

  // Cargar perfiles al inicio
  useEffect(() => {
    async function loadProfiles() {
      if (!user) return;
      setInitLoading(true);
      const { profiles: userProfiles, error } = await profileService.getUserProfiles(user.id);

      if (error) {
        setErrorMsg(error);
      } else {
        setProfiles(userProfiles);
        if (userProfiles.length > 0) {
          handleProfileSelect(userProfiles[0]);
        }
      }
      setInitLoading(false);
    }

    loadProfiles();
  }, [user]);

  const handleProfileSelect = (profile: Profile) => {
    setActiveProfileId(profile.id);
    
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
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  // Guardar en sessionStorage automáticamente al cambiar (con debouncing)
  useEffect(() => {
    if (!activeProfileId || !formData) return;

    const timeoutId = setTimeout(() => {
      sessionStorage.setItem(`sif_draft_${activeProfileId}`, JSON.stringify(formData));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, activeProfileId]);

  const handleConfirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    if (!activeProfileId || !formData) return;

    setSubmitLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { finalProfileData, error: uploadError } = await profileService.processProfileImages(
        formData,
        activeProfileId
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      const { success, error } = await profileService.updateProfile(
        activeProfileId,
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
        sessionStorage.removeItem(`sif_draft_${activeProfileId}`);
        
        // Actualizar la lista de perfiles local
        setProfiles((prev) =>
          prev.map((p) => p.id === activeProfileId ? {
            ...p,
            slug: finalProfileData.slug,
            theme_palette: finalProfileData.theme_palette,
            data: activationService.cleanProfileData(finalProfileData)
          } : p)
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

  if (profiles.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-sif-surface-subtle p-4 text-sif-muted">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-sif-text">No tienes perfiles configurados</h2>
        <p className="text-sm text-sif-muted max-w-md">
          Aún no has activado ninguna tarjeta inteligente asociada a esta cuenta.
          Activa una tarjeta primero para poder editar tu perfil.
        </p>
      </div>
    );
  }

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const previewProfile: Profile | null = activeProfile && formData ? {
    ...activeProfile,
    slug: formData.slug,
    theme_palette: formData.theme_palette,
    data: activationService.cleanProfileData(formData),
  } : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-sif-bg">
      {/* Encabezado */}
      <div className="border-b border-sif-border bg-sif-surface px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-sif-text">Mi Perfil</h2>
          <p className="mt-0.5 text-xs text-sif-muted">
            Edita y personaliza tus perfiles.
          </p>
        </div>

        {/* Selector de perfiles */}
        {profiles.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-sif-muted">Perfil:</span>
            <select
              value={activeProfileId || ''}
              onChange={(e) => {
                const p = profiles.find((x) => x.id === e.target.value);
                if (p) handleProfileSelect(p);
              }}
              className="rounded-lg border border-sif-border bg-sif-surface-subtle px-3 py-1.5 text-xs text-sif-text focus:border-sif-gold focus:outline-none"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.data.display_name || p.slug || 'Perfil sin nombre'}
                </option>
              ))}
            </select>
          </div>
        )}
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
