import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false; // Set this dynamically based on actual authentication state

  constructor() {
    // Check login state from authentication service or local storage
    // this.isLoggedIn = authService.isLoggedIn();
  }

  logout() {
    // Perform logout operation
    // authService.logout();
    this.isLoggedIn = false; // Update the state
  }
}
