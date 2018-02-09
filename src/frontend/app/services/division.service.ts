import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { DivisionModel } from '../../../common/models/division.model';

@Injectable()
export class DivisionService {
  private endpoint = 'divisions';

  constructor(private restService: RestService) { }

  getDivisions(): Promise<DivisionModel[]> {
    return this.restService.get<DivisionModel[]>(this.endpoint);
  }
}
