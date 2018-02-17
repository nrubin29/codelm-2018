import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { CodemirrorComponent } from 'ng2-codemirror';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { TeamService } from '../../../services/team.service';
import { TeamModel } from '../../../../../common/models/team.model';
import { CodeSaverService } from '../../../services/codesaver.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit, AfterViewInit {
  team: TeamModel;
  problem: ProblemModel;
  submissions: SubmissionModel[] = [];

  @ViewChildren(CodemirrorComponent) codeMirrors: QueryList<CodemirrorComponent>;
  language: string;

  constructor(private problemService: ProblemService, private teamService: TeamService, private codeSaverService: CodeSaverService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.teamService.team.subscribe(team => this.team = team);

    this.activatedRoute.data.subscribe(data => {
      this.problem = data['problem'];
      this.submissions = this.team.submissions.filter(submission => submission.problem._id === this.problem._id);
      this.language = this.codeSaverService.getLanguage();
    });
  }

  ngAfterViewInit() {
    this.write(this.codeMirrors.first);
    this.codeMirrors.changes.subscribe((codeMirrors: QueryList<CodemirrorComponent>) => {
      codeMirrors.forEach(cm => this.write(cm));
    });
  }

  private write(codeMirror: CodemirrorComponent) {
    codeMirror.writeValue(this.codeSaverService.get(this.problem._id, codeMirror.config.mode));
  }

  saveCode() {
    this.codeSaverService.save(this.problem._id, this.codeMirrors.first.config.mode, this.codeMirrors.first.value);
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
