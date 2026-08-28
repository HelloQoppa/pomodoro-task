import * as SQLite from 'expo-sqlite';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (databasePromise === null) {
    databasePromise = SQLite.openDatabaseAsync('focus-pulse.db');
  }

  return databasePromise;
}
