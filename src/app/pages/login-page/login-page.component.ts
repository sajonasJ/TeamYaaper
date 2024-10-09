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
      if (params['signup']) {
        this.isSignIn = false;
      } else {
        this.isSignIn = true;
      }
    });
  }

  // Methods to switch between Sign up, both keeps the query params
  switchToSignUp(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { signup: true },
    });
  }

  // Method to switch to Sign In, merge the query params
  switchToSignIn(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { signup: null },
      queryParamsHandling: 'merge',
    });
  }
}
