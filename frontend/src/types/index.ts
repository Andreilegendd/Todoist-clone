export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  name: string;
  color: string;
  userId: number;
  position: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
}

export interface Task {
  id: number;
  content: string;
  description?: string;
  dueDate?: string;
  priority: 1 | 2 | 3 | 4;
  projectId?: number;
  userId: number;
  position: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  labels?: Label[];
  project?: Project;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskLabel {
  id: number;
  taskId: number;
  labelId: number;
  createdAt: string;
  updatedAt: string;
  task?: Task;
  label?: Label;
}

export interface UserSession {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  user: User;
  token: string;
  expiresAt: string;
}

export interface CreateTaskData {
  content: string;
  description?: string;
  dueDate?: string;
  priority?: 1 | 2 | 3 | 4;
  projectId?: number;
  labelIds?: number[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  isCompleted?: boolean;
  position?: number;
}

export interface CreateProjectData {
  name: string;
  color: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  position?: number;
  isArchived?: boolean;
}

export interface CreateLabelData {
  name: string;
  color: string;
}

export interface UpdateLabelData extends Partial<CreateLabelData> {}

export interface SidebarState {
  isOpen: boolean;
  selectedProjectId?: number;
}

export interface TaskFilters {
  projectId?: number;
  labelIds?: number[];
  priority?: 1 | 2 | 3 | 4;
  isCompleted?: boolean;
  dueDate?: 'today' | 'week' | 'overdue';
}

export const AVAILABLE_COLORS = [
  '#dc4c3e',
  '#ff8c00',  
  '#fad000',
  '#7ecc49',
  '#4073ff',
  '#884dff',
  '#ff69b4',
  '#a0522d',
  '#b8b8b8',
] as const;

export type ColorOption = typeof AVAILABLE_COLORS[number];