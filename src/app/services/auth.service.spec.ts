import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();  // Clean up session storage after each test
  });

  // Test service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test initialization of the loggedIn state based on session storage
  it('should initialize loggedIn state from session storage', () => {
    // Set session storage to simulate a logged-in user
    sessionStorage.setItem('userlogin', 'true');
    service = TestBed.inject(AuthService);

    service.isLoggedIn.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeTrue();
    });
  });

  // Test login method
  it('should log in the user and update session storage', () => {
    service.login();
    
    // Check session storage is updated
    expect(sessionStorage.getItem('userlogin')).toBe('true');

    // Check that the loggedIn BehaviorSubject is updated
    service.isLoggedIn.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeTrue();
    });
  });

  // Test logout method
  it('should log out the user and clear session storage', () => {
    // First log in the user to set up the session storage
    service.login();
    expect(sessionStorage.getItem('userlogin')).toBe('true');

    // Now log out the user
    service.logout();

    // Check session storage is cleared
    expect(sessionStorage.getItem('userlogin')).toBeNull();

    // Check that the loggedIn BehaviorSubject is updated
    service.isLoggedIn.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeFalse();
    });
  });

  // Test initialization when session storage is empty (not logged in)
  it('should initialize as logged out when session storage is empty', () => {
    // Clear session storage and initialize the service
    sessionStorage.clear();
    service = TestBed.inject(AuthService);

    service.isLoggedIn.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeFalse();  // Should be logged out initially
    });
  });
});
