import { LayoutDashboard, Layers, Users, Building2, CalendarClock, Settings, FlaskConical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  /** Descripción corta para breadcrumb / tooltip */
  description: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Métricas globales de la plataforma',
  },
  {
    id: 'cards',
    label: 'Lotes & Tarjetas NFC',
    path: '/admin/cards',
    icon: Layers,
    description: 'Gestión de inventario físico y números de serie',
  },
  {
    id: 'users',
    label: 'Clientes & Cuentas',
    path: '/admin/users',
    icon: Users,
    description: 'Usuarios particulares y corporativos',
  },
  {
    id: 'organizations',
    label: 'Organizaciones B2B',
    path: '/admin/organizations',
    icon: Building2,
    description: 'Empresas asociadas y contratos',
  },
  {
    id: 'renewals',
    label: 'Finanzas & Renovaciones',
    path: '/admin/renewals',
    icon: CalendarClock,
    description: 'Membresías activas y vencimientos',
  },
  {
    id: 'settings',
    label: 'Configuración Global',
    path: '/admin/settings',
    icon: Settings,
    description: 'Ajustes de la plataforma y dominios',
  },
  {
    id: 'prueba',
    label: 'Prueba de Tarjetas',
    path: '/admin/prueba',
    icon: FlaskConical,
    description: 'Previsualización de temas de tarjeta',
  },
];
