import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProblemService } from '../../../services/problem.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  constructor(private dashboard: DashboardComponent, private problemService: ProblemService, private router: Router) { }

  ngOnInit() {
    this.dashboard.sidebar.toggle();

    this.problemService.submit(this.problemService.problemSubmission).then(submissionId => {
      this.dashboard.sidebar.toggle();
      this.router.navigate(['dashboard', 'submission', submissionId])
    });
  }
}
