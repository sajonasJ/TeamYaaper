import { Component, Input, OnInit } from '@angular/core';
import {User, Group, Channel } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';
import { HttpClient } from '@angular/common/http';
import { httpOptions, BACKEND_URL } from '../../constants';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
  @Input() selectedGroup: Group | null = null;
  users: User[] = [];
  groups: Group[] = [];
  selectedChannel: Channel | null = null;

  newChannelName: string = '';
  newChannelDescription: string = '';
  userInputs: { [key: string]: string } = {};
  currentUser: string | null = null;

  constructor(
    private groupService: GroupService,
    private httpClient: HttpClient,
    private authservice: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authservice.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.loadGroups();
      }
    });
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Group[] | null) => {
        if (groups) {
          this.groups = groups;
        } else {
          this.groups = [];
        }
      },
      (error) => console.error('Error loading groups', error)
    );
  }

  selectChannel(channel: Channel): void {
    this.selectedChannel = channel;
  }

  // Method to add a new channel to the selected group
  addNewChannel(): void {
    if (
      this.newChannelName &&
      this.newChannelDescription &&
      this.selectedGroup
    ) {
      const newChannel: Channel = {
        id: this.generateUniqueId(),
        name: this.newChannelName,
        description: this.newChannelDescription,
        messages: [],
        users: this.currentUser ? [this.currentUser] : []
      };
      this.selectedGroup.channels.push(newChannel);
      this.updateGroupsStorage();
      this.updateGroupDB(this.selectedGroup);
      this.resetNewChannelForm();
      this.loadGroups();
    } else {
      alert('Please fill in both the channel name and description.');
    }
  }

  loadCurrentUser(): void {
    this.currentUser = sessionStorage.getItem('username');
  }

  resetNewChannelForm(): void {
    this.newChannelName = '';
    this.newChannelDescription = '';
  }
  updateGroupsStorage(): void {
    if (this.selectedGroup) {
      const groupId = this.selectedGroup.id.toString();
      const groupIndex = this.groups.findIndex(
        (group) => group.id.toString() === groupId
      );

      if (groupIndex !== -1) {
        this.groups[groupIndex].channels = [...this.selectedGroup.channels];
        sessionStorage.setItem('allGroups', JSON.stringify(this.groups));
      } else {
        console.error('Group not found in groups array:', this.selectedGroup);
      }
    } else {
      console.error('No group selected.');
    }
  }

  updateGroupDB(groupObj: Group): void {
    this.httpClient
      .post<any>(BACKEND_URL + '/groupRoute', groupObj, httpOptions)
      .subscribe(
        (response: any) => {
          alert(JSON.stringify(response));
          alert('Group updated successfully!');

          // Optional: Fetch updated groups from the backend to ensure synchronization
          this.loadGroups();
        },
        (error) => {
          console.error('Error updating group:', error);
          alert('Failed to update group. Please try again.');
        }
      );
  }

  generateUniqueId(): string {
    if (!this.selectedGroup) return '1';
    const maxId = this.selectedGroup.channels.reduce(
      (max, channel) => Math.max(max, +channel.id),
      0
    );
    return (maxId + 1).toString();
  }

  addUserToGroup(group: Group): void {
    const newUserUsername = this.userInputs[group.id];

    if (!newUserUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    const userExists = this.users.some(
      (user) => user.username === newUserUsername
    );

    if (!userExists) {
      this.toastr.error('User does not exist.', 'Error');
      return;
    }

    if (!group.users.includes(newUserUsername)) {
      group.users.push(newUserUsername);
      this.updateGroupDB(group);
      this.updateSessionStorage();
      this.toastr.success('User added successfully!', 'Success');
      this.userInputs[group.id] = '';
    } else {
      this.toastr.error('User already in group.', 'Error');
    }
  }

  addUserToChannel(channel: Channel): void {
    const newUserUsername = this.userInputs[channel.id];

    if (!newUserUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    const userExists = this.users.some((user) => user.username === newUserUsername);

    if (!userExists) {
      this.toastr.error('User does not exist.', 'Error');
      return;
    }

    if (!channel.users.includes(newUserUsername)) {
      channel.users.push(newUserUsername);
      this.updateGroupDB(this.selectedGroup!);
      this.updateSessionStorage();
      this.toastr.success('User added successfully!', 'Success');
      this.userInputs[channel.id] = ''; // Clear input after adding
    } else {
      this.toastr.error('User already in channel.', 'Error');
    }
  }

  deleteUserFromChannel(channel: Channel, username: string): void {
    const index = channel.users.indexOf(username);
    if (index !== -1) {
      channel.users.splice(index, 1);
      this.updateGroupDB(this.selectedGroup!);
      this.updateSessionStorage();
      this.loadGroups();
      this.toastr.success('User removed successfully!', 'Success');
    }
  }


   // Delete a user from a group
   deleteUserFromGroup(group: Group, username: string): void {
    const index = group.users.indexOf(username);
    if (index !== -1) {
      group.users.splice(index, 1);
      this.updateGroupDB(group);
      this.updateSessionStorage();
      this.loadGroups();
      this.toastr.success('User removed uccessfully!', 'Success');
    }
  }
  updateSessionStorage(): void {
    sessionStorage.setItem('allGroups', JSON.stringify(this.groups));
  }

   // Helper method to get the role of a user in a specific group
   getUserRoleInGroup(group: Group, username: string): string {
    if (group.admins.includes(username)) return 'admin';
    if (group.users.includes(username)) return 'user';
    return 'none';
  }

}
