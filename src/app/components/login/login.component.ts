import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../constants';
import { httpOptions } from '../../constants';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private groupService: GroupService
  ) {}

  submit() {
    let user = { username: this.username, password: this.password };
  
    this.httpClient
      .post(BACKEND_URL + '/verify', user, httpOptions)
      .subscribe(
        (response: any) => {
          if (response.ok) {
            // Store user information in session storage
            sessionStorage.setItem('username', response.username);
            sessionStorage.setItem('firstname', response.firstname);
            sessionStorage.setItem('lastname', response.lastname);
            sessionStorage.setItem('email', response.email);
  
            // If roles and group memberships are arrays, use JSON.stringify
            sessionStorage.setItem('roles', JSON.stringify(response.roles));
            sessionStorage.setItem('groupMemberships', JSON.stringify(response.groupMemberships)); // Ensure they are stored as strings
  
            sessionStorage.setItem('userlogin', 'true');
  
            // Update the login status in AuthService
            this.authService.login();
  
            // Redirect to the home page after successful login
            this.router.navigate(['/home']);
          } else {
            this.toastr.error(response.message || 'Email or password incorrect');
          }
        },
        (error) => {
          console.error('Error during login:', error);
          this.toastr.error('An error occurred during login.');
        }
      );
  }
  
}
