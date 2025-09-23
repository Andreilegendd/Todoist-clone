import apiClient from './client';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthUser,
  ApiResponse,
} from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    const response = await apiClient.post<ApiResponse<AuthUser>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthUser> => {
    const response = await apiClient.post<ApiResponse<AuthUser>>('/auth/register', credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<AuthUser> => {
    const response = await apiClient.post<ApiResponse<AuthUser>>('/auth/refresh');
    return response.data.data;
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    return response.data.data;
  },
};