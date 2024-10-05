import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../constants';
import { httpOptions } from '../../constants';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrected property name and syntax
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  // Submit the username and password to the backend and set the session storage on login
  submit() {
    let user = { username: this.username, password: this.password };

    this.httpClient
      .post(BACKEND_URL + '/auth/verify', user, httpOptions) // Updated route
      .subscribe(
        (data: any) => {
          if (data.ok) {
            // Store user information in session storage
            if (data.id) {
              sessionStorage.setItem('id', data.id.toString()); // Store id if available
            }
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('firstname', data.firstname);
            sessionStorage.setItem('lastname', data.lastname);
            sessionStorage.setItem('email', data.email);
            sessionStorage.setItem('roles', JSON.stringify(data.roles));
            sessionStorage.setItem('groups', JSON.stringify(data.groupMemberships));
            sessionStorage.setItem('userlogin', 'true');

            // Update the login status in AuthService
            this.authService.login();

            // Fetch groups and then redirect to the home page
            this.fetchGroups();
          } else {
            this.toastr.error(data.message || 'Email or password incorrect');
          }
        },
        (error) => {
          console.error('Error during login:', error);
          this.toastr.error('An error occurred during login.');
        }
      );
  }

  // Fetch groups from the backend
  fetchGroups() {
    this.httpClient
      .get(BACKEND_URL + '/groups', httpOptions) // Changed to GET request and updated endpoint
      .subscribe(
        (groups: any) => {
          sessionStorage.setItem('allGroups', JSON.stringify(groups));
  
          // Redirect to the home page after groups are fetched
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Failed to fetch groups:', error);
          this.toastr.error('Failed to fetch groups');
        }
      );
  }
  
}
