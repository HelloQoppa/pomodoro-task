export type AlarmSound = 'default' | 'soft' | 'digital';

export type UserSettings = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesPerSession: number;
  theme: 'light' | 'dark';
  alarmSound: AlarmSound;
  shouldAutoStartNextCycle: boolean;
};

export const defaultUserSettings: UserSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesPerSession: 4,
  theme: 'light',
  alarmSound: 'default',
  shouldAutoStartNextCycle: true,
};
