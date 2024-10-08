import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Group } from '../../models/dataInterfaces';
import { GroupService } from '../../services/group.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../../shared/utils.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  groups: Group[] = [];
  newGroupName: string = '';
  newGroupDescription: string = '';
  currentUser: string | null = null;

  @Output() groupSelected = new EventEmitter<Group>();

  constructor(
    private groupService: GroupService,
    private toastr: ToastrService,
    private utilsService: UtilsService 
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.currentUser = this.utilsService.loadCurrentUser();
  }

  // Load groups from the backend
  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      },
      (error) => {
        this.toastr.error('Failed to load groups. Please try again.', 'Error');
      }
    );
  }

  // Emit selected group when a group is clicked
  onGroupClick(group: Group): void {
    this.groupSelected.emit(group);
  }


  saveGroup(): void {
    if (this.newGroupName && this.newGroupDescription) {
      const newGroup: Group = {
        name: this.newGroupName,
        description: this.newGroupDescription,
        admins: [this.currentUser!],
        users: [this.currentUser!], 
        channels: [],
      };
      console.log('New group:', newGroup);
      this.groupService.addGroup(newGroup).subscribe(
        (response) => {
          this.toastr.success('Group added successfully!', 'Success');
          this.loadGroups();
          this.newGroupName = '';
          this.newGroupDescription = '';
        },
        (error) => {
          console.error('Error adding group:', error);
          this.toastr.error('Failed to add group. Please try again.', 'Error');
        }
      );
    } else {
      this.toastr.error(
        'Please fill in both group name and description.',
        'Error'
      );
    }
  }
}
