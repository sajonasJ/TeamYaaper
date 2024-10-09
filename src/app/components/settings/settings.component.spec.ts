import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../shared/utils.service';
import { JoinRequestService } from '../../services/join-request.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';
import { Group, User, JoinRequest } from '../../models/dataInterfaces';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockGroupService: jasmine.SpyObj<GroupService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockJoinRequestService: jasmine.SpyObj<JoinRequestService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockGroupService = jasmine.createSpyObj('GroupService', [
      'getGroupById',
      'updateGroup',
      'deleteGroup',
    ]);
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', [
      'removeUserFromList',
    ]);
    mockJoinRequestService = jasmine.createSpyObj('JoinRequestService', [
      'getJoinRequests',
      'updateJoinRequest',
    ]);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: UserService, useValue: mockUserService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: JoinRequestService, useValue: mockJoinRequestService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnChanges - when selectedGroup changes
  it('should load group data, join requests, and all users when selectedGroup changes', () => {
    spyOn(component, 'loadGroupData');
    spyOn(component, 'loadJoinRequests');
    spyOn(component, 'loadAllUsers');

    const group: Group = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };
    component.selectedGroup = group;

    component.ngOnChanges({
      selectedGroup: new SimpleChange(null, group, true),
    });

    expect(component.loadGroupData).toHaveBeenCalled();
    expect(component.loadJoinRequests).toHaveBeenCalled();
    expect(component.loadAllUsers).toHaveBeenCalled();
  });

  // Test loadGroupData with valid group ID
  it('should load group data successfully', () => {
    const group: Group = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };
    mockGroupService.getGroupById.and.returnValue(of(group));
    component.selectedGroup = group;

    component.loadGroupData();

    expect(mockGroupService.getGroupById).toHaveBeenCalledWith('1');
    expect(component.selectedGroup).toEqual(group);
  });

  // Test loadGroupData with invalid group ID
  it('should show an error when group data fails to load', () => {
    component.selectedGroup = {
      _id: 'invalid',
      name: '',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };
    mockGroupService.getGroupById.and.returnValue(
      throwError('Failed to load group data')
    );

    component.loadGroupData();

    expect(mockToastr.error).toHaveBeenCalledWith(
      'Failed to load group data. Please try again.',
      'Error'
    );
  });

  // Test loadJoinRequests
  it('should load join requests successfully', () => {
    const requests: JoinRequest[] = [
      {
        _id: '1',
        groupId: '1',
        userId: '2',
        status: 'pending',
        requestDate: new Date(),
        username: 'testUser',
        userDetails: {
          username: 'testUser',
          firstname: 'Test',
          lastname: 'User',
        },
      },
    ];
    mockJoinRequestService.getJoinRequests.and.returnValue(of(requests));
    component.selectedGroup = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };

    component.loadJoinRequests();

    expect(mockJoinRequestService.getJoinRequests).toHaveBeenCalledWith('1');
    expect(component.joinRequests.length).toBe(1);
    expect(component.joinRequests[0].username).toBe('testUser');
  });

  // Test approveJoinRequest
  it('should approve join request successfully', () => {
    const request: JoinRequest = {
      _id: '1',
      groupId: '1',
      userId: '2',
      status: 'pending',
      username: 'testUser',
      requestDate: new Date(),
      userDetails: {
        username: 'testUser',
        firstname: 'Test',
        lastname: 'User',
      },
    };
    mockJoinRequestService.updateJoinRequest.and.returnValue(of({}));
    component.selectedGroup = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };

    component.approveJoinRequest(request);

    expect(mockJoinRequestService.updateJoinRequest).toHaveBeenCalledWith(
      '1',
      'approved'
    );
    expect(mockToastr.success).toHaveBeenCalledWith(
      'Request updated successfully.',
      'Success'
    );
  });

  // Test rejectJoinRequest
  it('should reject join request successfully', () => {
    const request: JoinRequest = {
      _id: '1',
      groupId: '1',
      userId: '2',
      status: 'pending',
      requestDate: new Date(),
      username: 'testUser',
      userDetails: {
        username: 'testUser',
        firstname: 'Test',
        lastname: 'User',
      },
    };
    mockJoinRequestService.updateJoinRequest.and.returnValue(of({}));
    component.selectedGroup = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };

    component.rejectJoinRequest(request);

    expect(mockJoinRequestService.updateJoinRequest).toHaveBeenCalledWith(
      '1',
      'rejected'
    );
    expect(mockToastr.success).toHaveBeenCalledWith(
      'Request updated successfully.',
      'Success'
    );
  });

  // Test deleteGroup
  it('should delete group successfully', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Mock the confirm dialog
    mockGroupService.deleteGroup.and.returnValue(of({}));
    component.selectedGroup = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };

    component.deleteGroup();

    expect(mockGroupService.deleteGroup).toHaveBeenCalledWith('1');
    expect(mockToastr.success).toHaveBeenCalledWith(
      'Group deleted successfully.',
      'Success'
    );
  });

  // Test removeMember
  it('should remove a member and update the group', () => {
    const member: User = {
      _id: '1',
      username: 'testUser',
      firstname: 'Test',
      lastname: 'User',
      email: '',
      roles: [],
      groups: [],
    };
    component.selectedGroup = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: ['testUser'],
      users: ['testUser'],
      channels: [],
    };

    mockUtilsService.removeUserFromList.and.callFake((list, username) =>
      list.filter((user) => user !== username)
    );
    mockGroupService.updateGroup.and.returnValue(of({}));

    component.removeMember(member);

    expect(mockUtilsService.removeUserFromList).toHaveBeenCalledWith(
      ['testUser'],
      'testUser'
    );
    expect(mockGroupService.updateGroup).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalledWith(
      'Group updated successfully.',
      'Success'
    );
  });

  // Test closeSettings
  it('should emit close event when closeSettings is called', () => {
    spyOn(component.close, 'emit');

    component.closeSettings();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
