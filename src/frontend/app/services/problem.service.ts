import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { ProblemModel } from '../../../common/models/problem.model';
import { TestCaseSubmissionModel } from '../../../common/models/submission.model';
import { ClientProblemSubmission, isUploadProblemSubmission } from '../../../common/problem-submission';

@Injectable()
export class ProblemService {
  private endpoint = 'problems';

  // This holds a ClientProblemSubmission from problem.component and gives it to submit.component.
  private _problemSubmission: ClientProblemSubmission;

  get problemSubmission() {
    const temp = this._problemSubmission;
    this._problemSubmission = undefined;
    return temp;
  }

  get peekProblemSubmission() {
    return this._problemSubmission;
  }

  set problemSubmission(value: ClientProblemSubmission) {
    this._problemSubmission = value;
  }

  constructor(private restService: RestService) { }

  getProblem(id: string): Promise<ProblemModel> {
    return this.restService.get<ProblemModel>(`${this.endpoint}/${id}`);
  }

  getProblems(divisionId: string): Promise<ProblemModel[]> {
    return this.restService.get<ProblemModel[]>(`${this.endpoint}/division/${divisionId}`);
  }

  submit(problemSubmission: ClientProblemSubmission): Promise<TestCaseSubmissionModel[]> {
    const formData = new FormData();

    if (isUploadProblemSubmission(problemSubmission)) {
      for (let i = 0; i < problemSubmission.files.length; i++) {
        formData.append('files', problemSubmission.files[i], problemSubmission.files[i].name);
      }

      delete problemSubmission.files;
    }

    for (const key of Object.keys(problemSubmission)) {
      formData.append(key, problemSubmission[key]);
    }

    return this.restService.post<TestCaseSubmissionModel[]>(`${this.endpoint}/submit`, formData);
  }

  addOrUpdateProblem(problem: any): Promise<ProblemModel> {
    // problem should be a ProblemModel but division is a string[] rather than a DivisionModel[].
    return this.restService.put<ProblemModel>(this.endpoint, problem);
  }

  deleteProblem(problemId: string): Promise<void> {
    return this.restService.delete<void>(`${this.endpoint}/${problemId}`);
  }
}
