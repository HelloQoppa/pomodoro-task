import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';

type FocusBreakDonutChartProps = {
  focusRate: number;
};

export function FocusBreakDonutChart({
  focusRate,
}: FocusBreakDonutChartProps): React.JSX.Element {
  const { colors } = useTheme();
  const size = 146;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, focusRate)) / 100;

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <Svg height={size} style={StyleSheet.absoluteFill} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          rotation="-90"
          stroke={colors.primaryDark}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          strokeWidth={strokeWidth}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[styles.percentage, { color: colors.text }]}>{focusRate}%</Text>
      <Text style={[styles.label, { color: colors.textMuted }]}>Foco</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 30,
    fontWeight: '800',
  },
});
