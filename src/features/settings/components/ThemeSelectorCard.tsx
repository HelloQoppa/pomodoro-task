import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type ThemeSelectorCardProps = {
  isSelected: boolean;
  label: string;
  theme: 'light' | 'dark';
  onPress: (theme: 'light' | 'dark') => void;
};

export function ThemeSelectorCard({
  isSelected,
  label,
  theme,
  onPress,
}: ThemeSelectorCardProps): React.JSX.Element {
  const { colors } = useTheme();
  const isDarkPreview = theme === 'dark';
  const backgroundColor = isDarkPreview ? '#0B2618' : colors.surface;
  const foregroundColor = isDarkPreview ? '#F2F7F4' : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor,
          borderColor: isSelected ? colors.primary : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={(): void => onPress(theme)}
    >
      <Ionicons
        color={foregroundColor}
        name={isDarkPreview ? 'moon-outline' : 'sunny-outline'}
        size={25}
      />
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: foregroundColor }]}>{label}</Text>
        {isSelected ? (
          <Ionicons color={colors.primary} name="checkmark-circle" size={20} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 2,
    flex: 1,
    gap: 22,
    minHeight: 116,
    padding: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
