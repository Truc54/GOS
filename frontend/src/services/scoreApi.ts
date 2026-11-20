import type { StudentScoreDetail } from '../types/score';
import { apiGet } from './apiClient';

export function fetchScoreBySbd(
  sbd: string,
  signal?: AbortSignal,
): Promise<StudentScoreDetail> {
  return apiGet<StudentScoreDetail>(`/scores/${encodeURIComponent(sbd.trim())}`, signal);
}
