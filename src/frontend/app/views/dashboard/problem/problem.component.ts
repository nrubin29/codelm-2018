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
  config: any;

  constructor(private problemService: ProblemService, private teamService: TeamService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.language = 'python';
    this.config = { lineNumbers: true, mode: 'text/x-python' };

    this.teamService.team.subscribe(team => this.team = team);

    this.activatedRoute.params.subscribe(params => {
      this.problem = null;
      this.submissions = [];

      this.problemService.getProblem(params['id']).then(problem => {
        this.problem = problem;
        this.submissions = this.team.submissions.filter(submission => submission.problem._id === problem._id);
      }).catch(console.log);
    });
  }

  ngAfterViewInit() {
    this.codeMirrors.changes.subscribe((codeMirrors: QueryList<CodemirrorComponent>) => {
      codeMirrors.first.writeValue('print(int(input()) % 2 == 0)');
    });
  }

  onLanguageChange() {
    this.config.mode = {
      python: 'text/x-python',
      java: 'text/x-java',
      cpp: 'text/x-c++src'
    }[this.language];

    // this.codeMirrors.first.codemirrorInit(this.config);
  }

  submitClicked(test: boolean) {
    this.problemService.problemSubmission = {
      problemId: this.problem._id,
      code: this.codeMirrors.first.value,
      test: test
    };
    this.router.navigate(['dashboard', 'submit'])
  }
}
