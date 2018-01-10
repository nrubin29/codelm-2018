import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'codemirror/mode/python/python';
import { ProblemBaseComponent } from '../problembase/problembase.component';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {
  problem: string;

  constructor(private problemBase: ProblemBaseComponent) {}

  ngOnInit() {
    this.problemBase.problem.subscribe(problem => this.problem = problem)
  }

}
