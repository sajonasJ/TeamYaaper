import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {
  @Input() groups: Group[] = [];
  @Output() groupSelected = new EventEmitter<Group>();

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
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

  onGroupClick(group: Group): void {
    this.groupSelected.emit(group);
    console.log('Group emitted:', group);  // Add log to verify group emitted

  }


}