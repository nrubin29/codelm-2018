import { Component, OnInit } from '@angular/core';
import { ProblemModel } from '../../../../common/models/problem.model';
import { ProblemService } from '../../services/problem.service';
import { TeamService } from '../../services/team.service';
import { TeamModel } from '../../../../common/models/team.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  team: TeamModel;
  problems: ProblemModel[] = [];
  state = 'out';

  constructor(private problemService: ProblemService, private teamService: TeamService) { }

  ngOnInit() {
    this.teamService.team.subscribe(team => {
      this.team = team;
      this.problemService.getProblems(this.team.division._id).then(problems => this.problems = problems);
    });
  }

  toggle() {
    this.state = this.state === 'out' ? 'in': 'out';
  }
}
