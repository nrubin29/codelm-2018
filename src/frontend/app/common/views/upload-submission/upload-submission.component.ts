import { Component, Input, OnInit } from '@angular/core';
import { SubmissionComponent } from '../submission/submission.component';
import { UploadSubmissionModel } from '../../../../../common/models/submission.model';
import { SubmissionService } from '../../../services/submission.service';

@Component({
  selector: 'app-upload-submission',
  templateUrl: './upload-submission.component.html',
  styleUrls: ['./upload-submission.component.scss']
})
export class UploadSubmissionComponent implements OnInit {
  @Input() submission: UploadSubmissionModel;
  score: number;

  constructor(private submissionComponent: SubmissionComponent, private submissionService: SubmissionService) {
  }

  ngOnInit() {
  }

  setScore() {
    this.submission.score = this.score;
    this.submissionService.updateSubmission(this.submission).then(() => {
      this.submission.points = this.score;
      alert('Updated');
    }).catch(alert);
  }

  delete() {
    this.submissionComponent.delete();
  }

  get admin() {
    return this.submissionComponent.admin;
  }
}
