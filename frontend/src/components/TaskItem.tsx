'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Calendar,
  Flag,
  Edit,
  Trash2,
  CheckCircle2,
  Circle
} from 'lucide-react';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onComplete?: (taskId: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskItem({ task, onComplete, onEdit, onDelete }: TaskItemProps) {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-500 border-red-500';
      case 2: return 'text-yellow-500 border-yellow-500';
      case 3: return 'text-blue-500 border-blue-500';
      default: return 'text-gray-400 border-gray-300';
    }
  };

  const getPriorityFlag = (priority: number) => {
    if (priority === 4) return null;
    return <Flag className={`w-4 h-4 ${getPriorityColor(priority)}`} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-EN', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <div
      className={`group flex items-start space-x-3 p-3 border-b border-gray-100 dark:border-gray-800 todoist-task ${task.isCompleted ? 'opacity-60' : ''
        }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <button
        onClick={() => onComplete?.(task.id)}
        className="mt-0.5 hover:scale-110 transition-transform"
      >
        {task.isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className={`w-5 h-5 hover:text-red-500 transition-colors ${getPriorityColor(task.priority)}`} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${task.isCompleted
                ? 'line-through text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-gray-100'
                }`}
            >
              {task.content}
            </p>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-3 mt-2">
              {task.dueDate && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}

              {getPriorityFlag(task.priority)}

              {task.project && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: task.project.color }}
                  />
                  <span>{task.project.name}</span>
                </div>
              )}

              {task.labels && task.labels.length > 0 && (
                <div className="flex items-center space-x-1">
                  {task.labels.map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${label.color}20`,
                        color: label.color
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {(showActions || false) && (
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={() => onEdit?.(task)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-gray-500" />
              </button>

              <button
                onClick={() => onDelete?.(task.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>

              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}