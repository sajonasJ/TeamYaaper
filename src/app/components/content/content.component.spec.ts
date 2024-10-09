import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentComponent } from './content.component';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { JoinRequestService } from '../../services/join-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let mockGroupService: jasmine.SpyObj<GroupService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSocketService: jasmine.SpyObj<SocketService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockJoinRequestService: jasmine.SpyObj<JoinRequestService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockGroupService = jasmine.createSpyObj('GroupService', [
      'getGroups',
      'updateGroup',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockSocketService = jasmine.createSpyObj('SocketService', [
      'initSocket',
      'onMessage',
      'send',
    ]);
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);
    mockJoinRequestService = jasmine.createSpyObj('JoinRequestService', [
      'addJoinRequest',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ContentComponent],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SocketService, useValue: mockSocketService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: JoinRequestService, useValue: mockJoinRequestService },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;

    // Mock AuthService's isLoggedIn observable
    mockAuthService.isLoggedIn = of(true); // Simulate that the user is logged in
  });

  // Test to check if the component is created successfully
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit
  it('should call loadGroups, loadCurrentUser, and loadUsers on ngOnInit', () => {
    spyOn(component, 'loadGroups');
    spyOn(component, 'loadCurrentUser');
    spyOn(component, 'loadUsers');

    component.ngOnInit();

    expect(component.loadGroups).toHaveBeenCalled();
    expect(component.loadCurrentUser).toHaveBeenCalled();
    expect(component.loadUsers).toHaveBeenCalled();
  });

  // Test loadGroups
  it('should load groups from GroupService', () => {
    const mockGroups = [
      {
        _id: '1',
        name: 'Test Group',
        description: 'A test group',
        admins: [],
        users: [],
        channels: [],
      },
    ];
    mockGroupService.getGroups.and.returnValue(of(mockGroups));

    component.loadGroups();

    expect(component.groups).toEqual(mockGroups);
    expect(mockGroupService.getGroups).toHaveBeenCalled();
  });

  // Test loadUsers
  it('should load users from UserService', () => {
    const mockUsers = [
      {
        _id: '1',
        username: 'testUser',
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        roles: ['user'],
        groups: [],
      },
    ];
    mockUserService.getUsers.and.returnValue(of(mockUsers));

    component.loadUsers();

    expect(component.users).toEqual(mockUsers);
    expect(mockUserService.getUsers).toHaveBeenCalled();
  });

  // Test selectChannel
  it('should select a channel and load chat history', () => {
    const mockChannel = {
      name: 'general',
      description: 'General channel',
      messages: [],
      users: [],
    };
    component.selectedGroup = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };

    spyOn(component, 'loadChatHistory');

    component.selectChannel(mockChannel);

    expect(component.selectedChannel).toEqual(mockChannel);
    expect(component.loadChatHistory).toHaveBeenCalledWith('1', 'general');
  });

  // Test chat method
  it('should send a message through the SocketService', () => {
    component.currentUser = {
      _id: '1',
      username: 'testUser',
      firstname: '',
      lastname: '',
      email: '',
      roles: [],
      groups: [],
    };
    component.selectedGroup = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };
    component.selectedChannel = {
      name: 'general',
      description: '',
      messages: [],
      users: [],
    };
    component.newMessage = 'Hello World';

    component.chat(new Event('submit'));

    expect(mockSocketService.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        groupId: '1',
        channelName: 'general',
        name: 'testUser',
        text: 'Hello World',
      })
    );
  });

  // Test showDeleteConfirmationModal
  it('should show the delete confirmation modal', () => {
    spyOn(document, 'getElementById').and.returnValue(
      document.createElement('div')
    );
    spyOn(bootstrap.Modal.prototype, 'show');

    component.showDeleteConfirmationModal();

    expect(bootstrap.Modal.prototype.show).toHaveBeenCalled();
  });
});
