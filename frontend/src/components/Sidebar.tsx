'use client';

import { useState } from 'react';
import {
  Inbox,
  Calendar,
  CalendarDays,
  Filter,
  Plus,
  Hash,
  FolderOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useUIStore } from '@/zustand';
import { useLabels, useTaskCounts } from '@/hooks';
import { CreateProjectModal, CreateLabelModal } from '@/components';
import type { Project, Label } from '@/types';

interface SidebarProps {
  projects?: Project[];
  onProjectSelect?: (projectId: number | undefined) => void;
  onFilterSelect?: (filter: 'inbox' | 'today' | 'upcoming') => void;
  onLabelSelect?: (labelId: number | undefined) => void;
  selectedFilter?: string;
  selectedLabelId?: number;
}

export function Sidebar({
  projects = [],
  onProjectSelect,
  onFilterSelect,
  onLabelSelect,
  selectedFilter,
  selectedLabelId
}: SidebarProps) {
  const { sidebar } = useUIStore();
  const [showProjects, setShowProjects] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateLabel, setShowCreateLabel] = useState(false);

  const { data: labels = [] } = useLabels();
  const { todayCount, upcomingCount, inboxCount, labelCounts } = useTaskCounts();

  if (!sidebar.isOpen) {
    return null;
  }

  const menuItems = [
    {
      icon: Inbox,
      label: 'Inbox',
      count: inboxCount,
      id: 'inbox',
      onClick: () => {
        console.log('Inbox clicked');
        onFilterSelect?.('inbox');
      },
    },
    {
      icon: Calendar,
      label: 'Today',
      count: todayCount,
      id: 'today',
      onClick: () => {
        console.log('Today clicked');
        onFilterSelect?.('today');
      },
    },
    {
      icon: CalendarDays,
      label: 'Upcoming',
      count: upcomingCount,
      id: 'upcoming',
      onClick: () => {
        console.log('Upcoming clicked');
        onFilterSelect?.('upcoming');
      },
    },
    {
      icon: Filter,
      label: 'Filters & Labels',
      id: 'filters',
      onClick: () => onProjectSelect?.(undefined),
    },
  ];

  return (
    <aside className="w-80 todoist-sidebar flex-shrink-0 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1 mb-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors todoist-task ${selectedFilter === item.id || (sidebar.selectedProjectId === undefined && selectedFilter === undefined && item.id === 'inbox')
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mb-6">
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-2">
              {showProjects ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <FolderOpen className="w-4 h-4" />
              <span>Projects</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateProject(true);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Add project"
            >
              <Plus className="w-3 h-3" />
            </button>
          </button>

          {showProjects && (
            <div className="mt-2 space-y-1">
              {projects.length === 0 ? (
                <p className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No projects
                </p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onProjectSelect?.(project.id)}
                    className={`w-full flex items-center justify-between px-6 py-2 text-sm rounded-md transition-colors todoist-task ${sidebar.selectedProjectId === project.id
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span>{project.name}</span>
                    </div>
                    {project.taskCount && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.taskCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-2">
              {showLabels ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Hash className="w-4 h-4" />
              <span>Labels</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateLabel(true);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Add label"
            >
              <Plus className="w-3 h-3" />
            </button>
          </button>

          {showLabels && (
            <div className="mt-2 space-y-1">
              {labels.length === 0 ? (
                <p className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No labels
                </p>
              ) : (
                labels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => {
                      onLabelSelect?.(label.id);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-2 text-sm transition-colors rounded-md ${selectedLabelId === label.id
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      <span>{label.name}</span>
                    </div>
                    {labelCounts[label.id] > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {labelCounts[label.id]}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
      />

      <CreateLabelModal
        isOpen={showCreateLabel}
        onClose={() => setShowCreateLabel(false)}
      />
    </aside>
  );
}