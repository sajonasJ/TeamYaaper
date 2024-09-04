import { Component } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedGroup: Group | null = null;

  constructor(private router: Router, private authservice: AuthService) {}

  //check if user is logged in otherwise return to login page
  ngOnInit() {
    this.authservice.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }

  //set the selected group
  onGroupSelected(group: Group): void {
    this.selectedGroup = group;
  }
}
