import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type TimerProgressRingProps = {
  children: React.ReactNode;
  progress: number;
  progressColor: string;
  size: number;
  trackColor: string;
};

export function TimerProgressRing({
  children,
  progress,
  progressColor,
  size,
  trackColor,
}: TimerProgressRingProps): React.JSX.Element {
  const strokeWidth = Math.max(18, size * 0.075);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <Svg height={size} style={StyleSheet.absoluteFill} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          rotation="-90"
          stroke={progressColor}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - normalizedProgress)}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
