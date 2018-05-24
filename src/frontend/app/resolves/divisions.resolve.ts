import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DivisionModel } from '../../../common/models/division.model';
import { DivisionService } from '../services/division.service';

@Injectable({
  providedIn: 'root'
})
export class DivisionsResolve implements Resolve<DivisionModel[]> {
  constructor(private divisionService: DivisionService) {}

  resolve(route: ActivatedRouteSnapshot): Promise<DivisionModel[]> {
    return this.divisionService.getDivisions();
  }
}
