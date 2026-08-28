import { keyValueStorage } from '@/services/storage/keyValueStorage';

import type { TimerConfig } from '../types';

const userSettingsStorageKey = 'focus-pulse:user-settings';

const defaultTimerConfig: TimerConfig = {
  focusDurationInSeconds: 25 * 60,
  shortBreakDurationInSeconds: 5 * 60,
  longBreakDurationInSeconds: 15 * 60,
  cyclesPerSession: 4,
  shouldAutoStartNextCycle: true,
};

function numberProperty(
  object: Record<string, unknown>,
  property: string,
  fallback: number,
): number {
  const value = object[property];
  return typeof value === 'number' && value > 0 ? value : fallback;
}

export async function fetchTimerConfig(): Promise<TimerConfig> {
  const storedSettings = await keyValueStorage.getString(userSettingsStorageKey);

  if (storedSettings === null) {
    return defaultTimerConfig;
  }

  try {
    const parsedSettings: unknown = JSON.parse(storedSettings);
    if (typeof parsedSettings !== 'object' || parsedSettings === null) {
      return defaultTimerConfig;
    }

    const settingsRecord = parsedSettings as Record<string, unknown>;
    return {
      focusDurationInSeconds:
        numberProperty(settingsRecord, 'focusDuration', 25) * 60,
      shortBreakDurationInSeconds:
        numberProperty(settingsRecord, 'shortBreakDuration', 5) * 60,
      longBreakDurationInSeconds:
        numberProperty(settingsRecord, 'longBreakDuration', 15) * 60,
      cyclesPerSession: Math.round(
        numberProperty(settingsRecord, 'cyclesPerSession', 4),
      ),
      shouldAutoStartNextCycle:
        typeof settingsRecord.shouldAutoStartNextCycle === 'boolean'
          ? settingsRecord.shouldAutoStartNextCycle
          : true,
    };
  } catch {
    return defaultTimerConfig;
  }
}
