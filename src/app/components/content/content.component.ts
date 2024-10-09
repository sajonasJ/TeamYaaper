import { Component, Input, OnInit } from '@angular/core';
import { User, Group, Channel, Message } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';
import { HttpClient } from '@angular/common/http';
import { httpOptions, BACKEND_URL } from '../../constants';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JoinRequestService } from '../../services/join-request.service';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {
  @Input() selectedGroup: Group | null = null;
  users: User[] = [];
  userMap: { [key: string]: User } = {};
  groups: Group[] = [];
  showSettings: boolean = false;

  selectedChannel: Channel | null = null;
  channelToDelete: Channel | null = null;

  newChannelName: string = '';
  newChannelDescription: string = '';
  userInputs: { [key: string]: string } = {};
  currentUser: User | null = null;

  newMessage: string = '';
  messages: Message[] = [];
  ioConnection: any;

  constructor(
    private groupService: GroupService,
    private socketService: SocketService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private joinRequestService: JoinRequestService,
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.loadGroups();
        this.loadCurrentUser();
        this.initIoConnection();
        this.loadUsers();
      }
    });
  }

  // Load chat history for a group and channel
  loadChatHistory(groupId: string, channelName: string): void {
    this.httpClient
      .get<Message[]>(`${BACKEND_URL}/showChat/${groupId}/${channelName}`)
      .subscribe(
        (messages) => {
          this.messages = messages;
          console.log('Loaded chat history:', this.messages);
        },
        (error) => {
          console.error('Error loading chat history:', error);
        }
      );
  }

  // Load all users from the backend using UserService
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;

        // Create a userMap with defined _id or id
        this.userMap = data.reduce((map, user) => {
          const userId = user._id || user.id;
          if (userId) {
            map[userId] = user;
          }
          return map;
        }, {} as { [key: string]: User });

        console.log('Loaded users:', this.users);
        console.log('User map:', this.userMap);
      },
      (error) => {
        this.toastr.error('Failed to load users. Please try again.', 'Error');
      }
    );
  }

  // Updated selectChannel method to use channel name
  selectChannel(channel: Channel): void {
    console.log('Selected channel:', channel);
    this.selectedChannel = channel; // Set the selected channel

    // Load messages for the selected channel by its name
    if (this.selectedGroup && channel.name) {
      this.loadChatHistory(this.selectedGroup._id!, channel.name);
    } else {
      console.error('No valid channel name or group ID found.');
    }
  }

  // Updated ngOnChanges method to load groups and current user
  ngOnChanges(): void {
    if (this.selectedGroup) {
      this.loadGroups();
      this.loadCurrentUser();
      this.closeSettings();
    }
  }

  // Initialize the socket connection
  private initIoConnection() {
    this.socketService.initSocket();

    this.ioConnection = this.socketService
      .onMessage()
      .subscribe((message: Message) => {
        console.log('Message received:', message);

        if (this.selectedChannel) {
          console.log('Pushing to selectedChannel.messages:', message);
          this.selectedChannel.messages.push(message);
          this.loadChatHistory(
            this.selectedGroup!._id!,
            this.selectedChannel.name
          );
        } else {
          console.log('Pushing to messages array:', message);
          this.messages.push(message);
        }

        // Check the current state of the messages array
        console.log('Updated messages array:', this.messages);
      });
  }

  // Function to send a message in the public chat
  public chat(event: Event) {
    event.preventDefault();

    if (
      !this.currentUser ||
      !this.newMessage ||
      !this.selectedGroup ||
      !this.selectedChannel
    ) {
      return; // Ensure all necessary data is available
    }

    // Create the Message object
    const message: any = {
      groupId: this.selectedGroup._id,
      channelName: this.selectedChannel.name,
      name: this.currentUser.username,
      userId: this.currentUser._id,
      text: this.newMessage,
      timestamp: new Date(),
    };

    console.log('Sending message:', message);
    this.socketService.send(message);
    this.newMessage = '';
  }

  // Function to show the delete confirmation modal
  showDeleteConfirmationModal(): void {
    const modalElement = document.getElementById('confirmDeleteModal');
    if (modalElement) {
      const confirmDeleteModal = new bootstrap.Modal(modalElement);
      confirmDeleteModal.show();
    }
  }

  // Function to send a join request
  requestToJoin(): void {
    if (
      !this.selectedGroup ||
      !this.currentUser ||
      !this.currentUser.username
    ) {
      this.toastr.error(
        'You need to select a group and be logged in to send a join request.',
        'Error'
      );
      return;
    }

    const groupId = this.selectedGroup._id;

    // Ensure `groupId` is defined before making the API call
    if (!groupId) {
      this.toastr.error(
        'Invalid group ID. Please select a valid group.',
        'Error'
      );
      return;
    }

    // Send the `username` instead of `userId`
    this.joinRequestService
      .addJoinRequest(groupId, this.currentUser.username)
      .subscribe(
        (response) => {
          if (response.ok) {
            this.toastr.success('Join request sent successfully!', 'Success');
          } else {
            this.toastr.error(
              response.message || 'Failed to send join request.',
              'Error'
            );
          }
        },
        (error) => {
          if (error.status === 400 && error.error?.message) {
            this.toastr.error(error.error.message, 'Error');
          } else {
            this.toastr.error(
              'An error occurred while sending the join request.',
              'Error'
            );
          }
        }
      );
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
    const id = sessionStorage.getItem('id');
    const username = sessionStorage.getItem('username');
    const firstname = sessionStorage.getItem('firstname');
    const lastname = sessionStorage.getItem('lastname');
    const email = sessionStorage.getItem('email');
    const profilePictureUrl = sessionStorage.getItem('profilePicture');
    const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    const groupMemberships = JSON.parse(
      sessionStorage.getItem('groupMemberships') || '[]'
    );

    // Populate the currentUser object
    this.currentUser = {
      id: id || '',
      _id: id || '',
      username: username || '',
      firstname: firstname || '',
      lastname: lastname || '',
      email: email || '',
      roles: roles,
      profilePictureUrl: profilePictureUrl || '',
      groups: groupMemberships,
    };
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
    const confirmDelete = confirm(
      `Are you sure you want to delete the group "${group.name}"?`
    );
    if (!confirmDelete) return;

    this.groupService.deleteGroup(group._id!).subscribe(
      () => {
        this.toastr.success('Group deleted successfully', 'Success');
        this.loadGroups();
        if (this.selectedGroup && this.selectedGroup._id === group._id) {
          this.selectedGroup = null;
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

  // Reset the new channel form inputs
  resetNewChannelForm(): void {
    this.newChannelName = '';
    this.newChannelDescription = '';
  }

  // Open the settings component
  toSettings(): void {
    if (this.selectedGroup) {
      this.showSettings = true;
    }
  }

  //close the settings component
  closeSettings(): void {
    this.showSettings = false;
  }
}
