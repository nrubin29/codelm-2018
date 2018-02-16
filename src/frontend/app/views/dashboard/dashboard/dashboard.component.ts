import { Component, OnInit, ViewChild } from '@angular/core';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { TeamService } from '../../../services/team.service';
import { ProblemService } from '../../../services/problem.service';
import { MatSidenav } from '@angular/material';
import { TeamModel } from '../../../../../common/models/team.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private team: TeamModel;
  private problems: ProblemModel[] = [];
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  constructor(private problemService: ProblemService, private teamService: TeamService) { }

  ngOnInit() {
    this.teamService.team.subscribe(team => {
      this.team = team;
      this.problemService.getProblems(this.team.division._id).then(problems => this.problems = problems);
    });
  }

  toggle(): Promise<void> {
    return this.sideNav.toggle();
  }
}
