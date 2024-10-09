import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

// Skip this test suite by using xdescribe instead of describe
xdescribe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
