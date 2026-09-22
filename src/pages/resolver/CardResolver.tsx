import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cardResolverService } from '../../services/cardResolverService';
import type { Card, Profile } from '../../types/database';
import ProfileView from '../public/ProfileView';
import AuthModal from '../../components/auth/AuthModal';
import { supabase } from '../../lib/supabase';
import sifGold from '../../assets/sif_gold.png';
import {
  AlertCircle,
  ShieldAlert,
  Clock,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

type ErrorState =
  | '404'
  | 'inactive'
  | 'blocked'
  | 'no_profile'
  | 'subscription_expired'
  | null;

/**
 * Componente principal de resolución de tarjetas NFC / QR físicas y slugs.
 * Intercepta los escaneos, evalúa el estado en Supabase y renderiza la pantalla adecuada.
 */
export default function CardResolver() {
  const navigate = useNavigate();
  const { token, prefix, slug } = useParams<{
    token?: string;
    prefix?: string;
    slug?: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [errorType, setErrorType] = useState<ErrorState>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNfcSource, setIsNfcSource] = useState<boolean>(false);
  const [resolvedToken, setResolvedToken] = useState<string | undefined>();
  const [activeCardPrefix, setActiveCardPrefix] = useState<string | undefined>();
  const [inactiveCard, setInactiveCard] = useState<Card | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      setLoading(true);
      setErrorType(null);
      setErrorMessage(null);
      setProfile(null);
      setInactiveCard(null);
      setActiveCardPrefix(undefined);

      // ── Caso 1: Acceso seguro por Slug y Token genérico (/p/:slug/:token) ──
      if (slug && !prefix) {
        if (!token) {
          setErrorType('404');
          setErrorMessage('Acceso denegado. Se requiere escanear la tarjeta física.');
          setLoading(false);
          return;
        }

        const result = await cardResolverService.getCardByToken(token);
        if (!isMounted) return;

        if (!result.card || result.card.profile?.slug !== slug) {
          setErrorType('404');
          setErrorMessage('Tarjeta no encontrada o acceso denegado.');
          setLoading(false);
          return;
        }

        const card = result.card;

        // Si la tarjeta pertenece a un lote con prefijo, no debe usarse la ruta /p/:slug/:token
        if (card.batch?.url_prefix) {
          setErrorType('404');
          setErrorMessage('Enlace no válido. Esta tarjeta utiliza un acceso corporativo.');
          setLoading(false);
          return;
        }

        const p = card.profile;
        if (p.subscription_status === 'expired' || p.subscription_status === 'suspended') {
          setErrorType('subscription_expired');
          setErrorMessage(
            'Membresía anual vencida. Este perfil se encuentra temporalmente suspendido hasta su renovación.'
          );
        } else {
          setIsNfcSource(false); // Acceso web directo
          setResolvedToken(token);
          setProfile(p);
        }
        setLoading(false);
        return;
      }

      // ── Caso 2: Resolución por Token (/t/:token o /:prefix/:token o /:prefix/:slug/:token) ──
      if (token && (!slug || prefix)) {
        const result = await cardResolverService.getCardByToken(token, prefix);
        if (!isMounted) return;

        if (!result.card) {
          setErrorType('404');
          setErrorMessage('Tarjeta no encontrada o enlace no válido.');
          setLoading(false);
          return;
        }

        const card: Card = result.card;

        // Si se envió un slug por la ruta corporativa, validarlo
        if (slug && card.profile?.slug !== slug) {
          setErrorType('404');
          setErrorMessage('Tarjeta no encontrada o acceso denegado.');
          setLoading(false);
          return;
        }

        // Evaluación del ciclo de vida del producto en cards.status
        if (card.status === 'inactive') {
          setInactiveCard(card);
          // Evalúa sesión del usuario
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            // Escenario A: Ya tiene sesión activa → Redirige a activación
            navigate('/activate/' + card.token, { replace: true });
            return;
          } else {
            // Escenario B: No tiene sesión activa → Abre modal de auth en la vista desenfocada
            setErrorType('inactive');
            setIsAuthModalOpen(true);
            setLoading(false);
            return;
          }
        } else if (card.status === 'blocked') {
          setErrorType('blocked');
          setErrorMessage(
            'Esta tarjeta ha sido suspendida o reportada como extraviada. Contacta a soporte SIF.'
          );
        } else if (card.status === 'active') {
          if (!card.profile) {
            setErrorType('no_profile');
            setErrorMessage(
              'Error de configuración: La tarjeta está activa pero no tiene un perfil asociado.'
            );
          } else {
            const cardProfile = card.profile;
            if (
              cardProfile.subscription_status === 'expired' ||
              cardProfile.subscription_status === 'suspended'
            ) {
              setErrorType('subscription_expired');
              setErrorMessage(
                'Membresía anual vencida. Este perfil se encuentra temporalmente suspendido hasta su renovación.'
              );
            } else {
              // Actualiza la URL visible a la versión adecuada
              if (card.batch?.url_prefix) {
                window.history.replaceState(null, '', `/${card.batch.url_prefix}/${cardProfile.slug}/${token}`);
                setActiveCardPrefix(card.batch.url_prefix);
              } else {
                window.history.replaceState(null, '', `/p/${cardProfile.slug}/${token}`);
              }
              
              // Si vino con slug ya en la URL, asumimos que no es un escaneo directo de NFC nuevo
              // sino quizás alguien recargando la página o compartiendo el link.
              setIsNfcSource(!slug); 
              setResolvedToken(token);
              setProfile(cardProfile);
            }
          }
        }
        setLoading(false);
        return;
      }

      // Sin parámetros válidos
      setErrorType('404');
      setErrorMessage('Tarjeta no encontrada o enlace no válido.');
      setLoading(false);
    }

    resolve();

    return () => {
      isMounted = false;
    };
  }, [token, prefix, slug, navigate]);

  // Transición post-autenticación exitosa
  const handleAuthSuccess = () => {
    setToastMessage('¡Cuenta verificada con éxito! Preparando tu perfil...');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      const targetToken = inactiveCard?.token || token;
      if (targetToken) {
        navigate('/activate/' + targetToken, { replace: true });
      }
    }, 1200);
  };

  // 1. Estado de Carga (Loading)
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-sif-bg flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-2 border-sif-border border-t-sif-gold animate-spin" />
            <span className="absolute font-bold text-xs tracking-wider text-sif-gold">
              SIF
            </span>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-sm font-semibold text-sif-text tracking-wide">
              Sharing is Fast
            </h1>
            <p className="text-xs text-sif-muted animate-pulse">
              Consultando tarjeta NFC...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Renderizado exitoso del perfil activo
  if (profile && !errorType) {
    return <ProfileView profile={profile} isNfcSource={isNfcSource} token={resolvedToken} prefix={activeCardPrefix} isStandalone={true} />;
  }

  // 3. Vista especial para Tarjeta Virgen / Inactiva
  if (errorType === 'inactive') {
    return (
      <div className="min-h-screen w-full bg-sif-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Luz ambiental dorada de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--sif-gold) 0%, transparent 70%)',
          }}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 z-50 flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-emerald-950/90 px-5 py-3 text-xs font-semibold text-emerald-300 shadow-2xl backdrop-blur-md animate-bounce">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Fondo desenfocado de espera (Preview de la tarjeta virgen) */}
        <div className="filter blur-sm select-none pointer-events-none opacity-50 w-full max-w-sm flex flex-col items-center">
          {/* Mockup de la tarjeta física virgen */}
          <div
            className="w-full aspect-[1.586/1] rounded-2xl border border-sif-gold/40 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(18,18,21,0.95) 50%, rgba(226,232,240,0.08) 100%)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            }}
          >
            <div className="flex justify-between items-start">
              <img src={sifGold} alt="SIF" className="h-8 w-auto object-contain" />
              <span className="text-[10px] font-mono tracking-widest text-sif-gold border border-sif-gold/30 px-2.5 py-0.5 rounded-full bg-sif-gold/10">
                TARJETA SIN ACTIVAR
              </span>
            </div>

            {/* Brillo metálico diagonal */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
              }}
            />

            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-widest text-sif-muted font-medium">
                Serie / Token
              </p>
              <p className="text-sm font-mono font-bold tracking-widest text-sif-text">
                {inactiveCard?.serial_number ||
                  `SIF-${(inactiveCard?.token || token || '000').toUpperCase()}`}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center space-y-1">
            <h2 className="text-base font-semibold text-sif-text flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-sif-gold" />
              <span>Tarjeta Lista para Activación</span>
            </h2>
            <p className="text-xs text-sif-muted">SIF • Sharing is Fast</p>
          </div>
        </div>

        {/* Botón de respaldo por si el usuario cierra el modal */}
        {!isAuthModalOpen && !toastMessage && (
          <div className="absolute z-20 flex flex-col items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="rounded-full px-7 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95 shadow-xl"
              style={{
                background:
                  'linear-gradient(135deg, var(--sif-gold) 0%, #f0cc5a 50%, var(--sif-gold) 100%)',
                boxShadow: '0 4px 20px rgba(221, 178, 37, 0.4)',
              }}
            >
              Activar mi tarjeta
            </button>
          </div>
        )}

        {/* AuthModal contextualizado */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode="register"
          title="Bienvenido a SIF"
          subtitle="Inicia sesión o crea tu cuenta para configurar tu perfil digital, editar tus datos cuando lo desees y acceder a todas las funcionalidades exclusivas como miembro de SIF."
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // 4. Renderizado de otras vistas de error (404, blocked, subscription_expired, no_profile)
  return (
    <div className="min-h-screen w-full bg-sif-bg flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-sif-border bg-sif-surface p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
        {/* Icono temático */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-sif-border bg-sif-surface-subtle shadow-inner">
          {errorType === '404' && (
            <AlertCircle className="h-8 w-8 text-sif-muted" />
          )}
          {errorType === 'blocked' && (
            <ShieldAlert className="h-8 w-8 text-rose-500" />
          )}
          {errorType === 'subscription_expired' && (
            <Clock className="h-8 w-8 text-amber-500" />
          )}
          {errorType === 'no_profile' && (
            <HelpCircle className="h-8 w-8 text-rose-400" />
          )}
        </div>

        {/* Título de estado */}
        <h2 className="mb-2 text-lg font-bold text-sif-text">
          {errorType === '404' && 'Enlace no encontrado'}
          {errorType === 'blocked' && 'Tarjeta suspendida'}
          {errorType === 'subscription_expired' && 'Suscripción Vencida'}
          {errorType === 'no_profile' && 'Error de Configuración'}
        </h2>

        {/* Mensaje descriptivo principal */}
        <p className="mb-6 text-sm leading-relaxed text-sif-muted">
          {errorMessage}
        </p>

        {/* Footer / Branding */}
        <div className="w-full border-t border-sif-border pt-5 flex items-center justify-between text-xs text-sif-muted">
          <span>
            Powered by <strong className="text-sif-text">SIF</strong>
          </span>
          <Link
            to="/admin"
            className="text-xs text-sif-gold hover:underline transition-colors font-medium"
          >
            Ir al Panel Admin &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

