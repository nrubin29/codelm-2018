import { ProblemModel } from '../models/problem.model';
import { SubmissionModel } from '../models/submission.model';

export class SubmissionUtil {
  static getSolution(problem: ProblemModel, submissions: SubmissionModel[]): SubmissionModel {
    submissions = submissions.filter(submission => submission.problem._id === problem._id);
    const solved = submissions.filter(submission => submission.points > 0);

    // TODO: Is it safe to assume that points > 0 means success?
    if (solved.length > 0) {
      return solved[0];
    }

    return null;
  }
}