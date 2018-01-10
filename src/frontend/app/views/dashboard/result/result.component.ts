import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  private resultId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => params.get('rid')).subscribe(resultId => {
      this.resultId = resultId
    });
  }

}
