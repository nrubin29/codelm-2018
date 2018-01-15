import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { ProblemComponent } from './views/dashboard/problem/problem.component';
import { StandingsComponent } from './views/dashboard/standings/standings.component';
import { AdminComponent } from './views/admin/admin/admin.component';
import { SubmitComponent } from './views/dashboard/submit/submit.component';
import { SubmissionComponent } from './views/dashboard/submission/submission.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent, /*canActivate: [SocketGuard],*/ children:
    [
      {path: '', component: StandingsComponent},
      {path: 'problem/:id', component: ProblemComponent},
      {path: 'submit', component: SubmitComponent},
      {path: 'submission/:id', component: SubmissionComponent}
    ]
  },
  {path: 'admin', component: AdminComponent, /*canActivate: [SocketGuard],*/ children:
      [

      ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
