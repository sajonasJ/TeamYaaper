import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../shared/utils.service';
import { Group, User } from '../../models/dataInterfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Input() selectedGroup: Group | undefined;
  @Output() close = new EventEmitter<void>();
  groupAdmins: User[] = [];
  groupMembers: User[] = [];
  allUsers: User[] = [];
  userInputs: { [key: string]: string } = {};

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private utilsService: UtilsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.selectedGroup) {
      this.loadGroupData();
      this.loadAllUsers();
    }
  }

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
        this.toastr.error('Failed to load group data. Please try again.', 'Error');
      }
    );
  }

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

  mapUserDetailsToGroup(): void {
    if (this.selectedGroup && this.allUsers.length > 0) {
      // Map admins
      this.groupAdmins = this.selectedGroup.admins
        .map((username) => this.allUsers.find(user => user.username === username))
        .filter((user): user is User => user !== undefined);

      // Map members excluding admins
      this.groupMembers = this.selectedGroup.users
        .filter(username => !this.selectedGroup?.admins.includes(username))
        .map((username) => this.allUsers.find(user => user.username === username))
        .filter((user): user is User => user !== undefined);
    }
  }

  addUserToGroup(): void {
    if (!this.selectedGroup || !this.selectedGroup._id) {
      this.toastr.error('No group selected.', 'Error');
      return;
    }

    const newUserUsername = this.userInputs['group-' + this.selectedGroup._id];
    if (!newUserUsername) {
      this.toastr.error('Please enter a username.', 'Error');
      return;
    }

    const userExists = this.allUsers.some(user => user.username === newUserUsername);
    if (!userExists) {
      this.toastr.error('User does not exist.', 'Error');
      return;
    }

    if (!this.selectedGroup.users.includes(newUserUsername)) {
      this.selectedGroup.users.push(newUserUsername);
      this.updateGroupDB(this.selectedGroup);
      this.userInputs['group-' + this.selectedGroup._id] = ''; // Clear input after adding user
    } else {
      this.toastr.error('User already in group.', 'Error');
    }
  }

  removeMember(member: User): void {
    if (!this.selectedGroup) return;

    // Remove user from members and admins if they are listed in both
    this.selectedGroup.users = this.selectedGroup.users.filter(username => username !== member.username);
    this.selectedGroup.admins = this.selectedGroup.admins.filter(username => username !== member.username);
    this.updateGroupDB(this.selectedGroup);
  }

  deleteGroup(): void {
    if (this.selectedGroup && this.selectedGroup._id) {
      const confirmDelete = confirm(`Are you sure you want to delete the group "${this.selectedGroup.name}"?`);
      if (confirmDelete) {
        this.groupService.deleteGroup(this.selectedGroup._id).subscribe(
          () => {
            this.toastr.success('Group deleted successfully.', 'Success');
            this.closeSettings();
          },
          (error) => {
            this.toastr.error('Failed to delete group. Please try again.', 'Error');
          }
        );
      }
    }
  }

  deleteChannel(channel: any): void {
    if (!this.selectedGroup) return;

    const confirmDelete = confirm(`Are you sure you want to delete the channel "${channel.name}"?`);
    if (!confirmDelete) return;

    this.selectedGroup.channels = this.selectedGroup.channels.filter((ch) => ch.name !== channel.name);
    this.updateGroupDB(this.selectedGroup);
  }

  updateGroupDB(group: Group): void {
    this.groupService.updateGroup(group).subscribe(
      () => {
        this.toastr.success('Group updated successfully.', 'Success');
        this.loadGroupData(); // Reload the group data to reflect the changes
      },
      (error) => {
        this.toastr.error('Failed to update group. Please try again.', 'Error');
      }
    );
  }

  closeSettings(): void {
    this.close.emit();
  }
}
