import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProblemService } from '../../../services/problem.service';
import { ClientProblemSubmission } from '../../../../../common/problem-submission';
import { TeamService } from '../../../services/team.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  problemSubmission: ClientProblemSubmission;
  animation: number;
  finished: boolean;

  constructor(private dashboard: DashboardComponent, private problemService: ProblemService, private teamService: TeamService, private router: Router) { }

  ngOnInit() {
    this.finished = false;
    this.problemSubmission = this.problemService.problemSubmission;
    this.animation = Math.floor(Math.random() * 11);

    this.dashboard.toggle().then(() => {
      this.problemService.submit(this.problemSubmission).then(submissionId => {
        this.teamService.refreshTeam().then(() => {
          setTimeout(() => {
            this.dashboard.toggle().then(() => {
              setTimeout(() => {
                this.finished = true;
                this.router.navigate(['dashboard', 'submission', submissionId]);
              }, 200);
            });
          }, 5000);
        });
      });
    });
  }
}
