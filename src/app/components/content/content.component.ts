import { Component, Input, OnInit } from '@angular/core';
import { Group, Channel } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
  @Input() selectedGroup: Group | null = null;
  groups: Group[] = []
  selectedChannel: Channel | null = null;

  newChannelName: string = '';
  newChannelDescription: string = '';

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Group[] | null) => {
        if (groups) {
          this.groups = groups;
          console.log('Loaded groups from GroupService:', this.groups);
        } else {
          this.groups = [];
          console.error('No groups found in session storage');
        }
      },
      (error) => console.error('Error loading groups', error)
    );
  }

  ngOnChanges(): void {
    console.log('Selected Group:', this.selectedGroup);
    if (this.selectedGroup) {
      console.log('Channels:', this.selectedGroup.channels);
    }
  }

  selectChannel(channel: Channel): void {
    this.selectedChannel = channel;
    console.log('Selected Channel:', this.selectedChannel);
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
      };
      this.selectedGroup.channels.push(newChannel);
      this.updateGroupsStorage()
      this.resetNewChannelForm();
    } else {
      alert('Please fill in both the channel name and description.');
    }
  }

  resetNewChannelForm(): void {
    this.newChannelName = '';
    this.newChannelDescription = '';
  }
  updateGroupsStorage(): void {
    if (this.selectedGroup) {
      const groupId = this.selectedGroup.id.toString();
      console.log('Selected Group ID:', groupId, 'Type:', typeof groupId);

      const groupIndex = this.groups.findIndex(group => group.id.toString() === groupId);

      if (groupIndex !== -1) {
        this.groups[groupIndex].channels = [...this.selectedGroup.channels];
        console.log('Updating group:', this.groups[groupIndex]);
        console.log('Updated groups array:', this.groups);
        sessionStorage.setItem('allGroups', JSON.stringify(this.groups));
      } else {
        console.error('Group not found in groups array:', this.selectedGroup);
      }
    } else {
      console.error('No group selected.');
    }
  }


  generateUniqueId(): string {
    if (!this.selectedGroup) return '1';
    const maxId = this.selectedGroup.channels.reduce(
      (max, channel) => Math.max(max, +channel.id),
      0
    );
    return (maxId + 1).toString();
  }
}
