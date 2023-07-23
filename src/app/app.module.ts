import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntryComponent } from './pages/entry/entry.component';
import { LoginComponent } from './pages/entry/login/login.component';
import { RegisterComponent } from './pages/entry/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateNewComponent } from './pages/create-new/create-new.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { MainTimerComponent } from './components/main-timer/main-timer.component';
import { CreateNewWidgetComponent } from './components/create-new-widget/create-new-widget.component';
import { CountdownWidgetComponent } from './components/countdown-widget/countdown-widget.component';
import { CountupWidgetComponent } from './components/countup-widget/countup-widget.component';
import { LastPerformedOnWidgetComponent } from './components/last-performed-on-widget/last-performed-on-widget.component';
import { SuperscriptPipe } from './pipes/superscript.pipe';
import { LimitDecimalsPipe } from './pipes/limit-decimals.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EntryComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CreateNewComponent,
    HeaderBarComponent,
    MainTimerComponent,
    CreateNewWidgetComponent,
    CountdownWidgetComponent,
    CountupWidgetComponent,
    LastPerformedOnWidgetComponent,
    SuperscriptPipe,
    LimitDecimalsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
