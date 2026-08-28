import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

import { DailyHistoryCard } from '../components/DailyHistoryCard';
import { FocusBreakDonutChart } from '../components/FocusBreakDonutChart';
import { PeakHoursCard } from '../components/PeakHoursCard';
import { PeriodSegmentedControl } from '../components/PeriodSegmentedControl';
import { ProductivityRingChart } from '../components/ProductivityRingChart';
import { WeeklyBarChart } from '../components/WeeklyBarChart';
import { useAnalyticsController } from '../controllers/useAnalyticsController';

export function AnalyticsOverviewScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const controller = useAnalyticsController();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Overview</Text>
        <Pressable onPress={controller.handleRefresh}>
          <Ionicons color={colors.text} name="refresh" size={22} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <PeriodSegmentedControl
          period={controller.period}
          onChange={controller.handleChangePeriod}
        />

        {controller.isLoading ? (
          <ActivityIndicator color={colors.primary} size="large" style={styles.loader} />
        ) : (
          <>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, shadowColor: colors.shadow },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>Produtividade</Text>
              <View style={styles.chartCenter}>
                <ProductivityRingChart
                  percentage={controller.snapshot.productivityRate}
                />
              </View>
            </View>

            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, shadowColor: colors.shadow },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>Foco vs Pausas</Text>
              <View style={styles.chartCenter}>
                <FocusBreakDonutChart focusRate={controller.snapshot.focusRate} />
              </View>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primaryDark }]} />
                  <Text style={[styles.legendText, { color: colors.textMuted }]}>
                    Foco ({controller.snapshot.focusRate}%)
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.textMuted }]}>
                    Pausas ({100 - controller.snapshot.focusRate}%)
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, shadowColor: colors.shadow },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>Progresso Semanal</Text>
              <WeeklyBarChart metrics={controller.snapshot.weeklyMetrics} />
            </View>

            <View style={styles.historySection}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Histórico Diário</Text>
              {controller.snapshot.dailyMetrics.length === 0 ? (
                <View style={[styles.emptyHistory, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.emptyHistoryText, { color: colors.textMuted }]}>
                    Seus ciclos concluídos aparecerão aqui.
                  </Text>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={styles.historyList}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {controller.snapshot.dailyMetrics.map(
                    (metric): React.JSX.Element => (
                      <DailyHistoryCard key={metric.date} metric={metric} />
                    ),
                  )}
                </ScrollView>
              )}
            </View>

            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, shadowColor: colors.shadow },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>Horários de Pico</Text>
              <PeakHoursCard metrics={controller.snapshot.peakHours} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    elevation: 2,
    gap: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartCenter: {
    alignItems: 'center',
  },
  content: {
    gap: 18,
    padding: 18,
    paddingBottom: 48,
  },
  emptyHistory: {
    borderRadius: 14,
    padding: 24,
  },
  emptyHistoryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  historyList: {
    gap: 12,
  },
  historySection: {
    gap: 14,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  legendDot: {
    borderRadius: 6,
    height: 11,
    width: 11,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  legendText: {
    fontSize: 12,
  },
  loader: {
    marginVertical: 80,
  },
  safeArea: {
    flex: 1,
  },
});
