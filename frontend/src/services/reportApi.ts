import type { ScoreDistributionReport } from '../types/report';
import { apiGet } from './apiClient';

export function fetchScoreDistribution(signal?: AbortSignal): Promise<ScoreDistributionReport> {
  return apiGet<ScoreDistributionReport>('/reports/score-distribution', signal);
}
