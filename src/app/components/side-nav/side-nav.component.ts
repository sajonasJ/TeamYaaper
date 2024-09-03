import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';
import { HttpClient } from '@angular/common/http';
import { httpOptions, BACKEND_URL } from '../../constants';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  @Input() groups: Group[] = [];
  @Output() groupSelected = new EventEmitter<Group>();
  @Output() groupAdded = new EventEmitter<Group>();

  newGroupName: string = '';
  newGroupDescription: string = '';
  maxUserId: number = 0;
  currentUser: string | null = null;

  constructor(
    private groupService: GroupService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = sessionStorage.getItem('name');
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Group[] | null) => {
        if (groups) {
          this.groups = groups;
        } else {
          this.groups = [];
        }
      },
      (error) => console.error('Error loading groups', error)
    );
  }
  

  onGroupClick(group: Group): void {
    this.groupSelected.emit(group);
    console.log('Group emitted:', group);
  }

  addNewGroup(): void {
    if (this.newGroupName && this.newGroupDescription) {
      const newGroup: Group = {
        id: this.generateUniqueId(),
        name: this.newGroupName,
        description: this.newGroupDescription,
        channels: [],
        admins: this.currentUser ? [this.currentUser] : [],
        users: [],
      };
      this.updateGroupDB(newGroup);
    } else {
      alert('Please fill in both the group name and description.');
    }
  }

  resetNewGroupForm(): void {
    this.newGroupName = '';
    this.newGroupDescription = '';
  }

  generateUniqueId(): string {
    const maxId = this.groups.reduce(
      (max, group) => Math.max(max, +group.id),
      0
    );
    return (maxId + 1).toString();
  }

  updateGroupsStorage(): void {
    sessionStorage.setItem('allGroups', JSON.stringify(this.groups));
  }

  updateGroupDB(groupObj: Group): void {
    console.log('Sending to Backend:', groupObj)
    this.httpClient
      .post<any>(BACKEND_URL + '/groupRoute', groupObj, httpOptions)
      .subscribe(
        (response: any) => {
          alert(JSON.stringify(response));
          alert('Group added successfully!');

          // Update local group list and session storage after successful addition
          this.groups.push(groupObj);
          this.groupAdded.emit(groupObj);
          this.updateGroupsStorage();
          this.resetNewGroupForm();
        },
        (error) => {
          console.error('Error adding group:', error);
          alert('Failed to add group. Please try again.');
        }
      );
  }
}