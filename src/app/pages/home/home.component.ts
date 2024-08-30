import { Component } from '@angular/core';
import { Group } from '../../models/dataInterfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  groups: Group[] = [
    // Example data
    { id: '1', name: 'Group 1', posts: [] },
    { id: '2', name: 'Group 2', posts: [] },
    { id: '3', name: 'Group 3', posts: [] }
  ];

  selectedGroup: Group | null = null;

  onGroupSelected(group: Group): void {
    this.selectedGroup = group; // Update the selected group
  }
}