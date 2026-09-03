export type UserRole = 'superadmin' | 'org_admin' | 'user';

export type SubscriptionStatus = 'active' | 'grace_period' | 'expired' | 'suspended';

export type CardStatus = 'unclaimed' | 'active' | 'inactive';

export type CardPhysicalType = 
  | 'matte-black-gold' 
  | 'matte-black-silver' 
  | 'matte-white-gold' 
  | 'matte-white-silver';

export interface ProfileData {
  avatar_url?: string;
  banner_url?: string;
  display_name: string;
  job_title: string;
  company: string;
  bio_description?: string;
  direct_contacts?: {
    whatsapp?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  social_links?: Array<{
    platform: string;
    url: string;
  }>;
  languages?: string[];
  education?: Array<{
    title: string;
    institution: string;
    period: string;
  }>;
  businesses?: Array<{
    name: string;
    description: string;
    url: string;
  }>;
}

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface User {
  id: string;
  org_id: string | null;
  role: UserRole;
  created_at: string;
  organization?: Organization | null;
}

export interface Profile {
  id: string;
  user_id: string | null;
  slug: string;
  template_type: string;
  theme_palette: string;
  data: ProfileData;
  created_at: string;
  updated_at: string;
  subscription_status: SubscriptionStatus;
  activated_at: string | null;
  expires_at: string | null;
}

export interface Batch {
  id: string;
  name: string;
  card_type: CardPhysicalType | string;
  total_quantity: number;
  notes: string | null;
  created_at: string;
  url_prefix: string | null;
  org_id: string | null;
  organization?: Organization | null;
}

export interface Card {
  id: string;
  token: string;
  status: CardStatus;
  user_id: string | null;
  profile_id: string | null;
  created_at: string;
  batch_id: string | null;
  serial_number: string | null;
  relative_path: string | null;
  batch?: Batch | null;
  profile?: Profile | null;
  user?: User | null;
}

export interface AnalyticsEvent {
  id: string;
  profile_id: string | null;
  event_type: 'nfc_tap' | 'qr_scan' | 'contact_download' | 'link_click' | string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type CardInsert = Omit<Card, 'id' | 'created_at' | 'serial_number'> & {
  id?: string;
  serial_number?: string;
};

export type BatchInsert = Omit<Batch, 'id' | 'created_at'> & {
  id?: string;
};