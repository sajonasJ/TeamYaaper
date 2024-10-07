import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/dataInterfaces';
import * as bootstrap from 'bootstrap';

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
  profilePictureUrl: string | ArrayBuffer | null = '';
  selectedFile: File | null = null;


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
    this.profilePictureUrl = sessionStorage.getItem('profilePicture');

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Show a preview of the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePictureUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadProfilePicture(): void {
    if (this.selectedFile && this.id) {
        this.userService.uploadProfilePicture(this.selectedFile, this.id).subscribe(
            (response) => {
                if (response.ok) {
                    this.toastr.success('Profile picture updated successfully!', 'Success');
                    this.profilePictureUrl = `http://localhost:3000${response.imageUrl}`;
                    sessionStorage.setItem('profilePicture', this.profilePictureUrl);
                } else {
                    this.toastr.error('Failed to update profile picture.', 'Error');
                }
            },
            (error) => {
                this.toastr.error('Failed to upload profile picture. Please try again.', 'Error');
            }
        );
    }
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

    // Prepare updated user data
    const updatedUser: User = {
      _id: this.id,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      roles: this.roles,
      groups: this.groups,

    };

    this.userService.updateUser(updatedUser).subscribe(
      (response) => {
        if (response.ok) { 
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
   // Show the delete confirmation modal
   showDeleteConfirmationModal(): void {
    const modalElement = document.getElementById('confirmDeleteModal');
    if (modalElement) {
      const confirmDeleteModal = new bootstrap.Modal(modalElement);
      confirmDeleteModal.show();
    }
  }

    // Trigger the delete confirmation modal for a user
    confirmDeleteUser(): void {
      this.showDeleteConfirmationModal();
    }
  
  // Delete user account
  onDelete(): void {
    if (this.id) {
      this.userService.deleteUser(this.username).subscribe(
        () => {
          this.toastr.success('Account deleted successfully.', 'Success');
          this.authservice.logout(); // Log out the user after deleting the account
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toastr.error('Failed to delete account. Please try again.', 'Error');
        }
      );
    } else {
      this.toastr.error('User ID is missing. Cannot delete account.', 'Error');
    }
  }
}
