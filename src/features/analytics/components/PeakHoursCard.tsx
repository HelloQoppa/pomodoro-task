import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import type { PeakHourMetric } from '../types';

type PeakHoursCardProps = {
  metrics: PeakHourMetric[];
};

export function PeakHoursCard({ metrics }: PeakHoursCardProps): React.JSX.Element {
  const { colors } = useTheme();
  const bestPeriod = metrics.reduce<PeakHourMetric | null>(
    (best, metric): PeakHourMetric =>
      best === null || metric.focusSeconds > best.focusSeconds ? metric : best,
    null,
  );

  return (
    <View style={styles.rows}>
      {metrics.map((metric): React.JSX.Element => {
        const isBest = metric === bestPeriod && metric.focusSeconds > 0;
        return (
          <View
            key={metric.label}
            style={[
              styles.row,
              { backgroundColor: isBest ? colors.primarySoft : colors.surfaceMuted },
            ]}
          >
            <Text style={[styles.label, { color: colors.primaryDark }]}>
              {metric.label}
            </Text>
            <Text style={[styles.range, { color: colors.text }]}>{metric.range}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  range: {
    fontSize: 15,
  },
  row: {
    alignItems: 'center',
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  rows: {
    gap: 9,
  },
});
