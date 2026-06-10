import { useCallback, useEffect, useState } from 'react';
import type { AnalyticsStats, HealthResponse } from '../types/api';
import { fetchAnalyticsStats, fetchHealth } from '../services/api/talkBridgeApi';
import { ApiRequestError, isApiConfigured } from '../services/api/httpClient';

interface BackendStatusState {
  health: HealthResponse | null;
  stats: AnalyticsStats | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
}

export function useBackendStatus() {
  const [state, setState] = useState<BackendStatusState>({
    health: null,
    stats: null,
    isLoading: true,
    error: null,
    isOnline: false,
  });

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setState({
        health: null,
        stats: null,
        isLoading: false,
        error: 'Backend URL is not configured.',
        isOnline: false,
      });
      return;
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const [health, stats] = await Promise.all([
        fetchHealth(),
        fetchAnalyticsStats(),
      ]);

      setState({
        health,
        stats,
        isLoading: false,
        error: null,
        isOnline: health.status === 'ok',
      });
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unable to reach backend.';

      setState({
        health: null,
        stats: null,
        isLoading: false,
        error: message,
        isOnline: false,
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}
