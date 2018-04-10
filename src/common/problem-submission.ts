import { TestCaseModel } from './models/problem.model';

export interface ClientProblemSubmission {
  problemId: string;
}

export interface ClientGradedProblemSubmission extends ClientProblemSubmission {
  language: string;
  code: string;
  test: boolean;
}

export interface ClientUploadProblemSubmission extends ClientProblemSubmission {
  files: FileList;
}

export function isUploadProblemSubmission(problemSubmission: ClientProblemSubmission): problemSubmission is ClientUploadProblemSubmission {
  return (problemSubmission as any).files !== undefined;
}

export interface ServerGradedProblemSubmission {
  problemTitle: string;
  testCases: TestCaseModel[];
  language: string;
  code: string;
}
