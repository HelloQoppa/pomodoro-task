import { useCallback, useEffect, useState } from 'react';

import { useTheme } from '@/theme/ThemeProvider';

import { fetchUserSettings } from '../services/fetchUserSettings';
import { updateUserSettings } from '../services/updateUserSettings';
import {
  defaultUserSettings,
  type AlarmSound,
  type UserSettings,
} from '../types';

type DurationSetting =
  | 'focusDuration'
  | 'shortBreakDuration'
  | 'longBreakDuration';

type UseSettingsControllerResult = {
  isLoading: boolean;
  settings: UserSettings;
  handleChangeDuration: (setting: DurationSetting, value: number) => void;
  handleChangeCycles: (delta: number) => void;
  handleChangeTheme: (theme: UserSettings['theme']) => void;
  handleChangeAlarmSound: (sound: AlarmSound) => void;
  handleToggleAutoStart: (value: boolean) => void;
  handleRestoreDefaults: () => void;
};

export function useSettingsController(): UseSettingsControllerResult {
  const { setThemeName } = useTheme();
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): (() => void) => {
    let isMounted = true;

    async function loadSettings(): Promise<void> {
      const storedSettings = await fetchUserSettings();
      if (isMounted) {
        setSettings(storedSettings);
        setThemeName(storedSettings.theme);
        setIsLoading(false);
      }
    }

    void loadSettings();

    return (): void => {
      isMounted = false;
    };
  }, [setThemeName]);

  const persistSettings = useCallback((nextSettings: UserSettings): void => {
    setSettings(nextSettings);
    void updateUserSettings(nextSettings);
  }, []);

  const handleChangeDuration = useCallback(
    (setting: DurationSetting, value: number): void => {
      persistSettings({ ...settings, [setting]: Math.round(value) });
    },
    [persistSettings, settings],
  );

  const handleChangeCycles = useCallback(
    (delta: number): void => {
      const cyclesPerSession = Math.min(
        8,
        Math.max(1, settings.cyclesPerSession + delta),
      );
      persistSettings({ ...settings, cyclesPerSession });
    },
    [persistSettings, settings],
  );

  const handleChangeTheme = useCallback(
    (theme: UserSettings['theme']): void => {
      setThemeName(theme);
      persistSettings({ ...settings, theme });
    },
    [persistSettings, setThemeName, settings],
  );

  const handleChangeAlarmSound = useCallback(
    (alarmSound: AlarmSound): void => {
      persistSettings({ ...settings, alarmSound });
    },
    [persistSettings, settings],
  );

  const handleToggleAutoStart = useCallback(
    (shouldAutoStartNextCycle: boolean): void => {
      persistSettings({ ...settings, shouldAutoStartNextCycle });
    },
    [persistSettings, settings],
  );

  const handleRestoreDefaults = useCallback((): void => {
    setThemeName(defaultUserSettings.theme);
    persistSettings(defaultUserSettings);
  }, [persistSettings, setThemeName]);

  return {
    isLoading,
    settings,
    handleChangeDuration,
    handleChangeCycles,
    handleChangeTheme,
    handleChangeAlarmSound,
    handleToggleAutoStart,
    handleRestoreDefaults,
  };
}
