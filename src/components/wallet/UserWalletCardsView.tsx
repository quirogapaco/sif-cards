import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Loader2,
  CheckCircle2,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cardService } from '../../services/cardService';
import { profileService } from '../../services/profileService';
import type { Card } from '../../types/database';

import GoldDarkCard from '../../assets/cards/Gold_Dark_cards.png';
import SilverDarkCard from '../../assets/cards/Silver_Dark_cards.png';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN || 'https://sifcards.com';

export function UserWalletCardsView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cards, setCards] = useState<Card[]>([]);
  const [profileOptions, setProfileOptions] = useState<{ id: string; display_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Índice visual de giro vs. Índice con datos estables
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [renderedIndex, setRenderedIndex] = useState<number>(0);
  const [isStabilizing, setIsStabilizing] = useState<boolean>(false);

  // Estados interactivos
  const [isCopying, setIsCopying] = useState(false);
  const [updatingProfileCardId, setUpdatingProfileCardId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isSelectDropdownOpen, setIsSelectDropdownOpen] = useState(false);

  // Control táctil con cálculo de velocidad e inercia
  const dragStartY = useRef<number | null>(null);
  const dragStartTime = useRef<number>(0);
  const dragDeltaY = useRef<number>(0);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [userCards, pOptions] = await Promise.all([
        cardService.getUserCards(user.id),
        profileService.getUserProfileOptions(user.id),
      ]);
      setCards(userCards);
      setProfileOptions(pOptions);
      setSelectedIndex(0);
      setRenderedIndex(0);
    } catch (err) {
      console.error('Error cargando tarjetas:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounce: espera 350ms a que la tarjeta se detenga para hidratar la info
  useEffect(() => {
    setIsStabilizing(true);
    if (settleTimer.current) {
      clearTimeout(settleTimer.current);
    }

    settleTimer.current = setTimeout(() => {
      setRenderedIndex(selectedIndex);
      setIsStabilizing(false);
    }, 350);

    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [selectedIndex]);

  // Cerrar dropdown al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSelectDropdownOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCard = cards[renderedIndex] || cards[0];

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopying(true);
      setSuccessToast('Enlace copiado al portapapeles');
      setTimeout(() => {
        setIsCopying(false);
        setSuccessToast(null);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar enlace', err);
    }
  };

  const handleProfileChange = async (cardId: string, newProfileId: string) => {
    setUpdatingProfileCardId(cardId);
    setIsSelectDropdownOpen(false);
    try {
      const { success, error } = await cardService.reassignCardProfile(cardId, newProfileId);
      if (!success) throw new Error(error);

      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, profile_id: newProfileId } : c))
      );
      setSuccessToast('Perfil reasignado con éxito');
      setTimeout(() => setSuccessToast(null), 2500);
    } catch (err) {
      console.error('Error reasignando perfil:', err);
    } finally {
      setUpdatingProfileCardId(null);
    }
  };

  const getCardImage = (cardType: string) => {
    switch (cardType) {
      case 'matte-white-silver':
        return SilverDarkCard;
      case 'matte-black-gold':
      default:
        return GoldDarkCard;
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(isoString));
  };

  const getCanonicalUrl = (card: Card) => {
    if (card.batch?.url_prefix) {
      return `${DOMAIN}/${card.batch.url_prefix}/${card.token}`;
    }
    return `${DOMAIN}/t/${card.token}`;
  };

  // ── Gestos Swipe Vertical de Alta Sensibilidad con Inercia ──
  const handleTouchStart = (clientY: number) => {
    dragStartY.current = clientY;
    dragStartTime.current = Date.now();
    dragDeltaY.current = 0;
  };

  const handleTouchMove = (clientY: number) => {
    if (dragStartY.current === null) return;
    dragDeltaY.current = clientY - dragStartY.current;
  };

  const handleTouchEnd = () => {
    if (dragStartY.current === null || cards.length <= 1) return;

    const timeElapsed = Math.max(Date.now() - dragStartTime.current, 1);
    const distance = dragDeltaY.current;
    const velocity = Math.abs(distance) / timeElapsed; // px/ms

    // Cuanto más rápido deslices, más tarjetas avanza
    let steps = 1;
    if (velocity > 1.4 || Math.abs(distance) > 220) {
      steps = 3;
    } else if (velocity > 0.7 || Math.abs(distance) > 120) {
      steps = 2;
    }

    // Umbral mínimo ultrasensible: solo 18px
    if (Math.abs(distance) > 18) {
      setIsSelectDropdownOpen(false);
      if (distance > 0) {
        // Deslizar hacia abajo: tarjetas anteriores
        setSelectedIndex((prev) => (prev - steps + cards.length * 10) % cards.length);
      } else {
        // Deslizar hacia arriba: siguientes tarjetas
        setSelectedIndex((prev) => (prev + steps) % cards.length);
      }
    }

    dragStartY.current = null;
    dragDeltaY.current = 0;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#ddb225]" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Cargando tu SIF Wallet...
        </p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#121215] p-10 text-center max-w-sm mx-auto mt-12 shadow-2xl">
        <div className="mb-4 rounded-full bg-white/[0.03] border border-white/10 p-4 text-slate-400">
          <CreditCard className="h-8 w-8 text-[#ddb225]" />
        </div>
        <h2 className="mb-1 text-base font-semibold text-[#EBF1F9]">Aún no tienes tarjetas SiF</h2>
        <p className="mb-5 text-xs text-slate-400 leading-relaxed">
          Activa o vincula tu primera tarjeta física NFC para comenzar.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full border border-[#ddb225]/40 bg-[#ddb225]/10 px-5 py-2.5 text-xs font-semibold text-[#ddb225] hover:bg-[#ddb225]/20 transition-all cursor-pointer"
        >
          Vincular nueva tarjeta
        </button>
      </div>
    );
  }

  const selectedProfileObj = profileOptions.find((p) => p.id === activeCard?.profile_id);

  return (
    <div className="relative isolate z-0 w-full max-w-md sm:max-w-xl mx-auto min-h-[calc(100vh-4.5rem)] flex flex-col justify-between px-3.5 sm:px-6 py-2 select-none overflow-x-hidden">
      {/* Toast Flotante */}
      {successToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-black/95 px-4 py-2 text-xs font-mono text-emerald-300 shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Halo de luz ambiental */}
      <div
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[380px] sm:w-[500px] h-[300px] blur-[110px] rounded-full transition-all duration-700 -z-10"
        style={{
          background:
            cards[selectedIndex]?.card_type === 'matte-white-silver'
              ? 'radial-gradient(circle, rgba(226,232,240,0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(221,178,37,0.14) 0%, transparent 70%)',
        }}
      />

      {/* ── 1. CABECERA & GUÍA DE POSICIÓN ── */}
      <div className="w-full flex items-center justify-between pt-1 pb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ddb225] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-medium">
            Tarjeta {selectedIndex + 1} de {cards.length}
          </span>
        </div>

        {/* Dots interactivos */}
        <div className="flex items-center gap-1.5 bg-[#121215]/80 px-2.5 py-1 rounded-full border border-white/[0.08]">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedIndex(i);
                setIsSelectDropdownOpen(false);
              }}
              className={`transition-all rounded-full ${
                i === selectedIndex
                  ? 'w-4 h-1.5 bg-[#ddb225]'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Ir a tarjeta ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── 2. ESCENARIO VERTICAL DE TARJETAS ── */}
      <div
        className="relative w-full h-[340px] sm:h-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing my-auto"
        onMouseDown={(e) => handleTouchStart(e.clientY)}
        onMouseMove={(e) => handleTouchMove(e.clientY)}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleTouchMove(e.touches[0].clientY)}
        onTouchEnd={handleTouchEnd}
      >
        {cards.map((card, idx) => {
          const isCenter = idx === selectedIndex;
          let offset = idx - selectedIndex;

          if (offset > cards.length / 2) offset -= cards.length;
          if (offset < -cards.length / 2) offset += cards.length;

          let translateY = 0;
          let scale = 1;
          let zIndex = 20;
          let opacity = 1;
          let filter = 'brightness(1)';

          if (isCenter) {
            translateY = 0;
            scale = 1;
            zIndex = 30;
            filter = 'brightness(1) contrast(1.05)';
          } else if (offset === 1 || (offset < 0 && Math.abs(offset) === cards.length - 1)) {
            translateY = 65;
            scale = 0.93;
            zIndex = 15;
            filter = 'brightness(0.85) contrast(0.98)';
          } else if (offset === -1 || (offset > 0 && offset === cards.length - 1)) {
            translateY = -65;
            scale = 0.93;
            zIndex = 15;
            filter = 'brightness(0.85) contrast(0.98)';
          } else {
            translateY = offset * 55;
            scale = 0.86;
            opacity = 0.4;
            zIndex = 5;
            filter = 'brightness(0.7)';
          }

          return (
            <div
              key={card.id}
              onClick={() => {
                setSelectedIndex(idx);
                setIsSelectDropdownOpen(false);
              }}
              className="absolute w-[400px] sm:w-[560px] aspect-[1.586/1] transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                zIndex,
                opacity,
                filter,
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={getCardImage(card.card_type)}
                  alt={`SiF Card ${card.serial_number}`}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
                />

                <div className="absolute bottom-2.5 right-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-slate-200 flex items-center gap-1.5 shadow-md">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      card.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span>{card.serial_number || 'SIF'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. PANEL DE INFORMACIÓN CON SKELETON / LOADING DURANTE EL CAMBIO ── */}
      <div className="w-full bg-[#121215] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 mt-1 mb-2">
        
        {/* Fila 1: Estado y Fecha de Activación */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.06]">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
              Estado
            </span>
            {isStabilizing ? (
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse my-0.5" />
            ) : (
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeCard?.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`text-xs font-mono font-semibold uppercase ${
                    activeCard?.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {activeCard?.status === 'active' ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.06]">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
              Activada el
            </span>
            {isStabilizing ? (
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse my-0.5" />
            ) : (
              <span className="text-xs font-mono text-slate-200 font-medium">
                {formatDate(activeCard?.activated_at)}
              </span>
            )}
          </div>
        </div>

        {/* Fila 2: Enlace de SiF Card */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06]">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
            Enlace de SIF Card
          </span>

          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#18181c] border border-white/[0.08]">
            {isStabilizing ? (
              <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
            ) : (
              <span className="font-mono text-xs text-[#ddb225] truncate">
                {activeCard ? getCanonicalUrl(activeCard) : ''}
              </span>
            )}

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => activeCard && handleCopyLink(getCanonicalUrl(activeCard))}
                disabled={isStabilizing}
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-40"
                title="Copiar enlace"
              >
                {isCopying ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <a
                href={activeCard && !isStabilizing ? getCanonicalUrl(activeCard) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition ${
                  isStabilizing ? 'pointer-events-none opacity-40' : ''
                }`}
                title="Abrir perfil"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Fila 3: Selector de Perfil Vinculado */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] relative">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
            Perfil Vinculado
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSelectDropdownOpen(!isSelectDropdownOpen)}
              disabled={updatingProfileCardId === activeCard?.id || isStabilizing}
              className="w-full flex items-center justify-between bg-[#18181c] hover:bg-[#1f1f24] border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-xs text-white transition-all cursor-pointer shadow-inner disabled:opacity-50"
            >
              {isStabilizing ? (
                <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-full bg-[#ddb225]/15 border border-[#ddb225]/30 flex items-center justify-center text-[10px] text-[#ddb225] font-bold shrink-0">
                    {selectedProfileObj?.display_name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <span className="truncate font-medium text-slate-100">
                    {selectedProfileObj?.display_name || 'Selecciona un perfil...'}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                {updatingProfileCardId === activeCard?.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ddb225]" />
                ) : (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSelectDropdownOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                )}
              </div>
            </button>

            {/* Menú Desplegable Flotante */}
            {isSelectDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-[#18181c] border border-white/15 rounded-2xl shadow-2xl p-1.5 space-y-1 max-h-44 overflow-y-auto">
                {profileOptions.map((p) => {
                  const isCurrent = p.id === activeCard?.profile_id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProfileChange(activeCard.id, p.id)}
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
                      {isCurrent && <UserCheck className="w-3.5 h-3.5 text-[#ddb225] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Fila 4: Botón de Edición Directa */}
        <button
          onClick={() => {
            if (activeCard?.profile_id) {
              navigate('/admin/profile', { state: { profileId: activeCard.profile_id } });
            }
          }}
          disabled={!activeCard?.profile_id || isStabilizing}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ddb225] via-[#e5bd38] to-[#f59e0b] hover:brightness-110 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(221,178,37,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Editar este perfil</span>
        </button>
      </div>

    </div>
  );
}