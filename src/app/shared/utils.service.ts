import { Injectable } from '@angular/core';
import { User, Group } from '../models/dataInterfaces';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  loadCurrentUser(): string | null {
    return sessionStorage.getItem('username');
  }

  userExists(users: User[], username: string): boolean {
    return users.some((user) => user.username === username);
  }

  // Check if a user is already in the group
  userInGroup(group: Group, username: string): boolean {
    return group.users.includes(username);
  }

  // Check if a user is already an admin
  adminInGroup(group: Group, username: string): boolean {
    return group.admins.includes(username);
  }


  // Utility function to map user/admin IDs in the groups to their corresponding usernames
  mapUserDetailsToGroups(groups: Group[], users: User[]): Group[] {
    if (groups.length && users.length) {
      return groups.map((group) => {
        // Ensure `admins` and `users` are arrays
        group.admins = Array.isArray(group.admins) ? group.admins : [];
        group.users = Array.isArray(group.users) ? group.users : [];

        // Map IDs to usernames
        group.admins = group.admins.map((adminId) =>
          this.getUsernameById(users, adminId)
        );
        group.users = group.users.map((userId) =>
          this.getUsernameById(users, userId)
        );

        return group;
      });
    }
    return groups;
  }

  // Get username by user ID
  getUsernameById(users: User[], userId: string): string {
    const user = users.find((user) => user._id === userId);
    return user ? user.username : userId;
  }

  showDeleteConfirmationModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  addUserToGroup(group: Group, username: string, userRole: 'user' | 'admin'): Group {
    if (userRole === 'admin' && !group.admins.includes(username)) {
      group.admins.push(username);
    }
    if (!group.users.includes(username)) {
      group.users.push(username);
    }
    return group;
  }
  

  removeUserFromList(list: string[], username: string): string[] {
    return list.filter((user) => user !== username);
  }
}
