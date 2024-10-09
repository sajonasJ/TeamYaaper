import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { GroupService } from '../../services/group.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../../shared/utils.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Group } from '../../models/dataInterfaces';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let mockGroupService: jasmine.SpyObj<GroupService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    // Mock the dependencies
    mockGroupService = jasmine.createSpyObj('GroupService', ['getGroups', 'addGroup']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['loadCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [SideNavComponent],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: UtilsService, useValue: mockUtilsService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit
  it('should call loadGroups and loadCurrentUser on init', () => {
    spyOn(component, 'loadGroups');
    component.ngOnInit();
    expect(component.loadGroups).toHaveBeenCalled();
    expect(mockUtilsService.loadCurrentUser).toHaveBeenCalled();
  });

  // Test loadGroups - successful
  it('should load groups successfully', () => {
    const mockGroups: Group[] = [
      { _id: '1', name: 'Group 1', description: '', admins: [], users: [], channels: [] },
      { _id: '2', name: 'Group 2', description: '', admins: [], users: [], channels: [] }
    ];

    mockGroupService.getGroups.and.returnValue(of(mockGroups));

    component.loadGroups();

    expect(component.groups.length).toBe(2);
    expect(component.groups).toEqual(mockGroups);
  });

  // Test loadGroups - failure
  it('should show error when loading groups fails', () => {
    mockGroupService.getGroups.and.returnValue(throwError('Failed to load groups'));

    component.loadGroups();

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to load groups. Please try again.', 'Error');
  });

  // Test onGroupClick
  it('should emit groupSelected event when a group is clicked', () => {
    spyOn(component.groupSelected, 'emit');
    const mockGroup: Group = { _id: '1', name: 'Group 1', description: '', admins: [], users: [], channels: [] };

    component.onGroupClick(mockGroup);

    expect(component.groupSelected.emit).toHaveBeenCalledWith(mockGroup);
  });

  // Test saveGroup - success
  it('should save group and reload groups on success', () => {
    const mockGroup: Group = {
      _id: '1',
      name: 'New Group',
      description: 'Description',
      admins: ['testUser'],
      users: ['testUser'],
      channels: []
    };

    mockGroupService.addGroup.and.returnValue(of({}));
    component.newGroupName = 'New Group';
    component.newGroupDescription = 'Description';
    component.currentUser = 'testUser';

    component.saveGroup();

    expect(mockGroupService.addGroup).toHaveBeenCalledWith(mockGroup);
    expect(mockToastr.success).toHaveBeenCalledWith('Group added successfully!', 'Success');
    expect(component.newGroupName).toBe('');
    expect(component.newGroupDescription).toBe('');
    expect(component.loadGroups).toHaveBeenCalled();
  });

  // Test saveGroup - failure
  it('should show error when saving group fails', () => {
    mockGroupService.addGroup.and.returnValue(throwError('Failed to add group'));
    component.newGroupName = 'New Group';
    component.newGroupDescription = 'Description';
    component.currentUser = 'testUser';

    component.saveGroup();

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to add group. Please try again.', 'Error');
  });

  // Test saveGroup - missing input fields
  it('should show error when group name or description is missing', () => {
    component.newGroupName = '';
    component.newGroupDescription = 'Description';

    component.saveGroup();

    expect(mockToastr.error).toHaveBeenCalledWith('Please fill in both group name and description.', 'Error');
  });
});
