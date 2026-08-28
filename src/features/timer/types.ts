export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export type TimerConfig = {
  focusDurationInSeconds: number;
  shortBreakDurationInSeconds: number;
  longBreakDurationInSeconds: number;
  cyclesPerSession: number;
  shouldAutoStartNextCycle: boolean;
};

export type PersistedTimerState = {
  mode: TimerMode;
  cycle: number;
  remainingSeconds: number;
  targetEndAt: number | null;
  taskId: string | null;
  taskTitle: string | null;
};
