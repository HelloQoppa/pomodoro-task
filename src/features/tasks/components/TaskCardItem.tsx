import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import type { Task } from '../types';
import { TaskPriorityBadge } from './TaskPriorityBadge';

type TaskCardItemProps = {
  task: Task;
  onStart: (task: Task) => void;
  onToggleCompletion: (task: Task) => void;
};

export function TaskCardItem({
  task,
  onStart,
  onToggleCompletion,
}: TaskCardItemProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          opacity: task.isCompleted ? 0.65 : 1,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Pressable
        accessibilityLabel={task.isCompleted ? 'Reabrir tarefa' : 'Concluir tarefa'}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.isCompleted }}
        style={[
          styles.checkbox,
          {
            backgroundColor: task.isCompleted ? colors.primary : 'transparent',
            borderColor: colors.primary,
          },
        ]}
        onPress={(): void => onToggleCompletion(task)}
      >
        {task.isCompleted ? (
          <Ionicons color="#FFFFFF" name="checkmark" size={18} />
        ) : null}
      </Pressable>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              textDecorationLine: task.isCompleted ? 'line-through' : 'none',
            },
          ]}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.pomodoros, { color: colors.textMuted }]}>
            ðŸ… {task.completedPomodoros}/{task.estimatedPomodoros}
          </Text>
          <TaskPriorityBadge priority={task.priority} />
        </View>
      </View>

      {!task.isCompleted ? (
        <Pressable
          accessibilityLabel={`Iniciar foco em ${task.title}`}
          style={({ pressed }) => [
            styles.playButton,
            { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.65 : 1 },
          ]}
          onPress={(): void => onStart(task)}
        >
          <Ionicons color={colors.primaryDark} name="play" size={24} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 20,
    elevation: 2,
    flexDirection: 'row',
    gap: 16,
    minHeight: 122,
    padding: 18,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  content: {
    flex: 1,
    gap: 10,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  playButton: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  pomodoros: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 25,
  },
});
