import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProblemService } from '../../../services/problem.service';
import { ProblemSubmission } from '../../../../../common/problem-submission';
import { TeamService } from '../../../services/team.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  problemSubmission: ProblemSubmission;
  animation: number;

  constructor(private dashboard: DashboardComponent, private problemService: ProblemService, private teamService: TeamService, private router: Router) { }

  ngOnInit() {
    this.problemSubmission = this.problemService.problemSubmission;
    this.animation = Math.floor(Math.random() * 11);

    this.dashboard.sidebar.toggle();

    this.problemService.submit(this.problemSubmission).then(submissionId => {
      this.teamService.refreshTeam().then(() => {
        setTimeout(() => {
          this.dashboard.sidebar.toggle();
          this.router.navigate(['dashboard', 'submission', submissionId])
        }, 5000);
      });
    });
  }
}
