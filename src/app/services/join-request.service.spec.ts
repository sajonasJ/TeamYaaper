import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JoinRequestService } from './join-request.service';
import { JoinRequest } from '../models/dataInterfaces';
import { BACKEND_URL } from '../constants';

describe('JoinRequestService', () => {
  let service: JoinRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JoinRequestService]
    });

    service = TestBed.inject(JoinRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no unmatched requests are outstanding
  });

  // Test fetching join requests for a specific group
  it('should retrieve join requests for a specific group', () => {
    const mockJoinRequests: JoinRequest[] = [
      { _id: '1', groupId: '1', userId: 'user1', username: 'testUser1', status: 'pending', requestDate: new Date() },
      { _id: '2', groupId: '1', userId: 'user2', username: 'testUser2', status: 'pending', requestDate: new Date() }
    ];

    service.getJoinRequests('1').subscribe((joinRequests) => {
      expect(joinRequests.length).toBe(2);
      expect(joinRequests).toEqual(mockJoinRequests);
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/groups/1/joinRequests`);
    expect(req.request.method).toBe('GET');
    req.flush(mockJoinRequests);  // Mock the response
  });

  // Test adding a join request
  it('should add a new join request', () => {
    const groupId = '1';
    const username = 'newUser';

    service.addJoinRequest(groupId, username).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/addJoinRequest`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ groupId, username });
    req.flush({ success: true });  // Mock the response
  });

  // Test updating a join request (approve or reject)
  it('should update a join request', () => {
    const requestId = '1';
    const status = 'approved';

    service.updateJoinRequest(requestId, status).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${BACKEND_URL}/updateJoinRequest`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ requestId, status });
    req.flush({ success: true });  // Mock the response
  });
});
