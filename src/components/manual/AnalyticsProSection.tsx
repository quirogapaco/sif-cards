import React, { useState } from 'react';
import KpiGrid from '../dashboard/KpiGrid';
import TrafficChart from '../dashboard/TrafficChart';
import SocialDistribution from '../dashboard/SocialDistribution';
import DirectLinks from '../dashboard/DirectLinks';
import ConversionFunnel from '../dashboard/ConversionFunnel';
import type { DashboardMetrics, DashboardMetricsResponse } from '../../types/dashboard';

interface AnalyticsScenario {
  id: string;
  label: string;
  badge: string;
  overview: DashboardMetrics['overview'];
  traffic: DashboardMetricsResponse['traffic'];
  socialDistribution: DashboardMetrics['socialDistribution'];
  directLinks: DashboardMetrics['directLinks'];
  funnel: DashboardMetrics['funnel'];
}

const SCENARIOS: Record<string, AnalyticsScenario> = {
  ejecutivo: {
    id: 'ejecutivo',
    label: 'Profesional / Creador',
    badge: 'Caso del Manual',
    overview: {
      totalViews: 36,
      viewsGrowth: 100,
      totalTaps: 3,
      tapsGrowth: 100,
      contactsSaved: 2,
      contactsGrowth: 100,
      totalShares: 0,
      sharesGrowth: 0,
      ctr: 9,
      ctrGrowth: 0,
    },
    traffic: [
      { date: '2026-10-18', web_views: 0, nfc_taps: 0 },
      { date: '2026-10-22', web_views: 0, nfc_taps: 0 },
      { date: '2026-10-26', web_views: 0, nfc_taps: 0 },
      { date: '2026-10-30', web_views: 0, nfc_taps: 0 },
      { date: '2026-11-03', web_views: 0, nfc_taps: 0 },
      { date: '2026-11-07', web_views: 9, nfc_taps: 1 },
      { date: '2026-11-09', web_views: 1, nfc_taps: 0 },
      { date: '2026-11-11', web_views: 3, nfc_taps: 0 },
      { date: '2026-11-15', web_views: 2, nfc_taps: 0 },
      { date: '2026-11-17', web_views: 18, nfc_taps: 2 },
    ],
    socialDistribution: [
      { platform: 'instagram', clicks: 1, percentage: 50, color: '#f43f5e' },
      { platform: 'website', clicks: 1, percentage: 50, color: '#10b981' },
    ],
    directLinks: [
      { type: 'whatsapp', clicks: 1, percentage: 100 },
    ],
    funnel: {
      views: 34,
      interactions: 3,
      saves: 2,
    },
  },
  evento: {
    id: 'evento',
    label: 'Feria & Congreso B2B',
    badge: 'Alto Tráfico',
    overview: {
      totalViews: 420,
      viewsGrowth: 185,
      totalTaps: 164,
      tapsGrowth: 210,
      contactsSaved: 98,
      contactsGrowth: 145,
      totalShares: 34,
      sharesGrowth: 80,
      ctr: 46,
      ctrGrowth: 24,
    },
    traffic: [
      { date: '2026-11-01', web_views: 18, nfc_taps: 8 },
      { date: '2026-11-04', web_views: 32, nfc_taps: 14 },
      { date: '2026-11-07', web_views: 68, nfc_taps: 29 },
      { date: '2026-11-10', web_views: 95, nfc_taps: 42 },
      { date: '2026-11-13', web_views: 84, nfc_taps: 31 },
      { date: '2026-11-17', web_views: 123, nfc_taps: 40 },
    ],
    socialDistribution: [
      { platform: 'LinkedIn', clicks: 82, percentage: 48, color: '#3b82f6' },
      { platform: 'Instagram', clicks: 54, percentage: 32, color: '#f43f5e' },
      { platform: 'RIMAN / Web', clicks: 34, percentage: 20, color: '#10b981' },
    ],
    directLinks: [
      { type: 'whatsapp', clicks: 76, percentage: 68 },
      { type: 'email', clicks: 24, percentage: 21 },
      { type: 'teléfono', clicks: 12, percentage: 11 },
    ],
    funnel: {
      views: 380,
      interactions: 175,
      saves: 98,
    },
  },
};

