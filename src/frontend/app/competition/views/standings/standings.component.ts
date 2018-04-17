import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../../../../common/models/team.model';
import { TeamService } from '../../../services/team.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  team: TeamModel;
  link: string;

  constructor(private teamService: TeamService, private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.teamService.team.subscribe(team => {
      this.team = team;

      this.settingsService.getSettings().then(settings => {
        this.link = '/files/' + settings.state.toString().toLowerCase() + '/' + team.division._id + '.zip';
      });
    });
  }
}
