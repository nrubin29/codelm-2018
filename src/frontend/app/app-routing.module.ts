import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { ProblemComponent } from './views/dashboard/problem/problem.component';
import { StandingsComponent } from './views/dashboard/standings/standings.component';
import { AdminComponent } from './views/admin/admin/admin.component';
import { SubmitComponent } from './views/dashboard/submit/submit.component';
import { SubmissionComponent } from './views/dashboard/submission/submission.component';
import { SocketGuard } from './guards/socket.guard';
import { TeamComponent } from './views/admin/team/team.component';
import { AdminHomeComponent } from './views/admin/admin-home/admin-home.component';
import { ProblemsComponent } from './views/admin/problems/problems.component';
import { DivisionsComponent } from './views/admin/divisions/divisions.component';
import { TeamGuard } from './guards/team.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminsComponent } from './views/admin/admins/admins.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { SubmissionResolve } from './views/dashboard/submission/submission.resolve';
import { ProblemResolve } from './views/dashboard/problem/problem.resolve';
import { ProblemGuard } from './views/dashboard/problem/problem.guard';
import { TeamResolve } from './views/admin/team/team.resolve';
import { DivisionsProblemsResolve } from './views/admin/problems/divisions-problems.resolve';
import { DisconnectedComponent } from './views/disconnected/disconnected.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'disconnected', component: DisconnectedComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [SocketGuard, TeamGuard], children:
    [
      {path: '', component: StandingsComponent},
      {path: 'problem/:id', component: ProblemComponent, canActivate: [ProblemGuard], resolve: {problem: ProblemResolve}},
      {path: 'submit', component: SubmitComponent},
      {path: 'submission/:id', component: SubmissionComponent, resolve: {submission: SubmissionResolve}}
    ]
  },
  {path: 'admin', component: AdminComponent, canActivate: [SocketGuard, AdminGuard], children:
      [
        {path: '', component: AdminHomeComponent},
        {path: 'team/:id', component: TeamComponent, resolve: {team: TeamResolve}},
        {path: 'submission/:id', component: SubmissionComponent, resolve: {submission: SubmissionResolve}},
        {path: 'divisions', component: DivisionsComponent},
        {path: 'problems', component: ProblemsComponent, resolve: {divisionsAndProblems: DivisionsProblemsResolve}},
        {path: 'admins', component: AdminsComponent},
        {path: 'add-team', component: EditTeamComponent}
      ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ],
  providers: [
    SocketGuard,
    TeamGuard,
    AdminGuard,
    ProblemGuard,
    SubmissionResolve,
    ProblemResolve,
    TeamResolve,
    DivisionsProblemsResolve
  ]
})
export class AppRoutingModule {}
