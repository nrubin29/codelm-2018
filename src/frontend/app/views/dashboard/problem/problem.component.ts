import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { TeamService } from '../../../services/team.service';
import { TeamModel } from '../../../../../common/models/team.model';
import { CodeSaverService } from '../../../services/codesaver.service';
import { CodeMirrorComponent } from '../../../components/code-mirror/code-mirror.component';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit, AfterViewInit, OnDestroy {
  team: TeamModel;
  problem: ProblemModel;
  problemNumber: number;
  submissions: SubmissionModel[] = [];

  @ViewChildren(CodeMirrorComponent) codeMirrors: QueryList<CodeMirrorComponent>;
  language: string;
  lastSaved: Date; // TODO: Either display this better or not at all.

  constructor(private problemService: ProblemService, private teamService: TeamService, private codeSaverService: CodeSaverService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.teamService.team.subscribe(team => this.team = team);

    this.activatedRoute.data.subscribe(data => {
      this.problem = data['problem'];
      this.submissions = data['submissions'].filter(submission => submission.problem._id === this.problem._id);
      this.problemNumber = this.problem.divisions.find(division => division.division._id == this.team.division._id).problemNumber;
      this.language = this.codeSaverService.getLanguage();
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
    })
  }

  ngOnDestroy() {
    this.saveCode();
  }

  saveCode() {
    this.codeSaverService.save(this.problem._id, this.codeMirrors.first.config.mode, this.codeMirrors.first.value);
    this.lastSaved = new Date();
  }

  submitClicked(test: boolean) {
    this.saveCode();

    this.problemService.problemSubmission = {
      problemId: this.problem._id,
      language: this.language,
      code: this.codeMirrors.first.value,
      test: test
    };
    this.router.navigate(['dashboard', 'submit'])
  }
}
