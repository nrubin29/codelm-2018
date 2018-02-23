import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../../../../common/models/team.model';
import { TeamService } from '../../../services/team.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  team: TeamModel;
  link: string;

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.teamService.team.subscribe(team => {
      this.team = team;
      this.link = '/assets/' + team.division.name.split(new RegExp(/[\s/]/)).join('') + '.zip';
    });
  }
}
