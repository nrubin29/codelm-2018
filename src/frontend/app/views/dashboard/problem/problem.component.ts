import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'codemirror/mode/python/python';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {
  problem: ProblemModel;

  constructor(private problemService: ProblemService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap.switchMap((params: ParamMap) => params.get('id')).subscribe(id => {
      this.problem = null;
      this.problemService.getProblem(id).then(problem => this.problem = problem).catch(console.log)
    });
  }

  submitClicked(type: string) {
    this.router.navigate(['dashboard', 'submit'])
  }
}
