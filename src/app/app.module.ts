import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AccountComponent } from './pages/account/account.component';
import { GroupInnerPageComponent } from './pages/group-inner-page/group-inner-page.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    SideNavComponent,
    LoginComponent,
    SignUpComponent,
    AccountComponent,
    GroupInnerPageComponent,
    HomeComponent,
    LoginPageComponent,
    WelcomeComponent,
    FooterComponent,
    ModalComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
