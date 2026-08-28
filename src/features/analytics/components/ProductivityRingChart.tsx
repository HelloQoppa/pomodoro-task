import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';

type ProductivityRingChartProps = {
  percentage: number;
};

export function ProductivityRingChart({
  percentage,
}: ProductivityRingChartProps): React.JSX.Element {
  const { colors } = useTheme();
  const size = 146;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, percentage)) / 100;

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <Svg height={size} style={StyleSheet.absoluteFill} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={colors.surfaceMuted}
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
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[styles.percentage, { color: colors.primaryDark }]}>
        {percentage}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 34,
    fontWeight: '800',
  },
});
