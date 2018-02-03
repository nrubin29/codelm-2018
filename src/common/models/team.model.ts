import { DivisionModel } from './division.model';
import { SubmissionModel } from './submission.model';

export interface TeamModel {
  _id: string;
  id: number;
  username: string;
  password: string;
  salt: string;
  members: string;
  division: DivisionModel;
  submissions: SubmissionModel[];
  score?: number; // This is optional because it is a Mongoose virtual.
}