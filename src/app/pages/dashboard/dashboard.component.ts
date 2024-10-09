import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL, httpOptions } from '../../constants';
import { User, Group } from '../../models/dataInterfaces';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../shared/utils.service';
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
  newFirstname: string = '';
  newLastname: string = '';
  newEmail: string = '';
  newGroupName: string = '';
  newGroupDescription: string = '';
  currentUser: string | null = null;
  adminInputs: { [key: string]: string } = {};
  userInputs: { [key: string]: string } = {};

  deleteEntity: User | Group | null = null;
  isUserDeletion: boolean = false;

  constructor(
    private toastr: ToastrService,
    private groupService: GroupService,
    private userService: UserService,
    private utilsService: UtilsService 
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
    this.currentUser = this.utilsService.loadCurrentUser();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.mapUserDetailsToGroups();
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
          this.adminInputs[groupId] = '';
          this.userInputs[groupId] = '';
        });
        this.mapUserDetailsToGroups();
      },
      (error) => {
        this.toastr.error('Failed to load groups. Please try again.', 'Error');
      }
    );
  }

  mapUserDetailsToGroups(): void {
    this.groups = this.utilsService.mapUserDetailsToGroups(this.groups, this.users);
  }

  saveUser(): void {
    if (this.newUsername && this.newPassword) {
      const newUser = {
        username: this.newUsername,
        password: this.newPassword,
        firstname: this.newFirstname,
        lastname: this.newLastname,
        email: this.newEmail,
      };
  
      this.userService.addUser(newUser).subscribe(
        () => {
          this.toastr.success('User added successfully!', 'Success');
          this.loadUsers();
          this.newUsername = '';
          this.newPassword = '';
          this.newFirstname = '';
          this.newLastname = '';
          this.newEmail = '';
        },
        (error) => {
          if (error.status === 409) {
            const errorMessage = error.error?.message || 'User already exists. Please choose a different username.';
            this.toastr.error(errorMessage, 'Conflict');
          } else {
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
    this.confirmDeleteUser(user);
  }

  addAdminToGroup(group: Group): void {
    if (!group._id) {
      this.toastr.error('Group ID is missing. Cannot proceed.', 'Error');
      return;
    }
    const groupId = group._id;
    const newAdminUsername = this.adminInputs[groupId];
    if (!newAdminUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    if (!this.utilsService.userExists(this.users || [], newAdminUsername)) {
      this.toastr.error('User does not exist.', 'Error');
      return;
    }
    

    if (!this.utilsService.adminInGroup(group, newAdminUsername)) {
      group = this.utilsService.addUserToGroup(group, newAdminUsername, 'admin');
      this.updateGroupDB(group);
      this.adminInputs[groupId] = '';
    } else {
      this.toastr.error('User is already an admin.', 'Error');
    }
  }

 
  

  addUserToGroup(group: Group): void {
    const groupId = group._id || 'undefined';
    const newUserUsername = this.userInputs[groupId];
    if (!newUserUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    if (!this.utilsService.userExists(this.users, newUserUsername)) {
      this.toastr.error('User does not exist.', 'Error');
      return;
    }
14
    if (!this.utilsService.userInGroup(group, newUserUsername)) {
      group = this.utilsService.addUserToGroup(group, newUserUsername, 'user');
      this.updateGroupDB(group);
      this.userInputs[groupId] = '';
    } else {
      this.toastr.error('User is already in the group.', 'Error');
    }
  }

  deleteUserFromGroup(group: Group, username: string): void {
    group.users = this.utilsService.removeUserFromList(group.users, username);
    this.updateGroupDB(group);
  }
  deleteAdminFromGroup(group: Group, username: string): void {
    group.admins = this.utilsService.removeUserFromList(group.admins, username);
    this.updateGroupDB(group);
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

  showDeleteConfirmationModal(): void {
    this.utilsService.showDeleteConfirmationModal('confirmDeleteModal');
  }
  

  // Confirm deletion from the modal
  onConfirmDelete(): void {
    if (this.deleteEntity) {
      if (this.isUserDeletion) {
        const usernameToDelete = (this.deleteEntity as User).username;
  
        // Step 1: Delete the user
        this.userService.deleteUser(usernameToDelete).subscribe(
          () => {
            this.toastr.success('User deleted successfully!', 'Success');
            // Step 2: Remove the user from any groups
            this.groups.forEach(group => {
              if (group.admins.includes(usernameToDelete)) {
                group.admins = this.utilsService.removeUserFromList(group.admins, usernameToDelete);
              }
              if (group.users.includes(usernameToDelete)) {
                group.users = this.utilsService.removeUserFromList(group.users, usernameToDelete);
              }
              this.updateGroupDB(group);
            });
            // Step 3: Reload users and groups
            this.loadUsers();
            this.loadGroups();
          },
          (error) => {
            this.toastr.error('Failed to delete user. Please try again.', 'Error');
          }
        );
      } else {
        // Handle group deletion
        this.groupService.deleteGroup((this.deleteEntity as Group)._id!).subscribe(
          () => {
            this.toastr.success('Group deleted successfully!', 'Success');
            this.loadGroups();
          },
          (error) => {
            this.toastr.error('Failed to delete group. Please try again.', 'Error');
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
        this.toastr.error('Failed to update group. Please try again.', 'Error');
      }
    );
  }
}
