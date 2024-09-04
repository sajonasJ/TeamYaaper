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
  styleUrl: './login.component.css',
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

  //submit the username and password to the backend and set the session storage on login
  submit() {
    let user = { username: this.username, password: this.password };

    this.httpClient
      .post(BACKEND_URL + '/authRoute', user, httpOptions)
      .subscribe((data: any) => {
        if (data.ok) {
          sessionStorage.setItem('id', data.id.toString());
          sessionStorage.setItem('username', data.username);
          sessionStorage.setItem('firstname', data.firstname);
          sessionStorage.setItem('lastname', data.lastname);
          sessionStorage.setItem('email', data.email);
          sessionStorage.setItem('roles', JSON.stringify(data.roles));
          sessionStorage.setItem('groups', JSON.stringify(data.groups));
          sessionStorage.setItem('userlogin', 'true');

          this.fetchGroups();
        } else {
          this.toastr.error('email or password incorrect');
        }
      });
  }


//fetch groups from the backend
  fetchGroups() {
    this.httpClient
      .post(BACKEND_URL + '/groupRoute', {}, httpOptions)
      .subscribe(
        (groups: any) => {
          sessionStorage.setItem('allGroups', JSON.stringify(groups));
          this.router.navigate(['/home']);
          this.authService.login();
        },
        (error) => {
          console.error('Failed to fetch groups:', error);
          this.toastr.error('Failed to fetch groups');
        }
      );
  }
}
