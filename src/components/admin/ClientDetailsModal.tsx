import { useState, useEffect } from 'react';
import { X, User, CreditCard, LayoutTemplate, Loader2, Calendar } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { cardService } from '../../services/cardService';
import type { AdminUserListItem } from '../../services/userService';
import type { Profile, Card } from '../../types/database';

interface ClientDetailsModalProps {
  user: AdminUserListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailsModal({ user, isOpen, onClose }: ClientDetailsModalProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadUserData(user.id);
    }
  }, [isOpen, user]);

  const loadUserData = async (userId: string) => {
    setIsLoading(true);
    try {
      const [profilesRes, cardsData] = await Promise.all([
        profileService.getUserProfiles(userId),
        cardService.getUserCards(userId)
      ]);
      
      setProfiles(profilesRes.profiles || []);
      setCards(cardsData || []);
    } catch (err) {
      console.error('Error fetching user details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-sif-border bg-sif-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sif-border bg-sif-surface-subtle px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sif-gold/10 text-sif-gold border border-sif-gold/20">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-sif-text">{user.display_name || 'Sin nombre'}</h2>
              <p className="text-sm text-sif-muted">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-sif-muted hover:bg-sif-surface hover:text-sif-text">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-sif-gold" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Información General */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-sif-text border-b border-sif-border pb-2">Información de Cuenta</h3>
                <div className="rounded-xl border border-sif-border bg-sif-surface-subtle p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-sif-muted">Rol en el sistema:</span>
                    <span className="rounded-md bg-sif-surface px-2 py-1 text-xs font-semibold text-sif-text border border-sif-border">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-sif-muted">Miembro desde:</span>
                    <span className="flex items-center gap-1.5 text-xs text-sif-text font-medium">
                      <Calendar className="h-3.5 w-3.5 text-sif-gold" /> {formatDate(user.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-sif-muted">Organización B2B:</span>
                    <span className="text-xs text-sif-text font-medium">
                      {user.org_id ? <span className="text-sif-gold">Sí (Asignado)</span> : 'Ninguna'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Perfiles */}
              <div className="flex flex-col gap-4 md:col-span-2">
                <h3 className="text-lg font-bold text-sif-text border-b border-sif-border pb-2 flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5 text-sif-gold" />
                  Perfiles Digitales ({profiles.length})
                </h3>
                {profiles.length === 0 ? (
                  <p className="text-sm text-sif-muted text-center py-4 border border-dashed border-sif-border rounded-xl">
                    Este usuario no ha creado ningún perfil aún.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map(profile => {
                      const data = profile.data || {};
                      return (
                        <div key={profile.id} className="rounded-xl border border-sif-border bg-sif-surface-subtle p-4 flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            {data.avatar_url ? (
                              <img src={data.avatar_url} alt="avatar" className="h-10 w-10 rounded-full object-cover border border-sif-border" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-sif-surface border border-sif-border flex items-center justify-center">
                                <User className="h-5 w-5 text-sif-muted" />
                              </div>
                            )}
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-bold text-sif-text truncate">{data.display_name || 'Sin nombre'}</span>
                              <span className="text-xs text-sif-muted truncate">sifcards.com/p/{profile.slug}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Tarjetas */}
              <div className="flex flex-col gap-4 md:col-span-2">
                <h3 className="text-lg font-bold text-sif-text border-b border-sif-border pb-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-sif-gold" />
                  Tarjetas NFC Vinculadas ({cards.length})
                </h3>
                {cards.length === 0 ? (
                  <p className="text-sm text-sif-muted text-center py-4 border border-dashed border-sif-border rounded-xl">
                    No hay tarjetas físicas vinculadas a esta cuenta.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cards.map(card => (
                      <div key={card.id} className="rounded-xl border border-sif-border bg-sif-surface-subtle p-4 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs font-bold text-sif-gold">SN: {card.serial_number}</span>
                          <span className="text-xs text-sif-muted">
                            Perfil: {card.profile ? (card.profile as any).slug : 'Sin asignar'}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          card.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          card.status === 'inactive' ? 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {card.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
