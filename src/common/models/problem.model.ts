import { DivisionModel } from './division.model';

// TODO: Add a testCaseOutputMode field that handles case sensitive / insensitive and booleans: (true == True == 1) and (false == False == 0)
export interface ProblemModel {
  _id?: string;
  id: number;
  title: string;
  description: string;
  divisions: DivisionModel[];
  points: number;
  testCasesCaseSensitive: boolean;
  testCases: TestCaseModel[];
}

export interface TestCaseModel {
  hidden: boolean;
  input: string;
  output: string;
}