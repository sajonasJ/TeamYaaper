import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Group } from '../models/dataInterfaces';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly STORAGE_KEY = 'allGroups';

  constructor() {}

  // Fetch groups from session storage
  getGroups(): Observable<Group[] | null> {
    const groups = sessionStorage.getItem(this.STORAGE_KEY);
    if (groups) {
      return of(JSON.parse(groups) as Group[]);
    } else {
      return of(null); 
    }
  }
}