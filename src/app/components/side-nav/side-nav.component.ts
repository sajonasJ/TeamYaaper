import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  groups: Group[] = [];

  // Output event to notify the parent component of the selected group
  @Output() groupSelected = new EventEmitter<Group>();

  constructor(
    private groupService: GroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  // Load groups from the backend
  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      },
      (error) => {
        console.error('Error loading groups', error);
        this.toastr.error('Failed to load groups. Please try again.', 'Error');
      }
    );
  }

  // Emit selected group when a group is clicked
  onGroupClick(group: Group): void {
    this.groupSelected.emit(group);
  }
}
