import { SubjectCategory } from '../types';
import { Subject } from './Subject';

export class SocialScienceSubject extends Subject {
  public getCategory(): SubjectCategory {
    return 'SOCIAL_SCIENCE';
  }
}
