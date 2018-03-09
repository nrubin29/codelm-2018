import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './common/views/login/login.component';
import { DisconnectedComponent } from './common/views/disconnected/disconnected.component';
import { RegisterComponent } from './common/views/register/register.component';
import { CompetitionModule } from './competition/competition.module';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DisconnectedComponent,
    RegisterComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    CompetitionModule,
    AdminModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
