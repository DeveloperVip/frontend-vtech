import axios, { AxiosError } from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: normalise errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Network / timeout errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection and try again.',
      } as ApiErrorResponse);
    }
    return Promise.reject(error.response.data);
  },
);

export default apiClient;
