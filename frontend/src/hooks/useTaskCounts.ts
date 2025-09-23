import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/api';

export function useTaskCounts() {
  const { data: todayCount = 0 } = useQuery({
    queryKey: ['task-count', 'today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await tasksApi.getTasks({ 
        isCompleted: false, 
        dueDate: today 
      });
      return response.data?.length || 0;
    },
    refetchInterval: 30000,
  });

  const { data: upcomingCount = 0 } = useQuery({
    queryKey: ['task-count', 'upcoming'],
    queryFn: async () => {
      const response = await tasksApi.getTasks({ 
        isCompleted: false, 
        dueDate: 'upcoming' 
      });
      return response.data?.length || 0;
    },
    refetchInterval: 30000,
  });

  const { data: inboxCount = 0 } = useQuery({
    queryKey: ['task-count', 'inbox'],
    queryFn: async () => {
      const response = await tasksApi.getTasks({ 
        isCompleted: false 
      });
      return response.data?.length || 0;
    },
    refetchInterval: 30000,
  });

  const { data: labelCounts = {} } = useQuery({
    queryKey: ['task-count', 'labels'],
    queryFn: async () => {
      const response = await tasksApi.getTasks({ 
        isCompleted: false 
      });
      const tasks = response.data || [];
      
      const counts: Record<number, number> = {};
      tasks.forEach(task => {
        if (task.labels && task.labels.length > 0) {
          task.labels.forEach(label => {
            counts[label.id] = (counts[label.id] || 0) + 1;
          });
        }
      });
      
      return counts;
    },
    refetchInterval: 30000,
  });

  return {
    todayCount,
    upcomingCount,
    inboxCount,
    labelCounts,
  };
}