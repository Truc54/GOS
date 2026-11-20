import {
  ScoreLevel,
  type RawStudentScoreRecord,
  type SubjectCategory,
  type SubjectCode,
  type SubjectEvaluation,
  type SubjectFieldName,
  type SubjectMetadata,
} from '../types';

export const SCORE_LEVEL_THRESHOLDS = {
  EXCELLENT_MIN: 8,
  GOOD_MIN: 6,
  AVERAGE_MIN: 4,
} as const;

export abstract class Subject {
  constructor(
    protected readonly code: SubjectCode,
    protected readonly fieldName: SubjectFieldName,
    protected readonly displayName: string,
    protected readonly vietnameseName: string,
  ) {}

  public getCode(): SubjectCode {
    return this.code;
  }

  public getFieldName(): SubjectFieldName {
    return this.fieldName;
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public getVietnameseName(): string {
    return this.vietnameseName;
  }

  public abstract getCategory(): SubjectCategory;

  public isValidScore(score: number): boolean {
    return Number.isFinite(score) && score >= 0 && score <= 10;
  }

  public classifyScore(score: number): ScoreLevel {
    if (!this.isValidScore(score)) {
      throw new RangeError(
        `Invalid score (${score}) for subject ${this.displayName}. Expected value between 0 and 10.`,
      );
    }

    if (score >= SCORE_LEVEL_THRESHOLDS.EXCELLENT_MIN) return ScoreLevel.EXCELLENT;
    if (score >= SCORE_LEVEL_THRESHOLDS.GOOD_MIN) return ScoreLevel.GOOD;
    if (score >= SCORE_LEVEL_THRESHOLDS.AVERAGE_MIN) return ScoreLevel.AVERAGE;
    return ScoreLevel.BELOW_AVERAGE;
  }

  public extractScore(record: RawStudentScoreRecord): number | null {
    const value = record[this.fieldName];
    return typeof value === 'number' ? value : null;
  }

  protected extractMetadata(_record: RawStudentScoreRecord): SubjectMetadata | undefined {
    return undefined;
  }

  public evaluate(record: RawStudentScoreRecord): SubjectEvaluation | null {
    const score = this.extractScore(record);
    if (score === null) {
      return null;
    }

    const metadata = this.extractMetadata(record);
    return {
      code: this.code,
      name: this.displayName,
      vietnameseName: this.vietnameseName,
      category: this.getCategory(),
      score,
      level: this.classifyScore(score),
      ...(metadata ? { metadata } : {}),
    };
  }
}
