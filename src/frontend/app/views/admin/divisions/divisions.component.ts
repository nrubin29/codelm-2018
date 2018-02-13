import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../../../services/problem.service';
import { DivisionModel } from '../../../../../common/models/division.model';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit {
  divisions: DivisionModel[] = [];
  division: DivisionModel = undefined;

  constructor(private divisionService: DivisionService, private problemService: ProblemService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.divisions = [];
    this.division = undefined;

    this.divisionService.getDivisions().then(divisions => {
      this.divisions = divisions;
    });
  }

  get ready() {
    return this.divisions
  }
}
