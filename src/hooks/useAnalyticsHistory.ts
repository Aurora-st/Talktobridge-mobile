import { useCallback, useEffect, useState } from 'react';
import type { AnalyticsHistoryRecord } from '../types/api';
import { fetchAnalyticsHistory } from '../services/api/talkBridgeApi';
import { ApiRequestError, isApiConfigured } from '../services/api/httpClient';

export function useAnalyticsHistory(limit = 50) {
  const [history, setHistory] = useState<AnalyticsHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setHistory([]);
      setIsLoading(false);
      setError('Backend URL is not configured.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchAnalyticsHistory(limit);
      setHistory(response.history);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to load history.';
      setHistory([]);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    history,
    isLoading,
    error,
    refresh,
  };
}
