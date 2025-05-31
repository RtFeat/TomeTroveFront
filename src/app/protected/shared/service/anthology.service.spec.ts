import { TestBed } from '@angular/core/testing';

import { AnthologyService } from './anthology.service';

describe('AnthologyService', () => {
  let service: AnthologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnthologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
