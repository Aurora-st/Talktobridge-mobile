import type {
  AnalyticsHistoryResponse,
  AnalyticsStats,
  HealthResponse,
} from '../../types/api';
import { getJson } from './httpClient';

export async function fetchHealth(): Promise<HealthResponse> {
  return getJson<HealthResponse>('/health');
}

export async function fetchAnalyticsStats(): Promise<AnalyticsStats> {
  return getJson<AnalyticsStats>('/analytics/stats');
}

export async function fetchAnalyticsHistory(
  limit = 20,
): Promise<AnalyticsHistoryResponse> {
  return getJson<AnalyticsHistoryResponse>('/analytics/history', {
    params: { limit },
  });
}
