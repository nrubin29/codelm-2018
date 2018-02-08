import { ProblemModel} from './problem.model';

export interface TestCaseSubmissionModel {
  id: number;
  hidden: boolean;
  input: string;
  output: string;
  correctOutput: string;
  correct?: boolean; // This is optional because it is a Mongoose virtual.
}

interface BaseSubmissionModel {
  _id?: string; // This is optional because MongoDB generates the ID.
  problem: ProblemModel;
  language: string;
  code: string;
  result: string;
  test: boolean;
  points?: number; // This is optional because it is a Mongoose virtual.
}

interface ErrorSubmissionModel extends BaseSubmissionModel {
  error?: string;
}

interface SuccessSubmissionModel extends BaseSubmissionModel {
  testCases?: TestCaseSubmissionModel[];
}

export interface SubmissionModel extends ErrorSubmissionModel, SuccessSubmissionModel {}