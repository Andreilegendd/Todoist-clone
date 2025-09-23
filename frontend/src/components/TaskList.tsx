'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { CreateTaskModal } from './CreateTaskModal';
import { useLabels } from '@/hooks';
import type { Task, Project } from '@/types';

interface TaskListProps {
  tasks: Task[];
  title?: string;
  onTaskComplete?: (taskId: number) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: number) => void;
  projects: Project[];
  selectedProjectId?: number;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  title = 'Tasks',
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  projects,
  selectedProjectId,
  isLoading = false
}: TaskListProps) {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const { data: labels = [] } = useLabels();



  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-48"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">


        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No tasks
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first task to get started
            </p>
            <button
              onClick={() => setShowCreateTask(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        ) : (
          <div className="px-6">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onTaskComplete}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        projects={projects}
        labels={labels}
        selectedProjectId={selectedProjectId}
      />
    </div>
  );
}