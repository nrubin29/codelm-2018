import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProblemService } from '../../../services/problem.service';
import { ProblemSubmission } from '../../../../../common/problem-submission';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  problemSubmission: ProblemSubmission;

  constructor(private dashboard: DashboardComponent, private problemService: ProblemService, private router: Router) { }

  ngOnInit() {
    this.problemSubmission = this.problemService.problemSubmission;
    this.dashboard.sidebar.toggle();

    this.problemService.submit(this.problemSubmission).then(submissionId => {
      this.dashboard.sidebar.toggle();
      this.router.navigate(['dashboard', 'submission', submissionId])
    });
  }
}
