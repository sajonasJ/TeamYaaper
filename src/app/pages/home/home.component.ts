import { Component } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  selectedGroup: Group | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!sessionStorage.getItem('userlogin') || sessionStorage.getItem('userlogin') !== 'true') {
      this.router.navigate(['/login']);
    }
  }

  onGroupSelected(group: Group): void {
    this.selectedGroup = group;
    console.log('Group selected:', this.selectedGroup);
  }
}