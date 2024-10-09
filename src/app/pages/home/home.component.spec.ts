import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { of, Subscription, throwError } from 'rxjs';
import { Group } from '../../models/dataInterfaces';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockGroupService: jasmine.SpyObj<GroupService>;

  beforeEach(async () => {
    // Mock the dependencies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockGroupService = jasmine.createSpyObj('GroupService', ['getGroupById']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: GroupService, useValue: mockGroupService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test component creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit - when the user is not logged in
  it('should navigate to login page if user is not logged in', () => {
    mockAuthService.isLoggedIn = of(false); // Simulate not logged in

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test ngOnInit - when the user is logged in
  it('should not navigate if user is logged in', () => {
    mockAuthService.isLoggedIn = of(true); // Simulate logged in

    component.ngOnInit();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // Test ngOnDestroy to ensure that subscriptions are cleaned up
  it('should unsubscribe from subscriptions on destroy', () => {
    // Simulate behavior through the component lifecycle without accessing private properties directly.
    const authSubscriptionSpy = spyOn(
      Subscription.prototype,
      'unsubscribe'
    ).and.callThrough();

    component.ngOnDestroy();

    expect(authSubscriptionSpy).toHaveBeenCalledTimes(1);
  });

  // Test fetchGroupById - success case
  it('should fetch group by ID and set selectedGroup on success', () => {
    const mockGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };
    mockGroupService.getGroupById.and.returnValue(of(mockGroup));

    component.fetchGroupById('1');

    expect(mockGroupService.getGroupById).toHaveBeenCalledWith('1');
    expect(component.selectedGroup).toEqual(mockGroup);
  });

  // Test fetchGroupById - error case
  it('should log error when fetching group fails', () => {
    spyOn(console, 'error');
    mockGroupService.getGroupById.and.returnValue(
      throwError('Error fetching group')
    );

    component.fetchGroupById('1');

    expect(mockGroupService.getGroupById).toHaveBeenCalledWith('1');
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching group by ID:',
      'Error fetching group'
    );
  });

  // Test onGroupSelected method
  it('should set selectedGroup when onGroupSelected is called', () => {
    const mockGroup: Group = {
      _id: '1',
      name: 'Test Group',
      description: '',
      admins: [],
      users: [],
      channels: [],
    };

    component.onGroupSelected(mockGroup);

    expect(component.selectedGroup).toEqual(mockGroup);
  });
});
