import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { fetchTimerConfig } from '../services/fetchTimerConfig';
import { fetchTimerState } from '../services/fetchTimerState';
import { savePomodoroSession } from '../services/savePomodoroSession';
import { saveTimerState } from '../services/saveTimerState';
import type { TimerConfig, TimerMode } from '../types';

const initialConfig: TimerConfig = {
  focusDurationInSeconds: 25 * 60,
  shortBreakDurationInSeconds: 5 * 60,
  longBreakDurationInSeconds: 15 * 60,
  cyclesPerSession: 4,
  shouldAutoStartNextCycle: true,
};

type ActiveTask = {
  id: string;
  title: string;
};

type UsePomodoroTimerControllerInput = {
  taskId?: string;
  taskTitle?: string;
};

type UsePomodoroTimerControllerResult = {
  activeTask: ActiveTask | null;
  cycle: number;
  cyclesPerSession: number;
  formattedTime: string;
  isLoading: boolean;
  isRunning: boolean;
  mode: TimerMode;
  modeLabel: string;
  progress: number;
  handlePressPauseTimer: () => void;
  handlePressResetTimer: () => void;
  handlePressStartTimer: () => void;
};

function durationForMode(mode: TimerMode, config: TimerConfig): number {
  switch (mode) {
    case 'FOCUS':
      return config.focusDurationInSeconds;
    case 'SHORT_BREAK':
      return config.shortBreakDurationInSeconds;
    case 'LONG_BREAK':
      return config.longBreakDurationInSeconds;
  }
}

