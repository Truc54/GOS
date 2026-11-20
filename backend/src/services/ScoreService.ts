import { HttpStatus } from '../constants/httpStatus';
import { ExamGroup } from '../domain/groups/ExamGroup';
import { EXAM_GROUPS } from '../domain/groups/examGroups';
import { SubjectRegistry, subjectRegistry } from '../domain/subjects/SubjectRegistry';
import type { ExamGroupEvaluation, SubjectEvaluation } from '../domain/types';
import { AppError } from '../middlewares/errorHandler';
import { ScoreRepository } from '../repositories/ScoreRepository';

export interface StudentScoreDetailResponse {
  sbd: string;
  foreignLanguageCode: string | null;
  subjectCount: number;
  averageScore: number | null;
  subjects: SubjectEvaluation[];
  examGroups: ExamGroupEvaluation[];
}

export class ScoreService {
  constructor(
    private readonly repository: ScoreRepository = new ScoreRepository(),
    private readonly registry: SubjectRegistry = subjectRegistry,
    private readonly examGroups: readonly ExamGroup[] = EXAM_GROUPS,
  ) {}

  public async getScoreBySbd(sbd: string): Promise<StudentScoreDetailResponse> {
    const record = await this.repository.findBySbd(sbd);

    if (!record) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'SCORE_NOT_FOUND',
        `No exam scores found for registration number ${sbd}.`,
      );
    }

    const subjects = this.registry.evaluateStudentRecord(record);
    const examGroups = this.examGroups
      .map((group) => group.evaluate(record))
      .filter((evaluation): evaluation is ExamGroupEvaluation => evaluation !== null);

    const averageScore =
      subjects.length > 0
        ? Math.round(
            (subjects.reduce((acc, item) => acc + item.score, 0) / subjects.length) * 100,
          ) / 100
        : null;

    return {
      sbd: record.sbd,
      foreignLanguageCode: record.maNgoaiNgu,
      subjectCount: subjects.length,
      averageScore,
      subjects,
      examGroups,
    };
  }
}
