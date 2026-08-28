import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import type { TaskPriority } from '../types';

type TaskQuickInputProps = {
  priority: TaskPriority;
  value: string;
  onAdd: () => void;
  onChangePriority: () => void;
  onChangeText: (value: string) => void;
};

const priorityLabels: Record<TaskPriority, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
};

export function TaskQuickInput({
  priority,
  value,
  onAdd,
  onChangePriority,
  onChangeText,
}: TaskQuickInputProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <Pressable
        accessibilityLabel={`Prioridade ${priorityLabels[priority]}`}
        style={[styles.priorityButton, { backgroundColor: colors.primarySoft }]}
        onPress={onChangePriority}
      >
        <Text style={[styles.priorityLabel, { color: colors.primaryDark }]}>P</Text>
      </Pressable>
      <TextInput
        placeholder="Adicionar uma nova tarefa..."
        placeholderTextColor={colors.textMuted}
        returnKeyType="done"
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onAdd}
      />
      <Pressable
        accessibilityLabel="Adicionar tarefa"
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: colors.primaryDark, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={onAdd}
      >
        <Ionicons color="#FFFFFF" name="add" size={30} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  container: {
    alignItems: 'center',
    borderRadius: 18,
    elevation: 4,
    flexDirection: 'row',
    gap: 8,
    minHeight: 70,
    padding: 9,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 48,
  },
  priorityButton: {
    alignItems: 'center',
    borderRadius: 10,
    height: 38,
    justifyContent: 'center',
    width: 34,
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
});
