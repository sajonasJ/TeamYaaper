import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedGroup: Group | null = null;
  private authSubscription: Subscription = new Subscription();
  private groupSubscription: Subscription | null = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService
  ) {}

 
  ngOnInit() {
    this.authSubscription = this.authService.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }

  // Unsubscribe from all subscriptions to prevent memory leaks
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    if (this.groupSubscription) {
      this.groupSubscription.unsubscribe();
    }
  }

  // Method to fetch a specific group by its ID
  fetchGroupById(groupId: string) {
    if (this.groupSubscription) {
      this.groupSubscription.unsubscribe();
    }
    this.groupSubscription = this.groupService.getGroupById(groupId).subscribe(
      (group: Group) => {
        this.selectedGroup = group;
      },
      (error) => {
        console.error('Error fetching group by ID:', error);
      }
    );
  }

  // Set the selected group (can be used on group click)
  onGroupSelected(group: Group): void {
    this.selectedGroup = group;
  }
}
