import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/dataInterfaces';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly GROUP_API_URL = '/api/groups'; // URL for API endpoint
  constructor(private http: HttpClient) {}

  // Method to fetch groups from groupDB.json
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.GROUP_API_URL);
  }

  // Method to save groups to the server
  saveGroups(groups: Group[]): Observable<any> {
    return this.http.post<any>(this.GROUP_API_URL, { groups });
  }
}