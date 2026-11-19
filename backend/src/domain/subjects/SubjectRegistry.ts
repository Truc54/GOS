import {
  RawStudentScoreRecord,
  SubjectCategory,
  SubjectCode,
  SubjectEvaluation,
} from '../types';
import { MandatorySubject } from './MandatorySubject';
import { NaturalScienceSubject } from './NaturalScienceSubject';
import { SocialScienceSubject } from './SocialScienceSubject';
import { Subject } from './Subject';

export class SubjectRegistry {
  private readonly subjects: Map<SubjectCode, Subject>;

  constructor(subjectList: readonly Subject[]) {
    this.subjects = new Map(subjectList.map((subject) => [subject.getCode(), subject]));
  }

  public getAll(): Subject[] {
    return Array.from(this.subjects.values());
  }

  public getByCode(code: string): Subject | undefined {
    return this.subjects.get(code as SubjectCode);
  }

  public getByCategory(category: SubjectCategory): Subject[] {
    return this.getAll().filter((subject) => subject.getCategory() === category);
  }

  public isValidCode(code: string): code is SubjectCode {
    return this.subjects.has(code as SubjectCode);
  }

  public evaluateStudentRecord(record: RawStudentScoreRecord): SubjectEvaluation[] {
    const evaluations: SubjectEvaluation[] = [];

    for (const subject of this.subjects.values()) {
      const result = subject.evaluate(record);
      if (result !== null) {
        evaluations.push(result);
      }
    }

    return evaluations;
  }
}

export const subjectRegistry = new SubjectRegistry([
  new MandatorySubject('toan', 'toan', 'Mathematics', 'Toán'),
  new MandatorySubject('ngu_van', 'nguVan', 'Literature', 'Ngữ Văn'),
  new MandatorySubject('ngoai_ngu', 'ngoaiNgu', 'Foreign Language', 'Ngoại Ngữ', true),
  new NaturalScienceSubject('vat_li', 'vatLi', 'Physics', 'Vật Lí'),
  new NaturalScienceSubject('hoa_hoc', 'hoaHoc', 'Chemistry', 'Hóa Học'),
  new NaturalScienceSubject('sinh_hoc', 'sinhHoc', 'Biology', 'Sinh Học'),
  new SocialScienceSubject('lich_su', 'lichSu', 'History', 'Lịch Sử'),
  new SocialScienceSubject('dia_li', 'diaLi', 'Geography', 'Địa Lí'),
  new SocialScienceSubject('gdcd', 'gdcd', 'Civic Education', 'GDCD'),
]);
