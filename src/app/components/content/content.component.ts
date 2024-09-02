import { Component, Input } from '@angular/core';
import { Modal } from 'bootstrap';
import { Group, Channel } from '../../models/dataInterfaces';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  @Input() selectedGroup: Group | null = null;
  selectedChannel: Channel | null = null;

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
}