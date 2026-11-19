import {
  RawStudentScoreRecord,
  SubjectCategory,
  SubjectCode,
  SubjectFieldName,
  SubjectMetadata,
} from '../types';
import { Subject } from './Subject';

const FOREIGN_LANGUAGE_LABELS: Record<string, string> = {
  N1: 'English',
  N2: 'Russian',
  N3: 'French',
  N4: 'Chinese',
  N5: 'German',
  N6: 'Japanese',
  N7: 'Korean',
};

export class MandatorySubject extends Subject {
  private readonly tracksForeignLanguageCode: boolean;

  constructor(
    code: SubjectCode,
    fieldName: SubjectFieldName,
    displayName: string,
    vietnameseName: string,
    tracksForeignLanguageCode = false,
  ) {
    super(code, fieldName, displayName, vietnameseName);
    this.tracksForeignLanguageCode = tracksForeignLanguageCode;
  }

  public getCategory(): SubjectCategory {
    return 'MANDATORY';
  }

  protected override extractMetadata(
    record: RawStudentScoreRecord,
  ): SubjectMetadata | undefined {
    if (!this.tracksForeignLanguageCode || !record.maNgoaiNgu) {
      return undefined;
    }

    const languageCode = record.maNgoaiNgu.trim().toUpperCase();
    return {
      foreignLanguageCode: languageCode,
      foreignLanguageName: FOREIGN_LANGUAGE_LABELS[languageCode] ?? languageCode,
    };
  }
}
