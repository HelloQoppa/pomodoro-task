export type AnalyticsPeriod = 'TODAY' | 'WEEK' | 'MONTH' | 'TOTAL';

export type WeeklyMetric = {
  date: string;
  dayLabel: string;
  focusSeconds: number;
  isToday: boolean;
};

export type DailyMetric = {
  date: string;
  dateLabel: string;
  focusSeconds: number;
  completedCycles: number;
};

export type PeakHourMetric = {
  label: string;
  range: string;
  focusSeconds: number;
};

export type AnalyticsSnapshot = {
  productivityRate: number;
  focusRate: number;
  totalFocusSeconds: number;
  totalBreakSeconds: number;
  weeklyMetrics: WeeklyMetric[];
  dailyMetrics: DailyMetric[];
  peakHours: PeakHourMetric[];
};
