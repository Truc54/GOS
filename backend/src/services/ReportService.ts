import { InMemoryCache } from '../config/cache';
import { ExamGroup } from '../domain/groups/ExamGroup';
import { GROUP_A00 } from '../domain/groups/examGroups';
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

export interface TopGroupAStudent {
  rank: number;
  sbd: string;
  scores: {
    toan: number;
    vat_li: number;
    hoa_hoc: number;
  };
  totalScore: number;
}

export interface TopGroupAReport {
  groupCode: string;
  groupName: string;
  limit: number;
  students: TopGroupAStudent[];
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
  private readonly topGroupACache = new InMemoryCache<TopGroupAReport>();

  constructor(
    private readonly repository: ReportRepository = new ReportRepository(),
    private readonly registry: SubjectRegistry = subjectRegistry,
    private readonly groupA: ExamGroup = GROUP_A00,
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

  public async getTopGroupA(limit = 10): Promise<TopGroupAReport> {
    const cacheKey = `top_group_a:${limit}`;
    const cached = this.topGroupACache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const rows = await this.repository.getTopGroupA(limit);
    const students: TopGroupAStudent[] = [];
    let currentRank = 0;
    let previousTotal: number | null = null;

    for (const row of rows) {
      const totalScore = this.groupA.calculateTotalScore({
        toan: row.toan,
        vatLi: row.vat_li,
        hoaHoc: row.hoa_hoc,
      });

      if (totalScore === null) {
        continue;
      }

      if (previousTotal === null || totalScore !== previousTotal) {
        currentRank = students.length + 1;
        previousTotal = totalScore;
      }

      students.push({
        rank: currentRank,
        sbd: row.sbd,
        scores: {
          toan: row.toan,
          vat_li: row.vat_li,
          hoa_hoc: row.hoa_hoc,
        },
        totalScore,
      });
    }

    const report: TopGroupAReport = {
      groupCode: this.groupA.getCode(),
      groupName: this.groupA.getName(),
      limit,
      students,
    };

    this.topGroupACache.set(cacheKey, report);
    return report;
  }
}
