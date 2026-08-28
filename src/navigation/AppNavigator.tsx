import { Ionicons } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import type { ComponentProps } from 'react';

import { AnalyticsOverviewScreen } from '@/features/analytics';
import { SettingsScreen } from '@/features/settings';
import { TasksScreen } from '@/features/tasks';
import { TimerScreen } from '@/features/timer';
import { useTheme } from '@/theme/ThemeProvider';
import type { RootTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabLabels: Record<keyof RootTabParamList, string> = {
  Timer: 'Timer',
  Tasks: 'Tarefas',
  Analytics: 'Relatórios',
  Settings: 'Ajustes',
};

type IoniconName = ComponentProps<typeof Ionicons>['name'];

function iconNameForRoute(
  routeName: keyof RootTabParamList,
  isFocused: boolean,
): IoniconName {
  switch (routeName) {
    case 'Timer':
      return isFocused ? 'timer' : 'timer-outline';
    case 'Tasks':
      return isFocused ? 'checkmark-circle' : 'checkmark-circle-outline';
    case 'Analytics':
      return isFocused ? 'bar-chart' : 'bar-chart-outline';
    case 'Settings':
      return isFocused ? 'settings' : 'settings-outline';
  }
}

export function AppNavigator(): React.JSX.Element {
  const { colors, themeName } = useTheme();
  const baseNavigationTheme = themeName === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      background: colors.background,
      border: colors.border,
      card: colors.surface,
      notification: colors.danger,
      primary: colors.primaryDark,
      text: colors.text,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        initialRouteName="Timer"
        screenOptions={({ route }): BottomTabNavigationOptions => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primaryDark,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color, focused, size }): React.JSX.Element => (
            <Ionicons
              color={color}
              name={iconNameForRoute(route.name, focused)}
              size={size}
            />
          ),
          tabBarLabel: tabLabels[route.name],
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 5,
          },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 72,
            paddingTop: 7,
          },
        })}
      >
        <Tab.Screen component={TimerScreen} name="Timer" />
        <Tab.Screen component={TasksScreen} name="Tasks" />
        <Tab.Screen component={AnalyticsOverviewScreen} name="Analytics" />
        <Tab.Screen component={SettingsScreen} name="Settings" />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
