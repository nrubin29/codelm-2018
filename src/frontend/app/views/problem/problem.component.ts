import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'codemirror/mode/python/python';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {
  problem: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => params.get('id')).subscribe(problem => {
      this.problem = problem;
    });
  }

}
