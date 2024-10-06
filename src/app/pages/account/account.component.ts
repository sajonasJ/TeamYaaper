import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'], // Fixed typo: styleUrl -> styleUrls
})
export class AccountComponent implements OnInit {
  id: string = '';
  username: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  roles: string[] = [];
  isEditMode: boolean = false;

  constructor(
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService
  ) { }

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
  onSave(): void {
    console.log('onsave clicked')
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

  // Display groups by object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
