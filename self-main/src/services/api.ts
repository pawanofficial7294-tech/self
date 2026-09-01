import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Load base API URL from Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-ngo-grants.example.gov.in/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const sessionStr = localStorage.getItem('gov-portal-session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }
      } catch (e) {
        console.error('Error parsing token from session store', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors and token expiry
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest?.url?.toLowerCase().includes('/auth/login');
    
    // On 401 for authenticated requests (not login), log out
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('gov-portal-session');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Standardized Global Error Messages from ApiResponse
    let errorMessage = 'Unable to load the requested information. Please try again.';
    if (error.response) {
      const data = error.response.data as any;
      if (data?.message) {
        errorMessage = data.message;
      } else if (Array.isArray(data?.errors) && data.errors.length > 0) {
        errorMessage = data.errors.join(', ');
      } else {
        errorMessage = `Server Error (${error.response.status}): Request failed.`;
      }
    } else if (error.request) {
      errorMessage = 'Network connection failed. Please ensure the backend server is running.';
    }

    if (!isLoginRequest) {
      console.error('API Call Error:', errorMessage, error);
    } else {
      console.warn('Login Notice:', errorMessage);
    }
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper for multipart/form-data uploads
export const uploadApiConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
