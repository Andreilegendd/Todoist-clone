'use client';

import { useState } from 'react';
import { Menu, X, Plus, Search, Bell, Settings } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/zustand';
import { useTheme } from 'next-themes';

export function Header() {
  const { user, clearAuth } = useAuthStore();
  const { sidebar, toggleSidebar } = useUIStore();
  const { theme, setTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    clearAuth();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-10">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebar.isOpen ? (
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <h1 className="text-xl font-bold text-red-600 dark:text-red-500">
          Todoist
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-4">
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, projects, and more..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          title="Add task"
        >
          <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          title="Toggle theme"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name || 'User'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}