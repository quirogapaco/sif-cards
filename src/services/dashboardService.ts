import { userService, type TeamMember } from './userService';
import { profileService } from './profileService';

export const dashboardService = {
  /**
   * Obtiene la lista de usuarios y sus perfiles anidados para un administrador de organización.
   * Reutiliza la consulta optimizada de userService.
   */
  async getAdminFilterOptions(orgId: string): Promise<TeamMember[]> {
    try {
      return await userService.getOrganizationTeam(orgId);
    } catch (error) {
      console.error('Error fetching admin filter options:', error);
      return [];
    }
  },

  /**
   * Obtiene la lista de perfiles disponibles para un usuario estándar.
   * Reutiliza la consulta optimizada de profileService.
   */
  async getUserFilterOptions(userId: string): Promise<{ id: string; display_name: string }[]> {
    try {
      return await profileService.getUserProfileOptions(userId);
    } catch (error) {
      console.error('Error fetching user filter options:', error);
      return [];
    }
  }
};
