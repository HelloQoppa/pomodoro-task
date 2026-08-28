export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
};

export type CreateTaskInput = {
  title: string;
  priority: TaskPriority;
  estimatedPomodoros: number;
};
