import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  isSignIn = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  //switch to sign-up form when the user clicks the sign-up button
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['signup']) {
        this.switchToSignUp();
      } else {
        this.switchToSignIn();
      }
    });
  }

  //boolean switch to sign-up form
  switchToSignUp() {
    this.isSignIn = false;
  }

  //boolean switch to sign-in form
  switchToSignIn() {
    this.isSignIn = true;
  }

  //toast message when the user clicks the sign-up button
  toastShow() {
    this.toastr.error('Sign-up form not implemented yet.', 'Error');
  }
}
