import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import type { WeeklyMetric } from '../types';

type WeeklyBarChartProps = {
  metrics: WeeklyMetric[];
};

function formatCompactDuration(seconds: number): string {
  if (seconds === 0) {
    return '0m';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${minutes}m`;
}

export function WeeklyBarChart({ metrics }: WeeklyBarChartProps): React.JSX.Element {
  const { colors } = useTheme();
  const maximum = Math.max(1, ...metrics.map((metric): number => metric.focusSeconds));

  return (
    <View style={styles.container}>
      {metrics.map((metric): React.JSX.Element => {
        const barHeight = Math.max(8, (metric.focusSeconds / maximum) * 100);
        return (
          <View key={metric.date} style={styles.column}>
            <Text style={[styles.value, { color: colors.textMuted }]}>
              {formatCompactDuration(metric.focusSeconds)}
            </Text>
            <View style={styles.barArea}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: metric.isToday
                      ? colors.primaryDark
                      : colors.primary,
                    height: barHeight,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.day,
                { color: metric.isToday ? colors.primary : colors.textMuted },
              ]}
            >
              {metric.dayLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 8,
    minWidth: 18,
  },
  barArea: {
    alignItems: 'center',
    height: 105,
    justifyContent: 'flex-end',
  },
  column: {
    alignItems: 'center',
    flex: 1,
    gap: 5,
  },
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 4,
    minHeight: 145,
  },
  day: {
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
});
