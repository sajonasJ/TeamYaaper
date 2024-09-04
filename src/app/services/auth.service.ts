import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();

  constructor() {
    //check if the user is logged in
    const isLoggedIn = !!sessionStorage.getItem('userlogin') === true;
    this.loggedIn.next(isLoggedIn);
  }

  //
  login() {
    this.loggedIn.next(true);
  }

  //clear the session storage on logout
  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
  }
}
