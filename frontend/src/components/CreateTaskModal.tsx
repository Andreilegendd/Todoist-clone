'use client';

import { useState } from 'react';
import { X, Calendar, Flag, Tag, Inbox } from 'lucide-react';
import { useCreateTask } from '@/hooks';
import type { Project, Label } from '@/types';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    labels: Label[];
    selectedProjectId?: number;
}

const PRIORITY_OPTIONS = [
    { value: 1, label: 'P1', color: 'text-gray-600', flag: 'text-gray-400' },
    { value: 2, label: 'P2', color: 'text-blue-600', flag: 'text-blue-500' },
    { value: 3, label: 'P3', color: 'text-yellow-600', flag: 'text-yellow-500' },
    { value: 4, label: 'P4', color: 'text-red-600', flag: 'text-red-500' },
] as const;

export function CreateTaskModal({
    isOpen,
    onClose,
    projects,
    labels,
    selectedProjectId
}: CreateTaskModalProps) {
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<1 | 2 | 3 | 4>(1);
    const [projectId, setProjectId] = useState<number | undefined>(selectedProjectId);
    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);

    const createTaskMutation = useCreateTask();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            createTaskMutation.mutate({
                content: content.trim(),
                description: description.trim() || undefined,
                dueDate: dueDate || undefined,
                priority,
                projectId,
                labelIds: selectedLabels,
            }, {
                onSuccess: () => {
                    setContent('');
                    setDescription('');
                    setDueDate('');
                    setPriority(1);
                    setProjectId(selectedProjectId);
                    setSelectedLabels([]);
                    onClose();
                }
            });
        }
    };

    const toggleLabel = (labelId: number) => {
        setSelectedLabels(prev =>
            prev.includes(labelId)
                ? prev.filter(id => id !== labelId)
                : [...prev, labelId]
        );
    };

    const selectedProject = projects.find(p => p.id === projectId);
    const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority)!;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Add Task
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Task name"
                            className="w-full text-lg font-medium border-0 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            rows={3}
                            className="w-full border-0 outline-none bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 resize-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="relative">
                            <details className="group">
                                <summary className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors list-none">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">
                                        {dueDate ? new Date(dueDate).toLocaleDateString() : 'Schedule'}
                                    </span>
                                </summary>
                                <div className="absolute top-full left-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                    <div className="p-2 space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const today = new Date();
                                                setDueDate(today.toISOString().split('T')[0]);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                            Today
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                setDueDate(tomorrow.toISOString().split('T')[0]);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                            Tomorrow
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextWeek = new Date();
                                                nextWeek.setDate(nextWeek.getDate() + 7);
                                                setDueDate(nextWeek.toISOString().split('T')[0]);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                            Next week
                                        </button>
                                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                        <div className="px-3 py-2">
                                            <input
                                                type="date"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                        </div>
                                        {dueDate && (
                                            <button
                                                type="button"
                                                onClick={() => setDueDate('')}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                            >
                                                Remove date
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </details>
                        </div>

                        <div className="relative">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3 | 4)}
                                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md pl-8 pr-3 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[70px]"
                            >
                                {PRIORITY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Flag className={`w-4 h-4 ${selectedPriority.flag}`} />
                            </div>
                        </div>

                        {labels.length > 0 && (
                            <div className="relative">
                                <details className="group">
                                    <summary className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors list-none">
                                        <Tag className="w-4 h-4 text-purple-600" />
                                        <span className="text-purple-600">Labels</span>
                                    </summary>
                                    <div className="absolute top-full left-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                        {labels.map((label) => (
                                            <label
                                                key={label.id}
                                                className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLabels.includes(label.id)}
                                                    onChange={() => toggleLabel(label.id)}
                                                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                                                />
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: label.color }}
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {label.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <select
                            value={projectId || ''}
                            onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-transparent border-0 outline-none cursor-pointer"
                        >
                            <option value="">Inbox</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex-1" />

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!content.trim() || createTaskMutation.isPending}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {createTaskMutation.isPending ? 'Adding...' : 'Add task'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}