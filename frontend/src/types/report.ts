import type { ScoreLevel, SubjectCategory, SubjectCode } from './score';

export type ScoreLevelKey = 'excellent' | 'good' | 'average' | 'poor';

export interface ScoreLevelDefinition {
  key: ScoreLevelKey;
  code: ScoreLevel;
  label: string;
}

export interface SubjectScoreDistribution {
  code: SubjectCode;
  name: string;
  category: SubjectCategory;
  totalStudents: number;
  distribution: Record<ScoreLevelKey, number>;
  percentages: Record<ScoreLevelKey, number>;
}

export interface ScoreDistributionReport {
  levels: ScoreLevelDefinition[];
  subjects: SubjectScoreDistribution[];
}
