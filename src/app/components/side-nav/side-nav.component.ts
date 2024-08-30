import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Group} from '../../models/dataInterfaces';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  @Input() groups: Group[] = [];
  @Output() groupSelected = new EventEmitter<Group>();

  createGroup() {
    const groupName = prompt('Enter group name:');
    if (groupName) {
      const newGroup: Group = {
        id: this.generateUniqueId(), // Generate a unique ID
        name: groupName,
        posts: [] // Initialize with an empty posts array
      };
      this.groups.push(newGroup);
    }
  }

  onGroupClick(group: Group): void {
    this.groupSelected.emit(group); // Emit the selected group
  }

  // Utility function to generate a unique ID for a new group
  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9); // Simple example for generating a unique ID
  }
}
