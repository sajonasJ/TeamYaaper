import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';  // For handling template-driven forms
import { of, throwError } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockUserService = jasmine.createSpyObj('UserService', ['addUser']);

    mockActivatedRoute = {
      queryParams: of({ signup: 'true' })  // Simulating a query param
    };

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [FormsModule],  // For ngModel and form handling
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastrService, useValue: mockToastr },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Trigger ngOnInit and form bindings
  });

  // Test component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit to set isSignIn based on route parameters
  it('should set isSignIn to false if "signup" query param exists', () => {
    component.ngOnInit();
    expect(component.isSignIn).toBeFalse();
  });

  // Test switchToSignUp method
  it('should navigate to sign-up when switchToSignUp is called', () => {
    component.switchToSignUp();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { signup: true },
    });
  });

  // Test switchToSignIn method
  it('should navigate to sign-in when switchToSignIn is called', () => {
    component.switchToSignIn();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { signup: null },
      queryParamsHandling: 'merge',
    });
  });

  // Test form submission (successful user creation)
  it('should submit the form and show success message on valid signup', () => {
    component.newUsername = 'testUser';
    component.newPassword = 'password123';
    component.verifyPassword = 'password123';
    component.newFirstname = 'Test';
    component.newLastname = 'User';
    component.newEmail = 'test@example.com';

    // Mock successful user registration
    mockUserService.addUser.and.returnValue(of({}));

    const mockForm = { valid: true, value: {} };  // Simulating a valid form
    component.onSubmit(mockForm);

    expect(mockUserService.addUser).toHaveBeenCalledWith({
      username: 'testUser',
      password: 'password123',
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
    });
    expect(mockToastr.success).toHaveBeenCalledWith('User added successfully!', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test form submission (passwords do not match)
  it('should show error if passwords do not match', () => {
    component.newUsername = 'testUser';
    component.newPassword = 'password123';
    component.verifyPassword = 'differentPassword';

    const mockForm = { valid: true, value: {} };
    component.onSubmit(mockForm);

    expect(mockToastr.error).toHaveBeenCalledWith('Passwords do not match', 'Error');
  });

  // Test form submission (form is invalid)
  it('should show error if form is invalid', () => {
    const mockForm = { valid: false, value: {} };
    component.onSubmit(mockForm);

    expect(mockToastr.error).toHaveBeenCalledWith('Please fill in all fields correctly.', 'Error');
  });

  // Test form submission (user already exists - conflict error)
  it('should show conflict error if user already exists', () => {
    component.newUsername = 'testUser';
    component.newPassword = 'password123';
    component.verifyPassword = 'password123';

    // Mock conflict error response
    mockUserService.addUser.and.returnValue(
      throwError({ status: 409, error: { message: 'User already exists' } })
    );

    const mockForm = { valid: true, value: {} };
    component.onSubmit(mockForm);

    expect(mockToastr.error).toHaveBeenCalledWith('User already exists', 'Conflict');
  });

  // Test form submission (general server error)
  it('should show error if server returns a failure', () => {
    component.newUsername = 'testUser';
    component.newPassword = 'password123';
    component.verifyPassword = 'password123';

    // Mock generic server error
    mockUserService.addUser.and.returnValue(throwError({ status: 500 }));

    const mockForm = { valid: true, value: {} };
    component.onSubmit(mockForm);

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to add user. Please try again.', 'Error');
  });
});
