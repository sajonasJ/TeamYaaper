// super-user.ts
import { AdminUser } from './adminUserClass';
import { User } from './userClass';

export class SuperUser extends User {
  constructor(id: string, username: string, email: string) {
    super(id, username, email);
  }

  // Method to access any group and appoint an admin
  appointAdminInAnyGroup(group: string, user: User): void {
    user.addToGroup(group, ['admin']);
    console.log(`${user.username} appointed as an admin in group ${group} by ${this.username}`);
  }

  // Method to remove any user from any group
  removeUserFromAnyGroup(group: string, user: User): void {
    user.removeFromGroup(group);
    console.log(`${user.username} removed from group ${group} by ${this.username}`);
  }

  // Method to access all groups
  accessAllGroups(): void {
    console.log(`${this.username} has access to all groups`);
  }
}
