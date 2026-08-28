import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import type { RootTabParamList } from '@/types/navigation';

import { TimerClockDisplay } from '../components/TimerClockDisplay';
import { TimerControls } from '../components/TimerControls';
import { TimerProgressRing } from '../components/TimerProgressRing';
import { usePomodoroTimerController } from '../controllers/usePomodoroTimerController';

type TimerScreenProps = BottomTabScreenProps<RootTabParamList, 'Timer'>;

export function TimerScreen({ route }: TimerScreenProps): React.JSX.Element {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const controller = usePomodoroTimerController({
    ...(route.params?.taskId !== undefined ? { taskId: route.params.taskId } : {}),
    ...(route.params?.taskTitle !== undefined
      ? { taskTitle: route.params.taskTitle }
      : {}),
  });
  const ringSize = Math.min(width - 56, 390);
  const ringColors =
    controller.mode === 'SHORT_BREAK'
      ? { progress: colors.danger, track: colors.dangerSoft }
      : controller.mode === 'LONG_BREAK'
        ? { progress: colors.info, track: colors.infoSoft }
        : { progress: colors.primary, track: colors.primarySoft };

  if (controller.isLoading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Pomodoro</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.cycleContainer}>
          <Text style={[styles.cycle, { color: colors.textMuted }]}>
            Ciclo {controller.cycle} de {controller.cyclesPerSession}
          </Text>
          {controller.activeTask !== null ? (
            <Text numberOfLines={1} style={[styles.task, { color: colors.primaryDark }]}>
              {controller.activeTask.title}
            </Text>
          ) : null}
        </View>

        <TimerProgressRing
          progress={controller.progress}
          progressColor={ringColors.progress}
          size={ringSize}
          trackColor={ringColors.track}
        >
          <TimerClockDisplay
            formattedTime={controller.formattedTime}
            modeLabel={controller.modeLabel}
          />
        </TimerProgressRing>

        <TimerControls
          isRunning={controller.isRunning}
          onPause={controller.handlePressPauseTimer}
          onReset={controller.handlePressResetTimer}
          onStart={controller.handlePressStartTimer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cycle: {
    fontSize: 21,
    fontWeight: '600',
  },
  cycleContainer: {
    alignItems: 'center',
    gap: 6,
  },
  header: {
    alignItems: 'center',
    minHeight: 58,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    alignItems: 'center',
    flex: 1,
    gap: 30,
    justifyContent: 'center',
    paddingBottom: 28,
  },
  safeArea: {
    flex: 1,
  },
  task: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 280,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
});
