import { getDatabase } from '@/services/database/database';

import type { TimerMode } from '../types';

type SavePomodoroSessionInput = {
  durationInSeconds: number;
  interrupted: boolean;
  taskId: string | null;
  type: TimerMode;
};

function createSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function savePomodoroSession({
  durationInSeconds,
  interrupted,
  taskId,
  type,
}: SavePomodoroSessionInput): Promise<void> {
  const database = await getDatabase();

  await database.runAsync(
    `INSERT INTO pomodoro_sessions (
      id, task_id, type, duration_in_seconds, completed_at, interrupted
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    createSessionId(),
    taskId,
    type,
    durationInSeconds,
    new Date().toISOString(),
    interrupted ? 1 : 0,
  );

  if (type === 'FOCUS' && taskId !== null && !interrupted) {
    await database.runAsync(
      `UPDATE tasks
       SET completed_pomodoros = completed_pomodoros + 1
       WHERE id = ?`,
      taskId,
    );
  }
}
