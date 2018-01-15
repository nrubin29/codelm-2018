import { TeamModel } from './team.model';
import { ProblemModel, TestCaseModel } from './problem.model';

export interface SubmissionModel {
  id: number;
  team: TeamModel;
  problem: ProblemModel;
  code: string;
  testCases: {testCase: TestCaseModel, output: string}[];
  result: string;
}