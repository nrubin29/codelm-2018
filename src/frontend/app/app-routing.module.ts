import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/views/login/login.component';
import { SocketGuard } from './guards/socket.guard';
import { TeamGuard } from './guards/team.guard';
import { AdminGuard } from './guards/admin.guard';
import { DisconnectedComponent } from './common/views/disconnected/disconnected.component';
import { RegisterComponent } from './common/views/register/register.component';
import { EndGuard } from './guards/end.guard';
import { NotEndGuard } from './guards/not-end.guard';
import { DisconnectGuard } from './guards/disconnect.guard';
import { EndComponent } from './competition/views/end/end.component';
import { DivisionsResolve } from './resolves/divisions.resolve';
import { AdminRoutingModule } from './admin/admin.routing';
import { CompetitionRoutingModule } from './competition/competition.routing';
import { SettingsResolve } from './resolves/settings.resolve';
import { OpenRegistrationGuard } from './guards/open-registration.guard';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [EndGuard], resolve: {settings: SettingsResolve}},
  {path: 'register', component: RegisterComponent, canActivate: [EndGuard, OpenRegistrationGuard], resolve: {divisions: DivisionsResolve}},
  {path: 'disconnected', component: DisconnectedComponent, canActivate: [DisconnectGuard, EndGuard]},
  {path: 'end', component: EndComponent, canActivate: [NotEndGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
    CompetitionRoutingModule,
    AdminRoutingModule
  ],
  exports: [ RouterModule ],
  providers: [
    SocketGuard,
    TeamGuard,
    AdminGuard,
    EndGuard,
    NotEndGuard,
    OpenRegistrationGuard,
    DisconnectGuard,
    DivisionsResolve,
    SettingsResolve
  ]
})
export class AppRoutingModule {}
