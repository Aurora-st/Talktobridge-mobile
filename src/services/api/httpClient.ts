import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import {
  API_RETRY_ATTEMPTS,
  API_RETRY_DELAY_MS,
  API_TIMEOUT_MS,
  DEFAULT_API_BASE_URL,
} from '../../constants/config';
import type { BackendErrorBody } from '../../types/api';

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const axiosError = error as AxiosError;
  if (!axiosError.response) {
    return true;
  }

  const status = axiosError.response.status;
  return status >= 500 || status === 408 || status === 429;
}

export function configureHttpClient(baseUrl: string, apiKey: string): void {
  const normalizedBaseUrl = (baseUrl.trim() || DEFAULT_API_BASE_URL).replace(/\/$/, '');
  currentBaseUrl = normalizedBaseUrl;

  clientInstance = axios.create({
    baseURL: normalizedBaseUrl || undefined,
    timeout: API_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      ...(apiKey.trim() ? { Authorization: `Bearer ${apiKey.trim()}` } : {}),
    },
  });
}

export function isApiConfigured(): boolean {
  return currentBaseUrl.length > 0;
}

export function getApiBaseUrl(): string {
  return currentBaseUrl;
}

export function getHttpClient(): AxiosInstance {
  if (!clientInstance || !isApiConfigured()) {
    throw new ApiConfigurationError(
      'API is not configured. Set the backend URL in Settings.',
    );
  }
  return clientInstance;
}

export function resolveBackendUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    try {
      const resolved = new URL(pathOrUrl);
      const base = new URL(currentBaseUrl);
      resolved.protocol = base.protocol;
      resolved.host = base.host;
      return resolved.toString();
    } catch {
      return pathOrUrl;
    }
  }

  const base = currentBaseUrl.replace(/\/$/, '');
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function parseApiError(error: unknown): ApiRequestError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendErrorBody>;
    const statusCode = axiosError.response?.status ?? null;
    const payload = axiosError.response?.data;

    if (payload?.error?.message) {
      return new ApiRequestError(
        payload.error.message,
        statusCode,
        payload.error.type,
      );
    }

    if (payload?.detail?.length) {
      const message = payload.detail.map((item) => item.msg).join('; ');
      return new ApiRequestError(message, statusCode, 'VALIDATION_ERROR');
    }

    const message =
      axiosError.message ?? 'An unexpected network error occurred.';
    return new ApiRequestError(message, statusCode, 'NETWORK_ERROR');
  }

  if (error instanceof Error) {
    return new ApiRequestError(error.message, null, 'UNKNOWN_ERROR');
  }

  return new ApiRequestError('An unknown error occurred.', null, 'UNKNOWN_ERROR');
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config?: AxiosRequestConfig,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= API_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === API_RETRY_ATTEMPTS) {
        break;
      }

      await sleep(API_RETRY_DELAY_MS * attempt);
    }
  }

  throw parseApiError(lastError);
}

export async function getJson<T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const client = getHttpClient();
  return withRetry(async () => {
    const { data } = await client.get<T>(path, {
      ...config,
      headers: {
        ...config?.headers,
      },
    });
    return data;
  });
}

export async function postJson<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const client = getHttpClient();
  return withRetry(async () => {
    const { data } = await client.post<TResponse>(path, body, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
    return data;
  });
}

export async function postMultipart<TResponse>(
  path: string,
  formData: FormData,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const client = getHttpClient();
  return withRetry(async () => {
    const { data } = await client.post<TResponse>(path, formData, {
      ...config,
      timeout: config?.timeout ?? API_TIMEOUT_MS,
      headers: {
        ...config?.headers,
      },
      transformRequest: (payload) => payload,
    });
    return data;
  });
}
