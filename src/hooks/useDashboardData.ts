import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/analyticsService';
import type { DashboardMetricsResponse } from '../types/dashboard';

interface UseDashboardDataParams {
  targetUserId: string;
  profileId?: string | null;
  days: number;
}

interface UseDashboardDataReturn {
  data: DashboardMetricsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData({
  targetUserId,
  profileId = null,
  days,
}: UseDashboardDataParams): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick(t => t + 1);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getDashboardData(targetUserId, profileId, days);
        if (isMounted) {
          if (result) {
            setData(result);
          } else {
            setError('Error al obtener las métricas del dashboard.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Ocurrió un error inesperado al cargar las métricas.');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (targetUserId) {
      fetchData();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [targetUserId, profileId, days, tick]);

  return { data, isLoading, error, refetch };
}
