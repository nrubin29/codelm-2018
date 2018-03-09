import { NgModule } from '@angular/core';
import { CountdownComponent } from './components/countdown/countdown.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EndComponent } from './views/end/end.component';
import { ProblemComponent } from './views/problem/problem.component';
import { StandingsComponent } from './views/standings/standings.component';
import { SubmitComponent } from './views/submit/submit.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    CountdownComponent,
    DashboardComponent,
    EndComponent,
    ProblemComponent,
    StandingsComponent,
    SubmitComponent
  ],
  imports: [
    SharedModule
  ]
})
export class CompetitionModule { }
