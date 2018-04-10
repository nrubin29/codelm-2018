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
  files: FileList;

  constructor(private problemService: ProblemService, private problemComponent: ProblemComponent, private router: Router) {
  }

  ngOnInit() {
    this.problemComponent.enableTest = false;
    this.problemComponent.buttonClicked.subscribe(() => {
      if (!this.files || this.files.length === 0) {
        alert('You must upload at least one file.');
        return;
      }

      this.problemService.problemSubmission = {
        problemId: this.problem._id,
        files: this.files
      } as ClientUploadProblemSubmission;

      this.router.navigate(['dashboard', 'submit']);
    });
  }

  handleFiles(files: FileList) {
    this.files = files;
  }
}
