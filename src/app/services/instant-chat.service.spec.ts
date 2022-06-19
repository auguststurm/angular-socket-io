import { TestBed } from '@angular/core/testing';

import { InstantChatService } from './instant-chat.service';

describe('InstantChatService', () => {
  let service: InstantChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstantChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
