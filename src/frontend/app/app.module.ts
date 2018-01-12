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
import { ProblemBaseComponent } from './views/dashboard/problembase/problembase.component';
import { ResultComponent } from './views/dashboard/result/result.component';
import { HomeComponent } from './views/home/home.component';
import { FeedComponent } from './components/feed/feed.component';
import { CardComponent } from './components/card/card.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    ProblemBaseComponent,
    ResultComponent,
    HomeComponent,
    FeedComponent,
    CardComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    CodemirrorModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
