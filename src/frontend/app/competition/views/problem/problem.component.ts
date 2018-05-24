import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isGradedProblem, ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { TeamService } from '../../../services/team.service';
import { TeamModel } from '../../../../../common/models/team.model';
import { CodeSaverService } from '../../../services/code-saver.service';
import { ProblemUtil } from '../../../../../common/utils/problem.util';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {
  team: TeamModel;
  problem: ProblemModel;
  submissions: SubmissionModel[] = [];

  problemNumber: number;
  problemPoints: number;

  enableTest = true;
  buttonClicked: Subject<boolean>;

  constructor(private problemService: ProblemService, private teamService: TeamService, private codeSaverService: CodeSaverService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.buttonClicked = new Subject<boolean>();

    this.teamService.team.subscribe(team => this.team = team);

    this.activatedRoute.data.subscribe(data => {
      this.problem = data['problem'];
      this.submissions = data['submissions'].filter(submission => submission.problem._id === this.problem._id);
      this.problemNumber = ProblemUtil.getProblemNumberForTeam(this.problem, this.team);
      this.problemPoints = ProblemUtil.getPoints(this.problem, this.team);
    });
  }

  submitClicked(test: boolean) {
    this.buttonClicked.next(test);
  }

  get isGradedProblem() {
    return isGradedProblem(this.problem);
  }
}
