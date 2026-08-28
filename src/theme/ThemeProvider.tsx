import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { keyValueStorage } from '@/services/storage/keyValueStorage';

import { getAppColors, type AppColors, type AppThemeName } from './colors';

const settingsStorageKey = 'focus-pulse:user-settings';

type ThemeContextValue = {
  colors: AppColors;
  themeName: AppThemeName;
  setThemeName: (themeName: AppThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isStoredTheme(value: unknown): value is { theme: AppThemeName } {
  if (typeof value !== 'object' || value === null || !('theme' in value)) {
    return false;
  }

  const theme = value.theme;
  return theme === 'light' || theme === 'dark';
}

export function ThemeProvider({ children }: PropsWithChildren): React.JSX.Element {
  const systemTheme = useColorScheme();
  const [themeName, setThemeNameState] = useState<AppThemeName>(
    systemTheme === 'dark' ? 'dark' : 'light',
  );

  useEffect((): (() => void) => {
    let isMounted = true;

    async function loadTheme(): Promise<void> {
      const storedSettings = await keyValueStorage.getString(settingsStorageKey);

      if (storedSettings === null || !isMounted) {
        return;
      }

      try {
        const parsedSettings: unknown = JSON.parse(storedSettings);
        if (isStoredTheme(parsedSettings)) {
          setThemeNameState(parsedSettings.theme);
        }
      } catch {
        // Invalid settings are ignored and replaced on the next save.
      }
    }

    void loadTheme();

    return (): void => {
      isMounted = false;
    };
  }, []);

  const setThemeName = useCallback((nextThemeName: AppThemeName): void => {
    setThemeNameState(nextThemeName);
  }, []);

  const value = useMemo<ThemeContextValue>(
    (): ThemeContextValue => ({
      colors: getAppColors(themeName),
      themeName,
      setThemeName,
    }),
    [setThemeName, themeName],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return context;
}
