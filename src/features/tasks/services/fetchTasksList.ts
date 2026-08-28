import { getDatabase } from '@/services/database/database';

import type { Task, TaskPriority } from '../types';

type TaskRow = {
  id: string;
  title: string;
  priority: TaskPriority;
  estimated_pomodoros: number;
  completed_pomodoros: number;
  is_completed: number;
  created_at: string;
  completed_at: string | null;
};

function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    estimatedPomodoros: row.estimated_pomodoros,
    completedPomodoros: row.completed_pomodoros,
    isCompleted: row.is_completed === 1,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export async function fetchTasksList(): Promise<Task[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<TaskRow>(
    `SELECT
      id, title, priority, estimated_pomodoros, completed_pomodoros,
      is_completed, created_at, completed_at
    FROM tasks
    ORDER BY is_completed ASC, created_at DESC`,
  );

  return rows.map(mapTaskRow);
}
