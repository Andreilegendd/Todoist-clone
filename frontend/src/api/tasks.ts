import apiClient from './client';
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

const transformTaskFromBackend = (backendTask: any): Task => ({
  id: backendTask.id,
  content: backendTask.title,
  description: backendTask.description,
  dueDate: backendTask.due_date,
  priority: backendTask.priority,
  projectId: backendTask.project_id,
  userId: backendTask.user_id,
  position: backendTask.sort_order,
  isCompleted: backendTask.completed,
  completedAt: backendTask.completed_at,
  createdAt: backendTask.created_at,
  updatedAt: backendTask.updated_at,
  labels: backendTask.labels,
  project: backendTask.project
});

export const tasksApi = {
  getTasks: async (params?: {
    projectId?: number;
    labelId?: number;
    isCompleted?: boolean;
    priority?: 1 | 2 | 3 | 4;
    dueDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Task>> => {
    const transformedParams: any = {};
    
    if (params?.projectId !== undefined) transformedParams.project_id = params.projectId;
    if (params?.labelId !== undefined) transformedParams.label_id = params.labelId;
    if (params?.isCompleted !== undefined) transformedParams.completed = params.isCompleted;
    if (params?.priority !== undefined) transformedParams.priority = params.priority;
    if (params?.dueDate !== undefined) transformedParams.due_date = params.dueDate;
    if (params?.page !== undefined) transformedParams.page = params.page;
    if (params?.limit !== undefined) transformedParams.limit = params.limit;
    
    const response = await apiClient.get<any>('/tasks', { params: transformedParams });
    
    const transformedData = {
      ...response.data,
      data: response.data.data.map(transformTaskFromBackend)
    };
    
    return transformedData;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<any>(`/tasks/${id}`);
    return transformTaskFromBackend(response.data.data);
  },

  createTask: async (data: CreateTaskData): Promise<Task> => {
    const transformedData = {
      title: data.content,
      description: data.description,
      due_date: data.dueDate,
      priority: data.priority,
      project_id: data.projectId,
      labels: data.labelIds || []
    };
    const response = await apiClient.post<any>('/tasks', transformedData);
    return transformTaskFromBackend(response.data.data);
  },

  updateTask: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const transformedData: any = {};
    
    if (data.content !== undefined) transformedData.title = data.content;
    if (data.description !== undefined) transformedData.description = data.description;
    if (data.dueDate !== undefined) transformedData.due_date = data.dueDate;
    if (data.priority !== undefined) transformedData.priority = data.priority;
    if (data.projectId !== undefined) transformedData.project_id = data.projectId;
    if (data.labelIds !== undefined) transformedData.labels = data.labelIds;
    if (data.isCompleted !== undefined) transformedData.completed = data.isCompleted;
    if (data.position !== undefined) transformedData.sort_order = data.position;
    
    const response = await apiClient.put<any>(`/tasks/${id}`, transformedData);
    return transformTaskFromBackend(response.data.data);
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  completeTask: async (id: number): Promise<Task> => {
    const response = await apiClient.patch<any>(`/tasks/${id}/complete`);
    return transformTaskFromBackend(response.data.data);
  },

  uncompleteTask: async (id: number): Promise<Task> => {
    const response = await apiClient.patch<any>(`/tasks/${id}/uncomplete`);
    return transformTaskFromBackend(response.data.data);
  },

  reorderTasks: async (tasks: { id: number; position: number }[]): Promise<void> => {
    await apiClient.patch('/tasks/reorder', { tasks });
  },
};