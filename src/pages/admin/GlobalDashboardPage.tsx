import { useAuth } from '../../context/AuthContext';
import DashboardContainer from '../../components/dashboard/DashboardContainer';

export default function GlobalDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-dvh bg-[var(--sif-bg)] text-[var(--sif-text)] relative overflow-hidden">
      {/* Brillos ambientales */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--sif-gold)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[var(--sif-silver)]/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Header de la marca */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--sif-text)] to-[var(--sif-muted)]">
              SIF Cards Analytics Pro
            </h1>
            <p className="text-sm text-[var(--sif-muted)] mt-1">Métricas globales y rendimiento en tiempo real</p>
          </div>
        </header>

        {user && <DashboardContainer targetUserId={user.id} />}

      </div>
    </div>
  );
}
