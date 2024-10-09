import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../services/group.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BACKEND_URL } from '../../constants';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockGroupService: jasmine.SpyObj<GroupService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['error']);
    mockGroupService = jasmine.createSpyObj('GroupService', ['']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr },
        { provide: GroupService, useValue: mockGroupService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test successful login
  it('should navigate to /home on successful login and store user info in sessionStorage', () => {
    const mockResponse = {
      ok: true,
      id: '1',
      username: 'testUser',
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      roles: ['user'],
      groupMemberships: [],
      profilePictureUrl: 'some-url',
    };

    component.username = 'testUser';
    component.password = 'testPass';

    component.submit();

    // Mock the HTTP response
    const req = httpMock.expectOne(`${BACKEND_URL}/verify`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Expectations after the successful login
    expect(sessionStorage.getItem('id')).toBe(mockResponse.id);
    expect(sessionStorage.getItem('username')).toBe(mockResponse.username);
    expect(sessionStorage.getItem('roles')).toBe(
      JSON.stringify(mockResponse.roles)
    );
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  // Test failed login
  it('should show an error message on failed login', () => {
    const mockResponse = {
      ok: false,
      message: 'Invalid credentials',
    };

    component.username = 'testUser';
    component.password = 'wrongPass';

    component.submit();

    // Mock the HTTP response
    const req = httpMock.expectOne(`${BACKEND_URL}/verify`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Expectations after the failed login
    expect(mockToastr.error).toHaveBeenCalledWith(
      mockResponse.message || 'Email or password incorrect'
    );
    expect(sessionStorage.getItem('id')).toBeNull();
  });

  // Test HTTP error during login
  it('should show an error message when an HTTP error occurs during login', () => {
    component.username = 'testUser';
    component.password = 'testPass';

    component.submit();

    // Mock the HTTP error
    const req = httpMock.expectOne(`${BACKEND_URL}/verify`);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error'));

    // Expectations after the network error
    expect(mockToastr.error).toHaveBeenCalledWith(
      'An error occurred during login.'
    );
    expect(sessionStorage.getItem('id')).toBeNull();
  });
});
