import { TestBed } from '@angular/core/testing';

import { ClippyChatService } from './clippy-chat.service';

describe('ClippyChatService', () => {
  let service: ClippyChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClippyChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
