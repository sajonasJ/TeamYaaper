import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  onSubmit(signupForm: any) {
    if (signupForm.valid) {
      console.log('Form Submitted', signupForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
