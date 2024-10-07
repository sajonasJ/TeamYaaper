import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL, httpOptions } from '../../constants';
import { User, Group } from '../../models/dataInterfaces';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  groups: Group[] = [];
  newUserForGroup: string = '';
  newUsername: string = '';
  newPassword: string = '';
  newGroupName: string = '';
  newGroupDescription: string = '';
  currentUser: string | null = null;
  adminInputs: { [key: string]: string } = {};
  userInputs: { [key: string]: string } = {};

  deleteEntity: User | Group | null = null; // To track which entity is to be deleted
  isUserDeletion: boolean = false; // To differentiate between user and group deletion

  constructor(
    private toastr: ToastrService,
    private groupService: GroupService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = sessionStorage.getItem('username');
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.mapUserDetailsToGroups(); // After loading users, map the user details to the groups
      },
      (error) => {
        this.toastr.error('Failed to load users. Please try again.', 'Error');
      }
    );
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (data) => {
        this.groups = data;
        // Initialize adminInputs and userInputs for each group
        this.groups.forEach((group) => {
          const groupId = group._id || 'undefined';
          this.adminInputs[groupId] = ''; // Initialize with an empty string
          this.userInputs[groupId] = ''; // Initialize with an empty string
        });
        this.mapUserDetailsToGroups(); // Map user details to groups after loading groups
      },
      (error) => {
        this.toastr.error('Failed to load groups. Please try again.', 'Error');
      }
    );
  }

  // Utility function to map user/admin IDs in the groups to their corresponding usernames
  // Utility function to map user/admin IDs in the groups to their corresponding usernames
  mapUserDetailsToGroups(): void {
    if (this.groups.length && this.users.length) {
      this.groups.forEach((group) => {
        // Ensure `admins` and `users` are arrays
        if (!Array.isArray(group.admins)) {
          group.admins = [];
        }
        if (!Array.isArray(group.users)) {
          group.users = [];
        }

        // Map IDs to usernames
        group.admins = group.admins.map((adminId) =>
          this.getUsernameById(adminId)
        );
        group.users = group.users.map((userId) => this.getUsernameById(userId));
      });
    }
  }

  // Get username by user ID
  getUsernameById(userId: string): string {
    const user = this.users.find((user) => user._id === userId);
    return user ? user.username : userId; // Return userId if no match found for better traceability
  }

  saveUser(): void {
    if (this.newUsername && this.newPassword) {
      const newUser = {
        username: this.newUsername,
        password: this.newPassword,
      };

      this.userService.addUser(newUser).subscribe(
        (response: any) => {
          if (response.ok) {
            this.toastr.success('User added successfully!', 'Success');
            this.loadUsers();
            this.newUsername = '';
            this.newPassword = '';
          } else {
            this.toastr.error('Failed to add user. Please try again.', 'Error');
          }
        },
        (error) => {
          // Handle the 409 Conflict error specifically
          if (error.status === 409) {
            if (error.error && error.error.message) {
              // If the backend sends a message field, use it
              this.toastr.error(error.error.message, 'Conflict');
            } else {
              // Fallback error message
              this.toastr.error(
                'User already exists. Please choose a different username.',
                'Conflict'
              );
            }
          } else {
            // Handle any other errors
            this.toastr.error('Failed to add user. Please try again.', 'Error');
          }
        }
      );
    } else {
      this.toastr.error('Please fill in both username and password.', 'Error');
    }
  }

  saveGroup(): void {
    if (this.newGroupName && this.newGroupDescription) {
      const newGroup: Group = {
        name: this.newGroupName,
        description: this.newGroupDescription,
        admins: [],
        users: [],
        channels: [],
      };

      this.groupService.addGroup(newGroup).subscribe(
        (response) => {
          this.toastr.success('Group added successfully!', 'Success');
          this.loadGroups();
          this.newGroupName = '';
          this.newGroupDescription = '';
        },
        (error) => {
          console.error('Error adding group:', error);
          this.toastr.error('Failed to add group. Please try again.', 'Error');
        }
      );
    } else {
      this.toastr.error(
        'Please fill in both group name and description.',
        'Error'
      );
    }
  }

  makeSuper(user: User): void {
    this.userService.makeSuperUser(user.username).subscribe(
      (response) => {
        this.toastr.success('User promoted to superuser!', 'Success');
        this.loadUsers();
      },
      (error) => {
        console.error('Error making user super:', error);
        this.toastr.error('Failed to promote user. Please try again.', 'Error');
      }
    );
  }

  removeSuper(user: User): void {
    this.userService.removeSuperUser(user.username).subscribe(
      (response) => {
        this.toastr.success('Superuser role removed successfully!', 'Success');
        this.loadUsers();
      },
      (error) => {
        console.error('Error removing super role:', error);
        this.toastr.error(
          'Failed to remove super role. Please try again.',
          'Error'
        );
      }
    );
  }

  deleteUser(user: User): void {
    // Set the entity to be deleted and show the confirmation modal
    this.confirmDeleteUser(user);
  }

  addAdminToGroup(group: Group): void {
    const groupId = group._id || 'undefined';
    const newAdminUsername = this.adminInputs[groupId];
    if (!newAdminUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    const userExists = this.users.some(
      (user) => user.username === newAdminUsername
    );
    if (!userExists) {
      this.toastr.error('User does not exist.', 'Error');
      return;
    }

    if (!group.admins.includes(newAdminUsername)) {
      group.admins.push(newAdminUsername);
      group.users.push(newAdminUsername);
      this.updateGroupDB(group);
      this.adminInputs[groupId] = ''; // Clear the input field
    } else {
      this.toastr.error('User is already an admin.', 'Error');
    }
  }

  deleteAdminFromGroup(group: Group, username: string): void {
    const index = group.admins.indexOf(username);
    if (index !== -1) {
      group.admins.splice(index, 1);
      this.updateGroupDB(group);
    }
  }

  addUserToGroup(group: Group): void {
    const groupId = group._id || 'undefined';
    const newUserUsername = this.userInputs[groupId];
    if (!newUserUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    const userExists = this.users.some(
      (user) => user.username === newUserUsername
    );
    if (!userExists) {
      this.toastr.error('User does not exist.', 'Error');
      return;
    }

    if (!group.users.includes(newUserUsername)) {
      group.users.push(newUserUsername);
      this.updateGroupDB(group);
      this.userInputs[groupId] = ''; // Clear the input field
    } else {
      this.toastr.error('User is already in the group.', 'Error');
    }
  }

  deleteUserFromGroup(group: Group, username: string): void {
    const index = group.users.indexOf(username);
    if (index !== -1) {
      group.users.splice(index, 1);
      this.updateGroupDB(group);
    }
  }

  // Trigger the delete confirmation modal for a user
  confirmDeleteUser(user: User): void {
    this.deleteEntity = user;
    this.isUserDeletion = true;
    this.showDeleteConfirmationModal();
  }

  // Trigger the delete confirmation modal for a group
  confirmDeleteGroup(group: Group): void {
    this.deleteEntity = group;
    this.isUserDeletion = false;
    this.showDeleteConfirmationModal();
  }

  // Show the modal for delete confirmation
  showDeleteConfirmationModal(): void {
    const modalElement = document.getElementById('confirmDeleteModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Confirm deletion from the modal
  onConfirmDelete(): void {
    if (this.deleteEntity) {
      if (this.isUserDeletion) {
        this.userService
          .deleteUser((this.deleteEntity as User).username)
          .subscribe(
            () => {
              this.toastr.success('User deleted successfully!', 'Success');
              this.loadUsers();
            },
            (error) => {
              console.error('Error deleting user:', error);
              this.toastr.error(
                'Failed to delete user. Please try again.',
                'Error'
              );
            }
          );
      } else {
        this.groupService
          .deleteGroup((this.deleteEntity as Group)._id!)
          .subscribe(
            () => {
              this.toastr.success('Group deleted successfully!', 'Success');
              this.loadGroups();
            },
            (error) => {
              console.error('Error deleting group:', error);
              this.toastr.error(
                'Failed to delete group. Please try again.',
                'Error'
              );
            }
          );
      }
    }

    // Reset the delete state
    this.deleteEntity = null;
    this.isUserDeletion = false;
  }

  deleteGroup(group: Group): void {
    if (!group._id) {
      this.toastr.error('Group ID is missing. Cannot proceed.', 'Error');
      return;
    }

    // Set the entity to be deleted and show the confirmation modal
    this.confirmDeleteGroup(group);
  }
  updateGroupDB(group: Group): void {
    console.log('Sending updated group data:', group); // Add this log to inspect the payload
    this.groupService.updateGroup(group).subscribe(
      (response) => {
        this.toastr.success('Group updated successfully!', 'Success');
        this.loadGroups(); // Refresh the groups
      },
      (error) => {
        console.error('Error updating group:', error);
        this.toastr.error('Failed to update group. Please try again.', 'Error');
      }
    );
  }
}
