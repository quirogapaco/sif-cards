import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { activationService } from '../../services/activationService';
import { storageService } from '../../services/storageService';
import ProfileForm, { type ProfileFormData } from '../../components/profile/ProfileForm/ProfileForm';
import ProfileView from '../public/ProfileView';
import AuthModal from '../../components/auth/AuthModal';
import sifGold from '../../assets/sif_gold.png';
import type { Card, Profile } from '../../types/database';
import {
  Sparkles,
  Smartphone,
  Eye,
  Edit3,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function ActivateCardPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Estados de página y carga
  const [initLoading, setInitLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
  const [cardData, setCardData] = useState<Card | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isActivatedSuccess, setIsActivatedSuccess] = useState(false);

  // Tab activo en pantallas móviles ('form' | 'preview')
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Estado unificado del formulario
  const [formData, setFormData] = useState<ProfileFormData>({
    display_name: '',
    job_title: '',
    company: '',
    slug: '',
    avatar_url: '',
    banner_url: '',
    theme_palette: 'emerald-dark',
    direct_contacts: {
      whatsapp: '',
      email: '',
      phone: '',
      location: '',
    },
    bio_description: '',
    social_links: [
      { platform: 'linkedin', url: '' },
      { platform: 'instagram', url: '' },
    ],
    languages: ['Español'],
    education: [],
    businesses: [],
  });

  // Auto-scroll al mostrar error
  useEffect(() => {
    if (errorMsg) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [errorMsg]);

  // ── 1. Inicialización y Validación de Sesión / Tarjeta ──
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setInitLoading(true);
      setErrorMsg(null);

      // A. Verificar usuario autenticado
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (isMounted) {
          setIsAuthModalOpen(true);
          setInitLoading(false);
        }
        return;
      }

      const email = userData.user.email || '';
      const defaultName = userData.user.user_metadata?.full_name || '';

      // B. Verificar estado de la tarjeta por token
      if (token) {
        const { card, error } = await activationService.getCardStatus(token);
        if (!isMounted) return;

        if (error || !card) {
          setErrorMsg(error || 'La tarjeta especificada no fue encontrada.');
          setInitLoading(false);
          return;
        }

        if (card.status === 'active') {
          setErrorMsg('Esta tarjeta ya fue activada anteriormente.');
          setCardData(card);
          setInitLoading(false);
          return;
        }

        setCardData(card);

        // Autocompletar datos del usuario
        setFormData((prev) => ({
          ...prev,
          display_name: defaultName || prev.display_name,
          slug: defaultName
            ? defaultName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '-')
            : prev.slug,
          direct_contacts: {
            ...prev.direct_contacts,
            email: email || prev.direct_contacts.email,
          },
        }));
      }

      setInitLoading(false);
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // ── 2. Manejo del Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitLoading(true);
    setErrorMsg(null);

    try {
      // --- 1. Pre-validaciones antes de subir archivos ---
      const formattedSlug = formData.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
      const isAvailable = await activationService.isSlugAvailable(formattedSlug);
      if (!isAvailable) {
        setErrorMsg(`El enlace personalizado "sif.link/p/${formattedSlug}" ya está en uso. Por favor elige otro.`);
        setFieldErrors({ slug: true });
        setSubmitLoading(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setErrorMsg('Debes iniciar sesión para activar tu tarjeta.');
        setSubmitLoading(false);
        return;
      }
      // --------------------------------------------------

      let finalAvatarUrl = formData.avatar_url;
      let finalBannerUrl = formData.banner_url;
      let uploadedAvatarPath = '';
      let uploadedBannerPath = '';

      // Subir Avatar si hay archivo nuevo
      if (formData.avatar_file) {
        const avatarBucket = import.meta.env.VITE_SUPABASE_AVATARS_BUCKET;
        const ext = formData.avatar_file.name.split('.').pop() || 'jpg';
        uploadedAvatarPath = `${token}-avatar-${Date.now()}.${ext}`;
        const uploadedUrl = await storageService.uploadProfileImage(avatarBucket, uploadedAvatarPath, formData.avatar_file);
        if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      }

      // Subir Banner si hay archivo nuevo
      if (formData.banner_file) {
        const bannerBucket = import.meta.env.VITE_SUPABASE_BANNERS_BUCKET;
        const ext = formData.banner_file.name.split('.').pop() || 'jpg';
        uploadedBannerPath = `${token}-banner-${Date.now()}.${ext}`;
        const uploadedUrl = await storageService.uploadProfileImage(bannerBucket, uploadedBannerPath, formData.banner_file);
        if (uploadedUrl) finalBannerUrl = uploadedUrl;
      }

      // Clonar los datos y quitar los objetos File para no ensuciar la DB
      const finalProfileData = {
        ...formData,
        avatar_url: finalAvatarUrl,
        banner_url: finalBannerUrl,
      };
      delete finalProfileData.avatar_file;
      delete finalProfileData.banner_file;

      const result = await activationService.activateCard({
        token,
        slug: finalProfileData.slug,
        themePalette: finalProfileData.theme_palette,
        profileData: finalProfileData,
      });

      if (!result.success) {
        // Rollback: Eliminar imágenes si la activación falla en DB
        if (uploadedAvatarPath) {
          await storageService.removeImage(import.meta.env.VITE_SUPABASE_AVATARS_BUCKET, uploadedAvatarPath);
        }
        if (uploadedBannerPath) {
          await storageService.removeImage(import.meta.env.VITE_SUPABASE_BANNERS_BUCKET, uploadedBannerPath);
        }
        setErrorMsg(result.error || 'Ocurrió un error al activar tu tarjeta.');
        setSubmitLoading(false);
        return;
      }

      setSubmitLoading(false);
      setIsActivatedSuccess(true);
    } catch (err) {
      setErrorMsg('Error inesperado durante la activación.');
      setSubmitLoading(false);
    }
  };

  // Construcción del objeto Profile ficticio para la previsualización
  const previewProfile: Profile = {
    id: 'preview-id',
    user_id: null,
    slug: formData.slug || 'mi-perfil',
    template_type: 'standard_bcard',
    theme_palette: formData.theme_palette,
    data: activationService.cleanProfileData(formData),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subscription_status: 'active',
    activated_at: new Date().toISOString(),
    expires_at: null,
  };

  // Render Carga Inicial
  if (initLoading) {
    return (
      <div className="min-h-screen w-full bg-sif-bg flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-sif-border border-t-sif-gold animate-spin" />
          <span className="absolute font-bold text-xs tracking-wider text-sif-gold">SIF</span>
        </div>
        <p className="mt-4 text-xs text-sif-muted animate-pulse">Preparando entorno de activación...</p>
      </div>
    );
  }

  // Render Celebración / Éxito
  if (isActivatedSuccess) {
    return (
      <div className="min-h-screen w-full bg-sif-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--sif-gold) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-sif-border bg-sif-surface p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
          <img src={sifGold} alt="SIF Logo" className="h-12 w-auto mb-6 object-contain" />

          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-sif-gold/40 bg-sif-gold/10 text-sif-gold shadow-lg">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <CheckCircle2 className="h-4 w-4" />
            <span>¡Tarjeta Activada Exitosamente!</span>
          </span>

          <h1 className="text-xl font-bold tracking-tight text-sif-text mb-2">
            ¡Felicitaciones, {formData.display_name}!
          </h1>

          <p className="text-xs text-sif-muted mb-6 leading-relaxed">
            Tu tarjeta inteligente SIF ahora está activa y lista para compartir al instante con el mundo.
          </p>

          {/* Tarjeta con URL pública */}
          <div className="w-full rounded-2xl border border-sif-gold/30 bg-sif-surface-subtle p-4 mb-6 text-left">
            <p className="text-[11px] font-medium uppercase tracking-wider text-sif-muted mb-1">
              Enlace de tu Perfil Público:
            </p>
            <p className="text-sm font-mono font-bold text-sif-gold truncate">
              {import.meta.env.VITE_APP_DOMAIN || 'https://sif.link'}/t/{token}
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Link
              to={`/t/${token}`}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95 shadow-xl"
              style={{
                background:
                  'linear-gradient(135deg, var(--sif-gold) 0%, #f0cc5a 50%, var(--sif-gold) 100%)',
                boxShadow: '0 4px 20px rgba(221, 178, 37, 0.4)',
              }}
            >
              <span>Ver mi tarjeta en vivo</span>
              <ExternalLink className="h-4 w-4" />
            </Link>

            <Link
              to="/admin"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-sif-border bg-sif-surface-subtle py-3 text-xs font-medium text-sif-text transition-all hover:border-sif-gold hover:text-sif-gold active:scale-95"
            >
              <span>Ir a mi panel de administración</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Advertencia de Tarjeta Ya Activa
  if (cardData && cardData.status === 'active') {
    return (
      <div className="min-h-screen w-full bg-sif-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-sif-border bg-sif-surface p-8 shadow-2xl text-center flex flex-col items-center">
          <ShieldAlert className="h-12 w-12 text-amber-400 mb-4" />
          <h2 className="text-lg font-bold text-sif-text mb-2">Tarjeta Ya Activada</h2>
          <p className="text-xs text-sif-muted mb-6 leading-relaxed">
            Esta tarjeta física ya fue reclamada y activada previamente. Si eres el dueño de esta tarjeta, puedes editar su perfil iniciando sesión.
          </p>
          <Link
            to={`/t/${token}`}
            className="w-full rounded-full bg-sif-gold py-3 text-xs font-semibold text-black hover:opacity-90 transition-all"
          >
            Ver tarjeta activa &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-sif-bg text-sif-text">
      {/* ── HEADER DE BIENVENIDA SIF ── */}
      <header className="sticky top-0 z-30 border-b border-sif-border bg-sif-surface/90 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={sifGold}
              alt="SIF Logo"
              className="h-9 w-auto object-contain drop-shadow-sm"
            />
            <div className="hidden sm:block h-6 w-px bg-sif-border" />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-sif-text tracking-wide">
                Configuración y Activación
              </span>
              <span className="text-[11px]" style={{ color: 'var(--sif-gold)' }}>
                Tarjeta #{token}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-sif-muted">
            <Info className="h-3.5 w-3.5 text-sif-gold hidden sm:inline" />
            <span className="hidden md:inline">
              Podrás editar tu información en cualquier momento en{' '}
              <strong className="text-sif-text font-semibold">sif.link/login</strong>
            </span>
          </div>
        </div>
      </header>

      {/* ── ALERTA DE ERROR GENERAL ── */}
      {errorMsg && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300 shadow-sm">
            <span className="flex-1">{errorMsg}</span>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                document.getElementById('profile-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex-shrink-0 font-bold text-red-400 hover:text-red-300 hover:underline px-3 py-1 bg-red-500/10 rounded-full transition-colors"
            >
              Ir &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ── BANNER EXCLUSIVO DE BIENVENIDA ── */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
        <div className="rounded-3xl border border-sif-border bg-sif-surface p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-2xl"
            style={{
              background: 'radial-gradient(circle, var(--sif-gold) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sif-gold/30 bg-sif-gold/10 px-3 py-1 text-[11px] font-semibold text-sif-gold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bienvenido a SIF</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-sif-text mb-2">
              Personaliza tu tarjeta inteligente!
            </h1>
            <p className="text-xs sm:text-sm text-sif-muted leading-relaxed">
              Completa tu perfil. Puedes ver los cambios en tiempo real en la previsualización de tu tarjeta.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL LAYOUT RESPONSIVO (2 COLUMNAS / TOGGLE MÓVIL) ── */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Formulario en Acordeón */}
          <div
            id="profile-form-container"
            className={`lg:col-span-6 xl:col-span-7 ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <ProfileForm
              formData={formData}
              onChange={(updated) => {
                setFormData(updated);
                if (Object.keys(fieldErrors).length > 0) {
                  setFieldErrors({});
                  setErrorMsg(null);
                }
              }}
              onSubmit={handleSubmit}
              loading={submitLoading}
              submitButtonText="Guardar Mi Perfil"
              fieldErrors={fieldErrors}
            />
          </div>

          {/* COLUMNA DERECHA: Vista Previa en Vivo (Encapsulada con data-card-theme) */}
          <div
            className={`lg:col-span-6 xl:col-span-5 lg:sticky lg:top-24 ${
              mobileTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-sif-muted flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-sif-gold" />
                  <span>Vista Previa en Vivo (Perfil Activo)</span>
                </span>
                <span className="text-[10px] text-sif-gold font-mono border border-sif-gold/30 px-2 py-0.5 rounded-full bg-sif-gold/10">
                  {formData.theme_palette}
                </span>
              </div>

              {/* Contenedor estrictamente aislado con data-card-theme */}
              <div
                data-card-theme={formData.theme_palette}
                className="rounded-3xl border border-sif-border bg-sif-surface shadow-2xl overflow-hidden min-h-[600px]"
              >
                <ProfileView profile={previewProfile} isNfcSource={false} />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── BOTÓN FLOTANTE INFERIOR MÓVIL [ Formulario | Vista Previa ] ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <div className="flex items-center rounded-full border border-sif-border bg-sif-surface/95 p-1.5 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setMobileTab('form')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
              mobileTab === 'form'
                ? 'bg-sif-gold text-black shadow-md'
                : 'text-sif-muted hover:text-sif-text'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Formulario</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
              mobileTab === 'preview'
                ? 'bg-sif-gold text-black shadow-md'
                : 'text-sif-muted hover:text-sif-text'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Vista Previa</span>
          </button>
        </div>
      </div>

      {/* ── Modal de Autenticación de respaldo si el usuario no tiene sesión ── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
        title="Bienvenido a la experiencia SIF"
        subtitle="Para configurar y activar tu tarjeta inteligente, inicia sesión o crea tu cuenta gratuita."
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
