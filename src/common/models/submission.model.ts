import { ProblemModel} from './problem.model';

export interface TestCaseSubmissionModel {
  id: number;
  hidden: boolean;
  input: string;
  output: string;
  correctOutput: string;
  correct?: boolean; // This is optional because it is a Mongoose virtual.
}

export interface SubmissionModel {
  _id?: string; // This is optional because MongoDB generates the ID.
  problem: ProblemModel;
  code: string;
  testCases: TestCaseSubmissionModel[];
  result: string;
  points?: number; // This is optional because it is a Mongoose virtual.
}