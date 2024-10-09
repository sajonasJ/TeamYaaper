import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);
    mockUserService = jasmine.createSpyObj('UserService', ['uploadProfilePicture', 'updateUser', 'deleteUser']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [AccountComponent],
      imports: [FormsModule],  // For handling form inputs
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit - when user is logged in
  it('should load user data when user is logged in', () => {
    spyOn(component, 'loadData');
    mockAuthService.isLoggedIn = of(true);

    component.ngOnInit();
    
    expect(component.loadData).toHaveBeenCalled();
  });

  // Test ngOnInit - when user is not logged in
  it('should redirect to login page if user is not logged in', () => {
    mockAuthService.isLoggedIn = of(false);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test loadData method
  it('should load user data from session storage', () => {
    sessionStorage.setItem('id', '123');
    sessionStorage.setItem('username', 'testUser');
    sessionStorage.setItem('firstname', 'Test');
    sessionStorage.setItem('lastname', 'User');
    sessionStorage.setItem('email', 'test@example.com');
    sessionStorage.setItem('roles', JSON.stringify(['user']));
    sessionStorage.setItem('groups', JSON.stringify(['group1']));

    component.loadData();

    expect(component.id).toBe('123');
    expect(component.username).toBe('testUser');
    expect(component.firstname).toBe('Test');
    expect(component.lastname).toBe('User');
    expect(component.email).toBe('test@example.com');
    expect(component.roles).toEqual(['user']);
    expect(component.groups).toEqual(['group1']);
  });

  // Test onFileSelected method (profile picture upload preview)
  it('should preview the selected profile picture', () => {
    const file = new File([''], 'profile-picture.png');
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
  });

  // Test uploadProfilePicture - success
  it('should upload profile picture successfully', () => {
    const file = new File([''], 'profile-picture.png');
    component.selectedFile = file;
    component.id = '123';
    
    const mockResponse = { ok: true, imageUrl: 'image-url' };
    mockUserService.uploadProfilePicture.and.returnValue(of(mockResponse));

    component.uploadProfilePicture();

    expect(mockUserService.uploadProfilePicture).toHaveBeenCalledWith(file, '123');
    expect(mockToastr.success).toHaveBeenCalledWith('Profile picture updated successfully!', 'Success');
    expect(sessionStorage.getItem('profilePicture')).toBe('image-url');
  });

  // Test uploadProfilePicture - failure
  it('should show error when uploading profile picture fails', () => {
    component.selectedFile = new File([''], 'profile-picture.png');
    component.id = '123';
    
    mockUserService.uploadProfilePicture.and.returnValue(throwError('Failed to upload'));

    component.uploadProfilePicture();

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to upload profile picture. Please try again.', 'Error');
  });

  // Test onSave method (successful user update)
  it('should update user data successfully', () => {
    component.id = '123';
    component.username = 'testUser';
    component.firstname = 'Test';
    component.lastname = 'User';
    component.email = 'test@example.com';
    component.roles = ['user'];
    component.groups = ['group1'];

    const updatedUser = {
      _id: '123',
      username: 'testUser',
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      roles: ['user'],
      groups: ['group1']
    };

    mockUserService.updateUser.and.returnValue(of({ ok: true }));

    component.onSave();

    expect(mockUserService.updateUser).toHaveBeenCalledWith(updatedUser);
    expect(mockToastr.success).toHaveBeenCalledWith('User data updated successfully!', 'Success');
    expect(component.isEditMode).toBeFalse();
  });

  // Test onSave method (failure)
  it('should show error when updating user data fails', () => {
    mockUserService.updateUser.and.returnValue(throwError('Failed to update'));

    component.onSave();

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to update user data. Please try again.', 'Error');
  });

  // Test onDelete method (successful deletion)
  it('should delete the user and logout on success', () => {
    component.id = '123';
    component.username = 'testUser';

    mockUserService.deleteUser.and.returnValue(of({}));

    component.onDelete();

    expect(mockUserService.deleteUser).toHaveBeenCalledWith('testUser');
    expect(mockToastr.success).toHaveBeenCalledWith('Account deleted successfully.', 'Success');
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test onDelete method (failure)
  it('should show error when deleting the user account fails', () => {
    mockUserService.deleteUser.and.returnValue(throwError('Failed to delete'));

    component.onDelete();

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to delete account. Please try again.', 'Error');
  });

  // Test onUpdate method (switch to edit mode)
  it('should switch to edit mode when onUpdate is called', () => {
    component.onUpdate();

    expect(component.isEditMode).toBeTrue();
  });

  // Test onCancelEdit method (cancel edit mode)
  it('should cancel edit mode when onCancelEdit is called', () => {
    component.isEditMode = true;
    component.onCancelEdit();

    expect(component.isEditMode).toBeFalse();
  });

  // Test objectKeys method
  it('should return object keys', () => {
    const obj = { key1: 'value1', key2: 'value2' };
    const keys = component.objectKeys(obj);

    expect(keys).toEqual(['key1', 'key2']);
  });
});
