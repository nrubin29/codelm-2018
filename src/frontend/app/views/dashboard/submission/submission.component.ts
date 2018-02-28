import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
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

  constructor(private submissionService: SubmissionService, private teamService: TeamService, private codeSaverService: CodeSaverService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.submission = data['submission'];
      // TODO: If this submission is being viewed by an admin, TeamService's team won't have a value.
      this.problemNumber = this.submission.problem.divisions.find(division => division.division._id == this.teamService.team.getValue().division._id).problemNumber;
      this.mode = this.codeSaverService.getMode(this.submission.language);
      this.codeMirror.writeValue(this.submission.code);
    });
  }
}
