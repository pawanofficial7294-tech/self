import { api } from './api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}

export interface JobDto {
  id: string;
  code: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  openings: number;
  deadline: string;
  shortDesc: string;
  responsibilities: string[];
  qualifications: string[];
  desirableSkills: string[];
  isActive?: boolean;
}

export interface CreateJobDto {
  code: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  openings: number;
  deadline: string;
  shortDesc: string;
  responsibilities: string[];
  qualifications: string[];
  desirableSkills: string[];
}

export interface CandidateDto {
  id: string;
  refNumber: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  qualification: string;
  experience: string;
  salaryExpected: string;
  resumeUrl?: string;
  resumeName?: string;
  coverLetter?: string;
  status: 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  appliedAt: string;
  languages?: string[];
}

export const careerService = {
  // Get all active jobs
  getAllJobs: async (department?: string, query?: string): Promise<JobDto[]> => {
    const params: Record<string, string> = {};
    if (department && department !== 'All') params.department = department;
    if (query) params.query = query;

    const response = await api.get<ApiResponse<JobDto[]>>('/Career', { params });
    return response.data.data || [];
  },

  // Get job by ID
  getJobById: async (id: string): Promise<JobDto> => {
    const response = await api.get<ApiResponse<JobDto>>(`/Career/${id}`);
    return response.data.data;
  },

  // Create new job posting (Admin / Users with CanPostJobs)
  createJob: async (job: CreateJobDto): Promise<JobDto> => {
    const response = await api.post<ApiResponse<JobDto>>('/Career', job);
    return response.data.data;
  },

  // Update existing job posting
  updateJob: async (id: string, job: CreateJobDto): Promise<JobDto> => {
    const response = await api.put<ApiResponse<JobDto>>(`/Career/${id}`, job);
    return response.data.data;
  },

  // Delete a job posting
  deleteJob: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<boolean>>(`/Career/${id}`);
    return response.data.data;
  },

  // Get all applicants (Admin / Users with CanPostJobs)
  getAllCandidates: async (): Promise<CandidateDto[]> => {
    const response = await api.get<ApiResponse<CandidateDto[]>>('/Candidate');
    return response.data.data || [];
  },

  // Shortlist or update status of candidate
  updateCandidateStatus: async (id: string, status: string): Promise<boolean> => {
    const response = await api.patch<ApiResponse<boolean>>(`/Candidate/${id}/status`, null, {
      params: { status },
    });
    return response.data.data;
  },

  // Candidate Application Submission
  apply: async (formData: FormData): Promise<CandidateDto> => {
    const response = await api.post<ApiResponse<CandidateDto>>('/Candidate/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
