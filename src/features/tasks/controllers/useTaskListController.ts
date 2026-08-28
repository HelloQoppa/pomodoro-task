import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchTasksList } from '../services/fetchTasksList';
import { saveTaskItem } from '../services/saveTaskItem';
import { toggleTaskStatus } from '../services/toggleTaskStatus';
import type { Task, TaskPriority } from '../types';

type UseTaskListControllerResult = {
  activeTasks: Task[];
  completedTasks: Task[];
  isCompletedSectionExpanded: boolean;
  isLoading: boolean;
  newTaskTitle: string;
  selectedPriority: TaskPriority;
  handleAddTask: () => void;
  handleChangeNewTaskTitle: (title: string) => void;
  handleCyclePriority: () => void;
  handleRefreshTasks: () => void;
  handleToggleCompletedSection: () => void;
  handleToggleTaskCompletion: (task: Task) => void;
};

const priorityOrder: readonly TaskPriority[] = ['MEDIUM', 'HIGH', 'LOW'];

export function useTaskListController(): UseTaskListControllerResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [selectedPriority, setSelectedPriority] =
    useState<TaskPriority>('MEDIUM');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompletedSectionExpanded, setIsCompletedSectionExpanded] =
    useState<boolean>(false);

  const loadTasks = useCallback(async (): Promise<void> => {
    const storedTasks = await fetchTasksList();
    setTasks(storedTasks);
    setIsLoading(false);
  }, []);

  useEffect((): void => {
    void loadTasks();
  }, [loadTasks]);

  const handleAddTask = useCallback((): void => {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle.length === 0) {
      return;
    }

    async function addTask(): Promise<void> {
      const savedTask = await saveTaskItem({
        title: trimmedTitle,
        priority: selectedPriority,
        estimatedPomodoros: 1,
      });
      setTasks((currentTasks): Task[] => [savedTask, ...currentTasks]);
      setNewTaskTitle('');
    }

    void addTask();
  }, [newTaskTitle, selectedPriority]);

  const handleToggleTaskCompletion = useCallback((task: Task): void => {
    const nextIsCompleted = !task.isCompleted;
    const completedAt = nextIsCompleted ? new Date().toISOString() : null;

    setTasks((currentTasks): Task[] =>
      currentTasks.map(
        (currentTask): Task =>
          currentTask.id === task.id
            ? { ...currentTask, isCompleted: nextIsCompleted, completedAt }
            : currentTask,
      ),
    );
    void toggleTaskStatus(task.id, nextIsCompleted);
  }, []);

  const handleCyclePriority = useCallback((): void => {
    const currentIndex = priorityOrder.indexOf(selectedPriority);
    const nextIndex = (currentIndex + 1) % priorityOrder.length;
    setSelectedPriority(priorityOrder[nextIndex] ?? 'MEDIUM');
  }, [selectedPriority]);

  const handleRefreshTasks = useCallback((): void => {
    setIsLoading(true);
    void loadTasks();
  }, [loadTasks]);

  const handleToggleCompletedSection = useCallback((): void => {
    setIsCompletedSectionExpanded((isExpanded): boolean => !isExpanded);
  }, []);

  const activeTasks = useMemo<Task[]>(
    (): Task[] => tasks.filter((task): boolean => !task.isCompleted),
    [tasks],
  );
  const completedTasks = useMemo<Task[]>(
    (): Task[] => tasks.filter((task): boolean => task.isCompleted),
    [tasks],
  );

  return {
    activeTasks,
    completedTasks,
    isCompletedSectionExpanded,
    isLoading,
    newTaskTitle,
    selectedPriority,
    handleAddTask,
    handleChangeNewTaskTitle: setNewTaskTitle,
    handleCyclePriority,
    handleRefreshTasks,
    handleToggleCompletedSection,
    handleToggleTaskCompletion,
  };
}
