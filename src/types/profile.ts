// Tipo para el modelo del perfil de tarjeta de presentación

export interface ProfileData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  avatarUrl: string;
  linkedinUrl?: string;
}

/** Perfil de prueba para el Dashboard */
export const DEMO_PROFILE: ProfileData = {
  name: 'Isabel Rivera',
  title: 'Senior Investment Partner',
  company: 'Seguros Suárez',
  phone: '+593 999 692 453',
  email: 'isabel.rivera@empresa.com',
  location: 'Ambato, Ecuador',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
};
