import { InMemoryCache } from '../config/cache';
import { SubjectRegistry, subjectRegistry } from '../domain/subjects/SubjectRegistry';
import { ScoreLevel, type SubjectCategory, type SubjectCode } from '../domain/types';
import { ReportRepository } from '../repositories/ReportRepository';

export interface ScoreLevelDefinition {
  key: 'belowAverage' | 'average' | 'good' | 'excellent';
  code: ScoreLevel;
  label: string;
}

export interface SubjectScoreDistribution {
  code: SubjectCode;
  name: string;
  category: SubjectCategory;
  totalStudents: number;
  distribution: {
    belowAverage: number;
    average: number;
    good: number;
    excellent: number;
  };
  percentages: {
    belowAverage: number;
    average: number;
    good: number;
    excellent: number;
  };
}

export interface ScoreDistributionReport {
  levels: ScoreLevelDefinition[];
  subjects: SubjectScoreDistribution[];
}

const SCORE_LEVEL_DEFINITIONS: ScoreLevelDefinition[] = [
  { key: 'belowAverage', code: ScoreLevel.BELOW_AVERAGE, label: 'Below Average (< 4.0)' },
  { key: 'average', code: ScoreLevel.AVERAGE, label: 'Average (4.0 - 5.99)' },
  { key: 'good', code: ScoreLevel.GOOD, label: 'Good (6.0 - 7.99)' },
  { key: 'excellent', code: ScoreLevel.EXCELLENT, label: 'Excellent (>= 8.0)' },
];

const DISTRIBUTION_CACHE_KEY = 'score_distribution_all_subjects';

function toPercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 10000) / 100;
}

export class ReportService {
  private readonly distributionCache = new InMemoryCache<ScoreDistributionReport>();

  constructor(
    private readonly repository: ReportRepository = new ReportRepository(),
    private readonly registry: SubjectRegistry = subjectRegistry,
  ) {}

  public async getScoreDistribution(): Promise<ScoreDistributionReport> {
    let fullReport = this.distributionCache.get(DISTRIBUTION_CACHE_KEY);

    if (!fullReport) {
      const subjects = this.registry.getAll();
      const rawCounts = await this.repository.getScoreDistributionBySubjects(subjects);

      const subjectStats: SubjectScoreDistribution[] = subjects.map((subject) => {
        const code = subject.getCode();
        const counts = rawCounts[code];
        const totalStudents =
          counts.belowAverage + counts.average + counts.good + counts.excellent;

        return {
          code,
          name: subject.getDisplayName(),
          category: subject.getCategory(),
          totalStudents,
          distribution: counts,
          percentages: {
            belowAverage: toPercentage(counts.belowAverage, totalStudents),
            average: toPercentage(counts.average, totalStudents),
            good: toPercentage(counts.good, totalStudents),
            excellent: toPercentage(counts.excellent, totalStudents),
          },
        };
      });

      fullReport = {
        levels: SCORE_LEVEL_DEFINITIONS,
        subjects: subjectStats,
      };

      this.distributionCache.set(DISTRIBUTION_CACHE_KEY, fullReport);
    }

    return fullReport;
  }
}
