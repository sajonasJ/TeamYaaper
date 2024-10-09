import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs'; // To mock observables

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for AuthService and Router
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'logout',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Provide mock services in the test module
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test if the component is created successfully
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit
  it('should check if user is logged in and load roles if logged in', () => {
    // Mock AuthService.isLoggedIn observable
    mockAuthService.isLoggedIn = of(true);
    spyOn(component, 'loadUserRoles');

    component.ngOnInit();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.loadUserRoles).toHaveBeenCalled();
  });

  // Test loadUserRoles
  it('should load user roles from sessionStorage', () => {
    // Mock sessionStorage data
    const mockRoles = ['admin', 'user'];
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(mockRoles));

    component.loadUserRoles();

    expect(component.roles).toEqual(mockRoles);
  });

  // Test logout
  it('should logout the user and navigate to login page', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
