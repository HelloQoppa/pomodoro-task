import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import type { DailyMetric } from '../types';

type DailyHistoryCardProps = {
  metric: DailyMetric;
};

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${minutes} min`;
}

export function DailyHistoryCard({
  metric,
}: DailyHistoryCardProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Text style={[styles.date, { color: colors.text }]}>{metric.dateLabel}</Text>
      <View style={styles.statRow}>
        <Ionicons color={colors.primaryDark} name="timer-outline" size={15} />
        <Text style={[styles.statLabel, { color: colors.textMuted }]}>Focados</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>
        {formatDuration(metric.focusSeconds)}
      </Text>
      <View style={styles.statRow}>
        <Ionicons color={colors.primaryDark} name="checkmark-circle-outline" size={15} />
        <Text style={[styles.statLabel, { color: colors.textMuted }]}>Ciclos</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>
        {metric.completedCycles}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    gap: 5,
    minHeight: 150,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    width: 155,
  },
  date: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
});
