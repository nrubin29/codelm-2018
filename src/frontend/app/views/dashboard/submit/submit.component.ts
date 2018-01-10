import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => this.router.navigate(['dashboard', 'result', 1]), 5000)
  }

}
