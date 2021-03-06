import { NgModule } from '@angular/core';
import { CountdownComponent } from './components/countdown/countdown.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProblemComponent } from './views/problem/problem.component';
import { StandingsComponent } from './views/standings/standings.component';
import { SubmitComponent } from './views/submit/submit.component';
import { SharedModule } from '../shared.module';
import { GradedProblemComponent } from './views/graded-problem/graded-problem.component';
import { UploadProblemComponent } from './views/upload-problem/upload-problem.component';
import { CompetitionRoutingModule } from './competition.routing';

@NgModule({
  declarations: [
    CountdownComponent,
    DashboardComponent,
    ProblemComponent,
    StandingsComponent,
    SubmitComponent,
    GradedProblemComponent,
    UploadProblemComponent
  ],
  imports: [
    SharedModule,
    CompetitionRoutingModule
  ]
})
export class CompetitionModule { }
