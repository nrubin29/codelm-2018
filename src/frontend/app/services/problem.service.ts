import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { ProblemModel } from '../../../common/models/problem.model';
import { TestCaseSubmissionModel } from '../../../common/models/submission.model';
import { ProblemSubmission } from '../../../common/problem-submission';

@Injectable()
export class ProblemService {
  private endpoint = 'problems';

  private _problemSubmission: ProblemSubmission; // This holds a ProblemSubmission from problem.component and gives it to submit.component.

  get problemSubmission() {
    const temp = this._problemSubmission;
    this._problemSubmission = undefined;
    return temp;
  }

  set problemSubmission(value: ProblemSubmission) {
    this._problemSubmission = value;
  }

  constructor(private restService: RestService) { }

  getProblem(id: string): Promise<ProblemModel> {
    return this.restService.get<ProblemModel>(`${this.endpoint}/${id}`)
  }

  getProblems(divisionId: string): Promise<ProblemModel[]> {
    return this.restService.get<ProblemModel[]>(`${this.endpoint}/division/${divisionId}`)
  }

  submit(problemSubmission: ProblemSubmission): Promise<TestCaseSubmissionModel[]> {
    return this.restService.post<TestCaseSubmissionModel[]>(`${this.endpoint}/submit`, problemSubmission);
  }
}