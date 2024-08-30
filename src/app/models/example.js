import { User } from './models/user';
import { AdminUser } from './models/admin-user';
import { SuperUser } from './models/super-user';

// Create a SuperUser
const superUser = new SuperUser('1', 'superuser', 'superuser@example.com');

// Create a User and make them an AdminUser by creating a group
const user1 = new User('2', 'user1', 'user1@example.com');
user1.addToGroup('general', ['admin']); // User creates a group and becomes an admin

// Convert user1 to AdminUser
const adminUser = new AdminUser(user1.id, user1.username, user1.email, user1.groupRoles);

// AdminUser appoints another user as admin
const user2 = new User('3', 'user2', 'user2@example.com');
adminUser.appointAdmin('general', user2);

// SuperUser removes a user from a group
superUser.removeUserFromAnyGroup('general', user2);

// SuperUser can access all groups and appoint admins
superUser.accessAllGroups();
superUser.appointAdminInAnyGroup('support', user2);
