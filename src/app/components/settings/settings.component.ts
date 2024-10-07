import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { Group, User } from '../../models/dataInterfaces';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @Input() selectedGroup: Group | undefined;
  @Output() close = new EventEmitter<void>();
  groupMembers: User[] = [];
  groupId: string = '';
  isAdmin: boolean = false;
  userInputs: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute, 
    private groupService: GroupService,
    private userService: UserService // Inject UserService to fetch user details
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('groupId') || '';
      if (this.groupId) {
        this.loadGroupData();
      }
    });
  }

  loadGroupData(): void {
    this.groupService.getGroupById(this.groupId).subscribe((data) => {
      this.selectedGroup = data;
      this.loadGroupMembers(data.users);
      this.isAdmin = this.checkIfAdmin();
    });
  }

  loadGroupMembers(userIds: string[]): void {
    // Clear existing members
    this.groupMembers = [];

    // Iterate over each userId and get their details
    userIds.forEach((userId) => {
      this.userService.getUserById(userId).subscribe((user) => {
        this.groupMembers.push(user);
      });
    });
  }

  checkIfAdmin(): boolean {
    const currentUserId = 'currentLoggedInUserId'; // Replace with actual logic to get the logged-in user's ID
    return this.selectedGroup?.admins.includes(currentUserId) || false;
  }

  addUserToGroup(): void {
    const username = this.userInputs['group-' + (this.selectedGroup?._id ?? '')];
    if (username) {
      console.log('Adding user to group:', username);
      // Add the logic to call service to add a user to the group
    }
  }

  deleteGroup(): void {
    if (this.selectedGroup) {
      console.log('Deleting group:', this.selectedGroup);
      // Add the logic to call service to delete the group
    }
  }

  removeMember(member: User): void {
    console.log('Removing member:', member);
    // Add the logic to call service to remove a member from the group
  }

  deleteChannel(channel: any): void {
    console.log('Deleting channel:', channel);
    // Add the logic to call service to delete a channel from the group
  }

  closeSettings(): void {
    this.close.emit(); // Emit an event to close settings view
  }
}
