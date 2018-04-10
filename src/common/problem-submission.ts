import { TestCaseModel } from './models/problem.model';
import { SubmissionFileModel } from './models/submission.model';

export interface ClientProblemSubmission {
  problemId: string;
}

export interface ClientGradedProblemSubmission extends ClientProblemSubmission {
  language: string;
  code: string;
  test: boolean;
}

export interface ClientUploadProblemSubmission extends ClientProblemSubmission {
  files: SubmissionFileModel[];
}

export interface ServerGradedProblemSubmission {
  problemTitle: string;
  testCases: TestCaseModel[];
  language: string;
  code: string;
}
