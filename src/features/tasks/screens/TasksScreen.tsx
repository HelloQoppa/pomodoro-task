import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import type { RootTabParamList } from '@/types/navigation';

import { TaskCardItem } from '../components/TaskCardItem';
import { TaskQuickInput } from '../components/TaskQuickInput';
import { useTaskListController } from '../controllers/useTaskListController';
import type { Task } from '../types';

type TasksScreenProps = BottomTabScreenProps<RootTabParamList, 'Tasks'>;

export function TasksScreen({ navigation }: TasksScreenProps): React.JSX.Element {
  const { colors } = useTheme();
  const controller = useTaskListController();

  const handleStartTask = useCallback(
    (task: Task): void => {
      navigation.navigate('Timer', { taskId: task.id, taskTitle: task.title });
    },
    [navigation],
  );

  const renderTask = useCallback(
    ({ item }: { item: Task }): React.JSX.Element => (
      <TaskCardItem
        task={item}
        onStart={handleStartTask}
        onToggleCompletion={controller.handleToggleTaskCompletion}
      />
    ),
    [controller.handleToggleTaskCompletion, handleStartTask],
  );

  const taskKeyExtractor = useCallback((task: Task): string => task.id, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Minhas Tarefas</Text>
          <Ionicons color={colors.text} name="filter" size={24} />
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={controller.activeTasks}
          ItemSeparatorComponent={TaskSeparator}
          keyExtractor={taskKeyExtractor}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons color={colors.textMuted} name="checkmark-done" size={42} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Tudo em dia</Text>
              <Text style={[styles.emptyDescription, { color: colors.textMuted }]}>Adicione uma tarefa para começar.</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.completedContainer}>
              <Pressable
                style={styles.completedHeader}
                onPress={controller.handleToggleCompletedSection}
              >
                <Text style={[styles.completedTitle, { color: colors.textMuted }]}>
                  Conclui­das ({controller.completedTasks.length})
                </Text>
                <Ionicons
                  color={colors.textMuted}
                  name={
                    controller.isCompletedSectionExpanded
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={22}
                />
              </Pressable>
              {controller.isCompletedSectionExpanded
                ? controller.completedTasks.map(
                    (task): React.JSX.Element => (
                      <View key={task.id} style={styles.completedItem}>
                        <TaskCardItem
                          task={task}
                          onStart={handleStartTask}
                          onToggleCompletion={controller.handleToggleTaskCompletion}
                        />
                      </View>
                    ),
                  )
                : null}
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={controller.isLoading}
              tintColor={colors.primary}
              onRefresh={controller.handleRefreshTasks}
            />
          }
          renderItem={renderTask}
        />

        <View style={styles.inputContainer}>
          <TaskQuickInput
            priority={controller.selectedPriority}
            value={controller.newTaskTitle}
            onAdd={controller.handleAddTask}
            onChangePriority={controller.handleCyclePriority}
            onChangeText={controller.handleChangeNewTaskTitle}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TaskSeparator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  completedContainer: {
    gap: 10,
    paddingTop: 28,
  },
  completedHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  completedItem: {
    marginBottom: 12,
  },
  completedTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  emptyDescription: {
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 22,
  },
  inputContainer: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    padding: 18,
  },
  safeArea: {
    flex: 1,
  },
  separator: {
    height: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
});
