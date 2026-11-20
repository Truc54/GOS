import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiClientError } from '../services/apiClient';
import { fetchScoreBySbd } from '../services/scoreApi';
import type { StudentScoreDetail } from '../types/score';

const SBD_PATTERN = /^\d{8}$/;
const LOADING_INDICATOR_DELAY_MS = 180;

export interface UseScoreSearchResult {
  data: StudentScoreDetail | null;
  isLoading: boolean;
  showLoadingIndicator: boolean;
  error: { code: string; message: string } | null;
  search: (rawSbd: string) => Promise<void>;
  reset: () => void;
}

export function useScoreSearch(initialSbd?: string): UseScoreSearchResult {
  const [data, setData] = useState<StudentScoreDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingTimerRef = useRef<number | null>(null);

  const clearLoadingTimer = () => {
    if (loadingTimerRef.current !== null) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  };

  const search = useCallback(async (rawSbd: string) => {
    const sbd = rawSbd.trim();

    if (!SBD_PATTERN.test(sbd)) {
      clearLoadingTimer();
      setData(null);
      setIsLoading(false);
      setShowLoadingIndicator(false);
      setError({
        code: 'VALIDATION_ERROR',
        message: 'Registration number must be exactly 8 digits (e.g., 01000001).',
      });
      return;
    }

    abortControllerRef.current?.abort();
    clearLoadingTimer();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    // Avoid jarring skeleton flashes when indexed queries resolve in a few milliseconds
    loadingTimerRef.current = window.setTimeout(() => {
      if (abortControllerRef.current === controller) {
        setShowLoadingIndicator(true);
      }
    }, LOADING_INDICATOR_DELAY_MS);

    try {
      const result = await fetchScoreBySbd(sbd, controller.signal);
      setData(result);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      setData(null);
      if (err instanceof ApiClientError) {
        setError({ code: err.code, message: err.message });
      } else {
        setError({
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred while searching scores.',
        });
      }
    } finally {
      if (abortControllerRef.current === controller) {
        clearLoadingTimer();
        setIsLoading(false);
        setShowLoadingIndicator(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    clearLoadingTimer();
    setData(null);
    setError(null);
    setIsLoading(false);
    setShowLoadingIndicator(false);
  }, []);

  useEffect(() => {
    if (initialSbd && SBD_PATTERN.test(initialSbd.trim())) {
      void search(initialSbd);
    }

    return () => {
      abortControllerRef.current?.abort();
      clearLoadingTimer();
    };
  }, [initialSbd, search]);

  return {
    data,
    isLoading,
    showLoadingIndicator,
    error,
    search,
    reset,
  };
}
