// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class AuthService {
  // BehaviorSubject to hold the login state
  private loggedIn = new BehaviorSubject<boolean>(false);

  // Observable to expose login state
  isLoggedIn = this.loggedIn.asObservable();

  constructor() {
    // Check sessionStorage to set initial state
    const isLoggedIn = !!sessionStorage.getItem('userid');
    this.loggedIn.next(isLoggedIn);
  }

  // Method to log in the user
  login() {
    this.loggedIn.next(true);
  }

  // Method to log out the user
  logout() {
    // Clear session storage
    sessionStorage.clear();
    this.loggedIn.next(false);
  }
}
