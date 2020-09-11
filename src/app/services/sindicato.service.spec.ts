import { TestBed } from '@angular/core/testing';

import { SindicatoService } from './sindicato.service';

describe('SindicatoService', () => {
  let service: SindicatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SindicatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
