import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/dataInterfaces';
import { BACKEND_URL, httpOptions } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private httpClient: HttpClient) {}

  // Fetch all groups from the backend
  getGroups(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(
      `${BACKEND_URL}/allGroups`,
      httpOptions
    );
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

  // Update an existing group by its MongoDB _id
  updateGroup(group: Group): Observable<any> {
    // Create a shallow copy without the _id field
    const { _id, ...groupWithoutId } = group;
    return this.httpClient.put(
      `${BACKEND_URL}/allGroups/${_id}`,
      groupWithoutId,
      httpOptions
    );
  }

  // Add an admin to a group
  addAdminToGroup(groupId: string, adminUsername: string): Observable<any> {
    return this.httpClient.put(
      `${BACKEND_URL}/groups/${groupId}/admin`,
      { username: adminUsername },
      httpOptions
    );
  }

  // Remove an admin from a group
  removeAdminFromGroup(
    groupId: string,
    adminUsername: string
  ): Observable<any> {
    return this.httpClient.delete(`${BACKEND_URL}/groups/${groupId}/admin`, {
      headers: httpOptions.headers,
      body: { username: adminUsername },
    });
  }

  // Delete a group by its MongoDB _id
  deleteGroup(groupId: string): Observable<any> {
    return this.httpClient.delete(
      `${BACKEND_URL}/groups/${groupId}`,
      httpOptions
    );
  }
}
