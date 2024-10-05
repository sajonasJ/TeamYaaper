import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();

  constructor() {
    const isLoggedIn = !!sessionStorage.getItem('userlogin');
    this.loggedIn.next(isLoggedIn);
  }

  // Method to log in the user
  login() {
    sessionStorage.setItem('userlogin', 'true');
    this.loggedIn.next(true);
  }

  // Method to log out the user
  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
  }
}
