import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  constructor(private router: Router, private toastr: ToastrService) {}

  // if the user accidentally loads the sign-up page, redirect them to the login page
  // and display an error message
  ngOnInit(): void {
    this.router.navigate(['/login']);
    this.toastr.error('Sign-up form not implemented yet.', 'Error');
  }

  // Not functional yet, still need to implement the form
  onSubmit(signupForm: any) {
    if (signupForm.valid) {
      console.log('Form Submitted', signupForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
