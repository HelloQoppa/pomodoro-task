import { getDatabase } from '@/services/database/database';

export async function toggleTaskStatus(
  taskId: string,
  isCompleted: boolean,
): Promise<void> {
  const database = await getDatabase();
  const completedAt = isCompleted ? new Date().toISOString() : null;

  await database.runAsync(
    `UPDATE tasks
     SET is_completed = ?, completed_at = ?
     WHERE id = ?`,
    isCompleted ? 1 : 0,
    completedAt,
    taskId,
  );
}