function labelForMode(mode: TimerMode): string {
  switch (mode) {
    case 'FOCUS':
      return 'Foco';
    case 'SHORT_BREAK':
      return 'Pausa curta';
    case 'LONG_BREAK':
      return 'Pausa longa';
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export function usePomodoroTimerController({
  taskId,
  taskTitle,
}: UsePomodoroTimerControllerInput): UsePomodoroTimerControllerResult {
  const [config, setConfig] = useState<TimerConfig>(initialConfig);
  const [mode, setMode] = useState<TimerMode>('FOCUS');
  const [cycle, setCycle] = useState<number>(1);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    initialConfig.focusDurationInSeconds,
  );
  const [targetEndAt, setTargetEndAt] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isCompletingRef = useRef<boolean>(false);
  const configRef = useRef<TimerConfig>(config);
  const modeRef = useRef<TimerMode>(mode);
  const remainingSecondsRef = useRef<number>(remainingSeconds);
  const targetEndAtRef = useRef<number | null>(targetEndAt);

  configRef.current = config;
  modeRef.current = mode;
  remainingSecondsRef.current = remainingSeconds;
  targetEndAtRef.current = targetEndAt;

  useEffect((): void => {
    if (taskId !== undefined && taskTitle !== undefined) {
      setActiveTask({ id: taskId, title: taskTitle });
    }
  }, [taskId, taskTitle]);

  useEffect((): (() => void) => {
    let isMounted = true;

    async function restoreTimer(): Promise<void> {
      const [storedConfig, storedState] = await Promise.all([
        fetchTimerConfig(),
        fetchTimerState(),
      ]);

      if (!isMounted) {
        return;
      }

      setConfig(storedConfig);

      if (storedState === null) {
        setRemainingSeconds(storedConfig.focusDurationInSeconds);
      } else {
        setMode(storedState.mode);
        setCycle(Math.min(storedState.cycle, storedConfig.cyclesPerSession));
        setRemainingSeconds(
          storedState.targetEndAt === null
            ? storedState.remainingSeconds
            : Math.max(0, Math.ceil((storedState.targetEndAt - Date.now()) / 1000)),
        );
        setTargetEndAt(storedState.targetEndAt);
        if (storedState.taskId !== null && storedState.taskTitle !== null) {
          setActiveTask({ id: storedState.taskId, title: storedState.taskTitle });
        }
      }

      setIsLoading(false);
    }

    void restoreTimer();

    return (): void => {
      isMounted = false;
    };
  }, []);

  useFocusEffect(
    useCallback((): (() => void) | undefined => {
      if (isLoading) {
        return undefined;
      }

      let isFocused = true;

      async function refreshConfig(): Promise<void> {
        const nextConfig = await fetchTimerConfig();

        if (!isFocused) {
          return;
        }

        const currentMode = modeRef.current;
        const currentDuration = durationForMode(currentMode, configRef.current);
        const isTimerAtInitialValue =
          targetEndAtRef.current === null &&
          remainingSecondsRef.current === currentDuration;

        setConfig(nextConfig);
        setCycle((currentCycle): number =>
          Math.min(currentCycle, nextConfig.cyclesPerSession),
        );

        if (isTimerAtInitialValue) {
          setRemainingSeconds(durationForMode(currentMode, nextConfig));
        }
      }

      void refreshConfig();

      return (): void => {
        isFocused = false;
      };
    }, [isLoading]),
  );

  const completeCurrentMode = useCallback(async (): Promise<void> => {
    if (isCompletingRef.current) {
      return;
    }

    isCompletingRef.current = true;
    const completedDuration = durationForMode(mode, config);
    await savePomodoroSession({
      durationInSeconds: completedDuration,
      interrupted: false,
      taskId: activeTask?.id ?? null,
      type: mode,
    });

    let nextMode: TimerMode;
    let nextCycle = cycle;

    if (mode === 'FOCUS') {
      nextMode = cycle >= config.cyclesPerSession ? 'LONG_BREAK' : 'SHORT_BREAK';
    } else {
      nextMode = 'FOCUS';
      nextCycle = mode === 'LONG_BREAK' ? 1 : Math.min(cycle + 1, config.cyclesPerSession);
    }

    const nextDuration = durationForMode(nextMode, config);
    const nextTargetEndAt = config.shouldAutoStartNextCycle
      ? Date.now() + nextDuration * 1000
      : null;

    setMode(nextMode);
    setCycle(nextCycle);
    setRemainingSeconds(nextDuration);
    setTargetEndAt(nextTargetEndAt);
    isCompletingRef.current = false;
  }, [activeTask?.id, config, cycle, mode]);

  useEffect((): (() => void) | undefined => {
    if (targetEndAt === null || isLoading) {
      return undefined;
    }

    const updateRemainingTime = (): void => {
      const nextRemainingSeconds = Math.max(
        0,
        Math.ceil((targetEndAt - Date.now()) / 1000),
      );
      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds === 0) {
        setTargetEndAt(null);
        void completeCurrentMode();
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 250);
    const appStateSubscription = AppState.addEventListener('change', (state): void => {
      if (state === 'active') {
        updateRemainingTime();
      }
    });

    return (): void => {
      clearInterval(interval);
      appStateSubscription.remove();
    };
  }, [completeCurrentMode, isLoading, targetEndAt]);

  useEffect((): void => {
    if (isLoading) {
      return;
    }

    void saveTimerState({
      mode,
      cycle,
      remainingSeconds,
      targetEndAt,
      taskId: activeTask?.id ?? null,
      taskTitle: activeTask?.title ?? null,
    });
  }, [activeTask, cycle, isLoading, mode, remainingSeconds, targetEndAt]);

  const handlePressStartTimer = useCallback((): void => {
    if (targetEndAt === null) {
      setTargetEndAt(Date.now() + remainingSeconds * 1000);
    }
  }, [remainingSeconds, targetEndAt]);

  const handlePressPauseTimer = useCallback((): void => {
    if (targetEndAt !== null) {
      setRemainingSeconds(
        Math.max(0, Math.ceil((targetEndAt - Date.now()) / 1000)),
      );
      setTargetEndAt(null);
    }
  }, [targetEndAt]);

  const handlePressResetTimer = useCallback((): void => {
    setTargetEndAt(null);
    setRemainingSeconds(durationForMode(mode, config));
  }, [config, mode]);

  const totalDuration = durationForMode(mode, config);
  const progress = totalDuration > 0 ? remainingSeconds / totalDuration : 0;

  return useMemo<UsePomodoroTimerControllerResult>(
    (): UsePomodoroTimerControllerResult => ({
      activeTask,
      cycle,
      cyclesPerSession: config.cyclesPerSession,
      formattedTime: formatTime(remainingSeconds),
      isLoading,
      isRunning: targetEndAt !== null,
      mode,
      modeLabel: labelForMode(mode),
      progress,
      handlePressPauseTimer,
      handlePressResetTimer,
      handlePressStartTimer,
    }),
    [
      activeTask,
      config.cyclesPerSession,
      cycle,
      handlePressPauseTimer,
      handlePressResetTimer,
      handlePressStartTimer,
      isLoading,
      mode,
      progress,
      remainingSeconds,
      targetEndAt,
    ],
  );
}
