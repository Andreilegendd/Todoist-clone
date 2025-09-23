import { create } from 'zustand';
import type { SidebarState, TaskFilters } from '@/types';

interface UIState {
  sidebar: SidebarState;
  taskFilters: TaskFilters;
  darkMode: boolean;
  
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSelectedProject: (projectId: number | undefined) => void;
  
  setTaskFilters: (filters: Partial<TaskFilters>) => void;
  clearTaskFilters: () => void;
  
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  sidebar: {
    isOpen: true,
    selectedProjectId: undefined,
  },
  taskFilters: {},
  darkMode: false,
  
  toggleSidebar: () => {
    const currentState = get().sidebar;
    set({
      sidebar: {
        ...currentState,
        isOpen: !currentState.isOpen,
      },
    });
  },
  
  setSidebarOpen: (isOpen: boolean) => {
    const currentState = get().sidebar;
    set({
      sidebar: {
        ...currentState,
        isOpen,
      },
    });
  },
  
  setSelectedProject: (projectId: number | undefined) => {
    const currentState = get().sidebar;
    set({
      sidebar: {
        ...currentState,
        selectedProjectId: projectId,
      },
    });
  },
  
  setTaskFilters: (filters: Partial<TaskFilters>) => {
    const currentFilters = get().taskFilters;
    set({
      taskFilters: {
        ...currentFilters,
        ...filters,
      },
    });
  },
  
  clearTaskFilters: () => {
    set({
      taskFilters: {},
    });
  },
  
  toggleDarkMode: () => {
    const currentDarkMode = get().darkMode;
    set({ darkMode: !currentDarkMode });
  },
  
  setDarkMode: (isDark: boolean) => {
    set({ darkMode: isDark });
  },
}));