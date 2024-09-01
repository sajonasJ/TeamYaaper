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

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.authService.isLoggedIn.subscribe(status => this.isLoggedIn = status);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
