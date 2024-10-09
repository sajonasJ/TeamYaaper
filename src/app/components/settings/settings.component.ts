import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../shared/utils.service';
import { Group, User } from '../../models/dataInterfaces';
import { JoinRequestService } from '../../services/join-request.service';
import { JoinRequest } from '../../models/dataInterfaces';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnChanges {
  @Input() selectedGroup: Group | undefined;
  @Output() close = new EventEmitter<void>();
  groupAdmins: User[] = [];
  groupMembers: User[] = [];
  allUsers: User[] = [];
  userInputs: { [key: string]: string } = {};
  joinRequests: JoinRequest[] = [];

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private utilsService: UtilsService,
    private toastr: ToastrService,
    private joinRequestService: JoinRequestService
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
    console.log('Selected group on init:', this.selectedGroup);
  }

  // Use ngOnChanges to react to input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedGroup'] && changes['selectedGroup'].currentValue) {
      this.loadGroupData();
      this.loadJoinRequests();
      this.loadAllUsers();
    }
  }

  // Load group data from the backend
  loadGroupData(): void {
    if (!this.selectedGroup || !this.selectedGroup._id) {
      this.toastr.error('Group data is missing', 'Error');
      return;
    }

    this.groupService.getGroupById(this.selectedGroup._id).subscribe(
      (group) => {
        this.selectedGroup = group;
        this.mapUserDetailsToGroup();
      },
      (error) => {
        this.toastr.error(
          'Failed to load group data. Please try again.',
          'Error'
        );
      }
    );
  }

  // Load join requests for the selected group
  loadJoinRequests(): void {
    if (this.selectedGroup && this.selectedGroup._id) {
      this.joinRequestService.getJoinRequests(this.selectedGroup._id).subscribe(
        (requests) => {
          console.log('Join requests response:', requests);
  
          // The response is already an array, so we can assign it directly
          this.joinRequests = requests.map((request) => ({
            ...request,
            username: request.userDetails?.username || 'Unknown',
            firstname: request.userDetails?.firstname || '',
            lastname: request.userDetails?.lastname || '',
          }));
  
          console.log('Processed join requests:', this.joinRequests);
        },
        (error) => {
          console.error('Error loading join requests:', error);
          this.toastr.error(
            'Failed to load join requests. Please try again.',
            'Error'
          );
        }
      );
    }
  }
  

  // Approve a join request and add the user to the group by username
  approveJoinRequest(request: JoinRequest): void {
    if (!this.selectedGroup) {
      console.log('No selected group found, exiting approveJoinRequest.');
      return;
    }

    // Make sure userDetails exists on the request object
    const username = request.userDetails?.username;
    if (!request._id) {
      this.toastr.error('Username is missing for the join request.', 'Error');
      return;
    }
    console.log('Approving join request for:', username);

    if (request.username) {
      this.updateJoinRequest(request._id, 'approved');
    } else {
      console.error('Request ID is undefined, cannot approve the request.');
      this.toastr.error('Failed to approve request. Invalid request ID.', 'Error');
    }
}


  // Reject a join request
  rejectJoinRequest(request: JoinRequest): void {
    console.log('Rejecting join request for:', request);

    if (request._id) {
      this.updateJoinRequest(request._id, 'rejected');
    } else {
      console.error('Request ID is undefined, cannot reject the request.');
      this.toastr.error(
        'Failed to reject request. Invalid request ID.',
        'Error'
      );
    }
  }

  // Update a join request's status (approved or rejected)
  updateJoinRequest(requestId: string, status: 'approved' | 'rejected'): void {
    console.log('Sending update for join request:', { requestId, status });

    this.joinRequestService.updateJoinRequest(requestId, status).subscribe(
      () => {
        console.log('Join request updated successfully:', {
          requestId,
          status,
        });
        this.toastr.success('Request updated successfully.', 'Success');
        this.loadJoinRequests();
      },
      (error) => {
        console.error(
          'Failed to update join request:',
          { requestId, status },
          'Error:',
          error
        );
        this.toastr.error(
          'Failed to update request. Please try again.',
          'Error'
        );
      }
    );
  }

  // Load all users from the backend
  loadAllUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.allUsers = users;
        this.mapUserDetailsToGroup();
      },
      (error) => {
        this.toastr.error('Failed to load users. Please try again.', 'Error');
      }
    );
  }

  // Map user details to the group's admins and members
  mapUserDetailsToGroup(): void {
    if (this.selectedGroup && this.allUsers.length > 0) {
      console.log('Mapping users for selected group:', this.selectedGroup);
      console.log('All Users:', this.allUsers);

      // Map admins by username
      this.groupAdmins = this.selectedGroup.admins
        .map((username) =>
          this.allUsers.find((user) => user.username === username)
        )
        .filter((user): user is User => user !== undefined);
      console.log('Mapped Admins:', this.groupAdmins);

      // Map members (excluding admins) by username
      this.groupMembers = this.selectedGroup.users
        .filter((username) => !this.selectedGroup?.admins.includes(username))
        .map((username) =>
          this.allUsers.find((user) => user.username === username)
        )
        .filter((user): user is User => user !== undefined);
      console.log('Mapped Members:', this.groupMembers);
    }
  }

 // Remove a user from the group by username
 removeMember(member: User): void {
  if (!this.selectedGroup || !member.username) {
    this.toastr.error('Unable to remove member. Username is missing.', 'Error');
    return;
  }

  const memberUsername: string = member.username;
  this.selectedGroup.users = this.utilsService.removeUserFromList(this.selectedGroup.users, memberUsername);
  this.selectedGroup.admins = this.utilsService.removeUserFromList(this.selectedGroup.admins, memberUsername);
  this.updateGroupDB(this.selectedGroup);
}

// deleteGroup
  deleteGroup(): void {
    if (this.selectedGroup && this.selectedGroup._id) {
      const confirmDelete = confirm(
        `Are you sure you want to delete the group "${this.selectedGroup.name}"?`
      );
      if (confirmDelete) {
        this.groupService.deleteGroup(this.selectedGroup._id).subscribe(
          () => {
            this.toastr.success('Group deleted successfully.', 'Success');
            this.closeSettings();
          },
          (error) => {
            this.toastr.error(
              'Failed to delete group. Please try again.',
              'Error'
            );
          }
        );
      }
    }
  }

  //deleteChannel
  deleteChannel(channel: any): void {
    if (!this.selectedGroup) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete the channel "${channel.name}"?`
    );
    if (!confirmDelete) return;

    this.selectedGroup.channels = this.selectedGroup.channels.filter(
      (ch) => ch.name !== channel.name
    );
    this.updateGroupDB(this.selectedGroup);
  }

  //updateGroup database
  updateGroupDB(group: Group): void {
    this.groupService.updateGroup(group).subscribe(
      () => {
        this.toastr.success('Group updated successfully.', 'Success');
        this.loadGroupData();
      },
      (error) => {
        this.toastr.error('Failed to update group. Please try again.', 'Error');
      }
    );
  }

  //closeSettings component
  closeSettings(): void {
    this.close.emit();
  }
}
