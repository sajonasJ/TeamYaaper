// user.ts
export class User {
    id: string;
    username: string;
    email: string;
    groupRoles: { [groupName: string]: string[] }; // Roles per group
  
    constructor(id: string, username: string, email: string, groupRoles: { [groupName: string]: string[] } = {}) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.groupRoles = groupRoles;
    }
  
    // Method to add roles to a user in a specific group
    addToGroup(group: string, roles: string[] = ['user']): void {
      if (!this.groupRoles[group]) {
        this.groupRoles[group] = [];
      }
      this.groupRoles[group] = [...new Set([...this.groupRoles[group], ...roles])]; // Avoid duplicate roles
      console.log(`${this.username} added to group ${group} with roles: ${roles.join(', ')}`);
    }
  
    // Method to remove a user from a group
    removeFromGroup(group: string): void {
      delete this.groupRoles[group];
      console.log(`${this.username} removed from group ${group}`);
    }
  
    // Method to check if a user has a specific role in a group
    hasRole(group: string, role: string): boolean {
      return this.groupRoles[group]?.includes(role) || false;
    }
  
    // Method to get all roles of a user in a specific group
    getRolesForGroup(group: string): string[] {
      return this.groupRoles[group] || [];
    }
  }
  