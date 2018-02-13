import { Component, OnInit } from '@angular/core';
import { DivisionModel } from '../../../../../common/models/division.model';
import { DivisionService } from '../../../services/division.service';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss']
})
export class ProblemsComponent implements OnInit {
  divisions: DivisionModel[] = [];
  problems: {[divisionId: string]: ProblemModel[]} = {};
  problem: ProblemModel = undefined;

  constructor(private divisionService: DivisionService, private problemService: ProblemService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.divisions = [];
    this.problems = {};
    this.problem = undefined;

    this.divisionService.getDivisions().then(divisions => {
      this.divisions = divisions;

      for (let division of divisions) {
        this.problemService.getProblems(division._id).then(problems => {
          this.problems[division._id] = problems;
        });
      }
    });
  }

  get ready() {
    return this.divisions && Object.getOwnPropertyNames(this.problems).length === this.divisions.length
  }
}
