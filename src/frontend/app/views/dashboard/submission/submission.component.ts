import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { CodemirrorComponent } from 'ng2-codemirror';
import { SubmissionService } from '../../../services/submission.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-result',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit, AfterViewInit, OnDestroy {
  private sub: Subscription;

  private submission: SubmissionModel;
  @ViewChildren(CodemirrorComponent) codeMirrors: QueryList<CodemirrorComponent>;

  constructor(private submissionService: SubmissionService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.sub = this.activatedRoute.paramMap.switchMap((params: ParamMap) => params.get('id')).subscribe(id => {
    //   this.submission = null;
    //   this.submissionService.getSubmission(id).then(submission => this.submission = submission).catch(console.log)
    // });

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.sub = null;
      this.submissionService.getSubmission(params['id']).then(submission => this.submission = submission).catch(console.log)
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
