import { Component, OnInit } from '@angular/core';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DivisionModelWithProblems } from './divisions-problems.resolve';
import { MatDialog } from '@angular/material';
import { EditProblemComponent } from '../../../components/edit-problem/edit-problem.component';
import { DialogResult } from '../../../dialog-result';
import { ProblemService } from '../../../services/problem.service';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss']
})
export class ProblemsComponent implements OnInit {
  divisions: DivisionModelWithProblems[] = [];

  constructor(private problemService: ProblemService, private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.divisions = data['divisionsAndProblems'];
    });
  }

  edit(problem: ProblemModel) {
    const ref = this.dialog.open(EditProblemComponent, {
      data: {
        problem: problem,
        divisions: this.divisions
      }
    });

    ref.afterClosed().subscribe((r: [DialogResult, any]) => {
      const result = r[0];
      const data = r[1];

      // TODO: Correctly update data or reload route.
      if (result === 'save') {
        this.problemService.addOrUpdateProblem(data).then(() => {
          // this.divisions.filter(division => data.divisions.indexOf(division._id) !== -1).forEach(division => {
          //   division.problems = division.problems.filter(problem => problem._id != data._id).concat(data);
          // });
        }).catch(alert);
      }

      else if (result === 'delete') {
        // TODO: Replace this confirm with another dialog.
        if (confirm('Are you sure you want to delete this problem?')) {
          this.problemService.deleteProblem(data._id).then(() => {
            // this.divisions.filter(division => data.divisions.indexOf(division._id) !== -1).forEach(division => {
            //   division.problems = division.problems.filter(problem => problem._id != data._id).concat(data);
            // });
          }).catch(alert);
        }
      }
    });
  }
}
