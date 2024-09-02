import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions } from '../../constants';
import { BACKEND_URL } from '../../constants';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  id: number = 0;
  username: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  groups: { [key: string]: string[] } = {};

  isEditMode: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

  ngOnInit() {
    this.authservice.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.loadData();
      }
    });
  }
  

  loadData() {
    this.id = Number(sessionStorage.getItem('id') || '0');
    this.username = sessionStorage.getItem('username') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.email = sessionStorage.getItem('email') || '';

    try {
      this.groups = JSON.parse(sessionStorage.getItem('groups') || '{}');
    } catch (error) {
      console.error('Failed to parse groups from session storage', error);
      this.groups = {};
    }
  }

  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  onUpdate(): void {
    this.isEditMode = true;
  }

  onSave() {
    const userObj = {
      id: this.id,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      groups: this.groups,
    };

    this.httpClient
      .post<any>(BACKEND_URL + '/loggedOn', userObj, httpOptions)
      .subscribe((response: any) => {
        alert(JSON.stringify(response));
        alert('Profile updated successfully!');

        const updatedUser = response.find((user: any) => user.id === this.id);

        if (updatedUser) {
          sessionStorage.setItem('id', updatedUser.id.toString());
          sessionStorage.setItem('username', updatedUser.username);
          sessionStorage.setItem('firstname', updatedUser.firstname);
          sessionStorage.setItem('lastname', updatedUser.lastname);
          sessionStorage.setItem('email', updatedUser.email);
          sessionStorage.setItem('groups', JSON.stringify(updatedUser.groups));
          this.loadData();
          this.onCancelEdit();
        } else {
          alert('Failed to find updated user in response.');
        }
      });
  }

  onCancelEdit(): void {
    this.isEditMode = false;
  }

  onDelete(): void {
    console.log('Delete button clicked');
    if (confirm('Are you sure you want to delete this account?')) {
      alert('Delete functionality not implemented yet.');
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  
}
