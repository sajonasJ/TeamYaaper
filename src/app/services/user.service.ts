// C:\Users\jonas\Code\prog_repos\TeamYaaper\src\app\services\user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/dataInterfaces';
import { BACKEND_URL, httpOptions } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  // Fetch all users from the backend
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${BACKEND_URL}/allUsers`, httpOptions);
  }

  
  // Add a new user to the backend
  addUser(newUser: { username: string; password: string }): Observable<any> {
    return this.httpClient.post(`${BACKEND_URL}/addUser`, newUser, httpOptions);
  }

  // Promote a user to superuser
  makeSuperUser(username: string): Observable<any> {
    return this.httpClient.put(
      `${BACKEND_URL}/users/${username}/makeSuper`,
      {},
      httpOptions
    );
  }

  // Remove the superuser role from a user
  removeSuperUser(username: string): Observable<any> {
    return this.httpClient.put(
      `${BACKEND_URL}/users/${username}/removeSuper`,
      {},
      httpOptions
    );
  }

  // Delete a user by username
  deleteUser(username: string): Observable<any> {
    return this.httpClient.delete(
      `${BACKEND_URL}/users/${username}`,
      httpOptions
    );
  }
}
