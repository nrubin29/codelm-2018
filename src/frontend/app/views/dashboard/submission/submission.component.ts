import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { CodemirrorComponent } from 'ng2-codemirror';
import { SubmissionService } from '../../../services/submission.service';
import { Subscription } from 'rxjs/Subscription';
import { CodeSaverService } from '../../../services/codesaver.service';

@Component({
  selector: 'app-result',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  private submission: SubmissionModel;
  mode: string;
  @ViewChild(CodemirrorComponent) codeMirror: CodemirrorComponent;

  constructor(private submissionService: SubmissionService, private codeSaverService: CodeSaverService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.submission = data['submission'];
      this.mode = this.codeSaverService.getMode(this.submission.language);
      this.codeMirror.writeValue(this.submission.code);
    });
  }
}
