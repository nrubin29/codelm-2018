import { TeamModel } from './team.model';
import { ProblemModel } from './problem.model';

export interface SubmissionModel {
  id: number;
  team: TeamModel;
  problem: ProblemModel;
  testCases: TestCaseModel[];
  result: string;
}

export interface TestCaseModel {
  id: number;
  hidden: boolean;
  input: string;
  output: string;
  correct: string;
}