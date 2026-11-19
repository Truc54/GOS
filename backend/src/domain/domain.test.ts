import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  GROUP_A00,
  GROUP_C00,
  RawStudentScoreRecord,
  ScoreLevel,
  subjectRegistry,
} from './index';

const naturalScienceStudent: RawStudentScoreRecord = {
  sbd: '01000001',
  toan: 8.4,
  nguVan: 6.75,
  ngoaiNgu: 8.0,
  vatLi: 6.0,
  hoaHoc: 5.25,
  sinhHoc: 5.0,
  lichSu: null,
  diaLi: null,
  gdcd: null,
  maNgoaiNgu: 'N1',
};

const socialScienceStudent: RawStudentScoreRecord = {
  sbd: '01000002',
  toan: 8.6,
  nguVan: 8.5,
  ngoaiNgu: 7.2,
  vatLi: null,
  hoaHoc: null,
  sinhHoc: null,
  lichSu: 7.25,
  diaLi: 6.0,
  gdcd: 8.0,
  maNgoaiNgu: 'N1',
};

describe('Subject OOP hierarchy', () => {
  it('registers all 9 national exam subjects across 3 categories', () => {
    assert.equal(subjectRegistry.getAll().length, 9);
    assert.equal(subjectRegistry.getByCategory('MANDATORY').length, 3);
    assert.equal(subjectRegistry.getByCategory('NATURAL_SCIENCE').length, 3);
    assert.equal(subjectRegistry.getByCategory('SOCIAL_SCIENCE').length, 3);
  });

  it('classifies boundary scores accurately across 4 levels', () => {
    const math = subjectRegistry.getByCode('toan');
    assert.ok(math);

    assert.equal(math.classifyScore(10), ScoreLevel.EXCELLENT);
    assert.equal(math.classifyScore(8.0), ScoreLevel.EXCELLENT);
    assert.equal(math.classifyScore(7.99), ScoreLevel.GOOD);
    assert.equal(math.classifyScore(6.0), ScoreLevel.GOOD);
    assert.equal(math.classifyScore(5.99), ScoreLevel.AVERAGE);
    assert.equal(math.classifyScore(4.0), ScoreLevel.AVERAGE);
    assert.equal(math.classifyScore(3.99), ScoreLevel.POOR);
    assert.equal(math.classifyScore(0), ScoreLevel.POOR);

    assert.throws(() => math.classifyScore(-0.1), RangeError);
    assert.throws(() => math.classifyScore(10.25), RangeError);
    assert.throws(() => math.classifyScore(Number.NaN), RangeError);
  });

  it('attaches foreign language metadata only to ngoai_ngu via polymorphism', () => {
    const evaluations = subjectRegistry.evaluateStudentRecord(naturalScienceStudent);
    assert.equal(evaluations.length, 6);

    const foreignLang = evaluations.find((item) => item.code === 'ngoai_ngu');
    const math = evaluations.find((item) => item.code === 'toan');

    assert.deepEqual(foreignLang?.metadata, {
      foreignLanguageCode: 'N1',
      foreignLanguageName: 'English',
    });
    assert.equal(math?.metadata, undefined);
  });

  it('skips subjects the student did not take', () => {
    const evaluations = subjectRegistry.evaluateStudentRecord(socialScienceStudent);
    const codes = evaluations.map((item) => item.code);

    assert.deepEqual(codes, ['toan', 'ngu_van', 'ngoai_ngu', 'lich_su', 'dia_li', 'gdcd']);
  });
});

describe('ExamGroup OOP calculations', () => {
  it('computes Group A00 total accurately without floating-point drift', () => {
    assert.equal(GROUP_A00.isEligible(naturalScienceStudent), true);
    assert.equal(GROUP_A00.calculateTotalScore(naturalScienceStudent), 19.65);

    const evaluation = GROUP_A00.evaluate(naturalScienceStudent);
    assert.ok(evaluation);
    assert.equal(evaluation.groupCode, 'A00');
    assert.equal(evaluation.totalScore, 19.65);
    assert.equal(evaluation.subjects.length, 3);
  });

  it('returns null when student is missing any subject in the group', () => {
    assert.equal(GROUP_A00.isEligible(socialScienceStudent), false);
    assert.equal(GROUP_A00.calculateTotalScore(socialScienceStudent), null);
    assert.equal(GROUP_A00.evaluate(socialScienceStudent), null);

    assert.equal(GROUP_C00.isEligible(socialScienceStudent), true);
    assert.equal(GROUP_C00.calculateTotalScore(socialScienceStudent), 21.75);
  });
});
