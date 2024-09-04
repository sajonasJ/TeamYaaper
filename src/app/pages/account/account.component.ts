import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions } from '../../constants';
import { BACKEND_URL } from '../../constants';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
  groups: string[] = [];
  isEditMode: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService
  ) {}

  //check if user is logged in otherwise return to login page, load user data and groups
  ngOnInit() {
    this.authservice.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.loadData();
        this.loadGroups();
      }
    });
  }

  //load user groups
  loadGroups(): void {
    const allGroups = JSON.parse(sessionStorage.getItem('allGroups') || '[]');
    this.groups = allGroups
      .filter(
        (group: any) =>
          group.admins.includes(this.username) ||
          group.users.includes(this.username)
      )
      .map((group: any) => group.name);
  }

  //load user data
  loadData() {
    this.id = Number(sessionStorage.getItem('id') || '0');
    this.username = sessionStorage.getItem('username') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.email = sessionStorage.getItem('email') || '';
    this.roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    this.groups = JSON.parse(sessionStorage.getItem('groups') || '{}');
  }

  //Join first and last name
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  //switch to edit mode
  onUpdate(): void {
    this.isEditMode = true;
  }

  //save user data
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
      .post<any>(BACKEND_URL + '/loginRoute', userObj, httpOptions)
      .subscribe((response: any) => {
        if (response.ok) {
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
          this.toastr.error('Failed to update user data.');
        }
      });
  }

  //cancel edit mode
  onCancelEdit(): void {
    this.isEditMode = false;
  }

  //delete user account
  onDelete(): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.toastr.error('Delete functionality not implemented yet.');
    }
  }

  //display groups by object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
