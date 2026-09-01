import { api } from './api';
import type { ApiResponse } from './careerService';

export interface MonthlyGrantTrend {
  month: string;
  amount: number;
  projects: number;
}

export interface SectorDistribution {
  sector: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface StateWiseProject {
  state: string;
  projects: number;
  grantsCr: number;
}

export interface DashboardStats {
  totalNGOs: number;
  activeProjects: number;
  totalGrantsSanctionedCr: number;
  totalGrantsDisbursedCr: number;
  totalBeneficiaries: number;
  totalJobs: number;
  totalApplications: number;
  monthlyTrends: MonthlyGrantTrend[];
  sectorDistribution: SectorDistribution[];
  stateWiseDistribution: StateWiseProject[];
}

export const dashboardService = {
  getStats: async (year?: string, state?: string): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/Dashboard/stats', {
      params: { year, state },
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch dashboard statistics.');
    }
    return response.data.data;
  },
};
