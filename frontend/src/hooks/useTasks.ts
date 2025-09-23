import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/api';
import type { Task, CreateTaskData, UpdateTaskData } from '@/types';
import toast from 'react-hot-toast';

export function useTasks(filters?: {
  projectId?: number;
  isCompleted?: boolean;
  priority?: 1 | 2 | 3 | 4;
}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.getTasks(filters),
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => tasksApi.createTask(data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskData }) => 
      tasksApi.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['tasks', updatedTask.id], updatedTask);
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksApi.completeTask(id),
    onSuccess: (completedTask) => {
      queryClient.setQueryData(['tasks', completedTask.id], completedTask);
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      toast.success('Task completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete task');
    },
  });
}

export function useUncompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksApi.uncompleteTask(id),
    onSuccess: (uncompletedTask) => {
      queryClient.setQueryData(['tasks', uncompletedTask.id], uncompletedTask);
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      toast.success('Task marked as incomplete');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark task as incomplete');
    },
  });
}