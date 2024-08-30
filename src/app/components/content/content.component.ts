import { Component, Input } from '@angular/core';
import { Group } from '../../models/dataInterfaces';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  @Input() selectedGroup: Group | null = null; // Input to receive the selected group
}