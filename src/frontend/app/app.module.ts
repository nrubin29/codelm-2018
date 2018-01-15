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
import { HomeComponent } from './views/home/home.component';
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
    HomeComponent,
    FeedComponent,
    CardComponent,
    SidebarComponent,
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
    SubmissionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
