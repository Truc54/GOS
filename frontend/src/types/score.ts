export type SubjectCode =
  | 'toan'
  | 'ngu_van'
  | 'ngoai_ngu'
  | 'vat_li'
  | 'hoa_hoc'
  | 'sinh_hoc'
  | 'lich_su'
  | 'dia_li'
  | 'gdcd';

export type SubjectCategory = 'MANDATORY' | 'NATURAL_SCIENCE' | 'SOCIAL_SCIENCE';

export type ScoreLevel = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'BELOW_AVERAGE';

export interface SubjectMetadata {
  foreignLanguageCode?: string;
  foreignLanguageName?: string;
}

export interface SubjectEvaluation {
  code: SubjectCode;
  name: string;
  vietnameseName: string;
  category: SubjectCategory;
  score: number;
  level: ScoreLevel;
  metadata?: SubjectMetadata;
}

export interface ExamGroupEvaluation {
  groupCode: string;
  groupName: string;
  totalScore: number;
  subjects: SubjectEvaluation[];
}

export interface StudentScoreDetail {
  sbd: string;
  foreignLanguageCode: string | null;
  subjectCount: number;
  averageScore: number | null;
  subjects: SubjectEvaluation[];
  examGroups: ExamGroupEvaluation[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; message: string }>;
  };
}
