import { useCallback, useEffect, useState } from 'react';

import { fetchAnalyticsSnapshot } from '../services/fetchAnalyticsSnapshot';
import type { AnalyticsPeriod, AnalyticsSnapshot } from '../types';

const emptySnapshot: AnalyticsSnapshot = {
  productivityRate: 0,
  focusRate: 0,
  totalFocusSeconds: 0,
  totalBreakSeconds: 0,
  weeklyMetrics: [],
  dailyMetrics: [],
  peakHours: [],
};

type UseAnalyticsControllerResult = {
  isLoading: boolean;
  period: AnalyticsPeriod;
  snapshot: AnalyticsSnapshot;
  handleChangePeriod: (period: AnalyticsPeriod) => void;
  handleRefresh: () => void;
};

export function useAnalyticsController(): UseAnalyticsControllerResult {
  const [period, setPeriod] = useState<AnalyticsPeriod>('WEEK');
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot>(emptySnapshot);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect((): (() => void) => {
    let isMounted = true;

    async function loadAnalytics(): Promise<void> {
      setIsLoading(true);
      const nextSnapshot = await fetchAnalyticsSnapshot(period);
      if (isMounted) {
        setSnapshot(nextSnapshot);
        setIsLoading(false);
      }
    }

    void loadAnalytics();

    return (): void => {
      isMounted = false;
    };
  }, [period, refreshKey]);

  const handleRefresh = useCallback((): void => {
    setRefreshKey((currentKey): number => currentKey + 1);
  }, []);

  return {
    isLoading,
    period,
    snapshot,
    handleChangePeriod: setPeriod,
    handleRefresh,
  };
}
