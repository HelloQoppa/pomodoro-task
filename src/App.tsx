import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from '@/navigation/AppNavigator';
import { runDatabaseMigrations } from '@/services/database/migrationRunner';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

type BootstrapStatus = 'loading' | 'ready' | 'error';

function AppBootstrap(): React.JSX.Element {
  const { colors, themeName } = useTheme();
  const [status, setStatus] = useState<BootstrapStatus>('loading');

  useEffect((): (() => void) => {
    let isMounted = true;

    async function initializeApplication(): Promise<void> {
      try {
        await runDatabaseMigrations();
        if (isMounted) {
          setStatus('ready');
        }
      } catch {
        if (isMounted) {
          setStatus('error');
        }
      }
    }

    void initializeApplication();

    return (): void => {
      isMounted = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Preparando seu foco</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Não foi possível iniciar</Text>
        <Text style={[styles.errorMessage, { color: colors.textMuted }]}>Feche e abra o aplicativo para tentar novamente.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppBootstrap />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 32,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 21,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 15,
  },
});
