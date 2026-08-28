import { getDatabase } from './database';

const databaseVersion = 2;

export async function runDatabaseMigrations(): Promise<void> {
  const database = await getDatabase();
  const versionRow = await database.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  const currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion >= databaseVersion) {
    return;
  }

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
      estimated_pomodoros INTEGER NOT NULL DEFAULT 1,
      completed_pomodoros INTEGER NOT NULL DEFAULT 0,
      is_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS pomodoro_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT,
      type TEXT NOT NULL CHECK (type IN ('FOCUS', 'SHORT_BREAK', 'LONG_BREAK')),
      duration_in_seconds INTEGER NOT NULL,
      completed_at TEXT NOT NULL,
      interrupted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_completed_at
      ON pomodoro_sessions(completed_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_task_id
      ON pomodoro_sessions(task_id);

    DELETE FROM tasks
      WHERE id IN (
        'seed-task-landing-page',
        'seed-task-reports',
        'seed-task-sprint'
      );

    PRAGMA user_version = ${databaseVersion};
  `);
}
