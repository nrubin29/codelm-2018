import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { SubmissionService } from '../../../services/submission.service';
import { CodeSaverService } from '../../../services/codesaver.service';
import { CodeMirrorComponent } from '../../../components/code-mirror/code-mirror.component';
import { TeamService } from '../../../services/team.service';

@Component({
  selector: 'app-result',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  private submission: SubmissionModel;
  problemNumber: number;
  mode: string;
  @ViewChild(CodeMirrorComponent) codeMirror: CodeMirrorComponent;

  disputeMessage: string;

  constructor(private submissionService: SubmissionService, private teamService: TeamService, private codeSaverService: CodeSaverService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.submission = data['submission'];
      this.problemNumber = this.submission.problem.divisions.find(division => division.division._id == this.submission.team.division._id).problemNumber;
      this.mode = this.codeSaverService.getMode(this.submission.language);
      this.codeMirror.writeValue(this.submission.code);
    });
  }

  delete() {
    this.submissionService.deleteSubmission(this.submission._id).then(() => {
      this.router.navigate(['/admin', 'team', this.submission.team._id]);
    }).catch(alert);
  }

  overrideCorrect() {
    const submission: SubmissionModel = {...this.submission};
    submission.overrideCorrect = !submission.overrideCorrect;
    this.submissionService.updateSubmission(submission).then(submission => {
      this.submission = submission;
    }).catch(alert);
  }

  sendDispute() {
    if (!this.disputeMessage) {
      alert('Please provide a message explaining your dispute.');
    }

    const submission: SubmissionModel = {...this.submission};
    submission.dispute = {
      open: true,
      message: this.disputeMessage
    };

    this.submissionService.updateSubmission(submission).then(submission => {
      this.submission = submission;
    }).catch(alert);
  }

  resolveDispute() {
    const submission: SubmissionModel = {...this.submission};
    submission.dispute.open = false;

    this.submissionService.updateSubmission(submission).then(submission => {
      this.submission = submission;
    }).catch(alert);
  }

  get admin(): boolean {
    return !this.teamService.team.getValue();
  }
}
