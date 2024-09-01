import { Component } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}  

  ngOnInit() {
    if (!sessionStorage.getItem('userlogin') || sessionStorage.getItem('userlogin') !== 'true') {
      this.router.navigate(['/login']);
    }
  }

  onGroupSelected(group: Group): void {
    this.selectedGroup = group; // Update the selected group
  }
}