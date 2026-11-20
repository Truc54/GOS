import type { TopGroupAReport } from '../types/leaderboard';
import { apiGet } from './apiClient';

export function fetchTopGroupA(limit = 10, signal?: AbortSignal): Promise<TopGroupAReport> {
  return apiGet<TopGroupAReport>(`/reports/top-group-a?limit=${limit}`, signal);
}
