import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { API_TIMEOUT_MS } from '../../constants/config';
import type { ApiErrorPayload } from '../../types/api';

export class ApiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiConfigurationError';
  }
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number | null,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

let clientInstance: AxiosInstance | null = null;
let currentBaseUrl = '';
let currentApiKey = '';

export function configureHttpClient(baseUrl: string, apiKey: string): void {
  const normalizedBaseUrl = baseUrl.trim().replace(/\/$/, '');
  currentBaseUrl = normalizedBaseUrl;
  currentApiKey = apiKey.trim();

  clientInstance = axios.create({
    baseURL: normalizedBaseUrl || undefined,
    timeout: API_TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(currentApiKey ? { Authorization: `Bearer ${currentApiKey}` } : {}),
    },
  });
}

export function isApiConfigured(): boolean {
  return currentBaseUrl.length > 0;
}

export function getHttpClient(): AxiosInstance {
  if (!clientInstance || !isApiConfigured()) {
    throw new ApiConfigurationError(
      'API is not configured. Set the API base URL in Settings.',
    );
  }
  return clientInstance;
}

export function parseApiError(error: unknown): ApiRequestError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const statusCode = axiosError.response?.status ?? null;
    const payload = axiosError.response?.data;
    const message =
      payload?.message ??
      axiosError.message ??
      'An unexpected network error occurred.';
    const code = payload?.code ?? 'NETWORK_ERROR';
    return new ApiRequestError(message, statusCode, code);
  }

  if (error instanceof Error) {
    return new ApiRequestError(error.message, null, 'UNKNOWN_ERROR');
  }

  return new ApiRequestError('An unknown error occurred.', null, 'UNKNOWN_ERROR');
}
