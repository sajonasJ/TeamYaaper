import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/dataInterfaces';
import { BACKEND_URL } from '../constants';
import { httpOptions } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private httpClient: HttpClient) {}

  // Fetch all groups from the backend
  getGroups(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(`${BACKEND_URL}/allGroups`, httpOptions);
  }

  // Fetch a specific group by its ID from the backend
  getGroupById(groupId: string): Observable<Group> {
    return this.httpClient.get<Group>(
      `${BACKEND_URL}/groups/${groupId}`,
      httpOptions
    );
  }

  // Add a new group
  addGroup(group: Group): Observable<any> {
    return this.httpClient.post(`${BACKEND_URL}/allGroups`, group, httpOptions);
  }

  // Add this to your GroupService
  updateGroup(group: Group): Observable<any> {
    return this.httpClient.put(
      `${BACKEND_URL}/allGroups/${group.id}`,
      group,
      httpOptions
    );
  }
}
