import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL, httpOptions } from '../../constants';
import { User, Group } from '../../models/dataInterfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  users: User[] = [];
  groups: Group[] = [];
  newUserForGroup: string = ''; 

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
  }

  // Load groups from backend or storage
  loadUsers(): void {
    // Assuming your backend endpoint for users also works with POST
    this.httpClient
      .post<User[]>(`${BACKEND_URL}/loggedOn`, {}, httpOptions)
      .subscribe(
        (data) => (this.users = data),
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
          console.log('Loaded groups:', this.groups);
        },
        (error) => console.error('Error loading groups:', error)
      );
  }

  // Make a user a superuser
  makeSuper(user: User): void {
    this.updateUser(user);
    alert('User is now a superuser');
  }

  addUser(): void {
    alert('User added successfully');
  }
  updateUser(user: User): void {
    alert('User updated successfully');
  }
  deleteUser(user: User): void {
    alert('User deleted successfully');
  }

  addGroup(): void {
    alert('Group added successfully');
  }
  deleteGroup(group: Group): void {
    alert('Group deleted successfully');
  }
   // Helper method to get the role of a user in a specific group
   getUserRoleInGroup(group: Group, username: string): string {
    if (group.superuser.includes(username)) return 'superuser';
    if (group.admins.includes(username)) return 'admin';
    if (group.users.includes(username)) return 'user';
    return 'none';
  }

  // Add user to a specific group
  addUserToGroup(group: Group): void {
    if (this.newUserForGroup && !group.users.includes(this.newUserForGroup)) {
      group.users.push(this.newUserForGroup);
      this.updateGroupDB(group);
      this.newUserForGroup = ''; // Clear input after adding
    } else {
      alert('User already in group or no user specified');
    }
  }

  // Delete a user from a group
  deleteUserFromGroup(group: Group, username: string): void {
    const index = group.users.indexOf(username);
    if (index !== -1) {
      group.users.splice(index, 1);
      this.updateGroupDB(group);
    }
  }
  // Update group in the backend
  updateGroupDB(group: Group): void {
    console.log('Sending updated group to backend:', group);
    this.httpClient
      .post<Group>(`${BACKEND_URL}/groupRoute`, group, httpOptions)
      .subscribe(
        (response) => {
          console.log('Group updated successfully:', response);
          this.loadGroups(); // Reload groups to reflect changes
        },
        (error) => {
          console.error('Error updating group:', error);
          alert('Failed to update group. Please try again.');
        }
      );
  }

}
