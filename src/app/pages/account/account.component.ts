import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  // User information properties
  username: string = 'johndoe';
  firstName: string = 'John';
  lastName: string = 'Doe';
  email: string = 'johndoe@example.com';
  groups: string[] = ['Admin', 'User', 'Moderator'];

  // Editable user information properties
  editUsername: string = '';
  editFirstName: string = '';
  editLastName: string = '';
  editEmail: string = '';

  // Property to track edit mode
  isEditMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Initialization logic, such as fetching user data, can go here
  }

  // Method to get the full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Method to handle update button click
  onUpdate(): void {
    // Set edit mode to true and copy current values to editable fields
    this.isEditMode = true;
    this.editUsername = this.username;
    this.editFirstName = this.firstName;
    this.editLastName = this.lastName;
    this.editEmail = this.email;
  }

  // Method to handle save button click
  onSave(): void {
    // Update user information with edited values and exit edit mode
    this.username = this.editUsername;
    this.firstName = this.editFirstName;
    this.lastName = this.editLastName;
    this.email = this.editEmail;
    this.isEditMode = false;
  }

  // Method to handle cancel button click in edit mode
  onCancelEdit(): void {
    // Exit edit mode without saving changes
    this.isEditMode = false;
  }

  // Method to handle cancel button click in display mode
  onCancel(): void {
    console.log('Cancel button clicked');
    alert('Cancel functionality not implemented yet.');
  }

  // Method to handle delete button click
  onDelete(): void {
    console.log('Delete button clicked');
    if (confirm('Are you sure you want to delete this account?')) {
      alert('Delete functionality not implemented yet.');
    }
  }
}