export const AnalyticsProSection: React.FC = () => {
  const [scenarioKey, setScenarioKey] = useState<'ejecutivo' | 'evento'>('ejecutivo');
  const current = SCENARIOS[scenarioKey];

  return (
    <section
      id="analytics-pro"
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b dark:border-white/[0.06] border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de Sección 3 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-[#ddb225]/30 border-amber-500/30 bg-[#ddb225]/10 text-[#ddb225] font-mono text-[11px] uppercase tracking-widest mb-3 font-semibold">
              <span>Sección 03</span>
              <span>·</span>
              <span>Medición de Impacto</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white text-slate-900">
              3. Panel de Estadísticas (Analytics Pro)
            </h2>
            <p className="mt-3 text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed">
              SIF proporciona métricas detalladas en la sección <strong className="dark:text-white text-slate-900">“Dashboard”</strong> para medir el impacto de tus interacciones comerciales a través de un panel de alto contraste.
            </p>
          </div>

          {/* Selector Interactivo de Escenario */}
          <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest dark:text-slate-400 text-slate-500">
              Simular escenario de datos:
            </span>
            <div className="inline-flex p-1 rounded-2xl border dark:border-white/10 border-slate-200 dark:bg-[#121215] bg-white shadow-sm">
              {(['ejecutivo', 'evento'] as const).map((key) => {
                const item = SCENARIOS[key];
                const isActive = scenarioKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setScenarioKey(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#ddb225] text-black shadow-sm'
                        : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Guía rápida de los 4 puntos del Manual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: 'Métricas clave',
              desc: 'Resume el rendimiento total con indicadores de Vistas Web, Taps NFC, Contactos Guardados y Tasa de Conversión.',
            },
            {
              title: 'Tráfico en el tiempo',
              desc: 'Gráfica comparativa clara que diferencia entre las Vistas Web (Digitales) y los Taps Físicos de tu tarjeta (NFC) a lo largo de los días.',
            },
            {
              title: 'Comportamiento del usuario',
              desc: 'Analiza la distribución de clics en tus redes sociales y descubre cuál es el canal de contacto directo preferido por tus clientes.',
            },
            {
              title: 'Embudo de conversión',
              desc: 'Monitorea la efectividad de tu perfil paso a paso: desde Visitantes Únicos, pasando por Interacciones, hasta Leads Capturados.',
            },
          ].map((bullet, i) => (
            <div
              key={i}
              className="rounded-2xl border dark:border-white/[0.08] border-slate-200 dark:bg-[#121215]/70 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-5 w-5 rounded-full bg-[#ddb225]/15 border border-[#ddb225]/30 text-[#ddb225] text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="text-xs font-bold dark:text-white text-slate-900">{bullet.title}</h3>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">{bullet.desc}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Real Interactivo (Reutilizando KpiGrid, TrafficChart, SocialDistribution, DirectLinks y ConversionFunnel) */}
        <div className="rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-[#09090b] bg-slate-950 p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6" data-app-theme="dark">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Dashboard Interactivo SIF · Pasa el cursor sobre las gráficas y métricas
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#ddb225] border border-[#ddb225]/30 bg-[#ddb225]/10 px-2.5 py-0.5 rounded-full">
              {current.badge}
            </span>
          </div>

          {/* 1. KPIs Superiores */}
          <KpiGrid data={current.overview} />

          {/* 2. Gráfica de Tráfico en el Tiempo */}
          <TrafficChart data={current.traffic} />

          {/* 3. Comportamiento del Usuario + Embudo de Conversión */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <SocialDistribution data={current.socialDistribution} />
            <DirectLinks data={current.directLinks} />
            <ConversionFunnel data={current.funnel} />
          </div>
        </div>
      </div>
    </section>
  );
};
