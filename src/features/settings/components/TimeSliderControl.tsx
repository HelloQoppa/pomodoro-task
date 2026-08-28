import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const canDecrease = value > minimumValue;
  const canIncrease = value < maximumValue;

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <View style={styles.stepperControls}>
          <Pressable
            accessibilityLabel={`Diminuir ${label.toLowerCase()}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canDecrease }}
            disabled={!canDecrease}
            hitSlop={6}
            style={[
              styles.stepperButton,
              {
                backgroundColor: colors.primarySoft,
                opacity: canDecrease ? 1 : 0.4,
              },
            ]}
            onPress={(): void => onValueChange(Math.max(minimumValue, value - 1))}
          >
            <Ionicons color={colors.primary} name="remove" size={16} />
          </Pressable>
          <Text style={[styles.value, { color: colors.primaryDark }]}>
            {value} min
          </Text>
          <Pressable
            accessibilityLabel={`Aumentar ${label.toLowerCase()}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canIncrease }}
            disabled={!canIncrease}
            hitSlop={6}
            style={[
              styles.stepperButton,
              {
                backgroundColor: colors.primarySoft,
                opacity: canIncrease ? 1 : 0.4,
              },
            ]}
            onPress={(): void => onValueChange(Math.min(maximumValue, value + 1))}
          >
            <Ionicons color={colors.primary} name="add" size={16} />
          </Pressable>
        </View>
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
  stepperButton: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  stepperControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    minWidth: 52,
    textAlign: 'center',
  },
});
