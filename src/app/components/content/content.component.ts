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
  styleUrls: ['./content.component.css'], // Corrected property name and syntax
})
export class ContentComponent implements OnInit {
  @Input() selectedGroup: Group | null = null;
  users: User[] = [];
  groups: Group[] = [];
  selectedChannel: Channel | null = null;

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

  // Load groups and users on component initialization; reroutes to login if not logged in
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


  loadCurrentUser(): void {
    // Retrieve user information from session storage
    const username = sessionStorage.getItem('username');
    const firstname = sessionStorage.getItem('firstname');
    const lastname = sessionStorage.getItem('lastname');
    const email = sessionStorage.getItem('email');
    const roles = JSON.parse(sessionStorage.getItem('roles') || '[]'); // Parse stored JSON string to array
    const groupMemberships = JSON.parse(sessionStorage.getItem('groupMemberships') || '[]'); // Parse stored JSON string to array


    // Create currentUser object with the information from session storage
    const user: User = {
      id: '', // Optional, since MongoDB will generate this, if required.
      username: username as string,
      firstname: firstname as string,
      lastname: lastname as string,
      email: email as string,
      roles: roles,
      groups: groupMemberships,
    };

    // Assigning the currentUser from session storage data
    this.currentUser = user;
  }

  // Check if the current user is an admin in the selected group or a super user
  isAdmin(): boolean {
    if (!this.selectedGroup || !this.currentUser) return false; // Ensure both are defined
    return (
      this.currentUser.roles.includes('super') ||
      (this.selectedGroup.admins?.includes(this.currentUser.username) ?? false)
    );
  }


  // Check if the current user is a user in the selected group or a super user
  // Check if the current user is a user in the selected group or a super user
  isUser(): boolean {
    if (!this.selectedGroup || !this.currentUser) return false; // Ensure both are defined
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
    if (
      this.newChannelName &&
      this.newChannelDescription &&
      this.selectedGroup
    ) {
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

  // Update the group in the backend after modification
  updateGroupDB(groupObj: Group): void {
    this.groupService.updateGroup(groupObj).subscribe(
      () => {
        this.toastr.success('Group updated successfully', 'Success');
        // Reload groups to ensure local state is in sync with the server
        this.loadGroups();
      },
      (error) => {
        console.error('Error updating group:', error);
        this.toastr.error('Failed to update group. Please try again.', 'Error');
      }
    );
  }

  // Add a new user to the selected group
  addUserToGroup(group: Group): void {
    const newUserUsername = this.userInputs['group-' + group.id];
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
          this.userInputs['group-' + group.id] = '';
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
}

// // Request to join the selected group
// requestToJoinGroup(group: Group): void {
//   const userId = sessionStorage.getItem('username');
//   if (!userId || !group) {
//     this.toastr.error('You need to be logged in to request to join a group.', 'Error');
//     return;
//   }

//   this.httpClient.post(`${BACKEND_URL}/addJoinRequest`, { groupId: group.id, userId }, httpOptions).subscribe(
//     (response: any) => {
//       if (response.ok) {
//         this.toastr.success('Join request submitted successfully', 'Success');
//       } else {
//         this.toastr.error(response.message || 'Failed to submit join request', 'Error');
//       }
//     },
//     (error) => {
//       console.error('Error requesting to join group:', error);
//       this.toastr.error('Failed to submit join request. Please try again.', 'Error');
//     }
//   );
// }

//button
// <div *ngIf="selectedGroup && !isUser()">
//   <button class="btn btn-primary" (click)="requestToJoinGroup(selectedGroup)">Request to Join Group</button>
// </div>
// Get join requests for the group
// loadJoinRequests(groupId: string): void {
//   this.httpClient.get<JoinRequest[]>(`${BACKEND_URL}/getJoinRequests/${groupId}`, httpOptions).subscribe(
//     (requests) => {
//       this.joinRequests = requests; // Assign response to a joinRequests array
//     },
//     (error) => {
//       console.error('Error loading join requests:', error);
//       this.toastr.error('Failed to load join requests. Please try again.', 'Error');
//     }
//   );
// }

// // Approve or reject a join request
// handleJoinRequest(requestId: string, action: 'approved' | 'rejected'): void {
//   this.httpClient.post(`${BACKEND_URL}/updateJoinRequest`, { requestId, status: action }, httpOptions).subscribe(
//     (response: any) => {
//       if (response.ok) {
//         this.toastr.success(`Join request ${action} successfully`, 'Success');
//         this.loadJoinRequests(this.selectedGroup!.id); // Refresh requests
//       } else {
//         this.toastr.error(response.message || `Failed to ${action} join request`, 'Error');
//       }
//     },
//     (error) => {
//       console.error(`Error handling join request: ${action}`, error);
//       this.toastr.error(`Failed to ${action} join request. Please try again.`, 'Error');
//     }
//   );
// }
// <ul>
//   <li *ngFor="let request of joinRequests">
//     {{ request.username }} requested to join
//     <button (click)="handleJoinRequest(request.id, 'approved')">Approve</button>
//     <button (click)="handleJoinRequest(request.id, 'rejected')">Reject</button>
//   </li>
// </ul>
