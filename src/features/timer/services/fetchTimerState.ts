import { keyValueStorage } from '@/services/storage/keyValueStorage';

import type { PersistedTimerState, TimerMode } from '../types';

export const timerStateStorageKey = 'focus-pulse:timer-state';

function isTimerMode(value: unknown): value is TimerMode {
  return value === 'FOCUS' || value === 'SHORT_BREAK' || value === 'LONG_BREAK';
}

function isPersistedTimerState(value: unknown): value is PersistedTimerState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'mode' in value &&
    isTimerMode(value.mode) &&
    'cycle' in value &&
    typeof value.cycle === 'number' &&
    'remainingSeconds' in value &&
    typeof value.remainingSeconds === 'number' &&
    'targetEndAt' in value &&
    (typeof value.targetEndAt === 'number' || value.targetEndAt === null) &&
    'taskId' in value &&
    (typeof value.taskId === 'string' || value.taskId === null) &&
    'taskTitle' in value &&
    (typeof value.taskTitle === 'string' || value.taskTitle === null)
  );
}

export async function fetchTimerState(): Promise<PersistedTimerState | null> {
  const storedState = await keyValueStorage.getString(timerStateStorageKey);

  if (storedState === null) {
    return null;
  }

  try {
    const parsedState: unknown = JSON.parse(storedState);
    return isPersistedTimerState(parsedState) ? parsedState : null;
  } catch {
    return null;
  }
}
