import { useCallback, useEffect, useState } from 'react';
import { ApiClientError } from '../services/apiClient';
import { fetchTopGroupA } from '../services/leaderboardApi';
import type { TopGroupAReport } from '../types/leaderboard';

export interface UseTopGroupAResult {
  data: TopGroupAReport | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useTopGroupA(limit = 10): UseTopGroupAResult {
  const [data, setData] = useState<TopGroupAReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const retry = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchTopGroupA(limit, controller.signal)
      .then((report) => {
        setData(report);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof ApiClientError
            ? err.message
            : 'Unable to load Group A00 leaderboard.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [limit, reloadToken]);

  return { data, isLoading, error, retry };
}
