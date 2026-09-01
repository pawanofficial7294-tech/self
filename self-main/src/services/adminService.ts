import { api } from './api';
import { type ApiResponse } from './careerService';
import { type UserPermissions } from '../context/AuthContext';

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  darpanId?: string | null;
  officerId?: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  permissions: UserPermissions;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: number; // 1: NGO, 2: OFFICER, 3: ADMIN
  darpanId?: string;
  officerId?: string;
  canUploadImages: boolean;
  canPostJobs: boolean;
  canSubmitProjects: boolean;
  canManageSchemes: boolean;
  canManageUsers: boolean;
}

export interface UpdatePermissionsPayload {
  canUploadImages?: boolean;
  canPostJobs?: boolean;
  canSubmitProjects?: boolean;
  canManageSchemes?: boolean;
  canManageUsers?: boolean;
  isActive?: boolean;
}

export const adminService = {
  // Get all users
  getAllUsers: async (): Promise<UserSummary[]> => {
    const response = await api.get<ApiResponse<UserSummary[]>>('/Admin/users');
    return response.data.data || [];
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserSummary> => {
    const response = await api.get<ApiResponse<UserSummary>>(`/Admin/users/${id}`);
    return response.data.data;
  },

  // Create new user with assigned permissions
  createUser: async (payload: CreateUserPayload): Promise<UserSummary> => {
    const response = await api.post<ApiResponse<UserSummary>>('/Admin/users', payload);
    return response.data.data;
  },

  // Update user permissions / status
  updateUserPermissions: async (id: string, payload: UpdatePermissionsPayload): Promise<UserSummary> => {
    const response = await api.patch<ApiResponse<UserSummary>>(`/Admin/users/${id}/permissions`, payload);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<boolean>>(`/Admin/users/${id}`);
    return response.data.data;
  },
};
