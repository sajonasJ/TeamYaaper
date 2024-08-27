import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AccountComponent } from './pages/account/account.component';
import { GroupInnerPageComponent } from './pages/group-inner-page/group-inner-page.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    NavigationComponent,
    SideNavComponent,
    LoginComponent,
    SignUpComponent,
    AccountComponent,
    GroupInnerPageComponent,
    HomeComponent,
    LoginPageComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
