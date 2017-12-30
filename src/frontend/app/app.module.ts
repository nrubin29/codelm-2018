import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProblemComponent } from './views/problem/problem.component';
import { CodemirrorModule } from 'ng2-codemirror';
import { TabsComponent } from './components/tabs/tabs.component';
import { PaneComponent } from './components/pane/pane.component';
import { StandingsComponent } from './views/standings/standings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProblemComponent,
    TabsComponent,
    PaneComponent,
    StandingsComponent
  ],
  imports: [
    BrowserModule,
    CodemirrorModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
