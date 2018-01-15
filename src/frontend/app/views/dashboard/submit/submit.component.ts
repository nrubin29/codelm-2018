import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  constructor(private dashboard: DashboardComponent, private router: Router) { }

  ngOnInit() {
    this.dashboard.sidebar.toggle();
    setTimeout(() => {}, 0);

    setTimeout(() => {
      this.dashboard.sidebar.toggle();
      this.router.navigate(['dashboard', 'submission', 1])
    }, 5000);
  }
}
