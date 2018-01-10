import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { ProblemComponent } from './views/dashboard/problem/problem.component';
import { StandingsComponent } from './views/dashboard/standings/standings.component';
import { AdminComponent } from './views/admin/admin/admin.component';
import { SubmitComponent } from './views/dashboard/submit/submit.component';
import { ProblemBaseComponent } from './views/dashboard/problembase/problembase.component';
import { ResultComponent } from './views/dashboard/result/result.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, /*canActivate: [SocketGuard],*/ children:
    [
      {path: 'standings', component: StandingsComponent},
      {path: 'problem/:id', component: ProblemBaseComponent, children:
        [
          {path: '', component: ProblemComponent},
          {path: 'submit', component: SubmitComponent},
        ]
      },
      {path: 'result/:rid', component: ResultComponent}
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
