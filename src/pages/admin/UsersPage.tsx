import { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, UserCheck, Shield, RefreshCw } from 'lucide-react';
import { userService, type AdminUserListItem } from '../../services/userService';
import { ClientsTable } from '../../components/admin/ClientsTable';
import { ClientDetailsModal } from '../../components/admin/ClientDetailsModal';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAdminUsersList();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = users.length;
    
    // Simplificación para "Nuevos registros últimos 30 días"
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newSignups = users.filter(
      (u) => new Date(u.created_at) >= thirtyDaysAgo
    ).length;

    const proAccounts = users.filter((u) => u.profiles_count > 0).length;

    return { total, newSignups, proAccounts };
  }, [users]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-sif-text">Clientes & Cuentas</h1>
          <p className="mt-0.5 text-sm text-sif-muted">
            Gestión de usuarios particulares y cuentas corporativas
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-sif-border bg-sif-surface text-sif-muted transition-all hover:border-sif-gold/30 hover:text-sif-text disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Registrados', icon: Users, value: metrics.total },
          { label: 'Nuevos (30 días)', icon: UserCheck, value: metrics.newSignups },
          { label: 'Usuarios con Perfiles', icon: Shield, value: metrics.proAccounts },
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

      {/* Tabla de Clientes */}
      <div className="rounded-2xl border border-sif-border bg-sif-surface p-5">
        {isLoading && users.length === 0 ? (
          <div className="flex py-12 justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-sif-gold" />
          </div>
        ) : (
          <ClientsTable
            users={users}
            onViewDetails={(user) => setSelectedUser(user)}
          />
        )}
      </div>

      <ClientDetailsModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
