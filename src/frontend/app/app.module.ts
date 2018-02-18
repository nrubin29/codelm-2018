import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { ProblemComponent } from './views/dashboard/problem/problem.component';
import { StandingsComponent } from './views/dashboard/standings/standings.component';
import { AdminComponent } from './views/admin/admin/admin.component';
import { SubmitComponent } from './views/dashboard/submit/submit.component';
import { SubmissionComponent } from './views/dashboard/submission/submission.component';
import { FeedComponent } from './components/feed/feed.component';
import { CardComponent } from './components/card/card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { RestService } from './services/rest.service';
import { ProblemService } from './services/problem.service';
import { SubmissionService } from './services/submission.service';
import { SocketService } from './services/socket.service';
import { TeamService } from './services/team.service';
import { CodeSaverService } from './services/codesaver.service';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { DivisionService } from './services/division.service';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { TeamComponent } from './views/admin/team/team.component';
import { AdminHomeComponent } from './views/admin/admin-home/admin-home.component';
import { ProblemsComponent } from './views/admin/problems/problems.component';
import { EditProblemComponent } from './components/edit-problem/edit-problem.component';
import { DivisionsComponent } from './views/admin/divisions/divisions.component';
import { EditDivisionComponent } from './components/edit-division/edit-division.component';
import { AuthService } from './services/auth.service';
import { AdminsComponent } from './views/admin/admins/admins.component';
import { EditAdminComponent } from './components/edit-admin/edit-admin.component';
import { AdminService } from './services/admin.service';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import {
  MatButtonModule,
  MatCardModule, MatChipsModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule, MatTableModule, MatTabsModule, MatToolbarModule
} from '@angular/material';
import { DisconnectedComponent } from './views/disconnected/disconnected.component';
import { CodeMirrorComponent } from './components/code-mirror/code-mirror.component';
import { SettingsComponent } from './views/admin/settings/settings.component';
import { SettingsService } from './services/settings.service';
import { DpDatePickerModule } from 'ng2-date-picker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProblemComponent,
    StandingsComponent,
    AdminComponent,
    SubmitComponent,
    SubmissionComponent,
    FeedComponent,
    CardComponent,
    PluralizePipe,
    LeaderboardComponent,
    TeamComponent,
    AdminHomeComponent,
    ProblemsComponent,
    EditProblemComponent,
    DivisionsComponent,
    EditDivisionComponent,
    AdminsComponent,
    EditAdminComponent,
    EditTeamComponent,
    DisconnectedComponent,
    CodeMirrorComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    DpDatePickerModule
  ],
  providers: [
    RestService,
    ProblemService,
    SubmissionService,
    TeamService,
    DivisionService,
    SocketService,
    AuthService,
    CodeSaverService,
    AdminService,
    SettingsService,
    PluralizePipe,
  ],
  entryComponents: [EditProblemComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
