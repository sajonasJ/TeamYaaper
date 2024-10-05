import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly SESSION_STORAGE_KEY = 'userlogin';
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();

  constructor() {
    // Initialize the loggedIn state based on session storage on service initialization
    const isLoggedIn = this.checkLoginStatus();
    this.loggedIn.next(isLoggedIn);
  }

  // Utility method to get login status from session storage
  private checkLoginStatus(): boolean {
    return sessionStorage.getItem(this.SESSION_STORAGE_KEY) === 'true';
  }

  // Method to log in the user and update session storage
  login() {
    sessionStorage.setItem(this.SESSION_STORAGE_KEY, 'true');
    this.loggedIn.next(true);
  }

  // Method to log out the user and clear session storage
  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
  }
}
