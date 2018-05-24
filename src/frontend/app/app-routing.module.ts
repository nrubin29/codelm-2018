import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/views/login/login.component';
import { DisconnectedComponent } from './common/views/disconnected/disconnected.component';
import { RegisterComponent } from './common/views/register/register.component';
import { EndGuard } from './guards/end.guard';
import { NotEndGuard } from './guards/not-end.guard';
import { DisconnectGuard } from './guards/disconnect.guard';
import { EndComponent } from './competition/views/end/end.component';
import { DivisionsResolve } from './resolves/divisions.resolve';
import { SettingsResolve } from './resolves/settings.resolve';
import { OpenRegistrationGuard } from './guards/open-registration.guard';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'},
  {path: 'dashboard', loadChildren: 'app/competition/competition.module#CompetitionModule'},
  {path: 'login', component: LoginComponent, canActivate: [EndGuard], resolve: {settings: SettingsResolve}},
  {path: 'register', component: RegisterComponent, canActivate: [EndGuard, OpenRegistrationGuard], resolve: {divisions: DivisionsResolve}},
  {path: 'disconnected', component: DisconnectedComponent, canActivate: [DisconnectGuard, EndGuard]},
  {path: 'end', component: EndComponent, canActivate: [NotEndGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
