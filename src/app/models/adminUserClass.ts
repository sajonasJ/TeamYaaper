// admin-user.ts
import { User } from './userClass';

export class AdminUser extends User {
  constructor(id: string, username: string, email: string, groupRoles: { [groupName: string]: string[] }) {
    super(id, username, email, groupRoles);
  }

  // Method to add a user to a group as an admin
  appointAdmin(group: string, user: User): void {
    if (this.hasRole(group, 'admin')) {
      user.addToGroup(group, ['admin']);
      console.log(`${user.username} appointed as an admin in group ${group}`);
    } else {
      console.log(`${this.username} does not have the rights to appoint an admin in group ${group}`);
    }
  }

  // Method to remove a user from a group
  removeUserFromGroup(group: string, user: User): void {
    if (this.hasRole(group, 'admin')) {
      user.removeFromGroup(group);
      console.log(`${user.username} removed from group ${group}`);
    } else {
      console.log(`${this.username} does not have the rights to remove users in group ${group}`);
    }
  }
}
