'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Header, Sidebar, TaskList } from '@/components';
import { useAuthStore, useUIStore } from '@/zustand';
import { tasksApi, projectsApi } from '@/api';
import { useCreateTask, useUpdateTask, useDeleteTask, useCompleteTask } from '@/hooks/useTasks';
import { useLabels } from '@/hooks';
import { Toaster } from 'react-hot-toast';

export default function AppPage() {
  const { isAuthenticated, user, token, isHydrated } = useAuthStore();
  const { sidebar, setSelectedProject } = useUIStore();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'inbox' | 'today' | 'upcoming' | undefined>('inbox');
  const [selectedLabelId, setSelectedLabelId] = useState<number | undefined>();

  useEffect(() => {
    console.log('selectedFilter changed to:', selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    console.log('State changed:', {
      selectedFilter,
      selectedProjectId: sidebar.selectedProjectId,
      selectedLabelId
    });
  }, [selectedFilter, sidebar.selectedProjectId, selectedLabelId]);

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const completeTaskMutation = useCompleteTask();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
    enabled: isAuthenticated && isHydrated,
  });

  const { data: labels = [] } = useLabels();

  const getTaskFilterParams = () => {
    const baseParams = { isCompleted: false };

    if (sidebar.selectedProjectId) {
      const params = { ...baseParams, projectId: sidebar.selectedProjectId };
      console.log('Returning project filter params:', params);
      return params;
    }

    if (selectedLabelId) {
      const params = { ...baseParams, labelId: selectedLabelId };
      console.log('Returning label filter params:', params);
      return params;
    }

    switch (selectedFilter) {
      case 'today': {
        const today = new Date().toISOString().split('T')[0];
        const params = { ...baseParams, dueDate: today };
        return params;
      }
      case 'upcoming': {
        const params = { ...baseParams, dueDate: 'upcoming' };
        return params;
      }
      case 'inbox':
      default:
        const params = { ...baseParams, projectId: undefined };
        return params;
    }
  };

  const { data: tasksResponse, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', sidebar.selectedProjectId, selectedFilter, selectedLabelId],
    queryFn: () => tasksApi.getTasks(getTaskFilterParams()),
    enabled: isAuthenticated && isHydrated,
  });

  const pageTitle = useMemo(() => {
    console.log('pageTitle useMemo values:', {
      selectedProjectId: sidebar.selectedProjectId,
      selectedLabelId,
      selectedFilter
    });

    if (sidebar.selectedProjectId) {
      const project = projects.find(p => p.id === sidebar.selectedProjectId);
      return project?.name || 'Project';
    }

    if (selectedLabelId) {
      const label = labels.find(l => l.id === selectedLabelId);
      return label?.name || 'Label';
    }

    switch (selectedFilter) {
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      case 'inbox':
      default:
        return 'Inbox';
    }
  }, [sidebar.selectedProjectId, selectedLabelId, selectedFilter, projects, labels]);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  const tasks = tasksResponse?.data || [];

  const handleProjectSelect = (projectId: number | undefined) => {
    setSelectedProject(projectId);
    setSelectedFilter(undefined);
    setSelectedLabelId(undefined);
  };

  const handleFilterSelect = (filter: 'inbox' | 'today' | 'upcoming') => {
    console.log('handleFilterSelect called with:', filter);
    console.log('Before state updates - current states:', {
      selectedFilter,
      selectedProjectId: sidebar.selectedProjectId,
      selectedLabelId
    });

    setSelectedFilter(prevFilter => {
      console.log('setSelectedFilter: changing from', prevFilter, 'to', filter);
      return filter;
    });

    setSelectedProject(undefined);
    setSelectedLabelId(undefined);

    console.log('handleFilterSelect completed - state updates scheduled');
  };

  const handleLabelSelect = (labelId: number | undefined) => {
    console.log('handleLabelSelect called with labelId:', labelId);
    console.log('Before state updates - selectedLabelId:', selectedLabelId);

    setSelectedLabelId(labelId);
    setSelectedProject(undefined);
    setSelectedFilter(undefined);

    console.log('handleLabelSelect completed - state updates scheduled');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          projects={projects}
          onProjectSelect={handleProjectSelect}
          onFilterSelect={handleFilterSelect}
          onLabelSelect={handleLabelSelect}
          selectedFilter={selectedFilter}
          selectedLabelId={selectedLabelId}
        />

        <main className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          <TaskList
            tasks={tasks}
            title={pageTitle}
            isLoading={isLoadingTasks}
            projects={projects}
            selectedProjectId={sidebar.selectedProjectId}
            onTaskComplete={(taskId) => {
              completeTaskMutation.mutate(taskId);
            }}
            onTaskEdit={(task) => {
              const newContent = prompt('Edit task:', task.content);
              if (newContent && newContent.trim() !== task.content) {
                updateTaskMutation.mutate({
                  id: task.id,
                  data: { content: newContent.trim() }
                });
              }
            }}
            onTaskDelete={(taskId) => {
              if (confirm('Are you sure you want to delete this task?')) {
                deleteTaskMutation.mutate(taskId);
              }
            }}
          />
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
}