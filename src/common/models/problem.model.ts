import { DivisionModel } from './division.model';

// TODO: Add a testCasesOutputBoolean field that handles (true == True == 1) and (false == False == 0)
export interface ProblemModel {
  _id: string;
  id: number;
  title: string;
  description: string;
  divisions: DivisionModel[];
  points: number;
  testCasesCaseSensitive: boolean;
  testCases: TestCaseModel[];
}

export interface TestCaseModel {
  id: number;
  hidden: boolean;
  input: string;
  output: string;
}