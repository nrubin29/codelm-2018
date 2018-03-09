import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './views/admin-home/admin-home.component';
import { SettingsComponent } from './views/settings/settings.component';
import { SettingsResolve } from '../resolves/settings.resolve';
import { TeamComponent } from './views/team/team.component';
import { TeamResolve } from '../resolves/team.resolve';
import { SubmissionsResolve } from '../resolves/submissions.resolve';
import { SubmissionComponent } from '../common/views/submission/submission.component';
import { SubmissionResolve } from '../resolves/submission.resolve';
import { DisputesComponent } from './views/disputes/disputes.component';
import { DisputesResolve } from '../resolves/disputes.resolve';
import { DivisionsComponent } from './views/divisions/divisions.component';
import { ProblemsComponent } from './views/problems/problems.component';
import { DivisionsProblemsResolve } from '../resolves/divisions-problems.resolve';
import { AdminsComponent } from './views/admins/admins.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { SocketGuard } from '../guards/socket.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminComponent } from './views/admin/admin.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {path: 'admin', component: AdminComponent, canActivate: [SocketGuard, AdminGuard], children:
      [
        {path: '', component: AdminHomeComponent},
        {path: 'settings', component: SettingsComponent, resolve: {settings: SettingsResolve}},
        {path: 'team/:id', component: TeamComponent, resolve: {team: TeamResolve, submissions: SubmissionsResolve}},
        {path: 'submission/:id', component: SubmissionComponent, resolve: {submission: SubmissionResolve}},
        {path: 'disputes', component: DisputesComponent, resolve: {disputes: DisputesResolve}},
        {path: 'divisions', component: DivisionsComponent},
        {path: 'problems', component: ProblemsComponent, resolve: {divisionsAndProblems: DivisionsProblemsResolve}},
        {path: 'admins', component: AdminsComponent},
        {path: 'add-team', component: EditTeamComponent}
      ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [
    SocketGuard,
    AdminGuard,
    SubmissionResolve,
    TeamResolve,
    DivisionsProblemsResolve,
    SettingsResolve,
    SubmissionsResolve,
    DisputesResolve
  ]
})
export class AdminRoutingModule {}