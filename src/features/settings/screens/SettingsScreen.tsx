import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

import { ThemeSelectorCard } from '../components/ThemeSelectorCard';
import { TimeSliderControl } from '../components/TimeSliderControl';
import { useSettingsController } from '../controllers/useSettingsController';

export function SettingsScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const {
    isLoading,
    settings,
    handleChangeDuration,
    handleChangeCycles,
    handleChangeTheme,
    handleToggleAutoStart,
    handleRestoreDefaults,
  } = useSettingsController();

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Configurações</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Temporizador</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <TimeSliderControl
            label="Tempo de Foco"
            maximumValue={60}
            minimumValue={5}
            value={settings.focusDuration}
            onValueChange={(value): void =>
              handleChangeDuration('focusDuration', value)
            }
          />
          <TimeSliderControl
            label="Pausa Curta"
            maximumValue={20}
            minimumValue={1}
            value={settings.shortBreakDuration}
            onValueChange={(value): void =>
              handleChangeDuration('shortBreakDuration', value)
            }
          />
          <TimeSliderControl
            label="Pausa Longa"
            maximumValue={45}
            minimumValue={5}
            value={settings.longBreakDuration}
            onValueChange={(value): void =>
              handleChangeDuration('longBreakDuration', value)
            }
          />
          <View style={styles.stepperRow}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Ciclos por Sessão</Text>
            <View style={styles.stepperControls}>
              <Pressable
                accessibilityLabel="Diminuir ciclos"
                style={[styles.stepperButton, { backgroundColor: colors.primarySoft }]}
                onPress={(): void => handleChangeCycles(-1)}
              >
                <Ionicons color={colors.primary} name="remove" size={20} />
              </Pressable>
              <Text style={[styles.cycleValue, { color: colors.text }]}>
                {settings.cyclesPerSession}
              </Text>
              <Pressable
                accessibilityLabel="Aumentar ciclos"
                style={[styles.stepperButton, { backgroundColor: colors.primarySoft }]}
                onPress={(): void => handleChangeCycles(1)}
              >
                <Ionicons color={colors.primary} name="add" size={20} />
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>Tema</Text>
          <View style={styles.themeRow}>
            <ThemeSelectorCard
              isSelected={settings.theme === 'light'}
              label="Claro"
              theme="light"
              onPress={handleChangeTheme}
            />
            <ThemeSelectorCard
              isSelected={settings.theme === 'dark'}
              label="Escuro"
              theme="dark"
              onPress={handleChangeTheme}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notificações e Sons</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <View style={[styles.listRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Som do Alarme</Text>
            <View style={styles.trailingRow}>
              <Text style={[styles.secondaryValue, { color: colors.textMuted }]}>Padrão</Text>
              <Ionicons color={colors.textMuted} name="chevron-forward" size={20} />
            </View>
          </View>
          <View style={styles.listRow}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Inicio Automático</Text>
            <Switch
              accessibilityLabel="Início automático"
              thumbColor="#FFFFFF"
              trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
              value={settings.shouldAutoStartNextCycle}
              onValueChange={handleToggleAutoStart}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Geral</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <View style={[styles.listRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Idioma</Text>
            <View style={styles.trailingRow}>
              <Text style={[styles.secondaryValue, { color: colors.textMuted }]}>Português</Text>
              <Ionicons color={colors.textMuted} name="chevron-forward" size={20} />
            </View>
          </View>
          <View style={[styles.listRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Ajuda</Text>
            <Ionicons color={colors.textMuted} name="chevron-forward" size={20} />
          </View>
          <Pressable style={styles.listRow} onPress={handleRestoreDefaults}>
            <Text style={[styles.rowLabel, { color: colors.danger }]}>Restaurar Padrões</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    elevation: 2,
    gap: 22,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 48,
  },
  cycleValue: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 58,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  listRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  safeArea: {
    flex: 1,
  },
  secondaryValue: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  stepperButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  stepperControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  stepperRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 14,
  },
  trailingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
