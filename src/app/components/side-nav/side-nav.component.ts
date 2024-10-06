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
  newGroupName: string = ''; // Property to bind the group name input
  newGroupDescription: string = ''; // Property to bind the group description input

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

  // Add a new group by calling the GroupService
  addGroup(): void {
    if (!this.newGroupName || !this.newGroupDescription) {
      this.toastr.error('Group name and description are required', 'Error');
      return;
    }

    const newGroup: Group = {
      name: this.newGroupName,
      description: this.newGroupDescription,
      admins: [], // Add current user/admins as needed
      users: [],
      channels: [],
    };

    this.groupService.addGroup(newGroup).subscribe(
      (response: any) => {
        if (response && response._id) {
          this.groups.push(response);
          this.toastr.success('Group added successfully', 'Success');
          this.newGroupName = ''; // Clear the input fields
          this.newGroupDescription = '';
        } else {
          this.toastr.error(response.message || 'Failed to add group', 'Error');
        }
      },
      (error) => {
        console.error('Error adding group:', error);
        this.toastr.error('An error occurred while adding the group.', 'Error');
      }
    );
  }
}
