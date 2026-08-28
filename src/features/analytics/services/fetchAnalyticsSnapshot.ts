import { getDatabase } from '@/services/database/database';

import type {
  AnalyticsPeriod,
  AnalyticsSnapshot,
  DailyMetric,
  PeakHourMetric,
  WeeklyMetric,
} from '../types';

type TotalsRow = {
  focus_seconds: number | null;
  break_seconds: number | null;
  completed_focus: number | null;
};

type DayRow = {
  day: string;
  focus_seconds: number;
  cycles: number;
};

type HourRow = {
  hour: string;
  focus_seconds: number;
};

const weekDayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;
const monthLabels = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const;

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startDateForPeriod(period: AnalyticsPeriod, today: Date): Date {
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  switch (period) {
    case 'TODAY':
      return startDate;
    case 'WEEK':
      startDate.setDate(startDate.getDate() - 6);
      return startDate;
    case 'MONTH':
      startDate.setDate(1);
      return startDate;
    case 'TOTAL':
      return new Date(2000, 0, 1);
  }
}

function createWeeklyMetrics(rows: readonly DayRow[], today: Date): WeeklyMetric[] {
  const rowsByDate = new Map<string, DayRow>(rows.map((row) => [row.day, row]));

  return Array.from({ length: 7 }, (_, index): WeeklyMetric => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    date.setDate(date.getDate() - (6 - index));
    const dateKey = toDateKey(date);
    const row = rowsByDate.get(dateKey);

    return {
      date: dateKey,
      dayLabel: weekDayLabels[date.getDay()] ?? 'D',
      focusSeconds: row?.focus_seconds ?? 0,
      isToday: index === 6,
    };
  });
}

function createDailyMetrics(rows: readonly DayRow[]): DailyMetric[] {
  return rows.slice(0, 7).map((row): DailyMetric => {
    const [year = '2000', month = '01', day = '01'] = row.day.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const weekDay = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()] ?? 'Dia';
    const monthLabel = monthLabels[date.getMonth()] ?? 'Mês';

    return {
      date: row.day,
      dateLabel: `${weekDay}, ${day} ${monthLabel}`,
      focusSeconds: row.focus_seconds,
      completedCycles: row.cycles,
    };
  });
}

function createPeakHours(rows: readonly HourRow[]): PeakHourMetric[] {
  const periods = [
    { label: 'Manhã', range: '06:00 - 11:59', start: 6, end: 11 },
    { label: 'Tarde', range: '12:00 - 17:59', start: 12, end: 17 },
    { label: 'Noite', range: '18:00 - 23:59', start: 18, end: 23 },
  ] as const;

  return periods.map((period): PeakHourMetric => ({
    label: period.label,
    range: period.range,
    focusSeconds: rows
      .filter((row): boolean => {
        const hour = Number(row.hour);
        return hour >= period.start && hour <= period.end;
      })
      .reduce((total, row): number => total + row.focus_seconds, 0),
  }));
}

export async function fetchAnalyticsSnapshot(
  period: AnalyticsPeriod,
): Promise<AnalyticsSnapshot> {
  const database = await getDatabase();
  const today = new Date();
  const periodStart = toDateKey(startDateForPeriod(period, today));
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  weekStart.setDate(weekStart.getDate() - 6);

  const [totals, weeklyRows, dailyRows, hourRows] = await Promise.all([
    database.getFirstAsync<TotalsRow>(
      `SELECT
        SUM(CASE WHEN type = 'FOCUS' AND interrupted = 0 THEN duration_in_seconds ELSE 0 END) AS focus_seconds,
        SUM(CASE WHEN type != 'FOCUS' AND interrupted = 0 THEN duration_in_seconds ELSE 0 END) AS break_seconds,
        SUM(CASE WHEN type = 'FOCUS' AND interrupted = 0 THEN 1 ELSE 0 END) AS completed_focus
      FROM pomodoro_sessions
      WHERE date(completed_at) >= ?`,
      periodStart,
    ),
    database.getAllAsync<DayRow>(
      `SELECT
        date(completed_at) AS day,
        SUM(CASE WHEN type = 'FOCUS' AND interrupted = 0 THEN duration_in_seconds ELSE 0 END) AS focus_seconds,
        SUM(CASE WHEN type = 'FOCUS' AND interrupted = 0 THEN 1 ELSE 0 END) AS cycles
      FROM pomodoro_sessions
      WHERE date(completed_at) >= ?
      GROUP BY date(completed_at)
      ORDER BY day ASC`,
      toDateKey(weekStart),
    ),
    database.getAllAsync<DayRow>(
      `SELECT
        date(completed_at) AS day,
        SUM(CASE WHEN type = 'FOCUS' AND interrupted = 0 THEN duration_in_seconds ELSE 0 END) AS focus_seconds,
        SUM(CASE WHEN type = 'FOCUS' AND interrupted = 0 THEN 1 ELSE 0 END) AS cycles
      FROM pomodoro_sessions
      GROUP BY date(completed_at)
      ORDER BY day DESC
      LIMIT 7`,
    ),
    database.getAllAsync<HourRow>(
      `SELECT
        strftime('%H', completed_at) AS hour,
        SUM(duration_in_seconds) AS focus_seconds
      FROM pomodoro_sessions
      WHERE type = 'FOCUS' AND interrupted = 0 AND date(completed_at) >= ?
      GROUP BY strftime('%H', completed_at)`,
      periodStart,
    ),
  ]);

  const totalFocusSeconds = totals?.focus_seconds ?? 0;
  const totalBreakSeconds = totals?.break_seconds ?? 0;
  const totalTrackedSeconds = totalFocusSeconds + totalBreakSeconds;
  const focusRate =
    totalTrackedSeconds === 0
      ? 0
      : Math.round((totalFocusSeconds / totalTrackedSeconds) * 100);
  const expectedFocusSeconds = (totals?.completed_focus ?? 0) * 25 * 60;
  const productivityRate =
    expectedFocusSeconds === 0
      ? 0
      : Math.min(100, Math.round((totalFocusSeconds / expectedFocusSeconds) * 100));

  return {
    productivityRate,
    focusRate,
    totalFocusSeconds,
    totalBreakSeconds,
    weeklyMetrics: createWeeklyMetrics(weeklyRows, today),
    dailyMetrics: createDailyMetrics(dailyRows),
    peakHours: createPeakHours(hourRows),
  };
}
