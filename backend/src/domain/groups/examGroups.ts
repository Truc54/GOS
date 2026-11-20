import { Subject } from '../subjects/Subject';
import { subjectRegistry } from '../subjects/SubjectRegistry';
import { SubjectCode } from '../types';
import { ExamGroup } from './ExamGroup';

function requireSubject(code: SubjectCode): Subject {
  const subject = subjectRegistry.getByCode(code);
  if (!subject) {
    throw new Error(`Subject "${code}" is not registered in SubjectRegistry`);
  }
  return subject;
}

export const GROUP_A00 = new ExamGroup('A00', 'Group A00', [
  requireSubject('toan'),
  requireSubject('vat_li'),
  requireSubject('hoa_hoc'),
]);

export const GROUP_A01 = new ExamGroup('A01', 'Group A01', [
  requireSubject('toan'),
  requireSubject('vat_li'),
  requireSubject('ngoai_ngu'),
]);

export const GROUP_B00 = new ExamGroup('B00', 'Group B00', [
  requireSubject('toan'),
  requireSubject('hoa_hoc'),
  requireSubject('sinh_hoc'),
]);

export const GROUP_C00 = new ExamGroup('C00', 'Group C00', [
  requireSubject('ngu_van'),
  requireSubject('lich_su'),
  requireSubject('dia_li'),
]);

export const GROUP_D01 = new ExamGroup('D01', 'Group D01', [
  requireSubject('toan'),
  requireSubject('ngu_van'),
  requireSubject('ngoai_ngu'),
]);

export const EXAM_GROUPS: readonly ExamGroup[] = [
  GROUP_A00,
  GROUP_A01,
  GROUP_B00,
  GROUP_C00,
  GROUP_D01,
];
