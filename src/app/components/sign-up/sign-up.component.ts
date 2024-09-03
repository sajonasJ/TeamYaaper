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

  ngOnInit(): void {
    this.router.navigate(['/login']);
    this.toastr.error('Sign-up form not implemented yet.', 'Error');
  }
  
  onSubmit(signupForm: any) {
    if (signupForm.valid) {
      console.log('Form Submitted', signupForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
