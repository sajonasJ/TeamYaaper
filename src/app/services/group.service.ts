import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/dataInterfaces';
import { BACKEND_URL } from '../constants';
import { httpOptions } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private httpClient: HttpClient) {}

  // Fetch all groups from the backend
  getGroups(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(`${BACKEND_URL}/groups`, httpOptions);
  }

  // Fetch a specific group by its ID from the backend
  getGroupById(groupId: string): Observable<Group> {
    return this.httpClient.get<Group>(`${BACKEND_URL}/groups/${groupId}`, httpOptions);
  }
}
