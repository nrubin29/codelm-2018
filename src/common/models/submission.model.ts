import { ProblemModel} from './problem.model';

export interface SubmissionModel {
  id: number;
  // team: TeamModel;
  problem: ProblemModel;
  code: string;
  testCases: {id: number, hidden: boolean, input: string, output: string, correctOutput: string}[];
  result: string;
}