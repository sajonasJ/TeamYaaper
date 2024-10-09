import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';
import { User, Group } from '../models/dataInterfaces';

// Example of mock Users
const users: User[] = [
  {
    _id: '1',
    username: 'testUser',
    firstname: 'Test',
    lastname: 'User',
    email: 'testuser@example.com',
    roles: ['user'],
    groups: []
  },
  {
    _id: '2',
    username: 'otherUser',
    firstname: 'Other',
    lastname: 'User',
    email: 'otheruser@example.com',
    roles: ['admin'],
    groups: []
  }
];

// Example of mock Group
const group: Group = {
  _id: '1',
  name: 'Test Group',
  description: 'This is a test group',
  admins: ['1'],    // Assuming the ID of the user who is admin is '1'
  users: ['1', '2'], // Users in the group
  channels: []       // Assuming channels is an array
};

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  // Test loadCurrentUser method
  it('should return the current username from sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('testUser');
    const username = service.loadCurrentUser();
    expect(username).toBe('testUser');
  });

  it('should return null if username is not in sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    const username = service.loadCurrentUser();
    expect(username).toBeNull();
  });

  // Test userExists method
  it('should return true if user exists in users array', () => {
    const testUsers: User[] = [{
      _id: '1',
      username: 'testUser',
      firstname: 'Test',
      lastname: 'User',
      email: 'testuser@example.com',
      roles: ['user'],
      groups: []
    }];
    const exists = service.userExists(testUsers, 'testUser');
    expect(exists).toBeTrue();
  });

  it('should return false if user does not exist in users array', () => {
    const testUsers: User[] = [{
      _id: '2',
      username: 'otherUser',
      firstname: 'Other',
      lastname: 'User',
      email: 'otheruser@example.com',
      roles: ['admin'],
      groups: []
    }];
    const exists = service.userExists(testUsers, 'testUser');
    expect(exists).toBeFalse();
  });

  // Test userInGroup method
  it('should return true if user is in the group', () => {
    const testGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: 'This is a test group',
      admins: [],
      users: ['testUser'],
      channels: []
    };
    const inGroup = service.userInGroup(testGroup, 'testUser');
    expect(inGroup).toBeTrue();
  });

  it('should return false if user is not in the group', () => {
    const testGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: 'This is a test group',
      admins: [],
      users: ['otherUser'],
      channels: []
    };
    const inGroup = service.userInGroup(testGroup, 'testUser');
    expect(inGroup).toBeFalse();
  });

  // Test adminInGroup method
  it('should return true if user is an admin in the group', () => {
    const testGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: 'This is a test group',
      admins: ['adminUser'],
      users: [],
      channels: []
    };
    const isAdmin = service.adminInGroup(testGroup, 'adminUser');
    expect(isAdmin).toBeTrue();
  });

  it('should return false if user is not an admin in the group', () => {
    const testGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: 'This is a test group',
      admins: ['otherAdmin'],
      users: [],
      channels: []
    };
    const isAdmin = service.adminInGroup(testGroup, 'adminUser');
    expect(isAdmin).toBeFalse();
  });

  // Test mapUserDetailsToGroups method
  it('should map user IDs to usernames in groups', () => {
    const testUsers: User[] = [
      { _id: '1', username: 'adminUser', firstname: '', lastname: '', email: '', roles: [], groups: [] },
      { _id: '2', username: 'testUser', firstname: '', lastname: '', email: '', roles: [], groups: [] }
    ];
    const testGroups: Group[] = [
      {
        _id: '1',
        name: 'Test Group',
        description: 'A test group',
        admins: ['1'],
        users: ['2'],
        channels: []
      }
    ];

    const result = service.mapUserDetailsToGroups(testGroups, testUsers);
    expect(result[0].admins).toContain('adminUser');
    expect(result[0].users).toContain('testUser');
  });

  // Test getUsernameById method
  it('should return the username when the user ID is found', () => {
    const testUsers: User[] = [{ _id: '1', username: 'testUser', firstname: '', lastname: '', email: '', roles: [], groups: [] }];
    const username = service.getUsernameById(testUsers, '1');
    expect(username).toBe('testUser');
  });

  it('should return the user ID if the username is not found', () => {
    const testUsers: User[] = [{ _id: '1', username: 'testUser', firstname: '', lastname: '', email: '', roles: [], groups: [] }];
    const username = service.getUsernameById(testUsers, '2');
    expect(username).toBe('2');
  });

  // Test addUserToGroup method
  it('should add a user to both users and admins arrays if admin', () => {
    const testGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: 'This is a test group',
      admins: [],
      users: [],
      channels: []
    };
    const updatedGroup = service.addUserToGroup(testGroup, 'adminUser', 'admin');
    expect(updatedGroup.admins).toContain('adminUser');
    expect(updatedGroup.users).toContain('adminUser');
  });

  it('should add a user only to the users array if not admin', () => {
    const testGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: 'This is a test group',
      admins: [],
      users: [],
      channels: []
    };
    const updatedGroup = service.addUserToGroup(testGroup, 'testUser', 'user');
    expect(updatedGroup.admins).not.toContain('testUser');
    expect(updatedGroup.users).toContain('testUser');
  });

  // Test removeUserFromList method
  it('should remove a user from the list', () => {
    const usersList = ['user1', 'user2', 'user3'];
    const updatedList = service.removeUserFromList(usersList, 'user2');
    expect(updatedList).not.toContain('user2');
  });
});
