import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { userService } from '../../services/userService';
import { useAppTheme } from '../../context/AppThemeContext';
import sifGold from '../../assets/sif_gold.png';
import sifSilver from '../../assets/sif_silver.png';

// ── Tipos ──────────────────────────────────────────────────────────────────
type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

// ── SVG Isotipo de Google ─────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ── Componente Principal ──────────────────────────────────────────────────
export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  title,
  subtitle,
  onSuccess,
}: AuthModalProps) {
  const { mode: appTheme } = useAppTheme();

  // Estado interno
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza el modo inicial cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFullName('');
      setEmail('');
      setPassword('');
      setError(null);
      setSuccessMsg(null);
      // Focus al primer input tras la animación
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [isOpen, initialMode]);

  // Cierre con tecla Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clic fuera del contenedor
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  // ── Acciones de Auth ───────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con Google.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.href,
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;

        // Crear/asegurar el registro correspondiente en la tabla 'users'
        if (data?.user) {
          await userService.ensureUserRecord(data.user.id);
        }

        if (data?.session) {
          if (onSuccess) {
            onSuccess();
          } else {
            onClose();
          }
        } else {
          setSuccessMsg(
            '¡Cuenta creada! Revisa tu correo para confirmar tu dirección.'
          );
          if (onSuccess) {
            onSuccess();
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setFullName('');
    setError(null);
    setSuccessMsg(null);
  };

  // Logo adaptativo según el tema de la plataforma
  const logoSrc = appTheme === 'dark' ? sifGold : sifSilver;

  const displayTitle =
    title ?? (mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta SIF');
  const displaySubtitle =
    subtitle ??
    (mode === 'login'
      ? 'Accede a tu panel de administración'
      : 'Empieza a compartir en segundos');

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={displayTitle}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 dark:bg-black/75 bg-slate-900/40 backdrop-blur-md transition-colors duration-200"
      style={{
        animation: 'sif-fade-in 0.18s ease',
      }}
    >
      {/* Contenedor del modal */}
      <div
        className="relative w-full max-w-md max-h-[95vh] overflow-y-auto rounded-3xl border border-sif-border bg-sif-surface p-5 sm:p-6 shadow-2xl text-sif-text transition-all duration-200 custom-scrollbar"
        style={{ animation: 'sif-slide-up 0.22s cubic-bezier(0.22, 1, 0.36, 1)' }}
        role="document"
      >
        {/* ── Botón cerrar ── */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-sif-border text-sif-muted transition-all duration-150 hover:border-sif-gold hover:text-sif-gold active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Cabecera con imagotipo destacado ── */}
        <div className="mb-5 flex flex-col items-center gap-2">
          <img
            src={logoSrc}
            alt="SIF – Sharing is Fast"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-md mx-auto block transition-transform duration-300 hover:scale-105"
            draggable={false}
          />
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-sif-text">
              {displayTitle}
            </h1>
            <p className="mt-1 text-xs text-sif-muted">
              {displaySubtitle}
            </p>
          </div>
        </div>

        {/* ── Botón Google ── */}
        <button
          id="auth-google-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-sif-border bg-sif-surface-subtle py-2.5 text-sm font-medium text-sif-text transition-all duration-200 hover:border-sif-gold hover:bg-sif-surface hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
        >
          {googleLoading ? <Spinner /> : <GoogleIcon />}
          <span>Continuar con Google</span>
        </button>

        {/* ── Divisor ── */}
        <div className="relative mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-sif-border" />
          <span className="shrink-0 text-[11px] font-medium uppercase tracking-widest text-sif-muted">
            o continúa con tu correo
          </span>
          <div className="h-px flex-1 bg-sif-border" />
        </div>

        {/* ── Formulario ── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5">
          {/* Nombre (Solo en modo registro) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="auth-fullname"
                className="text-xs font-medium text-sif-muted"
              >
                Nombre completo
              </label>
              <input
                ref={firstInputRef}
                id="auth-fullname"
                type="text"
                autoComplete="name"
                required
                disabled={loading || googleLoading}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Carlos Mendoza"
                className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text placeholder:text-sif-muted/50 outline-none transition-all duration-150 focus:border-sif-gold focus:ring-1 focus:ring-sif-gold/30 disabled:opacity-50"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="auth-email"
              className="text-xs font-medium text-sif-muted"
            >
              Correo electrónico
            </label>
            <input
              ref={mode === 'login' ? firstInputRef : undefined}
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              disabled={loading || googleLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text placeholder:text-sif-muted/50 outline-none transition-all duration-150 focus:border-sif-gold focus:ring-1 focus:ring-sif-gold/30 disabled:opacity-50"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="auth-password"
              className="text-xs font-medium text-sif-muted"
            >
              Contraseña
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              disabled={loading || googleLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'login' ? '••••••••' : 'Mínimo 6 caracteres'}
              className="rounded-xl border border-sif-border bg-sif-surface-subtle px-4 py-2.5 text-sm text-sif-text placeholder:text-sif-muted/50 outline-none transition-all duration-150 focus:border-sif-gold focus:ring-1 focus:ring-sif-gold/30 disabled:opacity-50"
            />
          </div>

          {/* Alerta de error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMsg && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Botón submit */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={
              loading ||
              googleLoading ||
              !email ||
              !password ||
              (mode === 'register' && !fullName.trim())
            }
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background:
                'linear-gradient(135deg, var(--sif-gold) 0%, #f0cc5a 50%, var(--sif-gold) 100%)',
              boxShadow: '0 2px 16px rgba(221, 178, 37, 0.3)',
            }}
          >
            {loading && <Spinner />}
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        {/* ── Pie — Alternar modo ── */}
        <p className="mt-5 text-center text-xs text-sif-muted">
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <button
                id="auth-switch-to-register"
                type="button"
                onClick={switchMode}
                className="font-semibold underline-offset-2 transition-colors hover:underline"
                style={{ color: 'var(--sif-gold)' }}
              >
                Regístrate gratis
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                id="auth-switch-to-login"
                type="button"
                onClick={switchMode}
                className="font-semibold underline-offset-2 transition-colors hover:underline"
                style={{ color: 'var(--sif-gold)' }}
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>

        {/* ── Decoración biselada sutil (gradiente) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(221,178,37,0.04) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* ── Keyframes de animación (inyectados una vez) ── */}
      <style>{`
        @keyframes sif-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sif-slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
