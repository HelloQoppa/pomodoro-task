import { keyValueStorage } from '@/services/storage/keyValueStorage';

import { defaultUserSettings, type UserSettings } from '../types';

export const userSettingsStorageKey = 'focus-pulse:user-settings';

function isUserSettings(value: unknown): value is UserSettings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'focusDuration' in value &&
    typeof value.focusDuration === 'number' &&
    'shortBreakDuration' in value &&
    typeof value.shortBreakDuration === 'number' &&
    'longBreakDuration' in value &&
    typeof value.longBreakDuration === 'number' &&
    'cyclesPerSession' in value &&
    typeof value.cyclesPerSession === 'number' &&
    'theme' in value &&
    (value.theme === 'light' || value.theme === 'dark') &&
    'alarmSound' in value &&
    (value.alarmSound === 'default' ||
      value.alarmSound === 'soft' ||
      value.alarmSound === 'digital') &&
    'shouldAutoStartNextCycle' in value &&
    typeof value.shouldAutoStartNextCycle === 'boolean'
  );
}

export async function fetchUserSettings(): Promise<UserSettings> {
  const storedSettings = await keyValueStorage.getString(userSettingsStorageKey);

  if (storedSettings === null) {
    return defaultUserSettings;
  }

  try {
    const parsedSettings: unknown = JSON.parse(storedSettings);
    return isUserSettings(parsedSettings) ? parsedSettings : defaultUserSettings;
  } catch {
    return defaultUserSettings;
  }
}
