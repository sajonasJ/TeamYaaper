import { Component, Input, OnInit } from '@angular/core';
import { User, Group, Channel } from '../../models/dataInterfaces';
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
        this.loadUsers();
        this.loadCurrentUser();
      }
    });
  }

  // Add this method to load users
  loadUsers(): void {
    this.httpClient
      .post<User[]>(`${BACKEND_URL}/loggedOn`, {}, httpOptions)
      .subscribe(
        (data) => {
          this.users = data;
        },
        (error) => console.error('Error loading users:', error)
      );
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
        users: this.currentUser ? [this.currentUser] : [],
      };
      this.selectedGroup.channels.push(newChannel);
      // this.updateGroupsStorage();
      this.fetchGroups();
      this.updateGroupDB(this.selectedGroup);
      this.loadGroups();
      this.resetNewChannelForm();
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

  updateGroupDB(groupObj: Group): void {
    this.httpClient
      .post<any>(BACKEND_URL + '/groupRoute', groupObj, httpOptions)
      .subscribe(
        (response: any) => {
          alert(JSON.stringify(response));
          alert('Group updated successfully!');
          this.fetchGroups();
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
    this.loadUsers();
    const newUserUsername = this.userInputs['group-' + group.id];

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
      this.fetchGroups();
      this.toastr.success('User added successfully to group!', 'Success');
      this.loadGroups();
      this.userInputs['group-' + group.id] = '';
    } else {
      this.toastr.error('User already in group.', 'Error');
    }
  }

  addUserToChannel(channel: Channel): void {
    this.loadUsers();
    const newUserUsername = this.userInputs['channel-' + channel.id];
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

    if (!channel.users.includes(newUserUsername)) {
      channel.users.push(newUserUsername);
      this.updateGroupDB(this.selectedGroup!);
      this.fetchGroups();
      this.toastr.success('User added successfully to channel!', 'Success');
      this.loadGroups();
      this.userInputs['channel-' + channel.id] = '';
    } else {
      this.toastr.error('User already in channel.', 'Error');
    }
  }

  deleteUserFromChannel(channel: Channel | null): void {
    if (!channel) {
      this.toastr.error('No channel selected.', 'Error');
      return;
    }
    const username = this.userInputs['channel-' + channel.id];
    if (!username) {
      this.toastr.error('Please enter a username to delete.', 'Error');
      return;
    }

    if (!channel.users) {
      this.toastr.error('No users found in the channel.', 'Error');
      return;
    }

    const index = channel.users.indexOf(username);
    if (index !== -1) {
      channel.users.splice(index, 1);
      this.updateGroupDB(this.selectedGroup!);
      this.fetchGroups();
      this.toastr.success('User removed successfully from channel!', 'Success');
      this.loadGroups();
      this.userInputs['channel-' + channel.id] = '';
    } else {
      this.toastr.error('User not found in channel.', 'Error');
    }
  }

  deleteUserFromGroup(group: Group): void {
    const username = this.userInputs['group-' + group.id];

    if (!username) {
      this.toastr.error('Please enter a username to delete.', 'Error');
      return;
    }

    const index = group.users.indexOf(username);
    if (index !== -1) {
      group.users.splice(index, 1);
      this.updateGroupDB(group);
      this.fetchGroups();
      this.loadGroups();
      this.toastr.success('User removed successfully from group!', 'Success');
      this.userInputs['group-' + group.id] = '';
    } else {
      this.toastr.error('User not found in group.', 'Error');
    }
  }

  // Helper method to get the role of a user in a specific group
  getUserRoleInGroup(group: Group, username: string): string {
    if (group.admins.includes(username)) return 'admin';
    if (group.users.includes(username)) return 'user';
    return 'none';
  }

  // Planned feature: Report, Ban and Unban users
  reportUser(): void {
    this.toastr.success('User Reported!', 'Success');
  }
  banUser(): void {
    this.toastr.success('User Banned!', 'Success');
  }
  info(message: string): void {
    this.toastr.success(`Not Implemented ${message}!`, 'Success');
  }

  // New method to fetch updated groups from the backend
  fetchGroups() {
    this.httpClient
      .post(BACKEND_URL + '/groupRoute', {}, httpOptions)
      .subscribe(
        (groups: any) => {
          sessionStorage.setItem('allGroups', JSON.stringify(groups));
          this.loadGroups();
        },
        (error) => {
          console.error('Failed to fetch groups:', error);
        }
      );
  }

  deleteChannel(channel: Channel): void {
    if (this.selectedGroup) {
      const channelIndex = this.selectedGroup.channels.findIndex(
        (ch) => ch.id === channel.id
      );

      if (channelIndex !== -1) {
        this.selectedGroup.channels.splice(channelIndex, 1);
        this.updateGroupDB(this.selectedGroup);
        this.toastr.success('Channel deleted successfully!', 'Success');
        this.fetchGroups();
        this.loadGroups();
        this.selectedChannel = null;
      } else {
        this.toastr.error('Channel not found.', 'Error');
      }
    } else {
      this.toastr.error('No group selected.', 'Error');
    }
  }
  deleteGroup(group: Group): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete the group "${group.name}"?`
    );
    if (!confirmDelete) return;

    // Remove the group from the component's groups array
    this.groups = this.groups.filter((g) => g.id !== group.id);

    // Send delete request to backend
    this.httpClient
      .post(`${BACKEND_URL}/delGroupRoute`, { id: group.id }, httpOptions)
      .subscribe(
        (response: any) => {
          if (response.ok) {
            this.toastr.success('Group deleted successfully!', 'Success');
            this.fetchGroups();
            this.loadGroups();
          } else {
            this.toastr.error(
              'Failed to delete group. Please try again.',
              'Error'
            );
            this.loadGroups();
          }
        },
        (error) => {
          console.error('Error deleting group:', error);
          this.toastr.error(
            'Failed to delete group. Please retry again.',
            'Error'
          );
          this.loadGroups();
        }
      );
  }
}
