// Define exactamente lo que el backend de Supabase devolverá
export interface DashboardMetrics {
  overview: {
    totalViews: number;
    viewsGrowth: number;
    totalTaps: number;
    tapsGrowth: number;
    contactsSaved: number;
    contactsGrowth: number;
    ctr: number;
    ctrGrowth: number;
  };
  timeSeries: Array<{
    date: string;
    views: number;
    taps: number;
  }>;
  socialDistribution: Array<{
    platform: string;
    clicks: number;
    percentage: number;
    color: string;
  }>;
  directLinks: Array<{
    type: string;
    clicks: number;
    percentage: number;
  }>;
  devices: {
    ios: { percentage: number; count: number };
    android: { percentage: number; count: number };
  };
  peakHour: string;
  funnel: {
    views: number;
    interactions: number;
    saves: number;
  };
}