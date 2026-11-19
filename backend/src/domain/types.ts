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

export type SubjectFieldName =
  | 'toan'
  | 'nguVan'
  | 'ngoaiNgu'
  | 'vatLi'
  | 'hoaHoc'
  | 'sinhHoc'
  | 'lichSu'
  | 'diaLi'
  | 'gdcd';

export type SubjectCategory = 'MANDATORY' | 'NATURAL_SCIENCE' | 'SOCIAL_SCIENCE';

export enum ScoreLevel {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  POOR = 'POOR',
}

export interface RawStudentScoreRecord {
  sbd: string;
  toan: number | null;
  nguVan: number | null;
  ngoaiNgu: number | null;
  vatLi: number | null;
  hoaHoc: number | null;
  sinhHoc: number | null;
  lichSu: number | null;
  diaLi: number | null;
  gdcd: number | null;
  maNgoaiNgu: string | null;
}

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
