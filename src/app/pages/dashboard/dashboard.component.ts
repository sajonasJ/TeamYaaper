import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL, httpOptions } from '../../constants';
import { User, Group } from '../../models/dataInterfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  admins: User[] = [];
  groups: Group[] = [];
  newUserForGroup: string = '';
  newAdminForGroup: string = '';
  newUsername: string = '';
  newPassword: string = '';
  newGroupName: string = '';
  newGroupDescription: string = '';
  currentUser: string | null = null;
  adminInputs: { [key: string]: string } = {};
  userInputs: { [key: string]: string } = {};

  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
    this.loadCurrentUser();
  }
  loadCurrentUser(): void {
    this.currentUser = sessionStorage.getItem('username');
  }


  loadUsers(): void {
    this.httpClient
      .post<User[]>(`${BACKEND_URL}/loggedOn`, {}, httpOptions)
      .subscribe(
        (data) => {
          this.users = data;
        },

        (error) => console.error('Error loading users:', error)
      );
  }

  loadGroups(): void {
    this.httpClient
      .post<Group[]>(`${BACKEND_URL}/groupRoute`, {}, httpOptions)
      .subscribe(
        (data) => {
          this.groups = data;
          this.updateSessionStorage();
        },
        (error) => console.error('Error loading groups:', error)
      );
  }

  // Make a user a superuser
  makeSuper(user: User): void {
    if (!user.roles.includes('super')) {
      user.roles.push('super');
      this.updateUser(user);
      this.toastr.success(
        'User ugraded to Super User successfully!',
        'Success'
      );
    } else {
      this.toastr.error('User is already a superuser.', 'Error');
    }
  }

  removeSuper(user: User): void {
    const roleIndex = user.roles.indexOf('super');

    if (roleIndex !== -1) {
      user.roles.splice(roleIndex, 1);
      this.updateUser(user);
      this.toastr.success('SuperUser role removed successfully!', 'Success');
    } else {
      this.toastr.error('User is not a SuperUser.', 'Error');
    }
  }

  updateUser(user: User): void {
    this.httpClient
      .post<User[]>(`${BACKEND_URL}/loggedOn`, user, httpOptions)
      .subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.loadUsers();
          this.toastr.success('User updated successfully!', 'Success');
        },
        (error) => {
          console.error('Error updating user:', error);
          this.toastr.error(
            'Failed to update user. Please try again.',
            'Error'
          );
        }
      );
  }
  deleteUser(user: User): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete the user "${user.username}"?`
    );
    if (!confirmDelete) return;

    this.httpClient
      .post(
        `${BACKEND_URL}/delUserRoute`,
        { username: user.username },
        httpOptions
      )
      .subscribe(
        (response: any) => {
          if (response.ok) {
            this.toastr.success('User deleted successfully!', 'Success');
            this.loadUsers();
          } else {
            this.toastr.error(
              'Failed to delete user. Please try again.',
              'Error'
            );
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.toastr.error(
            'Failed to delete user. Please try again.',
            'Error'
          );
        }
      );
  }

  // Function to open modal and prepare for adding new group
  addNewGroup(): void {
    this.newGroupName = '';
    this.newGroupDescription = '';
  }

  saveGroup(): void {
    if (this.newGroupName && this.newGroupDescription) {
      const groupExists = this.groups.some(
        (group) => group.name.toLowerCase() === this.newGroupName.toLowerCase()
      );

      if (groupExists) {
        this.toastr.error(
          'A group with this name already exists. Please choose a different name.',
          'Error'
        );
        return;
      }

      const newGroup: Group = {
        id: this.generateUniqueId(),
        name: this.newGroupName,
        description: this.newGroupDescription,
        channels: [],
        admins: this.currentUser ? [this.currentUser] : [],
        users: [],
      };

      this.updateGroupDB(newGroup);
      this.toastr.success('Group added successfully!', 'Success');
    } else {
      this.toastr.error(
        'Please fill in both the group name and description.',
        'Error'
      );
    }
  }

  deleteGroup(group: Group): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete the group "${group.name}"?`
    );
    if (!confirmDelete) return;

    // Remove the group from the component's groups array
    this.groups = this.groups.filter((g) => g.id !== group.id);

    // Send delete request to backend
    this.httpClient
      .post(`${BACKEND_URL}/delGroupRoute`, { id: group.id }, httpOptions)
      .subscribe(
        (response: any) => {
          if (response.ok) {
            this.toastr.success('Group deleted successfully!', 'Success');
            this.updateSessionStorage();
            this.loadGroups();
          } else {
            this.toastr.error(
              'Failed to delete group. Please try again.',
              'Error'
            );
            this.loadGroups();
          }
        },
        (error) => {
          console.error('Error deleting group:', error);
          this.toastr.error(
            'Failed to delete group. Please retry again.',
            'Error'
          );
          this.loadGroups();
        }
      );
  }

  // Helper method to get the role of a user in a specific group
  getUserRoleInGroup(group: Group, username: string): string {
    if (group.admins.includes(username)) return 'admin';
    if (group.users.includes(username)) return 'user';
    return 'none';
  }

  // Add user to a specific group using map-based input storage
  addUserToGroup(group: Group): void {
    const newUserUsername = this.userInputs[group.id];

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
      this.updateSessionStorage();
      this.toastr.success('User added successfully!', 'Success');
      this.userInputs[group.id] = ''; // Clear input after adding
    } else {
      this.toastr.error('User already in group.', 'Error');
    }
  }

  // Add user to a specific group
  addAdminToGroup(group: Group): void {
    const newAdminUsername = this.adminInputs[group.id];

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
      this.updateGroupDB(group);
      this.toastr.success('Admin added successfully!', 'Success');
      this.adminInputs[group.id] = '';
    } else {
      this.toastr.error('Admin already in group.', 'Error');
    }
  }

  // Delete a user from a group
  deleteUserFromGroup(group: Group, username: string): void {
    const index = group.users.indexOf(username);
    if (index !== -1) {
      group.users.splice(index, 1);
      this.updateGroupDB(group);
      this.updateSessionStorage();
      this.loadGroups();
      this.toastr.success('User removed uccessfully!', 'Success');
    }
  }
  // Delete a user from a group
  deleteAdminFromGroup(group: Group, username: string): void {
    const index = group.admins.indexOf(username);
    if (index !== -1) {
      group.admins.splice(index, 1);
      this.updateGroupDB(group);
      this.loadGroups();
      this.toastr.success('Admin removed uccessfully!', 'Success');
    }
  }

  // Update group in the backend
  updateGroupDB(group: Group): void {
    this.httpClient
      .post<Group>(`${BACKEND_URL}/groupRoute`, group, httpOptions)
      .subscribe(
        (response) => {
          this.loadGroups();
        },
        (error) => {
          this.toastr.error(
            'Failed to update group. Please try again.',
            'Error'
          );
        }
      );
  }
  // Update groups in session storage
  updateSessionStorage(): void {
    sessionStorage.setItem('allGroups', JSON.stringify(this.groups));
  }

  saveUser(): void {
    if (this.newUsername && this.newPassword) {
      const newUser = {
        username: this.newUsername,
        password: this.newPassword,
        newUser: true,
      };

      this.httpClient
        .post(`${BACKEND_URL}/saveUserRoute`, newUser, httpOptions)
        .subscribe((response: any) => {
          if (response.ok) {
            this.saveUserData();
            this.toastr.success('User saved successfully!', 'Success');
          } else {
            this.toastr.error('Duplicate username. Please try again.', 'Error');
          }
        });
    } else {
      this.toastr.error(
        'Failed to add user to loggedOn. Please try again.',
        'Error'
      );
    }
  }
  saveUserData(): void {
    const newUserData = {
      id: this.generateMaxId(),
      username: this.newUsername,
      firstname: '',
      lastname: '',
      email: '',
      roles: [],
      groups: {},
    };

    this.httpClient
      .post(`${BACKEND_URL}/loggedOn`, newUserData, httpOptions)
      .subscribe((response: any) => {
        if (response.ok) {
          this.toastr.success('User data saved successfully!', 'Success');
          this.newUsername = '';
          this.newPassword = '';
          this.loadUsers();
        } else {
          this.toastr.error(
            'Failed to add user credentials. Please try again.',
            'Error'
          );
        }
      });
  }

  generateMaxId(): string {
    if (this.users.length === 0) {
      return '1';
    }
    const maxId = Math.max(...this.users.map((user) => +user.id));
    return (maxId + 1).toString();
  }

  generateUniqueId(): string {
    const maxId = this.groups.reduce(
      (max, group) => Math.max(max, +group.id),
      0
    );
    return (maxId + 1).toString();
  }
}
