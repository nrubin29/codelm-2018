import { DivisionModel } from './division.model';

export enum TestCaseOutputMode {
  CaseSensitive = 'Case Sensitive',
  CaseInsensitive = 'Case Insensitive',
  Number = 'Number',
  Boolean = 'Boolean'
}

export interface ProblemDivision {
  _id?: string;
  division: DivisionModel;
  problemNumber: number;
  points: number;
}

export interface ProblemModel {
  _id?: string;
  title: string;
  description: string;
  divisions: ProblemDivision[];
  testCaseOutputMode: TestCaseOutputMode;
  testCases: TestCaseModel[];
}

export interface TestCaseModel {
  hidden: boolean;
  input: string;
  output: string;
}