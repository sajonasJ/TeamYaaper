import { Component, Input, OnInit } from '@angular/core';
import { User, Group, Channel } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';
import { HttpClient } from '@angular/common/http';
import { httpOptions, BACKEND_URL } from '../../constants';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {
  @Input() selectedGroup: Group | null = null;
  users: User[] = [];
  groups: Group[] = [];
  showSettings: boolean = false;

  selectedChannel: Channel | null = null;
  channelToDelete: Channel | null = null;

  newChannelName: string = '';
  newChannelDescription: string = '';
  userInputs: { [key: string]: string } = {};
  currentUser: User | null = null;

  constructor(
    private groupService: GroupService,
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.loadGroups();
        this.loadCurrentUser();
      }
    });
  }

 
      // Show delete confirmation modal
  // Show delete confirmation modal
  showDeleteConfirmationModal(): void {
    const modalElement = document.getElementById('confirmDeleteModal');
    if (modalElement) {
      const confirmDeleteModal = new bootstrap.Modal(modalElement);
      confirmDeleteModal.show();
    }
  }

 // Trigger delete confirmation for a channel
 confirmDeleteChannel(channel: Channel): void {
  this.channelToDelete = channel;
  this.showDeleteConfirmationModal();
}


  // Load all groups from the backend using GroupService
  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      },
      (error) => {
        console.error('Error loading groups:', error);
        this.toastr.error('Failed to load groups. Please try again.', 'Error');
      }
    );
  }


  // Load current user from session storage
  loadCurrentUser(): void {
    const username = sessionStorage.getItem('username');
    const firstname = sessionStorage.getItem('firstname');
    const lastname = sessionStorage.getItem('lastname');
    const email = sessionStorage.getItem('email');
    const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    const groupMemberships = JSON.parse(sessionStorage.getItem('groupMemberships') || '[]');

    const user: User = {
      _id: '',  // Optional, as MongoDB will generate this
      username: username as string,
      firstname: firstname as string,
      lastname: lastname as string,
      email: email as string,
      roles: roles,
      groups: groupMemberships,
    };

    this.currentUser = user;
  }

  // Check if the current user is an admin in the selected group or a super user
  isAdmin(): boolean {
    if (!this.selectedGroup || !this.currentUser) return false;
    return (
      this.currentUser.roles.includes('super') ||
      (this.selectedGroup.admins?.includes(this.currentUser.username) ?? false)
    );
  }

  // Check if the current user is a user in the selected group or a super user
  isUser(): boolean {
    if (!this.selectedGroup || !this.currentUser) return false;
    return (
      this.currentUser.roles.includes('super') ||
      (this.selectedGroup.users?.includes(this.currentUser.username) ?? false)
    );
  }

  // Sets the selected channel
  selectChannel(channel: Channel): void {
    this.selectedChannel = channel;
  }

  // Add a new channel to the selected group
  addNewChannel(): void {
    if (this.newChannelName && this.newChannelDescription && this.selectedGroup) {
      const newChannel: Channel = {
        name: this.newChannelName,
        description: this.newChannelDescription,
        messages: [],
        users: this.currentUser ? [this.currentUser.username] : [],
      };

      // Update local state and send the update to the backend
      this.selectedGroup.channels.push(newChannel);
      this.updateGroupDB(this.selectedGroup);

      this.resetNewChannelForm();
    } else {
      this.toastr.error(
        'Please fill in both the channel name and description.',
        'Error'
      );
    }
  }

   // Confirm delete action for a channel
   onConfirmDelete(): void {
    if (this.channelToDelete && this.selectedGroup) {
      this.deleteChannel(this.channelToDelete);
    }

    // Reset the delete state
    this.channelToDelete = null;
  }

  // Delete a channel from the selected group
  deleteChannel(channel: Channel): void {
    if (!this.selectedGroup) return;

    this.selectedGroup.channels = this.selectedGroup.channels.filter(
      (ch) => ch.name !== channel.name
    );

    // Update the group in the backend after channel removal
    this.updateGroupDB(this.selectedGroup);
  }

  // Delete a group
  deleteGroup(group: Group): void {
    const confirmDelete = confirm(`Are you sure you want to delete the group "${group.name}"?`);
    if (!confirmDelete) return;

    this.groupService.deleteGroup(group._id!).subscribe(
      () => {
        this.toastr.success('Group deleted successfully', 'Success');
        this.loadGroups(); // Reload groups to reflect the deletion
        if (this.selectedGroup && this.selectedGroup._id === group._id) {
          this.selectedGroup = null; // Reset selected group if it's deleted
        }
      },
      (error) => {
        console.error('Error deleting group:', error);
        this.toastr.error('Failed to delete group. Please try again.', 'Error');
      }
    );
  }

  // Update the group in the backend after modification
  updateGroupDB(groupObj: Group): void {
    this.groupService.updateGroup(groupObj).subscribe(
      () => {
        this.toastr.success('Group updated successfully', 'Success');
        this.loadGroups(); 
      },
      (error) => {
        this.toastr.error('Failed to update group. Please try again.', 'Error');
      }
    );
  }

  // Add a new user to the selected group
  addUserToGroup(group: Group): void {
    const newUserUsername = this.userInputs['group-' + group._id];
    if (!newUserUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    // Check if the user exists in the system (backend check)
    this.httpClient.get<User[]>(`${BACKEND_URL}/users`, httpOptions).subscribe(
      (users) => {
        const userExists = users.some(
          (user) => user.username === newUserUsername
        );

        if (!userExists) {
          this.toastr.error('User does not exist.', 'Error');
          return;
        }

        if (!group.users.includes(newUserUsername)) {
          group.users.push(newUserUsername);
          this.updateGroupDB(group);
          this.userInputs['group-' + group._id] = '';
        } else {
          this.toastr.error('User already in group.', 'Error');
        }
      },
      (error) => {
        console.error('Error loading users:', error);
        this.toastr.error('Failed to load users. Please try again.', 'Error');
      }
    );
  }

  // Reset the new channel form inputs
  resetNewChannelForm(): void {
    this.newChannelName = '';
    this.newChannelDescription = '';
  }

  toSettings(): void {
    if (this.selectedGroup) {
      this.showSettings = true;
    }
  }

  closeSettings(): void {
    this.showSettings = false;
  }
}
