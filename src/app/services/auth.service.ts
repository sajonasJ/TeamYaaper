import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn = this.loggedIn.asObservable();

  constructor() {
    const isLoggedIn = !!sessionStorage.getItem('userlogin')===true;
    this.loggedIn.next(isLoggedIn);
    console.log('Is logged in:', isLoggedIn);
  }

  login() {
    this.loggedIn.next(true);
    console.log('Is logged in:', this.isLoggedIn);
  }

  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
  }
}
