import { TestCaseModel } from './models/problem.model';

export interface ClientProblemSubmission {
  problemId: string;
  language: string;
  code: string;
  test: boolean;
}

export interface ServerProblemSubmission {
  problemTitle: string;
  testCases: TestCaseModel[];
  language: string;
  code: string;
}