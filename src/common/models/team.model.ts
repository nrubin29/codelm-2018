import { DivisionModel } from './division.model';
import { SubmissionModel } from './submission.model';

export interface TeamModel {
  id: number;
  username: string;
  members: string;
  division: DivisionModel;
  submissions: SubmissionModel[];
}