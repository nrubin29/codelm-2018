import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProblemComponent } from './views/problem/problem.component';
import { StandingsComponent } from './views/standings/standings.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, /*canActivate: [SocketGuard],*/ children:
    [
      {path: 'standings', component: StandingsComponent},
      {path: 'problem/:id', component: ProblemComponent},
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
