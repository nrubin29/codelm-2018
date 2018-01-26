import { DivisionModel } from './division.model';

export interface ProblemModel {
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