import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type TimerControlsProps = {
  isRunning: boolean;
  onPause: () => void;
  onReset: () => void;
  onStart: () => void;
};

export function TimerControls({
  isRunning,
  onPause,
  onReset,
  onStart,
}: TimerControlsProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Reiniciar temporizador"
        style={({ pressed }) => [
          styles.secondaryButton,
          { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={onReset}
      >
        <Ionicons color={colors.text} name="refresh" size={28} />
      </Pressable>
      <Pressable
        accessibilityLabel={isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'}
        style={({ pressed }) => [
          styles.primaryButton,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
        onPress={isRunning ? onPause : onStart}
      >
        <Ionicons
          color="#FFFFFF"
          name={isRunning ? 'pause' : 'play'}
          size={38}
          style={isRunning ? undefined : styles.playIcon}
        />
      </Pressable>
      <Pressable
        accessibilityLabel={isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'}
        style={({ pressed }) => [
          styles.secondaryButton,
          { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={isRunning ? onPause : onStart}
      >
        <Ionicons
          color={colors.text}
          name={isRunning ? 'pause' : 'play-outline'}
          size={28}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 22,
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 4,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 42,
    elevation: 7,
    height: 84,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    width: 84,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 34,
    height: 66,
    justifyContent: 'center',
    width: 66,
  },
});
