import { api } from './api';
import type { ApiResponse } from './careerService';
import { APPLICATION_TRACKING_MOCKS, type ApplicationStatus } from '../constants/mockData';

export interface ProjectProposalPayload {
  title: string;
  schemeId: string;
  schemeName?: string;
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
  budget: {
    category: string;
    description: string;
    quantity: number;
    unitCost: number;
    total: number;
  }[];
  activities: string;
  expectedOutcomes: string;
  declarationChecked: boolean;
}

export interface ApplicationItem {
  id: string;
  applicationId: string;
  title: string;
  schemeName: string;
  ngoName: string;
  status: string;
  submittedAt: string;
  grantRequested: string;
  grantRequestedAmount: number;
}

export const applicationService = {
  // 1. Fetch all applications (for Admin & Officers)
  getAllApplications: async (): Promise<ApplicationItem[]> => {
    try {
      const response = await api.get<ApiResponse<ApplicationItem[]>>('/Application');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (e) {
      console.warn('Backend /Application unavailable, using fallback', e);
    }
    return [
      {
        id: 'f2cdfd4d-8391-4a01-bf18-0288261e577a',
        applicationId: 'NGO-2026-00124',
        title: 'Mobile Healthcare Clinic Jharkhand Phase 2',
        schemeName: 'Mobile Medical Units (MMU) in Scheduled Areas',
        ngoName: 'Gramin Vikas Parishad',
        status: 'Sanctioned',
        submittedAt: '2026-08-20',
        grantRequested: '₹40.00 Lakhs',
        grantRequestedAmount: 4000000,
      },
    ];
  },

  // 2. Update Application Status (Sanction, DistrictReview, Approved, Rejected)
  updateStatus: async (
    id: string,
    status: 'ProposalSubmitted' | 'DistrictReview' | 'StateReview' | 'Approved' | 'Sanctioned' | 'Rejected',
    remarks?: string
  ): Promise<ApplicationItem> => {
    const url = `/Application/${id}/status?status=${status}${remarks ? `&remarks=${encodeURIComponent(remarks)}` : ''}`;
    const response = await api.patch<ApiResponse<ApplicationItem>>(url);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update application status.');
    }
    return response.data.data;
  },

  // 3. Delete Application (Admin Only)
  deleteApplication: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<boolean>>(`/Application/${id}`);
    return Boolean(response.data.success);
  },

  // 4. Track an application by ID
  trackApplication: async (applicationId: string): Promise<ApplicationStatus> => {
    try {
      const response = await api.get<ApiResponse<any>>(`/Application/track/${applicationId}`);
      if (response.data.success && response.data.data) {
        const d = response.data.data;
        return {
          applicationId: d.applicationId,
          ngoName: d.ngoName,
          schemeName: d.schemeName,
          status: d.status,
          updatedAt: d.updatedAt,
          steps: d.steps || [],
        };
      }
    } catch (e) {
      console.warn('Backend tracking endpoint error, checking local store', e);
    }

    const matched = APPLICATION_TRACKING_MOCKS.find(
      (app) => app.applicationId.toUpperCase() === applicationId.trim().toUpperCase()
    );
    if (!matched) {
      throw new Error(`Application with ID "${applicationId}" was not found. Please verify the ID and try again.`);
    }
    return matched;
  },

  // 5. Submit a project proposal
  submitProposal: async (payload: ProjectProposalPayload): Promise<{ success: boolean; applicationId: string }> => {
    if (!payload.title || !payload.schemeId || payload.budget.length === 0) {
      throw new Error('Please fill in the project title, select a scheme, and build a project budget.');
    }

    try {
      const response = await api.post<ApiResponse<any>>('/Application/submit', payload);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          applicationId: response.data.data.applicationId || response.data.data.applicationNumber,
        };
      }
    } catch (e: any) {
      console.warn('Backend submit failed or unavailable, using fallback', e);
      if (e.message && !e.message.includes('Network Error')) {
        throw e;
      }
    }

    // Fallback simulation
    const randomNum = Math.floor(100 + Math.random() * 900);
    const applicationId = `NGO-2026-00${randomNum}`;
    APPLICATION_TRACKING_MOCKS.push({
      applicationId,
      ngoName: 'Vikas Kalyan Sansthan',
      schemeName: payload.schemeName || 'State Grant Scheme',
      status: 'Proposal Submitted',
      updatedAt: new Date().toISOString().split('T')[0],
      steps: [
        { name: 'Registered', status: 'completed', date: new Date().toISOString().split('T')[0] },
        { name: 'Proposal Submitted', status: 'completed', date: new Date().toISOString().split('T')[0], remarks: 'Project Proposal submitted via online portal.' },
        { name: 'District Review', status: 'current', remarks: 'Awaiting inspection scheduler allocation.' },
        { name: 'State Review', status: 'pending' },
        { name: 'Approved', status: 'pending' },
        { name: 'Sanctioned', status: 'pending' },
      ],
    });

    return { success: true, applicationId };
  },

  // 6. Fetch all applications submitted by a specific NGO
  fetchNGOApplications: async (ngoId: string): Promise<ApplicationItem[]> => {
    try {
      const response = await api.get<ApiResponse<ApplicationItem[]>>(`/Application/ngo/${ngoId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (e) {
      console.warn('Error fetching NGO applications', e);
    }
    return [
      {
        id: 'f2cdfd4d-8391-4a01-bf18-0288261e577a',
        applicationId: 'NGO-2026-00124',
        title: 'Mobile Healthcare Clinic Jharkhand Phase 2',
        schemeName: 'Mobile Medical Units (MMU) in Scheduled Areas',
        ngoName: 'Gramin Vikas Parishad',
        status: 'Sanctioned',
        submittedAt: '2026-08-20',
        grantRequested: '₹40.00 Lakhs',
        grantRequestedAmount: 4000000,
      },
    ];
  },
};
