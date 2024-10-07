import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/dataInterfaces';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'], // Fixed typo: styleUrl -> styleUrls
})
export class AccountComponent implements OnInit {
  id: string = '';
  userlogin: boolean = false;
  username: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  roles: string[] = [];
  groups: string[] = []; 
  isEditMode: boolean = false;

  constructor(
    private router: Router,
    private authservice: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  // Check if user is logged in; otherwise, return to login page, load user data and groups
  ngOnInit(): void {
    this.authservice.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.loadData();
      }
    });
  }

  // Load user data from session storage
  loadData(): void {
    this.id = sessionStorage.getItem('id') || '';
    this.username = sessionStorage.getItem('username') || '';
    this.firstname = sessionStorage.getItem('firstname') || '';
    this.lastname = sessionStorage.getItem('lastname') || '';
    this.email = sessionStorage.getItem('email') || '';
    this.roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    this.groups = JSON.parse(sessionStorage.getItem('groups') || '[]'); // Load groups from session storage

  }

  // Join first and last name
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  // Switch to edit mode
  onUpdate(): void {
    this.isEditMode = true;
  }

  // Save user data
  // Save user data using UserService
  onSave(): void {
    console.log("User ID:", this.id);


    // Prepare updated user data
    const updatedUser: User = {
      _id: this.id,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      roles: this.roles,
      groups: this.groups, // Include groups in the updated user data
    };
    const updateUrl = `http://localhost:3000/updateUser/${this.id}`;
    console.log("Request URL:", updateUrl);
    


    this.userService.updateUser(updatedUser).subscribe(
      (response) => {
        if (response.ok) { // Check if response is valid and successful
          this.toastr.success('User data updated successfully!', 'Success');
          this.isEditMode = false;
          this.updateSessionStorage(updatedUser);
          this.loadData();
        } else {
          this.toastr.error('Failed to update.', 'Error');
        }
      },
      (error) => {
        this.toastr.error(
          'Failed to update user data. Please try again.',
          'Error'
        );
      }
    );
  }

  // Cancel edit mode
  onCancelEdit(): void {
    this.isEditMode = false;
  }

  // Delete user account
  onDelete(): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.toastr.error('Delete functionality not implemented yet.');
    }
  }
  updateSessionStorage(updatedUser: User): void {
    sessionStorage.setItem('id', updatedUser._id ?? '');
    sessionStorage.setItem('username', updatedUser.username);
    sessionStorage.setItem('firstname', updatedUser.firstname);
    sessionStorage.setItem('lastname', updatedUser.lastname);
    sessionStorage.setItem('email', updatedUser.email);
    sessionStorage.setItem('roles', JSON.stringify(updatedUser.roles));
    sessionStorage.setItem('groups', JSON.stringify(updatedUser.groups)); 
  }

  // Display groups by object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
