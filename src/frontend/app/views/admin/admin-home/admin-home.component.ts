import { Component, OnInit } from '@angular/core';
import { DivisionModel } from '../../../../../common/models/division.model';
import { DivisionService } from '../../../services/division.service';

// TODO: Use a resolve.

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  divisions: DivisionModel[] = [];

  constructor(private divisionService: DivisionService) { }

  ngOnInit() {
    this.divisionService.getDivisions().then(divisions => this.divisions = divisions);
  }
}
