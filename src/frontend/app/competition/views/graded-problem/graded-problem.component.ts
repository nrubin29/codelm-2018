import { AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GradedProblemModel } from '../../../../../common/models/problem.model';
import { CodeMirrorComponent } from '../../../common/components/code-mirror/code-mirror.component';
import { TeamModel } from '../../../../../common/models/team.model';
import { CodeSaverService } from '../../../services/code-saver.service';
import { ProblemService } from '../../../services/problem.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import { ProblemComponent } from '../problem/problem.component';
import { ClientGradedProblemSubmission } from '../../../../../common/problem-submission';

@Component({
  selector: 'app-graded-problem',
  templateUrl: './graded-problem.component.html',
  styleUrls: ['./graded-problem.component.scss']
})
export class GradedProblemComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() problem: GradedProblemModel;
  team: TeamModel;

  @ViewChildren(CodeMirrorComponent) codeMirrors: QueryList<CodeMirrorComponent>;
  language: string;

  constructor(private problemService: ProblemService, private codeSaverService: CodeSaverService, private problemComponent: ProblemComponent, private router: Router) {
  }

  ngOnInit() {
    this.language = this.codeSaverService.getLanguage();

    this.problemComponent.enableTest = true;
    this.problemComponent.buttonClicked.subscribe(test => {
      this.saveCode();

      this.problemService.problemSubmission = {
        problemId: this.problem._id,
        language: this.language,
        code: this.codeMirrors.first.value,
        test: test
      } as ClientGradedProblemSubmission;

      this.router.navigate(['dashboard', 'submit']);
    });
  }

  ngAfterViewInit() {
    this.subscribeTo(this.codeMirrors.first);

    this.codeMirrors.changes.subscribe((codeMirrors: QueryList<CodeMirrorComponent>) => {
      codeMirrors.forEach(cm => this.subscribeTo(cm));
    });
  }

  private subscribeTo(codeMirror: CodeMirrorComponent) {
    codeMirror.writeValue(this.codeSaverService.get(this.problem._id, codeMirror.config.mode));
    codeMirror.change.debounceTime(5000).subscribe(() => {
      this.saveCode();
    });
  }

  ngOnDestroy() {
    this.saveCode();
  }

  saveCode() {
    this.codeSaverService.save(this.problem._id, this.codeMirrors.first.config.mode, this.codeMirrors.first.value);
  }

  get documentation() {
    return this.codeSaverService.getDocumentation();
  }
}
