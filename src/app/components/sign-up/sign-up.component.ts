import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  isSignIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // If the URL does not contain 'signup' as a query parameter, switch to sign-in form
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
      queryParams: { signup: null },
      queryParamsHandling: 'merge',
    });
  }

  // Dummy onSubmit method to be implemented
  onSubmit(signupForm: any) {
    if (signupForm.valid) {
      console.log('Form Submitted', signupForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
