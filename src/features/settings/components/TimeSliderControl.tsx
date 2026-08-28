import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type TimeSliderControlProps = {
  label: string;
  maximumValue: number;
  minimumValue: number;
  value: number;
  onValueChange: (value: number) => void;
};

export function TimeSliderControl({
  label,
  maximumValue,
  minimumValue,
  value,
  onValueChange,
}: TimeSliderControlProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.value, { color: colors.primaryDark }]}>
          {value} min
        </Text>
      </View>
      <Slider
        accessibilityLabel={label}
        maximumTrackTintColor={colors.primarySoft}
        maximumValue={maximumValue}
        minimumTrackTintColor={colors.primary}
        minimumValue={minimumValue}
        step={1}
        style={styles.slider}
        thumbTintColor={colors.primary}
        value={value}
        onSlidingComplete={onValueChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
  },
  slider: {
    height: 28,
    marginHorizontal: -6,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
});
