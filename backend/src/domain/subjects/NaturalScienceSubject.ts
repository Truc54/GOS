import { SubjectCategory } from '../types';
import { Subject } from './Subject';

export class NaturalScienceSubject extends Subject {
  public getCategory(): SubjectCategory {
    return 'NATURAL_SCIENCE';
  }
}
