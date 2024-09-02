import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  roles: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.loadUserRoles();
      }
    });
  }
  loadUserRoles() {
    const rolesFromStorage = sessionStorage.getItem('roles');
    this.roles = rolesFromStorage ? JSON.parse(rolesFromStorage) : [];
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
