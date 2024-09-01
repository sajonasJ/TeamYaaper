// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn = this.loggedIn.asObservable();

  constructor() {
    const isLoggedIn = !!sessionStorage.getItem('userid');
    this.loggedIn.next(isLoggedIn);
  }

  login() {
    this.loggedIn.next(true);
  }

  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
  }
}
