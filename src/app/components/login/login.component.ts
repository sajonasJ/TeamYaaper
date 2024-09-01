import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../constants';
import { httpOptions } from '../../constants';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private httpClient: HttpClient, private authService: AuthService) {}
 
  submit() {
    let user = { username: this.username, password: this.password };

    this.httpClient
      .post(BACKEND_URL + '/auth', user, httpOptions)
      .subscribe((data: any) => {
        alert('posting: ' + JSON.stringify(user));
        alert('posting: ' + JSON.stringify(data));
        if (data.ok) {
          alert('correct');
          sessionStorage.setItem('id', data.id.toString());
          sessionStorage.setItem('username', data.username);
          sessionStorage.setItem('firstname', data.firstname);
          sessionStorage.setItem('lastname', data.lastname);
          sessionStorage.setItem('email', data.email);
          sessionStorage.setItem('groups', JSON.stringify(data.groups));
          this.router.navigate(['/home']);
          this.authService.login();
        } else {
          alert('email or password incorrect');
        }
      });
  }
}