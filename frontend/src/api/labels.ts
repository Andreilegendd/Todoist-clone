import apiClient from './client';
import type {
  Label,
  CreateLabelData,
  UpdateLabelData,
  ApiResponse,
} from '@/types';

export const labelsApi = {
  getLabels: async (): Promise<Label[]> => {
    const response = await apiClient.get<ApiResponse<Label[]>>('/labels');
    return response.data.data;
  },

  getLabel: async (id: number): Promise<Label> => {
    const response = await apiClient.get<ApiResponse<Label>>(`/labels/${id}`);
    return response.data.data;
  },

  createLabel: async (data: CreateLabelData): Promise<Label> => {
    const response = await apiClient.post<ApiResponse<Label>>('/labels', data);
    return response.data.data;
  },

  updateLabel: async (id: number, data: UpdateLabelData): Promise<Label> => {
    const response = await apiClient.put<ApiResponse<Label>>(`/labels/${id}`, data);
    return response.data.data;
  },

  deleteLabel: async (id: number): Promise<void> => {
    await apiClient.delete(`/labels/${id}`);
  },
};