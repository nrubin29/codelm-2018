import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { DivisionModel } from '../../../common/models/division.model';
import { ProblemModel } from '../../../common/models/problem.model';

@Injectable()
export class DivisionService {
  private endpoint = 'divisions';

  constructor(private restService: RestService) { }

  getDivisions(): Promise<DivisionModel[]> {
    return this.restService.get<DivisionModel[]>(this.endpoint);
  }

  addOrUpdateDivision(division: DivisionModel): Promise<DivisionModel> {
      return this.restService.put<DivisionModel>(this.endpoint, division);
  }

  deleteDivision(divisionId: string): Promise<void> {
    return this.restService.delete<void>(`${this.endpoint}/${divisionId}`);
  }
}
