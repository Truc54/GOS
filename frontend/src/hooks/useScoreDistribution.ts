import { useCallback, useEffect, useState } from 'react';
import { ApiClientError } from '../services/apiClient';
import { fetchScoreDistribution } from '../services/reportApi';
import type { ScoreDistributionReport } from '../types/report';

export interface UseScoreDistributionResult {
  data: ScoreDistributionReport | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useScoreDistribution(): UseScoreDistributionResult {
  const [data, setData] = useState<ScoreDistributionReport | null>(null);
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

    fetchScoreDistribution(controller.signal)
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
            : 'Unable to load score distribution statistics.',
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
  }, [reloadToken]);

  return { data, isLoading, error, retry };
}
