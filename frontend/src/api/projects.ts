import apiClient from './client';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ApiResponse,
} from '@/types';

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  },

  updateProject: async (id: number, data: UpdateProjectData): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  archiveProject: async (id: number): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/archive`);
    return response.data.data;
  },

  unarchiveProject: async (id: number): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/unarchive`);
    return response.data.data;
  },

  reorderProjects: async (projects: { id: number; position: number }[]): Promise<void> => {
    await apiClient.patch('/projects/reorder', { projects });
  },
};