import { DivisionModel } from './division.model';

export interface ProblemDivision {
  _id?: string;
  division: DivisionModel;
  problemNumber: number;
}

// TODO: Add a testCaseOutputMode field that handles case sensitive / insensitive and booleans: (true == True == 1) and (false == False == 0)
export interface ProblemModel {
  _id?: string;
  title: string;
  description: string;
  divisions: ProblemDivision[];
  points: number;
  testCasesCaseSensitive: boolean;
  testCases: TestCaseModel[];
}

export interface TestCaseModel {
  hidden: boolean;
  input: string;
  output: string;
}