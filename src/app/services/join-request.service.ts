import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_URL, httpOptions } from '../constants';
import { JoinRequest } from '../models/dataInterfaces';

@Injectable({
  providedIn: 'root',
})
export class JoinRequestService {
  constructor(private http: HttpClient) {}

  // Get pending join requests for a specific group
  getJoinRequests(groupId: string): Observable<JoinRequest[]> {
    return this.http.get<JoinRequest[]>(`${BACKEND_URL}/groups/${groupId}/joinRequests`);
  }

  // Add a new join request
  addJoinRequest(groupId: string, userId: string): Observable<any> {
    return this.http.post(`${BACKEND_URL}/addJoinRequest`, { groupId, userId });
  }

// Update a join request (for approving or rejecting)
updateJoinRequest(requestId: string, status: 'approved' | 'rejected'): Observable<any> {
  return this.http.post(`${BACKEND_URL}/updateJoinRequest`, { requestId, status });
}


}
