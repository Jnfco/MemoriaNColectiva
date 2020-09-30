import { TestBed } from '@angular/core/testing';

import { FundacionService } from './fundacion.service';

describe('FundacionService', () => {
  let service: FundacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
