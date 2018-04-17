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

  addOrUpdateDivision(division: DivisionModel & { graded?: File, upload?: File }): Promise<DivisionModel> {
    const formData = new FormData();

    if (division.graded) {
      formData.append('gradedStarterCode', division.graded, division.graded.name);
      delete division.graded;
    }

    if (division.upload) {
      formData.append('uploadStarterCode', division.upload, division.upload.name);
      delete division.upload;
    }

    for (const key of Object.keys(division)) {
      formData.append(key, division[key]);
    }

    return this.restService.put<DivisionModel>(this.endpoint, formData);
  }

  deleteDivision(divisionId: string): Promise<void> {
    return this.restService.delete<void>(`${this.endpoint}/${divisionId}`);
  }
}
