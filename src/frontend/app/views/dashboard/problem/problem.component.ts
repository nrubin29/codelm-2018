import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'codemirror/mode/python/python';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { CodemirrorComponent } from 'ng2-codemirror';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { TeamService } from '../../../services/team.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit, AfterViewInit {
  problem: ProblemModel;
  submissions: SubmissionModel[] = [];
  @ViewChildren(CodemirrorComponent) codeMirrors: QueryList<CodemirrorComponent>;

  constructor(private problemService: ProblemService, private teamService: TeamService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.problem = null;
      this.submissions = [];

      this.problemService.getProblem(params['id']).then(problem => {
        this.problem = problem;
        console.log(this.teamService.team.submissions);
        this.submissions = this.teamService.team.submissions.filter(submission => submission.problem._id === problem._id);
      }).catch(console.log);
    });
  }

  ngAfterViewInit() {
    this.codeMirrors.changes.subscribe((codeMirrors: QueryList<CodemirrorComponent>) => {
      codeMirrors.first.writeValue('print(int(input()) % 2 == 0)');
    });
  }

  submitClicked(type: string) {
    this.problemService.problemSubmission = {
      problemId: this.problem._id,
      code: this.codeMirrors.first.value
    };
    this.router.navigate(['dashboard', 'submit'])
  }
}
