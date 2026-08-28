import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import type { TaskPriority } from '../types';

type TaskPriorityBadgeProps = {
  priority: TaskPriority;
};

const priorityLabels: Record<TaskPriority, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
};

export function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps): React.JSX.Element {
  const { colors } = useTheme();
  const backgroundColor =
    priority === 'HIGH'
      ? colors.danger
      : priority === 'MEDIUM'
        ? colors.warning
        : colors.info;
  const foregroundColor = priority === 'MEDIUM' ? '#182230' : '#FFFFFF';

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.label, { color: foregroundColor }]}>
        {priorityLabels[priority]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
});
