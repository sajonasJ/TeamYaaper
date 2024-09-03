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
  roles: string[] = [];
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
    this.roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    this.groups = JSON.parse(sessionStorage.getItem('groups') || '{}');
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
      roles: this.roles,
    };

    this.httpClient
      .post<any>(BACKEND_URL + '/loggedOn', userObj, httpOptions)
      .subscribe((response: any) => {
        if (response.ok) {
          alert('Profile updated successfully!');

          // Update session storage with the new user information
          sessionStorage.setItem('id', userObj.id.toString());
          sessionStorage.setItem('username', userObj.username);
          sessionStorage.setItem('firstname', userObj.firstname);
          sessionStorage.setItem('lastname', userObj.lastname);
          sessionStorage.setItem('email', userObj.email);
          sessionStorage.setItem('roles', JSON.stringify(userObj.roles));
          sessionStorage.setItem('groups', JSON.stringify(userObj.groups));

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
