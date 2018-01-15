import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { ProblemModel } from '../../../common/models/problem.model';

@Injectable()
export class ProblemService {

  private endpoint = 'problems';

  constructor(private restService: RestService) { }

  getProblem(id: string): Promise<ProblemModel> {
    return this.restService.get<ProblemModel>(`${this.endpoint}/${id}`)
  }

  getProblems(divisionId: string): Promise<ProblemModel[]> {
    return this.restService.get<ProblemModel[]>(`${this.endpoint}/division/${divisionId}`)
  }
}
