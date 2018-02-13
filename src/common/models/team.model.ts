import { DivisionModel } from './division.model';
import { SubmissionModel } from './submission.model';
import { UserModel } from './user.model';

export interface TeamModel extends UserModel {
  id: number;
  members: string;
  division: DivisionModel;
  submissions: SubmissionModel[];
  score?: number; // This is optional because it is a Mongoose virtual.
}