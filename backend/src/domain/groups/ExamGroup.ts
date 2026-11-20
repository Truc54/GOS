import { Subject } from '../subjects/Subject';
import {
  ExamGroupEvaluation,
  RawStudentScoreRecord,
  SubjectCode,
  SubjectEvaluation,
} from '../types';

export class ExamGroup {
  constructor(
    private readonly code: string,
    private readonly name: string,
    private readonly subjects: readonly Subject[],
  ) {
    if (subjects.length === 0) {
      throw new Error(`ExamGroup ${code} must contain at least one subject`);
    }
  }

  public getCode(): string {
    return this.code;
  }

  public getName(): string {
    return this.name;
  }

  public getSubjects(): readonly Subject[] {
    return this.subjects;
  }

  public getDbColumns(): SubjectCode[] {
    return this.subjects.map((subject) => subject.getCode());
  }

  public isEligible(record: Partial<RawStudentScoreRecord>): boolean {
    return this.subjects.every((subject) => subject.extractScore(record) !== null);
  }

  public calculateTotalScore(record: Partial<RawStudentScoreRecord>): number | null {
    let sum = 0;

    for (const subject of this.subjects) {
      const score = subject.extractScore(record);
      if (score === null) {
        return null;
      }
      if (!subject.isValidScore(score)) {
        throw new RangeError(
          `Invalid score (${score}) for subject ${subject.getDisplayName()} in group ${this.code}`,
        );
      }
      sum += score;
    }

    // Avoid IEEE 754 floating-point drift (e.g. 8.4 + 6.0 + 5.25)
    return Math.round(sum * 100) / 100;
  }

  public evaluate(record: RawStudentScoreRecord): ExamGroupEvaluation | null {
    const evaluations: SubjectEvaluation[] = [];
    let sum = 0;

    for (const subject of this.subjects) {
      const evaluation = subject.evaluate(record);
      if (evaluation === null) {
        return null;
      }
      evaluations.push(evaluation);
      sum += evaluation.score;
    }

    return {
      groupCode: this.code,
      groupName: this.name,
      totalScore: Math.round(sum * 100) / 100,
      subjects: evaluations,
    };
  }
}
