import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../../../../common/models/team.model';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { SubmissionModel } from '../../../../../common/models/submission.model';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  team: TeamModel;
  problems: ProblemModel[] = [];
  problemSubmissions: {[problemId: string]: SubmissionModel[]} = {};

  constructor(private teamService: TeamService, private problemService: ProblemService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      const teamAndProblems = data['team'];
      this.team = teamAndProblems[0];
      this.problems = teamAndProblems[1];
      for (let problem of this.problems) {
        this.problemSubmissions[problem._id] = this.team.submissions.filter(submission => submission.problem._id === problem._id);
      }
    });
  }
}