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

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
  }

  // Load groups from backend or storage
  loadUsers(): void {
    // Assuming your backend endpoint for users also works with POST
    this.httpClient.post<User[]>(`${BACKEND_URL}/loggedOn`, {}, httpOptions).subscribe(
      (data) => (this.users = data),
      (error) => console.error('Error loading users:', error)
    );
  }

  loadGroups(): void {
    // Sending an empty object with the POST request to fetch all groups
    this.httpClient.post<Group[]>(`${BACKEND_URL}/groupRoute`, {}, httpOptions).subscribe(
      (data) => {
        this.groups = data;
        console.log('Loaded groups:', this.groups);
      },
      (error) => console.error('Error loading groups:', error)
    );
  }

  // Make a user a superuser
  makeSuper(user: User): void {
    if (!user.roles.includes('super')) {
      user.roles.push('super');
      this.updateUser(user);
    }
  }

  deleteGroup(group: Group): void {
    if (confirm(`Are you sure you want to delete group ${group.name}?`)) {
      // Sending delete request to backend
      this.httpClient
        .delete(`${BACKEND_URL}/groups/${group.id}`, httpOptions)
        .subscribe(
          () => (this.groups = this.groups.filter((g) => g.id !== group.id)),
          (error) => console.error('Error deleting group:', error)
        );
    }
  }

  updateUser(user: User): void {
    this.httpClient
      .put(`${BACKEND_URL}/users/${user.id}`, user, httpOptions)
      .subscribe(
        () => console.log('User updated successfully.'),
        (error) => console.error('Error updating user:', error)
      );
  }
}