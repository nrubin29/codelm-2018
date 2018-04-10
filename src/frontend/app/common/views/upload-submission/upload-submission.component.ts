import { Component, Input, OnInit } from '@angular/core';
import { SubmissionComponent } from '../submission/submission.component';
import { UploadSubmissionModel } from '../../../../../common/models/submission.model';

@Component({
  selector: 'app-upload-submission',
  templateUrl: './upload-submission.component.html',
  styleUrls: ['./upload-submission.component.scss']
})
export class UploadSubmissionComponent implements OnInit {
  @Input() submission: UploadSubmissionModel;

  constructor(private submissionComponent: SubmissionComponent) {
  }

  ngOnInit() {
  }

  delete() {
    this.submissionComponent.delete();
  }

  get admin() {
    return this.submissionComponent.admin;
  }
}
