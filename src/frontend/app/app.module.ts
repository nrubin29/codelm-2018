import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { ProblemComponent } from './views/dashboard/problem/problem.component';
import { CodemirrorModule } from 'ng2-codemirror';
import { TabsComponent } from './components/tabs/tabs.component';
import { PaneComponent } from './components/pane/pane.component';
import { StandingsComponent } from './views/dashboard/standings/standings.component';
import { AdminComponent } from './views/admin/admin/admin.component';
import { SubmitComponent } from './views/dashboard/submit/submit.component';
import { SubmissionComponent } from './views/dashboard/submission/submission.component';
import { FeedComponent } from './components/feed/feed.component';
import { CardComponent } from './components/card/card.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { RestService } from './services/rest.service';
import { ProblemService } from './services/problem.service';
import { SubmissionService } from './services/submission.service';
import { SocketGuard } from './guards/socket.guard';
import { SocketService } from './services/socket.service';
import { TeamService } from './services/team.service';
import { CodeSaverService } from './services/codesaver.service';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { DivisionService } from './services/division.service';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { TeamComponent } from './views/admin/team/team.component';
import { AdminHomeComponent } from './views/admin/admin-home/admin-home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProblemComponent,
    TabsComponent,
    PaneComponent,
    StandingsComponent,
    AdminComponent,
    SubmitComponent,
    SubmissionComponent,
    FeedComponent,
    CardComponent,
    SidebarComponent,
    PluralizePipe,
    LeaderboardComponent,
    TeamComponent,
    AdminHomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    CodemirrorModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    RestService,
    ProblemService,
    SubmissionService,
    TeamService,
    DivisionService,
    SocketService,
    SocketGuard,
    CodeSaverService,
    PluralizePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
