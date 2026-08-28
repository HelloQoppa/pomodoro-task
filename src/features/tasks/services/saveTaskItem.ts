import { getDatabase } from '@/services/database/database';

import type { CreateTaskInput, Task } from '../types';

function createTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function saveTaskItem(input: CreateTaskInput): Promise<Task> {
  const database = await getDatabase();
  const task: Task = {
    id: createTaskId(),
    title: input.title.trim(),
    priority: input.priority,
    estimatedPomodoros: input.estimatedPomodoros,
    completedPomodoros: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  await database.runAsync(
    `INSERT INTO tasks (
      id, title, priority, estimated_pomodoros,
      completed_pomodoros, is_completed, created_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    task.id,
    task.title,
    task.priority,
    task.estimatedPomodoros,
    task.completedPomodoros,
    0,
    task.createdAt,
    null,
  );

  return task;
}
