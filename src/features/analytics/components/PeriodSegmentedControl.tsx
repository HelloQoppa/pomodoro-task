import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import type { AnalyticsPeriod } from '../types';

type PeriodSegmentedControlProps = {
  period: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
};

const options: readonly { label: string; value: AnalyticsPeriod }[] = [
  { label: 'Hoje', value: 'TODAY' },
  { label: 'Semana', value: 'WEEK' },
  { label: 'Mês', value: 'MONTH' },
  { label: 'Total', value: 'TOTAL' },
];

export function PeriodSegmentedControl({
  period,
  onChange,
}: PeriodSegmentedControlProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceMuted }]}>
      {options.map((option): React.JSX.Element => {
        const isSelected = period === option.value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={option.value}
            style={[
              styles.option,
              isSelected ? { backgroundColor: colors.surface } : undefined,
            ]}
            onPress={(): void => onChange(option.value)}
          >
            <Text
              style={[
                styles.optionLabel,
                { color: isSelected ? colors.text : colors.textMuted },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    flexDirection: 'row',
    padding: 4,
  },
  option: {
    alignItems: 'center',
    borderRadius: 9,
    flex: 1,
    paddingVertical: 9,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
