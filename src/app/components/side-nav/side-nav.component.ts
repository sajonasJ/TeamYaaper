import { Component } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  groups: { name: string }[] = [
    { name: 'Group 1' },
    { name: 'Group 2' },
    { name: 'Group 3' }
  ];
  createGroup() {
    const groupName = prompt('Enter group name:');
    if (groupName) {
      this.groups.push({ name: groupName });
    }
  }

  onGroupClick(group: { name: string }) {
    console.log('Group clicked:', group.name);
    // Perform any action here, like navigating to a group-specific page
  }
}
