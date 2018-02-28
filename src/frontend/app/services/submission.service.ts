import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { SubmissionModel } from '../../../common/models/submission.model';

@Injectable()
export class SubmissionService {
  private endpoint = 'submissions';

  constructor(private restService: RestService) { }

  getSubmission(id: string): Promise<SubmissionModel> {
    return this.restService.get<SubmissionModel>(`${this.endpoint}/${id}`)
  }

  getSubmissions(): Promise<SubmissionModel[]> {
    return this.restService.get<SubmissionModel[]>(this.endpoint);
  }

  getSubmissionsForTeam(teamId: string): Promise<SubmissionModel[]> {
    return this.restService.get<SubmissionModel[]>(`${this.endpoint}/team/${teamId}`)
  }
}
