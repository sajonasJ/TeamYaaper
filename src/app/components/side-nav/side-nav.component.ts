import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {
  @Input() groups: Group[] = [];
  @Output() groupSelected = new EventEmitter<Group>();

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Group[] | null) => {
        if (groups) {
          this.groups = groups;  // Set the groups if available
        } else {
          // Handle the case where no groups are found, if needed
          this.groups = [];  // Optional: Clear the groups or handle differently
          console.warn('No groups found');
        }
      },
      (error) => console.error('Error loading groups', error)
    );
  }

  createGroup(): void {
    const groupName = prompt('Enter group name:');
    if (groupName) {
      const newGroup: Group = {
        id: this.generateUniqueId(),
        name: groupName,
        posts: []
      };
      this.groups.push(newGroup);
      // this.saveGroups();
    }
  }

  onGroupClick(group: Group): void {
    this.groupSelected.emit(group);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // private saveGroups(): void {
  //   this.groupService.saveGroups(this.groups).subscribe(
  //     () => console.log('Groups saved successfully'),
  //     (error) => console.error('Error saving groups', error)
  //   );
  // }
}