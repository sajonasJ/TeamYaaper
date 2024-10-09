import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { UtilsService } from '../../shared/utils.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockUserService: any;
  let mockGroupService: any;
  let mockToastrService: any;
  let mockUtilsService: any;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'getUsers',
      'addUser',
      'deleteUser',
      'makeSuperUser',
      'removeSuperUser',
    ]);
    mockGroupService = jasmine.createSpyObj('GroupService', [
      'getGroups',
      'addGroup',
      'deleteGroup',
      'updateGroup',
    ]);
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);
    mockUtilsService = jasmine.createSpyObj('UtilsService', [
      'loadCurrentUser',
      'userExists',
      'adminInGroup',
      'userInGroup',
      'removeUserFromList',
      'addUserToGroup',
    ]);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: GroupService, useValue: mockGroupService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  xdescribe('ngOnInit', () => {
    xit('should load users and groups on init', () => {
      const mockUsers = [{ username: 'user1' }];
      const mockGroups = [{ name: 'group1' }];

      mockUserService.getUsers.and.returnValue(of(mockUsers));
      mockGroupService.getGroups.and.returnValue(of(mockGroups));

      component.ngOnInit();
    });

    xit('should handle error when loading users', () => {
      mockUserService.getUsers.and.returnValue(throwError({ status: 500 }));
      component.ngOnInit();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load users. Please try again.',
        'Error'
      );
    });

    xit('should handle error when loading groups', () => {
      mockGroupService.getGroups.and.returnValue(throwError({ status: 500 }));
      component.ngOnInit();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load groups. Please try again.',
        'Error'
      );
    });
  });

  describe('saveUser', () => {
    it('should add a user and clear input fields on success', () => {
      component.newUsername = 'testUser';
      component.newPassword = 'password';
      component.newFirstname = 'First';
      component.newLastname = 'Last';
      component.newEmail = 'test@example.com';

      mockUserService.addUser.and.returnValue(of({}));

      component.saveUser();

      expect(mockUserService.addUser).toHaveBeenCalled();
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'User added successfully!',
        'Success'
      );
      expect(component.newUsername).toBe('');
      expect(component.newPassword).toBe('');
      expect(component.newFirstname).toBe('');
      expect(component.newLastname).toBe('');
      expect(component.newEmail).toBe('');
    });

    it('should show an error if username or password is missing', () => {
      component.newUsername = '';
      component.newPassword = '';
      component.saveUser();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Please fill in both username and password.',
        'Error'
      );
    });
  });

  describe('saveGroup', () => {
    it('should add a group and clear input fields on success', () => {
      component.newGroupName = 'Test Group';
      component.newGroupDescription = 'A test group';

      mockGroupService.addGroup.and.returnValue(of({}));

      component.saveGroup();

      expect(mockGroupService.addGroup).toHaveBeenCalled();
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Group added successfully!',
        'Success'
      );
      expect(component.newGroupName).toBe('');
      expect(component.newGroupDescription).toBe('');
    });

    it('should show an error if group name or description is missing', () => {
      component.newGroupName = '';
      component.newGroupDescription = '';
      component.saveGroup();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Please fill in both group name and description.',
        'Error'
      );
    });
  });

  xdescribe('deleteUser', () => {
    xit('should call confirmDeleteUser when deleteUser is invoked', () => {
      const user = { username: 'testUser' };

      expect(component.isUserDeletion).toBeTrue();
    });
  });

  xdescribe('deleteGroup', () => {
    xit('should call confirmDeleteGroup when deleteGroup is invoked', () => {
      const group = { _id: 'group1' };

      expect(component.isUserDeletion).toBeFalse();
    });
  });

  xdescribe('onConfirmDelete', () => {
    xit('should delete user when confirmDelete is invoked for a user', () => {
      const user = { username: 'testUser' };
      component.isUserDeletion = true;
      mockUserService.deleteUser.and.returnValue(of({}));

      component.onConfirmDelete();

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(user.username);
      expect(component.deleteEntity).toBeNull();
    });

    xit('should delete group when confirmDelete is invoked for a group', () => {
      const group = { _id: 'group1' };
      component.isUserDeletion = false;
      mockGroupService.deleteGroup.and.returnValue(of({}));

      component.onConfirmDelete();

      expect(mockGroupService.deleteGroup).toHaveBeenCalledWith(group._id);
      expect(component.deleteEntity).toBeNull();
    });
  });
});
