import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labelsApi } from '@/api';
import type { Label, CreateLabelData, UpdateLabelData } from '@/types';
import toast from 'react-hot-toast';

export function useLabels() {
  return useQuery({
    queryKey: ['labels'],
    queryFn: labelsApi.getLabels,
  });
}

export function useLabel(id: number) {
  return useQuery({
    queryKey: ['labels', id],
    queryFn: () => labelsApi.getLabel(id),
    enabled: !!id,
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabelData) => labelsApi.createLabel(data),
    onSuccess: (newLabel) => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('Label created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create label');
    },
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLabelData }) => 
      labelsApi.updateLabel(id, data),
    onSuccess: (updatedLabel) => {
      queryClient.setQueryData(['labels', updatedLabel.id], updatedLabel);
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('Label updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update label');
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => labelsApi.deleteLabel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('Label deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete label');
    },
  });
}