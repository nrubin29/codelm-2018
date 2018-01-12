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
    setTimeout(() => this.dashboard.toggleSidebar(), 0);

    setTimeout(() => {
      this.dashboard.toggleSidebar();
      this.router.navigate(['dashboard', 'result', 1])
    }, 5000);
  }
}
