import axios from 'axios';
import type {
  AnalyticsHistoryResponse,
  AnalyticsStats,
  HealthResponse,
  RootHealthResponse,
} from '../../types/api';
import { getJson } from './httpClient';

function logRequestError(label: string, error: unknown): void {
  if (axios.isAxiosError(error)) {
    console.log(`[API] ${label}:`, error.response?.data ?? error.message);
    return;
  }

  console.log(
    `[API] ${label}:`,
    error instanceof Error ? error.message : error,
  );
}

export function isBackendHealthy(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return normalized === 'ok' || normalized.includes('running');
}

export async function fetchHealth(): Promise<HealthResponse> {
  return getJson<HealthResponse>('/health');
}

/** Tries /health first, then falls back to GET / for LAN connectivity checks. */
export async function testBackendConnection(): Promise<HealthResponse> {
  console.log('[API] Testing backend...');

  try {
    return await fetchHealth();
  } catch (healthError) {
    logRequestError('GET /health failed', healthError);

    try {
      const root = await getJson<RootHealthResponse>('/');
      return {
        status: root.status,
        version: root.version,
        whisper_model: undefined,
        cache_entries: undefined,
        database: root.version ? `v${root.version}` : undefined,
      };
    } catch (rootError) {
      logRequestError('GET / failed', rootError);
      throw rootError;
    }
  }
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
