import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
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
export class SubmissionComponent implements OnInit, AfterViewInit, OnDestroy {
  private sub: Subscription;

  private submission: SubmissionModel;
  mode: string;
  @ViewChildren(CodemirrorComponent) codeMirrors: QueryList<CodemirrorComponent>;

  constructor(private submissionService: SubmissionService, private codeSaverService: CodeSaverService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.sub = this.activatedRoute.paramMap.switchMap((params: ParamMap) => params.get('id')).subscribe(id => {
    //   this.submission = null;
    //   this.submissionService.getSubmission(id).then(submission => this.submission = submission).catch(console.log)
    // });

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.submission = null;
      this.submissionService.getSubmission(params['id']).then(submission => {
        this.submission = submission;
        this.mode = this.codeSaverService.getMode(submission.language);
      }).catch(console.log);
    })
  }

  ngAfterViewInit() {
    this.codeMirrors.changes.subscribe((codeMirrors: QueryList<CodemirrorComponent>) => {
      codeMirrors.first.writeValue(this.submission.code)
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
