import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-problembase',
  templateUrl: './problembase.component.html',
  styleUrls: ['./problembase.component.scss']
})
export class ProblemBaseComponent implements OnInit {
  problem: Observable<string>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.problem = new Observable<string>(observer => {
      this.route.paramMap.switchMap((params: ParamMap) => params.get('id')).subscribe(problem => {
        observer.next(problem)
      });
    });
  }

}
