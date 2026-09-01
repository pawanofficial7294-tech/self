import { api } from './api';
import { type UserSession, type UserRole } from '../context/AuthContext';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}

interface LoginApiData {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  darpanId?: string | null;
  officerId?: string | null;
  token: string;
  permissions: {
    canUploadImages: boolean;
    canPostJobs: boolean;
    canSubmitProjects: boolean;
    canManageSchemes: boolean;
    canManageUsers: boolean;
  };
}

export const authService = {
  // Login NGO, Officer, or Admin
  login: async (loginId: string, securityCode: string, role: UserRole): Promise<UserSession> => {
    if (!loginId || !securityCode) {
      throw new Error('Please fill in both Login ID and Password fields.');
    }

    const roleNumber = role === 'ADMIN' ? 3 : role === 'OFFICER' ? 2 : 1;

    const response = await api.post<ApiResponse<LoginApiData>>('/Auth/login', {
      loginId: loginId.trim(),
      securityCode: securityCode,
      role: roleNumber,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed. Please verify credentials.');
    }

    const d = response.data.data;
    const session: UserSession = {
      id: d.id,
      username: d.username,
      name: d.name,
      email: d.email,
      role: (d.role.toUpperCase() as UserRole) || role,
      darpanId: d.darpanId || undefined,
      officerId: d.officerId || undefined,
      token: d.token,
      permissions: d.permissions,
    };

    return session;
  },

  // Reset password request
  requestPasswordReset: async (loginId: string, email: string): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>('/Auth/forgot-password', { loginId, email });
    return response.data.success;
  },

  // Verify and submit new password
  resetPassword: async (token: string, newPassword: string): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>('/Auth/reset-password', { token, newPassword });
    return response.data.success;
  },

  // Register Officer credentials
  registerOfficer: async (officerData: any): Promise<boolean> => {
    const response = await api.post<ApiResponse<any>>('/Auth/register', officerData);
    return response.data.success;
  }
};
