import type { ApiErrorResponse, ApiSuccessResponse } from '../types/score';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${normalizedBase}${normalizedPath}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new ApiClientError(
      0,
      'NETWORK_ERROR',
      'Unable to reach the G-Scores API server. Please ensure the backend is running.',
    );
  }

  let payload: ApiSuccessResponse<T> | ApiErrorResponse | null = null;
  try {
    payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  } catch {
    throw new ApiClientError(
      response.status,
      'INVALID_RESPONSE',
      'Received an unexpected response from the server.',
    );
  }

  if (!response.ok || !payload.success) {
    const errorInfo = !payload.success ? payload.error : undefined;
    throw new ApiClientError(
      response.status,
      errorInfo?.code ?? 'REQUEST_FAILED',
      errorInfo?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return payload.data;
}
