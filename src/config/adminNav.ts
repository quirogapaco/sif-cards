import { LayoutDashboard, Layers, Users, Building2, CalendarClock, Settings, UserCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { UserRole } from '../types/database';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  /** Descripción corta para breadcrumb / tooltip */
  description: string;
  allowedRoles?: UserRole[];
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Métricas globales de la plataforma',
    allowedRoles: ['superadmin', 'org_admin', 'user'],
  },
  {
    id: 'cards',
    label: 'Lotes & Tarjetas NFC',
    path: '/admin/cards',
    icon: Layers,
    description: 'Gestión de inventario físico y números de serie',
    allowedRoles: ['superadmin', 'org_admin'],
  },
  {
    id: 'users',
    label: 'Clientes & Cuentas',
    path: '/admin/users',
    icon: Users,
    description: 'Usuarios particulares y corporativos',
    allowedRoles: ['superadmin'],
  },
  {
    id: 'organizations',
    label: 'Organizaciones B2B',
    path: '/admin/organizations',
    icon: Building2,
    description: 'Empresas asociadas y contratos',
    allowedRoles: ['superadmin'],
  },
  {
    id: 'renewals',
    label: 'Finanzas & Renovaciones',
    path: '/admin/renewals',
    icon: CalendarClock,
    description: 'Membresías activas y vencimientos',
    allowedRoles: ['superadmin'],
  },
  {
    id: 'settings',
    label: 'Configuración Global',
    path: '/admin/settings',
    icon: Settings,
    description: 'Ajustes de la plataforma y dominios',
    allowedRoles: ['superadmin'],
  },
  {
    id: 'profile',
    label: 'Mis Perfiles',
    path: '/admin/profile',
    icon: UserCircle,
    description: 'Edición de perfiles de tarjeta',
    allowedRoles: ['superadmin', 'org_admin', 'user'],
  },
];
