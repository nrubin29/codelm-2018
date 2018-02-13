import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { SubmissionModel } from '../../../common/models/submission.model';

@Injectable()
export class SubmissionService {
  private endpoint = 'teams/submissions'; // TODO: When an admin is logged in, the endpoint would be teams/:id/submissions

  constructor(private restService: RestService) { }

  getSubmission(id: string): Promise<SubmissionModel> {
    return this.restService.get<SubmissionModel>(`${this.endpoint}/${id}`)
  }

  getSubmissions(teamId: string): Promise<SubmissionModel[]> {
    return this.restService.get<SubmissionModel[]>(`${this.endpoint}`)
  }
}