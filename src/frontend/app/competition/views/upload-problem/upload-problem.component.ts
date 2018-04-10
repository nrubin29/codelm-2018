import { Component, Input, OnInit } from '@angular/core';
import { UploadProblemModel } from '../../../../../common/models/problem.model';
import { ProblemComponent } from '../problem/problem.component';
import { ProblemService } from '../../../services/problem.service';
import { Router } from '@angular/router';
import { ClientUploadProblemSubmission } from '../../../../../common/problem-submission';

@Component({
  selector: 'app-upload-problem',
  templateUrl: './upload-problem.component.html',
  styleUrls: ['./upload-problem.component.scss']
})
export class UploadProblemComponent implements OnInit {
  @Input() problem: UploadProblemModel;

  constructor(private problemService: ProblemService, private problemComponent: ProblemComponent, private router: Router) {
  }

  ngOnInit() {
    this.problemComponent.enableTest = false;
    this.problemComponent.buttonClicked.subscribe(() => {
      // TODO: Load files.

      this.problemService.problemSubmission = {
        problemId: this.problem._id,
        files: []
      } as ClientUploadProblemSubmission;

      this.router.navigate(['dashboard', 'submit']);
    });
  }

}
