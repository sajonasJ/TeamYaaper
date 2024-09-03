import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL, httpOptions } from '../../constants';
import { User, Group } from '../../models/dataInterfaces';

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

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
    this.loadCurrentUser();
  }
  loadCurrentUser(): void {
    this.currentUser = sessionStorage.getItem('username');
  }

  // Load groups from backend or storage
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
    // Sending an empty object with the POST request to fetch all groups
    this.httpClient
      .post<Group[]>(`${BACKEND_URL}/groupRoute`, {}, httpOptions)
      .subscribe(
        (data) => {
          this.groups = data;
        },
        (error) => console.error('Error loading groups:', error)
      );
  }

  // Make a user a superuser
  makeSuper(user: User): void {
    if (!user.roles.includes('super')) {
      user.roles.push('super');
      this.updateUser(user);
    } else {
      alert('User is already a superuser.');
    }
  }

  removeSuper(user: User): void {
    const roleIndex = user.roles.indexOf('super');

    if (roleIndex !== -1) {
      user.roles.splice(roleIndex, 1);
      this.updateUser(user);
      alert('SuperUser role removed successfully.');
    } else {
      alert('User is not a SuperUser.');
    }
  }

  addUser(): void {
    alert('User added successfully');
  }

  updateUser(user: User): void {
    this.httpClient
      .post<User[]>(`${BACKEND_URL}/loggedOn`, user, httpOptions)
      .subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.loadUsers(); // Reload users to reflect changes
          alert('User updated successfully');
        },
        (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user. Please try again.');
        }
      );
  }
  deleteUser(user: User): void {
    alert('User deleted successfully');
  }

  // Function to open modal and prepare for adding new group
  addNewGroup(): void {
    // Clear input fields before opening the modal
    this.newGroupName = '';
    this.newGroupDescription = '';
    // Trigger the modal open (this is handled by the [modalId] binding in HTML)
  }

  // Function to save the new group
  saveGroup(): void {
    if (this.newGroupName && this.newGroupDescription) {
      const newGroup: Group = {
        id: this.generateUniqueId(),
        name: this.newGroupName,
        description: this.newGroupDescription,
        channels: [],
        admins: this.currentUser ? [this.currentUser] : [],
        users: [],
      };
      this.loadUsers();
      this.updateSessionStorage()
      this.updateGroupDB(newGroup);
    } else {
      alert('Please fill in both the group name and description.');
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
            alert('Group deleted successfully');
            this.updateSessionStorage()
            this.loadGroups();
          } else {
            alert(
              response.message || 'Failed to delete group. Please try again.'
            );
            this.loadGroups(); // Reload groups to restore original state
          }
        },
        (error) => {
          console.error('Error deleting group:', error);
          alert('Failed to delete group. Please retry again.');
          this.loadGroups(); // Reload groups to restore original state
        }
      );
  }

  // Helper method to get the role of a user in a specific group
  getUserRoleInGroup(group: Group, username: string): string {
    if (group.admins.includes(username)) return 'admin';
    if (group.users.includes(username)) return 'user';
    return 'none';
  }

  // Add user to a specific group
  addUserToGroup(group: Group): void {
    const userExists = this.users.some(
      (user) => user.username === this.newUserForGroup
    );

    if (!userExists) {
      alert('User does not exist.');
      return;
    }

    if (this.newUserForGroup && !group.users.includes(this.newUserForGroup)) {
      group.users.push(this.newUserForGroup);
      this.updateGroupDB(group);
      this.updateSessionStorage();
      this.newUserForGroup = '';
    } else {
      alert('User already in group');
    }
  }

  // Add user to a specific group
  addAdminToGroup(group: Group): void {
    const userExists = this.users.some(
      (users) => users.username === this.newAdminForGroup
    );

    if (!userExists) {
      alert('User does not exist.');
      return;
    }

    if (
      this.newAdminForGroup &&
      !group.admins.includes(this.newAdminForGroup)
    ) {
      group.admins.push(this.newAdminForGroup);
      this.updateGroupDB(group);
      this.updateSessionStorage();
      this.newAdminForGroup = '';
    } else {
      alert('Admin already in group');
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
    }
  }
  // Delete a user from a group
  deleteAdminFromGroup(group: Group, username: string): void {
    const index = group.admins.indexOf(username);
    if (index !== -1) {
      group.admins.splice(index, 1);
      this.updateGroupDB(group);
      this.updateSessionStorage();
      this.loadGroups();
    }
  }
  // Update group in the backend
  updateGroupDB(group: Group): void {
    this.httpClient
      .post<Group>(`${BACKEND_URL}/groupRoute`, group, httpOptions)
      .subscribe(
        (response) => {
          this.loadGroups(); // Reload groups to reflect changes
        },
        (error) => {
          alert('Failed to update group. Please try again.');
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
            alert(response.message);
          } else {
            alert(
              response.message ||
                'Failed to add user credentials. Please try again.'
            );
          }
        });
    } else {
      alert('Failed to add user to loggedOn. Please try again.');
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
          alert(response.message);
          this.newUsername = '';
          this.newPassword = '';
          this.loadUsers();
        } else {
          alert(
            response.message ||
              'Failed to add user credentials. Please try again.'
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
