import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  isSignIn = false;

  newUsername = '';
  newPassword = '';
  newFirstname = '';
  newLastname = '';
  newEmail = '';
  verifyPassword = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
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

  // Methods to switch between Sign In and Sign Up
  switchToSignUp(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { signup: true },
    });
  }

  // Method to switch to Sign In
  switchToSignIn(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { signup: null },
      queryParamsHandling: 'merge',
    });
  }

  // Form submission logic to create a new user
  onSubmit(signupForm: any) {
    console.log('Signup form values:', signupForm.value);
    console.log('Component variables:', {
      newUsername: this.newUsername,
      newPassword: this.newPassword,
      newFirstname: this.newFirstname,
      newLastname: this.newLastname,
      newEmail: this.newEmail,
    });

    if (signupForm.valid && this.newPassword === this.verifyPassword) {
      const newUser = {
        username: this.newUsername,
        password: this.newPassword,
        firstname: this.newFirstname,
        lastname: this.newLastname,
        email: this.newEmail,
      };

      this.userService.addUser(newUser).subscribe(
        () => {
          this.toastr.success('User added successfully!', 'Success');
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 409) {
            const errorMessage =
              error.error?.message ||
              'User already exists. Please choose a different username.';
            this.toastr.error(errorMessage, 'Conflict');
          } else {
            this.toastr.error('Failed to add user. Please try again.', 'Error');
          }
        }
      );
    } else if (this.newPassword !== this.verifyPassword) {
      this.toastr.error('Passwords do not match', 'Error');
    } else {
      this.toastr.error('Please fill in all fields correctly.', 'Error');
    }
  }
}
