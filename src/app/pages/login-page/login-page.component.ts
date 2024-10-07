import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // If the URL contains 'signup' as a query parameter, switch to sign-up form
      if (params['signup']) {
        this.isSignIn = false;
      } else {
        this.isSignIn = true;
      }
    });
  }

  // Methods to switch between Sign In and Sign Up
  switchToSignUp(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { signup: true },
    });
  }

  switchToSignIn(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { signup: null }, // Clear the signup query param
      queryParamsHandling: 'merge',
    });
  }
}
