import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type TimerClockDisplayProps = {
  formattedTime: string;
  modeLabel: string;
};

export function TimerClockDisplay({
  formattedTime,
  modeLabel,
}: TimerClockDisplayProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[styles.time, { color: colors.text }]}
      >
        {formattedTime}
      </Text>
      <Text style={[styles.mode, { color: colors.textMuted }]}>{modeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    width: '72%',
  },
  mode: {
    fontSize: 19,
    fontWeight: '500',
  },
  time: {
    fontSize: 62,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
    letterSpacing: -2,
  },
});
