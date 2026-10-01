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

export interface DashboardMetricsResponse {
  kpis: {
    web_views: number;
    prev_web_views: number;
    nfc_taps: number;
    prev_nfc_taps: number;
    contacts_saved: number;
    prev_contacts_saved: number;
  };
  funnel: {
    unique_visitors: number | null;
    interactions: number;
    leads: number;
  };
  social_clicks: Array<{ platform: string; clicks: number }>;
  direct_contacts: Array<{ channel: string; clicks: number }>;
  traffic: Array<{ date: string; web_views: number; nfc_taps: number }>;
}