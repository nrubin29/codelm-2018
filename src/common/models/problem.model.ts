import { DivisionModel } from './division.model';

export interface ProblemDivision {
  _id?: string;
  division: DivisionModel;
  problemNumber: number;
  points: number;
}

export interface TestCaseModel {
  hidden: boolean;
  input: string;
  output: string;
}

export enum TestCaseOutputMode {
  CaseSensitive = 'Case Sensitive',
  CaseInsensitive = 'Case Insensitive',
  Number = 'Number',
  Boolean = 'Boolean'
}

export enum ProblemType {
  Graded = 'Graded',
  Upload = 'Upload'
}

export interface ProblemModel {
  _id?: string;
  title: string;
  description: string;
  type: ProblemType;
  divisions: ProblemDivision[];
}

export interface GradedProblemModel extends ProblemModel {
  testCaseOutputMode: TestCaseOutputMode;
  testCases: TestCaseModel[];
}

export function isGradedProblem(problem: ProblemModel): problem is GradedProblemModel {
  return problem.type === ProblemType.Graded;
}

export interface UploadProblemModel extends ProblemModel {

}

export function isUploadProblem(problem: ProblemModel): problem is UploadProblemModel {
  return problem.type === ProblemType.Upload;
}
