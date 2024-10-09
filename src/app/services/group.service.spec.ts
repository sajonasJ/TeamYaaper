import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupService } from './group.service';
import { Group } from '../models/dataInterfaces';
import { BACKEND_URL, httpOptions } from '../constants';

describe('GroupService', () => {
  let service: GroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupService]
    });

    service = TestBed.inject(GroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no unmatched requests are outstanding
  });

  // Test fetching all groups
  it('should retrieve all groups', () => {
    const mockGroups: Group[] = [
      { _id: '1', name: 'Group 1', description: 'Test Group 1', admins: [], users: [], channels: [] },
      { _id: '2', name: 'Group 2', description: 'Test Group 2', admins: [], users: [], channels: [] }
    ];

    service.getGroups().subscribe(groups => {
      expect(groups.length).toBe(2);
      expect(groups).toEqual(mockGroups);
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/allGroups`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers).toEqual(httpOptions.headers);
    req.flush(mockGroups); // Provide the mock data to the response
  });

  // Test fetching a group by ID
  it('should retrieve a group by ID', () => {
    const mockGroup: Group = { _id: '1', name: 'Group 1', description: 'Test Group 1', admins: [], users: [], channels: [] };

    service.getGroupById('1').subscribe(group => {
      expect(group).toEqual(mockGroup);
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/groups/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers).toEqual(httpOptions.headers);
    req.flush(mockGroup); // Provide the mock data to the response
  });

  // Test adding a group
  it('should add a new group', () => {
    const newGroup: Group = { name: 'New Group', description: 'New Description', admins: [], users: [], channels: [] };

    service.addGroup(newGroup).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/groups/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newGroup);
    expect(req.request.headers).toEqual(httpOptions.headers);
    req.flush({ success: true }); // Mock the response for POST
  });

  // Test updating a group
  it('should update an existing group', () => {
    const updatedGroup: Group = { _id: '1', name: 'Updated Group', description: 'Updated Description', admins: [], users: [], channels: [] };

    service.updateGroup(updatedGroup).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/allGroups/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      name: 'Updated Group',
      description: 'Updated Description',
      admins: [],
      users: [],
      channels: []
    });
    expect(req.request.headers).toEqual(httpOptions.headers);
    req.flush({ success: true }); // Mock the response for PUT
  });

  // Test deleting a group
  it('should delete a group by ID', () => {
    service.deleteGroup('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/deleteGroup/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers).toEqual(httpOptions.headers);
    req.flush({ success: true }); // Mock the response for DELETE
  });
});
