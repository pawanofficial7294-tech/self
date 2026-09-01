import { api } from './api';
import type { ApiResponse } from './careerService';

export interface NgoProfileData {
  id: string;
  name: string;
  registrationNumber: string;
  panNumber: string;
  darpanId: string;
  state: string;
  district: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  complianceStatus: string;
  isVerified: boolean;
}

export interface UserPermissions {
  canUploadImages: boolean;
  canPostJobs: boolean;
  canSubmitProjects: boolean;
  canManageSchemes: boolean;
  canManageUsers: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'OFFICER' | 'NGO';
  darpanId?: string | null;
  officerId?: string | null;
  ngoId?: string | null;
  ngo?: NgoProfileData | null;
  permissions: UserPermissions;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
}

export interface ProjectDocUploadPayload {
  title: string;
  type: string;
  year?: string;
  file: File;
}

export interface DirectProjectPayload {
  title: string;
  schemeId: string;
  schemeName: string;
  abstract: string;
  state: string;
  district: string;
  block?: string;
  villages?: string;
  beneficiaries: {
    maleCount: number;
    femaleCount: number;
    totalCount: number;
    stCount: number;
  };
  budget: Array<{
    category: string;
    description: string;
    quantity: number;
    unitCost: number;
    total: number;
  }>;
  activities: string;
  expectedOutcomes: string;
  declarationChecked: boolean;
}

export const profileService = {
  // Fetch current user's profile from /api/Auth/profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<ApiResponse<UserProfile>>('/Auth/profile');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user profile.');
    }
    return response.data.data;
  },

  // Update current user profile
  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await api.put<ApiResponse<UserProfile>>('/Auth/profile', payload);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update profile.');
    }
    return response.data.data;
  },

  // Upload Project PDF / Completion Report / News & Circular
  uploadDocumentOrNews: async (payload: ProjectDocUploadPayload): Promise<any> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('type', payload.type);
    formData.append('year', payload.year || new Date().getFullYear().toString());
    formData.append('file', payload.file);

    const response = await api.post<ApiResponse<any>>('/Resource', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Document upload failed.');
    }
    return response.data.data;
  },

  // Post / Submit Project directly (Admin or NGO)
  submitProject: async (payload: DirectProjectPayload, ngoId?: string): Promise<any> => {
    const url = ngoId ? `/Application/submit?ngoId=${ngoId}` : '/Application/submit';
    const response = await api.post<ApiResponse<any>>(url, payload);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Project submission failed.');
    }
    return response.data.data;
  },
};
