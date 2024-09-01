import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  isSignIn = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['signup']) {
        this.switchToSignUp();
      } else {
        this.switchToSignIn();
      }
    });
  }

  switchToSignUp() {
    this.isSignIn = false;
  }

  switchToSignIn() {
    this.isSignIn = true;
  }
}