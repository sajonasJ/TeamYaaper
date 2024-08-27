import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  isSignIn = true;  // By default, show the SignInComponent

  switchToSignUp() {
    this.isSignIn = false;  // Switch to SignUpComponent
  }

  switchToSignIn() {
    this.isSignIn = true;  // Switch back to SignInComponent
  }
}
