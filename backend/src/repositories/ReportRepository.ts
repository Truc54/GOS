import type { PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';
import { SCORE_LEVEL_THRESHOLDS, Subject } from '../domain/subjects/Subject';
import type { SubjectCode } from '../domain/types';

export interface RawSubjectDistributionCounts {
  belowAverage: number;
  average: number;
  good: number;
  excellent: number;
}

export class ReportRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  public async getScoreDistributionBySubjects(
    subjects: readonly Subject[],
  ): Promise<Record<SubjectCode, RawSubjectDistributionCounts>> {
    const { EXCELLENT_MIN, GOOD_MIN, AVERAGE_MIN } = SCORE_LEVEL_THRESHOLDS;

    // Column identifiers are strictly sourced from the whitelisted Subject domain instances
    const selectClauses = subjects.flatMap((subject) => {
      const col = subject.getCode();
      return [
        `COUNT(*) FILTER (WHERE "${col}" < ${AVERAGE_MIN})::int AS "${col}_below_average"`,
        `COUNT(*) FILTER (WHERE "${col}" >= ${AVERAGE_MIN} AND "${col}" < ${GOOD_MIN})::int AS "${col}_average"`,
        `COUNT(*) FILTER (WHERE "${col}" >= ${GOOD_MIN} AND "${col}" < ${EXCELLENT_MIN})::int AS "${col}_good"`,
        `COUNT(*) FILTER (WHERE "${col}" >= ${EXCELLENT_MIN})::int AS "${col}_excellent"`,
      ];
    });

    const query = `SELECT ${selectClauses.join(', ')} FROM "student_scores";`;
    const rows = await this.db.$queryRawUnsafe<Array<Record<string, number>>>(query);
    const row = rows[0] ?? {};

    const result = {} as Record<SubjectCode, RawSubjectDistributionCounts>;
    for (const subject of subjects) {
      const col = subject.getCode();
      result[col] = {
        belowAverage: Number(row[`${col}_below_average`] ?? 0),
        average: Number(row[`${col}_average`] ?? 0),
        good: Number(row[`${col}_good`] ?? 0),
        excellent: Number(row[`${col}_excellent`] ?? 0),
      };
    }

    return result;
  }
}
